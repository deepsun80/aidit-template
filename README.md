# 📌 AI-Powered Document Query System with Google Drive & Pinecone

## 📝 Project Overview

This project is a **Retrieval-Augmented Generation (RAG) application** that enables users to query documents stored in **Google Drive** using **natural language**. It leverages **Next.js (App Router), Pinecone (Vector DB), and LlamaIndex** to efficiently process, index, and retrieve relevant information.

The **main features** include:

- ✅ **Google Authentication** (NextAuth with Google OAuth)
- ✅ **Google Drive Integration** (Fetches documents from a specified Drive folder)
- ✅ **Vector Database (Pinecone) for RAG** (Stores document embeddings)
- ✅ **AI-Powered Querying** (Processes user queries to return relevant document snippets)
- ✅ **Modern Chat UI** (Built with Next.js & Tailwind CSS)
- ✅ **Vercel Deployment & Serverless Execution** (Uses API routes for query processing)

---

## 📐 Project Architecture

The application follows a **modular, scalable architecture** with clearly defined responsibilities:

📂 root/
├── 📂 lib/

# Core backend logic (authentication, indexing, document handling)

│ ├── auth.ts

# Google Authentication (NextAuth)

│ ├── documentLoader.ts

# Loads documents from Google Drive, processes text

│ ├── googleDrive.ts

# Handles Google Drive API operations

│ ├── indexManager.ts

# Manages vector database (Pinecone)

│ ├── queryProcessor.ts

# Handles query retrieval & ranking

│ ├── 📂 scripts/

# Utility scripts for indexing & vector management

│ ├── deleteVectors.ts

# Deletes vectors from Pinecone

│ ├── indexDocuments.ts

# Indexes documents into Pinecone

│ ├── testGoogleDrive.ts

# Tests Google Drive file fetching

│ ├── 📂 src/app/api/

# Next.js API Routes

│ ├── 📂 auth/[...nextauth]/

# NextAuth API Route

│ ├── 📂 query/

# Query processing API Route

│ ├── 📂 src/components/

# Frontend UI components

│ ├── ChatUI.tsx

# Chat-based UI for querying documents

│ ├── SessionProvider.tsx

# Manages authentication state

│ ├── .env.local

# Environment variables (API keys, credentials)

├── google-config.json

# Google service account credentials

---

## ⚙️ Tech Stack

### **Frontend:**

- **Next.js 15** (App Router, SSR)
- **Tailwind CSS** (Responsive UI)
- **React State Management** (Session handling & query management)

### **Backend:**

- **LlamaIndex** (Document Parsing & Retrieval)
- **Pinecone** (Vector Database for storing embeddings)
- **Google Drive API** (Fetches and processes documents)
- **NextAuth.js** (Google Authentication)
- **Vercel Functions** (Serverless API execution)

---

## 🔐 Authentication Flow

The project uses **NextAuth.js with Google OAuth** to authenticate users.

1. When a user accesses the app, they see a **"Sign in with Google"** button.
2. Clicking the button **redirects them to Google's OAuth page**.
3. Upon successful authentication, the user is **redirected back** to the app with a session.
4. **Session data is managed** using `SessionProvider.tsx` and passed to Next.js pages.

### **Relevant Files:**

- [`auth.ts`](lib/auth.ts) → Configures Google OAuth authentication.
- [`SessionProvider.tsx`](src/components/SessionProvider.tsx) → Wraps Next.js app with session context.
- [`route.ts`](src/app/api/auth/[...nextauth]/route.ts) → NextAuth API route handling login/logout.

---

## 📂 Document Processing Flow (Google Drive to Pinecone)

The app fetches **PDF/DOCX** files from a **Google Drive folder**, processes them into **text embeddings**, and stores them in **Pinecone** for querying.

### **1️⃣ Fetch Files from Google Drive**

- `googleDrive.ts` handles authentication and API calls to **fetch files from a shared Drive folder**.
- Uses **Google Service Account** credentials stored in `.env.local`.

### **2️⃣ Process & Parse Documents**

- `documentLoader.ts` reads the file content, extracts text, and applies **manual chunking** for **efficient retrieval**.
- Uses **LlamaParseReader** to parse PDFs and DOCX.
- Stores a temporary file buffer (handled with `os.tmpdir()` for compatibility with Vercel).

### **3️⃣ Store Vectors in Pinecone**

- `indexDocuments.ts` reads processed documents and **stores vector embeddings in Pinecone**.
- Uses **OpenAI’s text embeddings** (`text-embedding-3-small`).
- Runs as a **one-time script** to index files before querying.

### **4️⃣ Query Processing & Retrieval**

- `queryProcessor.ts` **retrieves top-k most relevant document snippets**.
- `route.ts` in `/api/query` handles user queries **via OpenAI LLM**.
- **Returns the best-matching text + source document & page number**.

### **Relevant Files:**

- [`googleDrive.ts`](lib/googleDrive.ts) → Fetches documents from Google Drive.
- [`documentLoader.ts`](lib/documentLoader.ts) → Parses and extracts text from documents.
- [`indexDocuments.ts`](scripts/indexDocuments.ts) → Indexes documents into Pinecone.
- [`indexManager.ts`](lib/indexManager.ts) → Handles interactions with Pinecone DB.

---

## 🔎 Query Flow

Once documents are stored in Pinecone, users can ask questions via the **chat UI**. The system retrieves **relevant document snippets**.

1. User **submits a query** from `ChatUI.tsx`.
2. The frontend **sends a request** to `/api/query/route.ts`.
3. `queryProcessor.ts` retrieves **top-k relevant vectors** from Pinecone.
4. OpenAI LLM **processes the query & returns a refined answer**.
5. The app **displays the response**, along with **source document & page number**.

### **Relevant Files:**

- [`ChatUI.tsx`](src/components/ChatUI.tsx) → Manages chat UI & user queries.
- [`queryProcessor.ts`](lib/queryProcessor.ts) → Handles vector retrieval & LLM processing.
- [`route.ts`](src/app/api/query/route.ts) → Next.js API Route handling query execution.

---

## 🚀 Deployment & Running Locally

### **1️⃣ Set Up Environment Variables**

Create a `.env.local` file in the project root and add:

```ini
# Google OAuth (Authentication)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Google Drive API
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY="your-private-key"
GOOGLE_DRIVE_FOLDER_ID=your-folder-id

# Pinecone (Vector DB)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=your-index-name

# NextAuth Secret
NEXTAUTH_SECRET=your-secret-key
```

---

## Scripts

# Test Google Drive Connection

npx tsx scripts/testGoogleDrive.ts

# Index Documents into Pinecone

npx tsx scripts/indexDocuments.ts

# Delete Vectors from Pinecone

npx tsx scripts/deleteVectors.ts
