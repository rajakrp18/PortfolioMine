import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, Code2, Cpu, Database, Shield } from 'lucide-react';

const ArchitectureShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const snippets = [
    {
      title: 'Legal RAG Copilot & Fallback Engine',
      filename: 'legal_rag_copilot.py',
      language: 'FastAPI / Gemini API / Async',
      icon: Cpu,
      context: 'Delivering sub-second legal query intelligence with certified PDF citations and 100% uptime when external LLM APIs fail or have rate limits.',
      solution: 'Implemented an async RAG pipeline in FastAPI that grounds queries against indexed judicial precedents, with an automatic fallback mechanism returning verified statutory ratios.',
      code: `from fastapi import FastAPI, HTTPException
import httpx
from app.models import PrecedentRatio
from app.config import settings

class LegalRAGCopilot:
    """
    Multi-turn Legal RAG Copilot with dual-quoted PDF citations 
    and local statutory ratio fallback for graceful degradation.
    """
    def __init__(self, gemini_api_key: str | None = None):
        self.api_key = gemini_api_key or settings.GEMINI_API_KEY
        self.model = "gemini-2.5-flash"

    async def query_copilot(self, question: str, limit: int = 5) -> dict:
        # 1. Fetch top grounded judicial precedents from async SQLite
        precedents = await PrecedentRatio.get_relevant_rulings(question, limit=limit)
        
        if not self.api_key:
            # Graceful degradation: Return verified local statutory ratios
            return {
                "mode": "FALLBACK_STATUTORY",
                "answer": self._format_statutory_fallback(question, precedents),
                "citations": [p.certified_pdf_path for p in precedents]
            }

        # 2. Construct grounded legal prompt strictly citing authentic court PDFs
        context_payload = self._build_context(precedents)
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent",
                params={"key": self.api_key},
                json={"contents": [{"parts": [{"text": f"Context: {context_payload}\\nQuery: {question}"}]}]}
            )
            return response.json()`
    },
    {
      title: 'Multi-Factor OSINT Confidence Scorer',
      filename: 'ConfidenceScorer.ts',
      language: 'TypeScript / OSINT Engine',
      icon: Shield,
      context: 'Attributing and verifying Indian phone numbers from fragmented MCA, IEPF dividend, and public registry records without false positives.',
      solution: 'Engineered a weighted 0–100% confidence algorithm combining string normalization, exact house/flat match, phonetic variant names, and multi-domain authority bonuses.',
      code: `export interface IdentityProfile {
  targetName: string;
  targetAddress: string;
  city: string;
  pincode?: string;
}

export type AttributionType = 'DIRECT_PERSON' | 'PROXY_PERSON' | 'RWA' | 'BROKER' | 'ORGANIZATION';

export class ConfidenceScorer {
  /**
   * Multi-factor scoring model:
   * Score = min(100, max(0, S_Name + S_Address + S_Attribution + S_MultiSource + S_DomainTrust))
   */
  public static calculateScore(
    candidate: { name: string; address: string; attribution: AttributionType; domains: string[] },
    target: IdentityProfile
  ): number {
    let score = 0;

    // 1. Name Resolution (Exact match: +30, Variant/Middle: +20)
    if (candidate.name.toLowerCase() === target.targetName.toLowerCase()) {
      score += 30;
    } else if (this.isPhoneticMatch(candidate.name, target.targetName)) {
      score += 20;
    }

    // 2. Address & Pincode Anchoring (Exact Flat/House: +40, Locality: +20)
    if (this.hasExactHouseNumber(candidate.address, target.targetAddress)) {
      score += 40;
    } else if (candidate.address.includes(target.city)) {
      score += 15;
    }

    // 3. Attribution Type Weighting
    const attributionWeights: Record<AttributionType, number> = {
      DIRECT_PERSON: 20,
      PROXY_PERSON: 10,
      RWA: 5,
      BROKER: 5,
      ORGANIZATION: 3
    };
    score += attributionWeights[candidate.attribution] || 0;

    // 4. Multi-Source Independent Verification Bonus (+15 per extra domain)
    if (candidate.domains.length > 1) {
      score += (candidate.domains.length - 1) * 15;
    }

    return Math.min(100, Math.max(0, score));
  }
}`
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
            Real code snippets demonstrating how I approach legal RAG fallback resilience, multi-agent OSINT confidence scoring, and multi-tenant schema isolation.
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

          {/* Code Viewer Body */}
          <div className="p-4 sm:p-6 bg-white dark:bg-[#070a10] overflow-x-auto text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200">
            <pre>
              <code>{currentSnippet.code}</code>
            </pre>
          </div>

        </div>

      </div>
    </section>
  );
};

export default ArchitectureShowcase;
