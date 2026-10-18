import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Code2, Cpu, Database, Activity } from 'lucide-react';

const ArchitectureShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const snippets = [
    {
      title: 'Real-Time EMG Serial Pipeline',
      filename: 'emg_stream_worker.py',
      language: 'Python / PyQt6 / Serial',
      icon: Activity,
      context: 'Processing bio-signals at 60+ FPS with sub-50ms latency without blocking the Qt main GUI loop.',
      solution: 'Used QThread worker with a circular ring-buffer to ingest raw serial packets from Arduino, decouple hardware I/O, and push batched vectors to PyQtGraph.',
      code: `import serial
from PyQt6.QtCore import QThread, pyqtSignal
import numpy as np

class EMGSerialWorker(QThread):
    data_packet_received = pyqtSignal(np.ndarray)
    
    def __init__(self, port="COM3", baudrate=115200, buffer_size=128):
        super().__init__()
        self.port = port
        self.baudrate = baudrate
        self.buffer_size = buffer_size
        self._running = True

    def run(self):
        # Establish non-blocking serial communication with Arduino
        with serial.Serial(self.port, self.baudrate, timeout=0.02) as ser:
            batch = []
            while self._running:
                raw_line = ser.readline().decode('utf-8', errors='ignore').strip()
                if not raw_line:
                    continue
                try:
                    # Ingest EMG analog voltage reading (0-1023)
                    val = float(raw_line)
                    batch.append(val)
                    if len(batch) >= self.buffer_size:
                        # Dispatch NumPy array to PyQtGraph renderer (<50ms latency)
                        self.data_packet_received.emit(np.array(batch, dtype=np.float32))
                        batch = []
                except ValueError:
                    continue`
    },
    {
      title: 'NLP Vector Similarity Service',
      filename: 'vector_search_service.py',
      language: 'FastAPI / Sentence-Transformers',
      icon: Cpu,
      context: 'Replacing brittle fuzzy-matching with semantic dense vectors for 95%+ medicine lookup accuracy.',
      solution: 'Loaded Hugging Face all-MiniLM-L6-v2 embeddings once at app startup, normalized query vectors, and executed cosine similarity across catalog embeddings in <15ms.',
      code: `from fastapi import FastAPI, HTTPException
from sentence_transformers import SentenceTransformer
import numpy as np
from pydantic import BaseModel

app = FastAPI(title="Medicine Semantic Vector Engine")
# Load transformer model into memory at startup
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

class MedicineQuery(BaseModel):
    query_text: str
    top_k: int = 5

@app.post("/api/v1/search/semantic")
async def semantic_medicine_search(payload: MedicineQuery):
    if not payload.query_text.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")
        
    # Generate 384-dimensional dense vector representation
    query_vector = model.encode(payload.query_text, normalize_embeddings=True)
    
    # Compute dot product (cosine similarity) with pre-indexed catalog vectors
    # Achieved 95%+ precision and 40% faster latency over traditional LIKE queries
    scores = np.dot(CATALOG_EMBEDDINGS, query_vector)
    top_indices = np.argsort(scores)[::-1][:payload.top_k]
    
    return [
        {"item": CATALOG_ITEMS[i], "confidence": float(scores[i])}
        for i in top_indices
    ]`
    },
    {
      title: 'Multi-Tenant Schema Isolation',
      filename: 'tenant_isolation.sql',
      language: 'PostgreSQL / SQL',
      icon: Database,
      context: 'Enforcing strict organization boundaries and auditability across 18 ERP microservice modules.',
      solution: 'Implemented Row-Level Security (RLS) policies keyed on tenant_id with index clustering, avoiding database-per-tenant sprawl while ensuring airtight data boundaries.',
      code: `-- Enforce Tenant Isolation for ERP Inventory & Billing
CREATE TABLE erp_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast tenant-scoped indexing
CREATE INDEX idx_invoices_tenant_created 
ON erp_invoices(tenant_id, created_at DESC);

-- Enable PostgreSQL Row-Level Security (RLS)
ALTER TABLE erp_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON erp_invoices
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::UUID);`
    }
  ];

  const currentSnippet = snippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="architecture" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-mono font-medium mb-3">
            <Terminal size={12} />
            <span>04 // UNDER THE HOOD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Architecture & <span className="text-gradient-primary">Code in Action</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mt-3 text-sm sm:text-base">
            Real code snippets demonstrating how I approach hardware serial streaming, vector search, and multi-tenant schema isolation.
          </p>
        </div>

        {/* Code Showcase Terminal Window */}
        <div className="card-crafted rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
          
          {/* Terminal Titlebar & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-100 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 gap-2">
            
            {/* Window Controls + Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto">
              <div className="hidden sm:flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              </div>

              {snippets.map((snip, index) => {
                const TabIcon = snip.icon;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === index
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200 dark:border-slate-700'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <TabIcon size={13} />
                    <span>{snip.filename}</span>
                  </button>
                );
              })}
            </div>

            {/* Language Tag & Copy Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {currentSnippet.language}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                title="Copy snippet"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Context & Architecture Explanation Bar */}
          <div className="p-4 sm:p-5 bg-blue-50/50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 text-xs leading-relaxed space-y-1.5">
            <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
              <strong className="text-blue-600 dark:text-blue-400 font-mono shrink-0">Challenge:</strong>
              <span>{currentSnippet.context}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono shrink-0">Solution:</strong>
              <span>{currentSnippet.solution}</span>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 sm:p-6 bg-slate-950 text-slate-200 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto">
            <pre className="code-font">
              <code>{currentSnippet.code}</code>
            </pre>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ArchitectureShowcase;
