# 🏥 SevaSetu AI Health Assistant

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Language-Python_3.11-3776AB.svg?style=flat&logo=python)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_(Supabase)-336791.svg?style=flat&logo=postgresql)](https://supabase.com)
[![Groq](https://img.shields.io/badge/AI_Inference-Groq_Cloud-F05A28.svg?style=flat)](https://groq.com)
[![Railway](https://img.shields.io/badge/Deploy-Railway-0B0D0E.svg?style=flat&logo=railway)](https://railway.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000.svg?style=flat&logo=vercel)](https://vercel.com)

**SevaSetu AI** is an intelligent, rural-friendly healthcare platform engineered to bridge healthcare accessibility gaps across India. Featuring real-time multilingual voice interaction, AI medical report comprehension, regional emergency services, and automated government health scheme navigation (PM-JAY, BSKY).

---

## 🌟 Key Features

- **🎙️ Multilingual Voice Assistant**: Full speech-to-text (STT) and voice synthesis (TTS) support in **English**, **Hindi (हिन्दी)**, and **Odia (ଓଡ଼ିଆ)**.
- **📄 AI Medical Report Analysis**: Upload prescriptions or lab reports for instant OCR extraction, abnormality highlights, and plain-language summaries.
- **🏛️ Government Schemes Navigator**: Vector-search RAG engine matching citizens to eligible state and central healthcare schemes.
- **🏥 Healthcare Directory**: Find hospitals, community health centers (CHCs), primary health centers (PHCs), and emergency ambulance contacts.
- **📅 Appointment Booking**: Seamless scheduling with local facilities and doctors.
- **🔒 Secure & Scalable Architecture**: Powered by FastAPI, PostgreSQL (via Supabase), and Groq ultra-low latency LLM inference.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Citizen / User]) -->|Interacts via Voice/Text| Frontend[React + Vite Frontend (Vercel)]
    Frontend -->|REST API Requests| Backend[FastAPI Backend (Railway)]
    
    Backend -->|LLM Chat & Analysis| Groq[Groq API (openai/gpt-oss-120b)]
    Backend -->|Persist Users, History & Schemes| DB[(Supabase PostgreSQL)]
    Backend -->|Store Medical Reports & Images| Cloudinary[(Cloudinary Storage)]
    Backend -->|Extract Text from Reports| Tesseract[Tesseract OCR]
    Backend -->|RAG Scheme Retrieval| FAISS[FAISS Vector Index]
```

---

## 📁 Repository Structure

```text
Health-AIChatbot/
├── AI-Health-Chatbot-n8n-main/    # Frontend Application
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/             # UI Components (shadcn/ui, layouts)
│   │   ├── contexts/               # Auth, Language, Theme contexts
│   │   ├── hooks/                  # Voice recognition & synthesis hooks
│   │   ├── pages/                  # Chat, Reports, Directory, Schemes
│   │   └── services/               # API clients (chat, reports, auth)
│   ├── .env.example                # Frontend environment template
│   ├── .env.production             # Frontend production configuration
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/                        # Backend Application
│   ├── alembic/                    # Database migration scripts
│   ├── app/
│   │   ├── config/                 # DB engine & Pydantic settings
│   │   ├── models/                 # SQLAlchemy ORM models
│   │   ├── routes/                 # FastAPI routers (chat, analysis, etc.)
│   │   ├── services/               # AI (Groq), RAG (FAISS), Storage services
│   │   └── utils/                  # JWT security & helper utilities
│   ├── .env.example                # Backend environment template
│   ├── .env.production             # Backend production configuration
│   ├── create_db.sql               # PostgreSQL / MySQL DDL schema
│   ├── Dockerfile                  # Container definition for cloud deploy
│   ├── Procfile                    # Railway / Render start process
│   └── requirements.txt            # Python package dependencies
│
└── README.md                       # Project documentation
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# Core App Settings
APP_NAME="SevaSetu AI Health Chatbot"
DEBUG=False
ALLOWED_ORIGINS="https://*.vercel.app,http://localhost:5173,http://localhost:8080"

# Supabase PostgreSQL (Session Pooler)
DATABASE_URL="postgresql+psycopg2://<user>:<password>@<host>:5432/postgres?sslmode=require"

# Groq Cloud AI
GROQ_API_KEY="gsk_your_groq_api_key"
AI_MODEL="openai/gpt-oss-120b"
VISION_MODEL="meta-llama/llama-4-scout-17b-16e-instruct"

# Cloudinary (Medical document storage)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# JWT Security
SECRET_KEY="your-secure-random-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend (`AI-Health-Chatbot-n8n-main/.env`)

```env
# Points to the FastAPI backend API prefix
VITE_API_BASE_URL="http://localhost:8000/api"
```

---

## 🚀 Deployment Guide

### 1. Deploy Backend on Railway

1. Push your repository to **GitHub**.
2. Go to [Railway Dashboard](https://railway.com) and create a **New Project > Deploy from GitHub repo**.
3. Under **Settings**:
   - Set **Root Directory** to `/backend`.
4. Under **Variables**:
   - Add all environment variables from `backend/.env.production`.
5. Under **Settings > Networking**:
   - Click **Generate Domain** (e.g. `https://sevasetu-api.up.railway.app`).
6. Verify deployment by visiting `https://<YOUR-RAILWAY-URL>/` (returns `{"status": "ok"}`).

---

### 2. Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com) and import your GitHub repository.
2. Configure project settings:
   - **Root Directory**: Select `AI-Health-Chatbot-n8n-main`.
   - **Framework Preset**: `Vite` (auto-detected).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add the environment variable:
   - `VITE_API_BASE_URL` = `https://<YOUR-RAILWAY-URL>/api` *(Append `/api` at the end)*.
4. Click **Deploy**.

---

## 💻 Local Development Setup

### Backend Setup

```bash
cd backend

# Create virtual environment (Python 3.11 recommended)
python -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

API docs will be available at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd AI-Health-Chatbot-n8n-main

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

App will run at `http://localhost:8080`.

---

## 🛡️ License

This project is licensed under the **MIT License**.
# HealthAIChatbot-LeadSphere
