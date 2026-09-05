import os
import uuid
from typing import Optional, List, Dict, Any
from ..config.settings import get_settings

settings = get_settings()

class QdrantService:
    def __init__(self):
        self.client = None
        self.embedder = None
        self._init_client()

    def _init_client(self):
        if settings.QDRANT_URL and settings.QDRANT_API_KEY:
            try:
                from qdrant_client import QdrantClient
                self.client = QdrantClient(
                    url=settings.QDRANT_URL,
                    api_key=settings.QDRANT_API_KEY,
                    timeout=10.0
                )
                print(" Connected to Qdrant Cloud Cluster successfully.")
            except Exception as e:
                print(f"⚠️ Failed to connect to Qdrant Cloud: {e}")
                self.client = None

    def _load_embedder(self):
        if self.embedder is None:
            try:
                from fastembed import TextEmbedding
                self.embedder = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
            except Exception as e:
                print(f"⚠️ Error loading fastembed model: {e}")

    def embed_text(self, text: str) -> List[float]:
        self._load_embedder()
        if self.embedder:
            generator = self.embedder.embed([text])
            return list(next(generator))
        # Fallback to zero vector if embedder unavailable
        return [0.0] * 384

    def ensure_collections(self):
        """Creates collections and payload indexes if they do not exist."""
        if not self.client:
            return

        from qdrant_client.http import models

        collections = {
            "health_schemes": ["state", "category", "target_group"],
            "medical_reports": ["user_id", "report_type"],
            "rural_first_aid": ["emergency_type", "urgency_level"]
        }

        existing_names = [c.name for c in self.client.get_collections().collections]

        for coll_name, index_fields in collections.items():
            if coll_name not in existing_names:
                print(f"📦 Creating Qdrant collection: {coll_name}...")
                self.client.create_collection(
                    collection_name=coll_name,
                    vectors_config=models.VectorParams(
                        size=384,
                        distance=models.Distance.COSINE
                    )
                )

            # Ensure payload indexes for high performance filtering
            for field in index_fields:
                try:
                    self.client.create_payload_index(
                        collection_name=coll_name,
                        field_name=field,
                        field_schema=models.PayloadSchemaType.KEYWORD
                    )
                except Exception:
                    pass  # Already indexed or exists

    # =========================================================================
    # 1. Government Schemes KB
    # =========================================================================
    def upsert_schemes(self, schemes: List[Dict[str, Any]]):
        if not self.client:
            return False

        from qdrant_client.http import models

        points = []
        for s in schemes:
            embed_content = f"Title: {s.get('title', '')}. State: {s.get('state', 'All-India')}. Category: {s.get('category', '')}. Eligibility: {s.get('eligibility', '')}. Benefits: {s.get('benefits', s.get('description', ''))}"
            vector = self.embed_text(embed_content)
            
            point_id = s.get("id") or str(uuid.uuid4())
            points.append(
                models.PointStruct(
                    id=point_id if isinstance(point_id, str) and len(point_id) == 36 else str(uuid.uuid5(uuid.NAMESPACE_DNS, str(s.get('title', '')))),
                    vector=vector,
                    payload=s
                )
            )

        self.client.upsert(collection_name="health_schemes", points=points)
        print(f"✅ Upserted {len(points)} schemes into Qdrant 'health_schemes'.")
        return True

    def search_schemes(self, query: str, state: Optional[str] = None, top_k: int = 3) -> List[Dict[str, Any]]:
        """Hybrid Search: Combines dense vector similarity with token keyword boosting for guaranteed accuracy."""
        if not self.client or not query:
            return []

        import re
        from qdrant_client.http import models

        query_vector = self.embed_text(query)

        query_filter = None
        if state and state.lower() not in ("all", "all-india", "india"):
            query_filter = models.Filter(
                should=[
                    models.FieldCondition(key="state", match=models.MatchValue(value=state)),
                    models.FieldCondition(key="state", match=models.MatchValue(value="All-India"))
                ]
            )

        # Retrieve top candidates via vector cosine distance
        candidate_limit = max(top_k * 2, 6)
        if hasattr(self.client, "query_points"):
            results = self.client.query_points(
                collection_name="health_schemes",
                query=query_vector,
                query_filter=query_filter,
                limit=candidate_limit
            ).points
        else:
            results = self.client.search(
                collection_name="health_schemes",
                query_vector=query_vector,
                query_filter=query_filter,
                limit=candidate_limit
            )

        # Keyword token scoring for hybrid re-ranking
        tokens = set(re.findall(r'\b\w{3,}\b', query.lower()))
        scored_results = []

        for hit in results:
            payload = hit.payload or {}
            score = getattr(hit, 'score', 0.0) or 0.0

            # Match tokens against title, category, eligibility, benefits
            searchable_text = f"{payload.get('title', '')} {payload.get('category', '')} {payload.get('eligibility', '')} {payload.get('benefits', '')}".lower()
            token_matches = sum(1 for token in tokens if token in searchable_text)
            
            # Exact title boost
            title_boost = 0.5 if any(token in payload.get('title', '').lower() for token in tokens) else 0.0
            hybrid_score = score + (token_matches * 0.15) + title_boost

            scored_results.append((hybrid_score, payload))

        # Sort by hybrid score descending
        scored_results.sort(key=lambda x: x[0], reverse=True)
        return [p for _, p in scored_results[:top_k]]


    # =========================================================================
    # 2. Patient Medical Reports KB (Longitudinal Patient Memory)
    # =========================================================================
    def index_medical_report(
        self,
        user_id: str,
        report_id: str,
        summary: str,
        abnormalities: List[Dict[str, Any]],
        recommendations: List[str],
        file_url: str = "",
        report_type: str = "Medical Report"
    ):
        if not self.client:
            return False

        from qdrant_client.http import models

        embed_content = f"Patient Report Summary: {summary}. Abnormal markers: {abnormalities}. Recommendations: {recommendations}"
        vector = self.embed_text(embed_content)

        payload = {
            "user_id": user_id,
            "report_id": report_id,
            "report_type": report_type,
            "summary": summary,
            "abnormalities": abnormalities,
            "recommendations": recommendations,
            "file_url": file_url
        }

        self.client.upsert(
            collection_name="medical_reports",
            points=[
                models.PointStruct(
                    id=str(uuid.uuid4()),
                    vector=vector,
                    payload=payload
                )
            ]
        )
        print(f" Indexed medical report for user '{user_id}' in Qdrant.")
        return True

    def search_patient_reports(self, user_id: str, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Strictly searches reports belonging ONLY to the authenticated user_id."""
        if not self.client or not user_id or not query:
            return []

        from qdrant_client.http import models

        query_vector = self.embed_text(query)

        user_filter = models.Filter(
            must=[
                models.FieldCondition(key="user_id", match=models.MatchValue(value=user_id))
            ]
        )

        if hasattr(self.client, "query_points"):
            results = self.client.query_points(
                collection_name="medical_reports",
                query=query_vector,
                query_filter=user_filter,
                limit=top_k
            ).points
        else:
            results = self.client.search(
                collection_name="medical_reports",
                query_vector=query_vector,
                query_filter=user_filter,
                limit=top_k
            )

        return [hit.payload for hit in results]

    # =========================================================================
    # 3. Rural First Aid & Emergency KB
    # =========================================================================
    def upsert_first_aid(self, protocols: List[Dict[str, Any]]):
        if not self.client:
            return False

        from qdrant_client.http import models

        points = []
        for p in protocols:
            embed_content = f"Emergency: {p.get('title', '')} ({p.get('emergency_type', '')}). Actions: {p.get('immediate_dos', '')}. Avoid: {p.get('strict_donts', '')}"
            vector = self.embed_text(embed_content)

            points.append(
                models.PointStruct(
                    id=str(uuid.uuid5(uuid.NAMESPACE_DNS, str(p.get('emergency_type', '')))),
                    vector=vector,
                    payload=p
                )
            )

        self.client.upsert(collection_name="rural_first_aid", points=points)
        print(f"✅ Upserted {len(points)} emergency protocols into Qdrant 'rural_first_aid'.")
        return True

    def search_first_aid(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Hybrid Search: Matches emergency vector similarity and boosts exact trauma/symptom types."""
        if not self.client or not query:
            return []

        import re

        query_vector = self.embed_text(query)
        candidate_limit = max(top_k * 2, 4)

        if hasattr(self.client, "query_points"):
            results = self.client.query_points(
                collection_name="rural_first_aid",
                query=query_vector,
                limit=candidate_limit
            ).points
        else:
            results = self.client.search(
                collection_name="rural_first_aid",
                query_vector=query_vector,
                limit=candidate_limit
            )

        tokens = set(re.findall(r'\b\w{3,}\b', query.lower()))
        scored_results = []

        for hit in results:
            payload = hit.payload or {}
            score = getattr(hit, 'score', 0.0) or 0.0

            searchable_text = f"{payload.get('emergency_type', '')} {payload.get('title', '')} {payload.get('immediate_dos', '')}".lower()
            token_matches = sum(1 for token in tokens if token in searchable_text)

            # Boost exact emergency type match (e.g. "snake" -> "snake_bite")
            type_boost = 0.6 if any(token in payload.get('emergency_type', '').lower() for token in tokens) else 0.0
            hybrid_score = score + (token_matches * 0.15) + type_boost

            scored_results.append((hybrid_score, payload))

        scored_results.sort(key=lambda x: x[0], reverse=True)
        return [p for _, p in scored_results[:top_k]]


# Singleton instance
qdrant_service = QdrantService()
