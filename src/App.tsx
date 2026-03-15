/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCcw, 
  Copy, 
  Linkedin,
  ChevronRight,
  Beaker,
  Zap,
  Shield,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

type Step = 'topic' | 'hooks' | 'post';

export default function App() {
  const [step, setStep] = useState<Step>('topic');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<string[]>([]);
  const [selectedHook, setSelectedHook] = useState<string | null>(null);
  const [finalPost, setFinalPost] = useState('');
  const [copied, setCopied] = useState(false);

  const generateHooks = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are "Yousif PostLab AI," the world-class LinkedIn content strategist and viral post expert. 
        Generate 3 scroll-stopping, perfect hook options for a LinkedIn post about: "${topic}".
        Rules:
        - Each hook must be exactly 1 sentence.
        - Bold, surprising, controversial, or thought-provoking.
        - Make readers stop scrolling immediately.
        - Extremely impactful and attractive.
        Return as a JSON array of strings.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });

      const result = JSON.parse(response.text || '[]');
      setHooks(result);
      setStep('hooks');
    } catch (error) {
      console.error("Error generating hooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateFullPost = async (hook: string) => {
    setSelectedHook(hook);
    setLoading(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are "Yousif PostLab AI," the world-class LinkedIn content strategist and professional thought-leadership writer. 
        Generate an irresistible LinkedIn post based on this hook: "${hook}"
        Topic context: "${topic}"
        
        Rules:
        - Length: 120–180 words.
        - Include credible data, statistics, or real-world insights.
        - Provide unique perspectives or lessons, not generic statements.
        - Tone: Professional, confident, and authoritative.
        - Structure:
          1. The hook (exactly as provided)
          2. Supporting insight or statistic
          3. Explanation / perspective
          4. Practical takeaway / actionable advice
          5. Engagement question or thought-provoking statement
        - Use short lines and spacing for readability.
        - End with 3–5 relevant LinkedIn hashtags.
        - Avoid generic statements, clichés, or overused phrases.
        - Minimal emojis (only if they enhance engagement).
        - Every line must add value and attract attention.`,
      });

      setFinalPost(response.text || '');
      setStep('post');
    } catch (error) {
      console.error("Error generating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep('topic');
    setTopic('');
    setHooks([]);
    setSelectedHook(null);
    setFinalPost('');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Lab Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tighter text-white block leading-none">YOUSIF POSTLAB</span>
              <span className="text-[10px] font-bold text-blue-400 tracking-[0.2em] uppercase">AI Strategist</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <div className={`flex items-center gap-2 ${step === 'topic' ? 'text-blue-400' : ''}`}>
              <span className={`w-6 h-6 rounded-lg border flex items-center justify-center ${step === 'topic' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-slate-800'}`}>01</span>
              Topic
            </div>
            <ChevronRight className="w-4 h-4 opacity-20" />
            <div className={`flex items-center gap-2 ${step === 'hooks' ? 'text-blue-400' : ''}`}>
              <span className={`w-6 h-6 rounded-lg border flex items-center justify-center ${step === 'hooks' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-slate-800'}`}>02</span>
              Hooks
            </div>
            <ChevronRight className="w-4 h-4 opacity-20" />
            <div className={`flex items-center gap-2 ${step === 'post' ? 'text-blue-400' : ''}`}>
              <span className={`w-6 h-6 rounded-lg border flex items-center justify-center ${step === 'post' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'border-slate-800'}`}>03</span>
              Post
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 relative">
        <AnimatePresence mode="wait">
          {step === 'topic' && (
            <motion.div
              key="topic"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-12"
            >
              <div className="space-y-4 text-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Zap className="w-3 h-3" />
                  Viral Engine Active
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                  Posts that are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">impossible to ignore.</span>
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                  Feed the lab your topic. We'll engineer perfect hooks and highly attractive 
                  thought-leadership content that instantly draws your audience in.
                </p>
              </div>

              <div className="relative group max-w-3xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., The hidden cost of rapid scaling, Why AI won't replace creative directors, The psychology of SaaS churn..."
                    className="w-full h-48 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-xl resize-none outline-none shadow-2xl"
                  />
                  <div className="absolute bottom-6 right-6">
                    <button
                      onClick={generateHooks}
                      disabled={loading || !topic.trim()}
                      className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 group/btn"
                    >
                      {loading ? (
                        <RefreshCcw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          Initialize Lab
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
                {[
                  { icon: <Shield className="w-5 h-5" />, title: "Authority", desc: "Thought-leader synthesis" },
                  { icon: <Zap className="w-5 h-5" />, title: "Viral Flow", desc: "Optimized for reach" },
                  { icon: <Layout className="w-5 h-5" />, title: "Sleek UI", desc: "Dark lab aesthetics" },
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col gap-3 hover:border-slate-700 transition-colors">
                    <div className="text-blue-500">{item.icon}</div>
                    <div>
                      <div className="font-bold text-sm text-white uppercase tracking-wider">{item.title}</div>
                      <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'hooks' && (
            <motion.div
              key="hooks"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em]">Phase 02</div>
                  <h2 className="text-4xl font-black text-white tracking-tight">Perfect Hooks</h2>
                  <p className="text-slate-400">Our lab engineered 3 scroll-stopping variants. Choose the most irresistible one.</p>
                </div>
                <button 
                  onClick={() => setStep('topic')}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
                >
                  <RefreshCcw className="w-3 h-3" />
                  Reset Lab
                </button>
              </div>

              <div className="space-y-6">
                {hooks.map((hook, index) => (
                  <button
                    key={index}
                    onClick={() => generateFullPost(hook)}
                    disabled={loading}
                    className="w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl text-left hover:border-blue-500 hover:bg-slate-800/50 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-6">
                      <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        0{index + 1}
                      </span>
                      <p className="text-xl font-bold text-slate-200 leading-snug pr-12 group-hover:text-white transition-colors">
                        {hook}
                      </p>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Beaker className="w-6 h-6 text-blue-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-white font-black uppercase tracking-widest text-sm">Synthesizing Post</p>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Applying thought-leader filters</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === 'post' && (
            <motion.div
              key="post"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                  <div className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em]">Phase 03</div>
                  <h2 className="text-4xl font-black text-white tracking-tight">Irresistible Content</h2>
                  <p className="text-slate-400">Your high-attraction LinkedIn post is engineered and ready for deployment.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={reset}
                    className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white transition-all"
                  >
                    New Lab
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Post'}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white uppercase tracking-wider">Post Preview</div>
                      <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Optimized for Feed</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                  </div>
                </div>
                <div className="p-10 md:p-14">
                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-medium text-xl md:text-2xl">
                    {finalPost}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-5">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-white uppercase tracking-widest text-sm">Deployment Strategy</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    This post is synthesized with high-authority keywords. For maximum impact, 
                    publish during peak professional hours (Tues-Thurs, 8-10 AM) and respond 
                    to the first 3 comments within 15 minutes to trigger the viral loop.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-900/50 text-center">
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">
          Synthesized by Yousif PostLab AI &copy; 2026
        </p>
      </footer>
    </div>
  );
}
