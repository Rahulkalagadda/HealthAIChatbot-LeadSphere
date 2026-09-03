"""
Seed script to populate Qdrant Cloud Knowledge Base:
1. health_schemes
2. rural_first_aid
"""

import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config.settings import get_settings
from app.services.qdrant_service import qdrant_service

settings = get_settings()

SCHEMES = [
    {
        "title": "Ayushman Bharat - PM-JAY",
        "state": "All-India",
        "category": "Hospitalization",
        "target_group": "BPL / Poor Rural Families",
        "coverage_amount": "₹5,00,000 per family per year",
        "eligibility": "Families identified under SECC 2011 database or active Antyodaya Anna Yojana (AAY) ration card.",
        "benefits": "100% cashless hospitalization across 27,000+ empaneled public and private hospitals across India for 1,949 medical procedures.",
        "official_portal": "https://pmjay.gov.in",
        "helpline": "14555"
    },
    {
        "title": "Biju Swasthya Kalyan Yojana (BSKY)",
        "state": "Odisha",
        "category": "Hospitalization",
        "target_group": "All Rural Citizens in Odisha",
        "coverage_amount": "₹5,00,000 per family (₹10,00,000 for women members)",
        "eligibility": "All BSKY Smart Card holders and National/State Food Security Card beneficiaries residing in Odisha.",
        "benefits": "Universal cashless healthcare at all government health facilities and 800+ empaneled premier private hospitals in Odisha and major Indian cities.",
        "official_portal": "https://bsky.odisha.gov.in",
        "helpline": "104"
    },
    {
        "title": "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
        "state": "All-India",
        "category": "Maternal Care",
        "target_group": "Pregnant Women and Lactating Mothers",
        "coverage_amount": "₹5,000 in cash incentive (plus ₹6,000 for second girl child)",
        "eligibility": "Pregnant women aged 19+ for first living child. Family income less than ₹8 Lakhs or holding MGNREGA job card/BPL card.",
        "benefits": "Direct Benefit Transfer (DBT) into bank account in 2 installments upon early registration and institutional health checkups.",
        "official_portal": "https://pmmvy.wcd.gov.in",
        "helpline": "1098"
    },
    {
        "title": "Janani Suraksha Yojana (JSY)",
        "state": "All-India",
        "category": "Maternal Care",
        "target_group": "Rural BPL Pregnant Women",
        "coverage_amount": "₹1,400 cash assistance for rural areas (₹1,000 for urban)",
        "eligibility": "All pregnant women from BPL/SC/ST households delivering in government health facilities or accredited private hospitals.",
        "benefits": "Financial assistance to reduce maternal and neonatal mortality by promoting institutional delivery, supported by ASHA workers.",
        "official_portal": "https://nhm.gov.in",
        "helpline": "104"
    },
    {
        "title": "Mission Indradhanush (Universal Immunization)",
        "state": "All-India",
        "category": "Child Health",
        "target_group": "Children under 2 years and Pregnant Women",
        "coverage_amount": "100% Free Vaccines",
        "eligibility": "All newborns, infants, children under 2 years, and pregnant mothers across India.",
        "benefits": "Free life-saving vaccines against 12 preventable diseases: Tuberculosis, Diphtheria, Pertussis, Tetanus, Polio, Hepatitis B, Pneumonia, Meningitis, Rotavirus, Measles, Rubella, and Japanese Encephalitis.",
        "official_portal": "https://nhm.gov.in/index1.php?lang=1&level=2&sublinkid=824&lid=220",
        "helpline": "1075"
    },
    {
        "title": "Rashtriya Bal Swasthya Karyakram (RBSK)",
        "state": "All-India",
        "category": "Child Health & Surgery",
        "target_group": "Children from birth to 18 years",
        "coverage_amount": "100% Free Screening and Corrective Surgeries",
        "eligibility": "All children enrolled in Anganwadis and government schools.",
        "benefits": "Free screening and tertiary medical/surgical treatments for 4Ds: Birth Defects (cleft lip, club foot, congenital heart defects), Deficiencies (anemia, vitamin A), Childhood Diseases, and Developmental Delays.",
        "official_portal": "https://rbsk.gov.in",
        "helpline": "104"
    },
    {
        "title": "Dr. YSR Aarogyasri Health Scheme",
        "state": "Andhra Pradesh",
        "category": "Hospitalization",
        "target_group": "BPL Families in Andhra Pradesh",
        "coverage_amount": "Up to ₹25,00,000 cashless medical care",
        "eligibility": "Holders of YSR Aarogyasri card with annual family income up to ₹5,00,000.",
        "benefits": "Covers 3,257 medical and surgical procedures across all major public and private super-specialty hospitals.",
        "official_portal": "https://ysraarogyasri.ap.gov.in",
        "helpline": "104"
    },
    {
        "title": "Ayushman Arogya Mandir (Health & Wellness Centres)",
        "state": "All-India",
        "category": "Primary & Preventive Care",
        "target_group": "All Citizens at Gram Panchayat Level",
        "coverage_amount": "Free Consultation, Diagnostics, and Essential Medicines",
        "eligibility": "Open to every citizen at village and ward level with no card required.",
        "benefits": "Screening for hypertension, diabetes, oral/breast/cervical cancers, free essential drugs, telemedicine with district doctors (eSanjeevani), and wellness activities.",
        "official_portal": "https://ab-hwc.nhp.gov.in",
        "helpline": "1075"
    }
]

