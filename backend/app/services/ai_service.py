from groq import Groq
import os
import base64
from ..config.settings import get_settings

settings = get_settings()

client = Groq(api_key=settings.GROQ_API_KEY)

class AIService:
    SYSTEM_PROMPT = """
    You are 'SevaSetu AI', a warm, compassionate, and trustworthy rural health assistant for people in India.
    
    ### CRITICAL COMMUNICATION RULES:
    1. NATURAL EMPATHETIC TONE: Speak warmly and naturally like an experienced healthcare professional.
    2. NEVER USE META LABELS: NEVER write robotic headings like "✅ Acknowledge:", "✅ Clarify:", "✅ Possible Causes (non-diagnostic):", "✅ Action Steps:", "⚠️ Emergency Check:", or step numbers. The user must NEVER see internal prompt labels.
    3. RESPONSE FLOW:
       • Start immediately with a caring, conversational sentence showing you understand their concern (e.g., "I'm sorry you're dealing with a cold and sore throat; let's help you find some relief.").
       • If critical information is missing, ask 1-2 gentle questions naturally (e.g., "Do you have a fever, or is it hard to swallow?").
       • Use clean, user-friendly markdown sections for guidance:
         
         **Possible Causes**
         • Short bullet points in plain language
         
         **Recommended Relief Steps**
         • Practical home care & safe steps (fluids, rest, steam, salt-water gargle, paracetamol if safe)
         
         **⚠️ When to See a Doctor**
         • Clear warning signs requiring immediate medical care
       
       • Conclude with a brief, friendly disclaimer:
         *Note: I am an AI health assistant, not a doctor. Please consult a qualified physician for a formal diagnosis and prescriptions.*
    
    4. BREVITY & SPACING: Keep explanations concise and easy to read on mobile screens without huge walls of text.
    5. LANGUAGE FIDELITY: Always reply in the user's requested language (English, Hindi, or Odia). If the user asks in Hinglish (Roman script Hindi), reply in Roman script Hinglish naturally.
    """

    @staticmethod
    async def get_chat_response(message: str, history: list = None, language: str = "English", user_id: Optional[str] = None):
        system_content = AIService.SYSTEM_PROMPT
        if language and language.lower() not in ("english", "en"):
            system_content += f"\n\nCRITICAL LANGUAGE DIRECTIVE:\nThe user's selected language interface is {language}. You MUST formulate your entire response in {language}."

        # Query Qdrant Cloud Knowledge Base for relevant context
        qdrant_context = []
        try:
            from .qdrant_service import qdrant_service
            # 1. Check emergency first-aid protocols
            first_aid = qdrant_service.search_first_aid(message, top_k=1)
            for fa in first_aid:
                qdrant_context.append(f"[EMERGENCY PROTOCOL - {fa.get('emergency_type')}]: DO: {fa.get('immediate_dos')} | DO NOT: {fa.get('strict_donts')} | Helpline: {fa.get('emergency_helpline')}")

            # 2. Check Government Schemes if financial assistance or welfare is relevant
            scheme_keywords = ("scheme", "yojana", "card", "free", "money", "help", "fund", "bima", "ayushman", "bsky", "sarkar", "sarkari", "delivery", "hospital")
            if any(k in message.lower() for k in scheme_keywords):
                schemes = qdrant_service.search_schemes(message, top_k=2)
                for s in schemes:
                    qdrant_context.append(f"[GOVT SCHEME - {s.get('title')} ({s.get('state')})]: Coverage: {s.get('coverage_amount')}. Eligibility: {s.get('eligibility')}. Benefits: {s.get('benefits')}. Portal: {s.get('official_portal')}, Helpline: {s.get('helpline')}")

            # 3. Check Patient's Past Lab Reports (for authenticated user)
            if user_id and user_id != "guest":
                past_reports = qdrant_service.search_patient_reports(user_id, message, top_k=2)
                for pr in past_reports:
                    qdrant_context.append(f"[PATIENT LAB RECORD ({pr.get('report_type')})]: Summary: {pr.get('summary')}. Abnormal parameters: {pr.get('abnormalities')}")
        except Exception as e:
            print(f"⚠️ Qdrant context retrieval error: {e}")

        if qdrant_context:
            system_content += "\n\n### VERIFIED KNOWLEDGE BASE CONTEXT (From Qdrant):\n" + "\n".join(qdrant_context) + "\nIncorporate this verified data naturally into your advice when relevant."
        
        messages = [{"role": "system", "content": system_content}]
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": message})
        
        response = client.chat.completions.create(
            messages=messages,
            model=settings.AI_MODEL,
        )
        return response.choices[0].message.content

    @staticmethod
    async def analyze_medical_report(ocr_text: str):
        if not ocr_text:
            return AIService.get_generic_medical_response()

        prompt = f"""
        Role: You are SevaSetu AI, an expert medical report analyst. 
        Task: Analyze the following medical report text and provide a structured JSON response.
        
        Report Text:
        {ocr_text}
        
        Analysis Instructions:
        1. Summarize the patient's condition in simple, empathetic, non-jargon language for a person in rural India.
        2. Carefully identify every parameter that is outside its reference range.
        3. For each abnormality, determine if it is "HIGH", "LOW", or "ABNORMAL". 
        4. Explain what each abnormality means simply and what might cause it.
        5. Provide 3-5 clear, actionable health recommendations (diet, hydration, follow-up).
        6. If a reference range looks like "116-140" but the value is "12%", interpret it as "11.6-14.0%" (handle OCR errors intelligently).
        
        Format: You MUST return ONLY a valid JSON object. No conversational filler.
        JSON Structure:
        {{
            "summary": "Simple 1-2 sentence overview",
            "detailed_explanation": "A more detailed paragraph explaining the overall results",
            "abnormalities": [
                {{
                    "name": "Parameter Name", 
                    "value": "Observed Value", 
                    "status": "HIGH/LOW/NORMAL/INFO", 
                    "explanation": "Simple explanation why it is high/low and what it means."
                }}
            ],
            "recommendations": ["Recommendation 1", "Recommendation 2"]
        }}
        """
        try:
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=settings.AI_MODEL,
                response_format={"type": "json_object"}
            )
            return response.choices[0].message.content
        except Exception as e:
            # Fallback if JSON mode fails or isn't supported by the specific model
            response = client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=settings.AI_MODEL,
            )
            return response.choices[0].message.content

    @staticmethod
    async def analyze_medical_image(image_bytes: bytes, file_type: str = "image/jpeg"):
        # Encode image to base64 for Groq Vision
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        prompt = """
        Role: You are SevaSetu AI, an expert medical imaging assistant. 
        Task: Describe this medical image (X-ray, scan, or prescription) simply and empathetically.
        
        Instructions:
        1. Identify the type of image (e.g., Chest X-ray, Hand scan, etc.).
        2. Describe the key findings in non-jargon language for a patient in rural India.
        3. Be supportive and calm.
        4. If it's a prescription, list the visible medicines and their general purpose.
        
        Format: Return ONLY a valid JSON object.
        JSON Structure:
        {
            "summary": "Short 1-sentence identification",
            "detailed_explanation": "Detailed but simple description of what is seen",
            "findings": "Key medical observations",
            "recommendations": ["Consult a specialist for a formal diagnosis", "Keep this record safe"]
        }
        """
        
        try:
            response = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:{file_type};base64,{base64_image}",
                                },
                            },
                        ],
                    }
                ],
                model=settings.VISION_MODEL,
                response_format={"type": "json_object"}
            )
            return response.choices[0].message.content
        except Exception as e:
            return f'{{ "summary": "Error analyzing image", "detailed_explanation": "{str(e)}", "findings": "Vision model failed.", "recommendations": ["Try a clearer image", "Consult a doctor."] }}'

    @staticmethod
    async def chat_about_medical_report(question: str, report_context: str):
        prompt = f"""
        Based on the following medical report context, answer the user's question.
        Use simple language and be empathetic.
        The user might be asking in Hindi, Marathi, or English. Respond in the SAME language as the question.
        
        Report Context: {report_context}
        User Question: {question}
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": AIService.SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            model=settings.AI_MODEL,
        )
        return response.choices[0].message.content

    @staticmethod
    def get_generic_medical_response():
        return '{ "summary": "This document seems to contain no readable text.", "abnormalities": [], "recommendations": ["Ensure document is clear and well-lit.", "Consut your doctor."] }'
