import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Instagram, X, Heart, AlertTriangle, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Types
type AppState = "IDLE" | "ANALYZING" | "READY" | "VIEWING" | "ERROR";

interface AnalysisResult {
  vibe: string;
  introduction: string;
  algorithmicPersona: string;
  topThemes: Array<{ title: string; description: string }>;
  emotionalLandscape: string;
  missing: string;
  blindSpots: string;
  closing: string;
}

const LOADING_MESSAGES = [
  "Synchronizing with neural networks...",
  "Parsing attention heatmaps...",
  "Aggregating aesthetic clusters...",
  "Calculating emotional resonance...",
  "Indexing digital blind spots...",
  "Synthesizing algorithmic persona...",
  "Finalizing your identity audit..."
];

// --- Components ---

const ChatView = ({ data, onRestart }: { data: AnalysisResult, onRestart: () => void }) => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const scrollRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const messages = [
    { type: "bot", content: data.introduction },
    { type: "bot", content: `I've analyzed your patterns. You are: **${data.vibe}**` },
    { type: "bot", content: data.algorithmicPersona },
    { 
      type: "bot", 
      content: "Here are the core pillars of your digital attention:",
      subContent: (
        <div className="grid gap-3 mt-4 w-full">
          {data.topThemes.map((theme, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <h4 className="font-black text-xs uppercase tracking-widest text-[#DD2A7B] mb-1">{theme.title}</h4>
              <p className="text-sm text-zinc-300 leading-relaxed">{theme.description}</p>
            </motion.div>
          ))}
        </div>
      )
    },
    { type: "bot", label: "Emotional Landscape", content: data.emotionalLandscape },
    { type: "bot", label: "The Void", content: `I've noticed a distinct lack of engagement with certain areas: ${data.missing}` },
    { 
      type: "bot", 
      label: "The Hard Truth", 
      content: data.blindSpots,
      className: "bg-white text-black border-none"
    },
    { type: "bot", content: data.closing }
  ];

  useEffect(() => {
    if (visibleMessages < messages.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(v => v + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [visibleMessages, messages.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-full bg-black font-sans overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-white leading-none">Algorithm Audit</h2>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Live Connection</p>
          </div>
        </div>
        <button 
          onClick={onRestart}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-zinc-400" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-24">
        <AnimatePresence>
          {messages.slice(0, visibleMessages).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex flex-col ${msg.type === "bot" ? "items-start" : "items-end"} max-w-[90%]`}
              ref={i === visibleMessages - 1 ? scrollRef : null}
            >
              {msg.label && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-4">
                  {msg.label}
                </span>
              )}
              <div className={`
                p-5 rounded-[2rem] text-sm font-medium leading-relaxed shadow-lg w-full
                ${msg.className || "bg-zinc-900 text-white border border-zinc-800"}
                ${msg.type === "bot" ? "rounded-bl-none" : "rounded-br-none bg-[#DD2A7B]"}
              `}>
                {msg.content.split('**').map((part, index) => 
                  index % 2 === 1 ? <strong key={index} className="text-[#DD2A7B]">{part}</strong> : part
                )}
                {msg.subContent}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {visibleMessages < messages.length && (
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {visibleMessages === messages.length && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-3 pt-4"
          >
            <Button 
              className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black italic shadow-xl"
              onClick={onRestart}
            >
              RESTART AUDIT
            </Button>
            <p className="text-[10px] text-center text-zinc-600 font-bold uppercase tracking-widest">
              explorewrapped.ai • 2024 identity report
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const LandingView = ({ onUpload, files, onRemove }: { onUpload: (files: File[]) => void, files: File[], onRemove: (index: number) => void }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUpload,
    accept: { 'image/*': [] },
    maxFiles: 10,
    multiple: true
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center z-10 relative bg-black selection:bg-[#DD2A7B]/30"
    >
      <div className="w-full max-w-md space-y-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-1 shadow-2xl">
              <div className="w-full h-full bg-black rounded-[2.3rem] flex items-center justify-center border-4 border-black">
                <Instagram className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
            Explore Wrapped
          </h1>
        </motion.div>

        <div className="space-y-4">
          <p className="text-xl font-medium text-white/90 leading-relaxed">
            Discover your algorithmic identity.
          </p>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
            Upload screenshots of your explore page to reveal what the algorithm really thinks of you.
          </p>
        </div>

        <div className="space-y-6">
          <div 
            {...getRootProps()} 
            className={`
              relative w-full aspect-square md:aspect-video md:h-64 rounded-2xl border-2 border-dashed transition-all duration-500
              flex flex-col items-center justify-center cursor-pointer overflow-hidden
              ${isDragActive 
                ? "border-[#DD2A7B] bg-[#DD2A7B]/5 scale-[1.02] shadow-[0_0_40px_rgba(221,42,123,0.15)]" 
                : "border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-zinc-700 hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]"
              }
            `}
          >
            <input {...getInputProps()} />
            <AnimatePresence mode="wait">
              <motion.div 
                key={isDragActive ? "active" : "idle"}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-4 px-6"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300 ${isDragActive ? 'bg-[#DD2A7B] text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                  <Upload className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-semibold text-white">
                    {isDragActive ? "Drop them here!" : "Upload Screenshots"}
                  </p>
                  <p className="text-xs text-zinc-500">Up to 10 images (JPG, PNG)</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {files.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Selected Images ({files.length}/10)
                  </span>
                  <button 
                    onClick={() => files.forEach((_, i) => onRemove(0))}
                    className="text-xs font-bold text-[#DD2A7B] hover:opacity-80 transition-opacity"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {files.map((file, idx) => (
                    <motion.div 
                      key={`${file.name}-${idx}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700"
                    >
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                      />
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(idx);
                        }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const event = new CustomEvent('start-analysis');
                    window.dispatchEvent(event);
                  }}
                  className="w-full h-14 text-lg rounded-xl bg-white text-black hover:bg-zinc-200 font-bold transition-all active:scale-[0.98] shadow-xl"
                >
                  Analyze My Identity
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 font-medium">
          <ShieldAlert className="w-3 h-3" />
          <span>Private & Secure On-Device Analysis</span>
        </div>
      </div>
    </motion.div>
  );
};

const AnalyzingView = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 5;
      });
    }, 2000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#DD2A7B]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="w-full max-w-xs space-y-12 text-center relative z-10">
        <div className="relative w-32 h-32 mx-auto">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#DD2A7B] border-r-[#F58529]"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-[#8134AF] border-l-[#DD2A7B] opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Instagram className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              <motion.h2 
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xl font-bold tracking-tight h-8"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.h2>
            </AnimatePresence>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
              Est. time remaining: {Math.max(5, Math.ceil((100 - progress) / 2))}s
            </p>
          </div>

          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = useCallback((newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles].slice(0, 10));
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const runAnalysis = useCallback(async () => {
    if (files.length === 0) return;

    setAppState("ANALYZING");

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisData(data);
      setAppState("READY");
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message);
      setAppState("ERROR");
    }
  }, [files]);

  useEffect(() => {
    const handleStartAnalysis = () => runAnalysis();
    window.addEventListener('start-analysis', handleStartAnalysis);
    return () => window.removeEventListener('start-analysis', handleStartAnalysis);
  }, [runAnalysis]);

  const handleRestart = useCallback(() => {
    setAppState("IDLE");
    setAnalysisData(null);
    setError(null);
    setFiles([]);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-hidden antialiased">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/10 blur-[120px] rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        {appState === "IDLE" && (
          <LandingView key="idle" onUpload={handleUpload} files={files} onRemove={removeFile} />
        )}
        
        {appState === "ANALYZING" && (
          <AnalyzingView key="analyzing" />
        )}

        {appState === "ERROR" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-black text-center"
          >
            <div className="w-full max-w-sm space-y-8">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-red-500/20">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-black italic tracking-tight">ANALYSIS HALTED.</h1>
                <p className="text-zinc-500 font-medium leading-relaxed">{error || "The algorithm refused to cooperate. Please try again."}</p>
              </div>
              <Button 
                className="w-full h-16 text-xl rounded-2xl bg-white text-black hover:bg-zinc-200 font-black italic shadow-2xl"
                onClick={handleRestart}
              >
                REBOOT ANALYSIS
              </Button>
            </div>
          </motion.div>
        )}

        {appState === "READY" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-black"
          >
            <div className="w-full max-w-sm text-center space-y-12">
              <div className="relative w-40 h-40 mx-auto">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[2.5rem] animate-spin-slow blur-2xl opacity-40" />
                 <div className="relative w-full h-full bg-zinc-950 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Instagram className="w-20 h-20 text-white" />
                    </motion.div>
                 </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-black italic leading-none tracking-tight">IDENTITY READY.</h1>
                <p className="text-zinc-500 font-medium uppercase tracking-[0.2em] text-xs">Analysis synchronized with profile</p>
              </div>
              
              <Button 
                className="w-full h-18 text-2xl rounded-2xl bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:scale-[1.02] transition-all font-black italic shadow-xl"
                onClick={() => setAppState("VIEWING")}
              >
                OPEN WRAPPED
              </Button>
            </div>
          </motion.div>
        )}

        {appState === "VIEWING" && analysisData && (
          <ChatView key="viewing" data={analysisData} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