FIRST_AID_PROTOCOLS = [
    {
        "emergency_type": "Snakebite",
        "title": "Field Protocol for Venomous Snakebite",
        "urgency_level": "CRITICAL",
        "immediate_dos": "1. Keep patient completely still and calm; movement accelerates venom circulation. 2. Immobilize the bitten limb using a splint or firm stick at heart level. 3. Remove all rings, bracelets, bangles, and tight shoes before swelling begins. 4. Call 108 ambulance immediately or rush to the nearest PHC equipped with Anti-Snake Venom (ASV).",
        "strict_donts": "DO NOT tie tight tourniquets or ropes (causes gangrene and amputation). DO NOT cut the wound, attempt suction, apply ice, or use herbal mud pastes. DO NOT give tea, coffee, or alcohol.",
        "emergency_helpline": "108"
    },
    {
        "emergency_type": "Heatstroke",
        "title": "Severe Heatstroke and Hyperthermia Triage",
        "urgency_level": "CRITICAL",
        "immediate_dos": "1. Immediately move victim to shade or cool room. 2. Remove excess outer clothing. 3. Sponge entire body with room-temperature water and fan vigorously. 4. Place wet cloths or ice packs on neck, armpits, and groin. 5. If conscious and able to swallow, give sips of WHO-ORS or salted water.",
        "strict_donts": "DO NOT give fluids if victim is unconscious, confused, or vomiting (aspiration risk). DO NOT use ice-cold bath which causes severe shivering.",
        "emergency_helpline": "108"
    },
    {
        "emergency_type": "Poisoning",
        "title": "Agricultural Pesticide / Chemical Ingestion Protocol",
        "urgency_level": "CRITICAL",
        "immediate_dos": "1. Move victim to open fresh air immediately. 2. Remove contaminated clothes with gloves; wash exposed skin with copious water and soap. 3. Maintain open airway in recovery position (on their side). 4. Bring the exact chemical/pesticide container to the hospital for doctors to identify the specific antidote (e.g. Atropine for organophosphates).",
        "strict_donts": "DO NOT induce vomiting unless specifically instructed by doctors (corrosive chemicals will re-burn esophagus and lungs). DO NOT force raw milk or kerosene.",
        "emergency_helpline": "108"
    },
    {
        "emergency_type": "Pediatric Seizures",
        "title": "Febrile Seizure (High Fever Convulsions in Infants/Children)",
        "urgency_level": "URGENT",
        "immediate_dos": "1. Place child on their side (recovery position) on a soft surface so saliva drains freely. 2. Loosen tight clothing around neck. 3. Clear surrounding area of sharp objects. 4. Gently sponge forehead, neck, and limbs with lukewarm water to bring fever down. 5. Note the exact duration of the seizure.",
        "strict_donts": "DO NOT put fingers, spoons, keys, or metal objects inside the child's mouth (teeth/jaw injury risk). DO NOT shake, slap, or restrain child during the convulsion.",
        "emergency_helpline": "108"
    },
    {
        "emergency_type": "Burns",
        "title": "Thermal Burns and Scalds Management",
        "urgency_level": "URGENT",
        "immediate_dos": "1. Immediately cool the burn with cool, gently running clean tap water for 15 to 20 minutes. 2. Gently remove loose clothing and jewelry around burn before swelling starts. 3. Cover loosely with sterile gauze or clean dry cloth.",
        "strict_donts": "DO NOT apply toothpaste, turmeric, butter, oil, or raw eggs (severe infection risk). DO NOT pop blisters or peel stuck clothing.",
        "emergency_helpline": "108"
    }
]

def main():
    print("=" * 60)
    print("🚀 Seeding Qdrant Cloud Knowledge Base")
    print(f"📡 Target Cluster: {settings.QDRANT_URL}")
    print("=" * 60)

    if not qdrant_service.client:
        print("❌ Cannot connect to Qdrant Cloud. Check QDRANT_URL and QDRANT_API_KEY.")
        sys.exit(1)

    # 1. Ensure all collections exist
    print("\n1. Verifying collections...")
    qdrant_service.ensure_collections()

    # 2. Seed Schemes
    print("\n2. Seeding Government Schemes KB...")
    qdrant_service.upsert_schemes(SCHEMES)

    # 3. Seed First Aid
    print("\n3. Seeding Rural First Aid KB...")
    qdrant_service.upsert_first_aid(FIRST_AID_PROTOCOLS)

    print("\n" + "=" * 60)
    print("🎉 Qdrant Cloud Knowledge Base successfully seeded!")
    print("=" * 60)

if __name__ == "__main__":
    main()
