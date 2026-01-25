import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Instagram, X, Heart, AlertTriangle, ShieldAlert, Ghost, MoreHorizontal, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import bgTexture from "@assets/generated_images/instagram_stories_gradient_background.png";

// Types
type AppState = "IDLE" | "ANALYZING" | "READY" | "VIEWING" | "ERROR";

interface AnalysisResult {
  vibe: string;
  algorithmicPersona: string;
  topThemes: Array<{ title: string; description: string }>;
  emotionalLandscape: string;
  missing: string;
  blindSpots: string;
}

const LOADING_MESSAGES = [
  "Reading your attention patterns...",
  "Detecting interests...",
  "Finding your vibe...",
  "Decoding algorithmic bias...",
  "Analyzing visual aesthetics...",
  "Mapping emotional landscape...",
  "Peering into blind spots...",
  "Constructing digital persona..."
];

// --- Components ---

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

const StoryProgressBar = ({ count, activeIndex, duration }: { count: number, activeIndex: number, duration: number }) => (
  <div className="absolute top-4 left-2 right-2 z-50 flex gap-1 h-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex-1 bg-white/20 rounded-full overflow-hidden h-full">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: i < activeIndex ? "100%" : "0%" }}
          animate={{ width: i < activeIndex ? "100%" : i === activeIndex ? "100%" : "0%" }}
          transition={{ duration: i === activeIndex ? duration : 0, ease: "linear" }}
        />
      </div>
    ))}
  </div>
);

const StoryHeader = ({ onRestart }: { onRestart: () => void }) => (
  <div className="absolute top-8 left-4 right-4 z-40 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
        <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden flex items-center justify-center">
           <Instagram className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-white shadow-black drop-shadow-lg tracking-tight">Explore Wrapped</span>
        <span className="text-[10px] font-bold text-white/60 shadow-black drop-shadow-lg uppercase tracking-widest">Digital Twin</span>
      </div>
    </div>
    <div className="flex gap-4 text-white/90">
      <button className="hover:scale-110 transition-transform"><MoreHorizontal className="w-6 h-6 drop-shadow-md" /></button>
      <button onClick={onRestart} className="hover:scale-110 transition-transform"><X className="w-6 h-6 drop-shadow-md" /></button>
    </div>
  </div>
);

const StoryView = ({ data, onRestart }: { data: AnalysisResult, onRestart: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;
  const slideDuration = 8;

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(c => c + 1);
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  }, [currentSlide]);

  useEffect(() => {
    const timer = setTimeout(nextSlide, slideDuration * 1000);
    return () => clearTimeout(timer);
  }, [currentSlide, nextSlide]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-sans touch-none">
      <div className="relative w-full h-full md:max-w-[420px] md:h-[840px] md:rounded-[3rem] md:my-8 overflow-hidden bg-black md:border-[8px] border-zinc-900 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        
        <StoryProgressBar count={totalSlides} activeIndex={currentSlide} duration={slideDuration} />
        <StoryHeader onRestart={onRestart} />

        {/* Navigation Tap Zones */}
        <div className="absolute inset-0 z-30 flex">
          <div className="w-1/4 h-full cursor-w-resize" onClick={prevSlide} />
          <div className="w-3/4 h-full cursor-e-resize" onClick={nextSlide} />
        </div>

        {/* Visible Nav Arrows (Desktop) */}
        <div className="hidden md:block absolute inset-y-0 -left-16 z-50 flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-white" onClick={prevSlide} disabled={currentSlide === 0}>
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="hidden md:block absolute inset-y-0 -right-16 z-50 flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-white/10 text-white" onClick={nextSlide} disabled={currentSlide === totalSlides - 1}>
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="absolute inset-0 z-0">
          <motion.img 
            key={`bg-${currentSlide}`}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src={bgTexture} 
            alt="background" 
            className="w-full h-full object-cover blur-3xl" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10"
          >
            {currentSlide === 0 && (
              <div className="text-center space-y-8">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 rounded-3xl bg-white/10 backdrop-blur-2xl flex items-center justify-center mx-auto shadow-2xl border border-white/20"
                >
                   <Instagram className="w-16 h-16 text-white" />
                </motion.div>
                <div className="space-y-4">
                  <h1 className="text-5xl font-black text-white leading-none tracking-tight">
                    DECODED.
                  </h1>
                  <p className="text-xl text-white/60 font-medium tracking-wide uppercase">Your 2024 Algorithmic Self</p>
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="w-full space-y-8">
                <div className="space-y-2 text-center">
                  <span className="text-xs font-black text-white/40 uppercase tracking-[0.3em]">The Persona</span>
                  <h2 className="text-4xl font-black text-white leading-tight tracking-tight">{data.vibe}</h2>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/5 blur-xl rounded-full" />
                  <p className="relative text-2xl leading-[1.4] text-white font-bold italic text-center px-4">
                    "{data.algorithmicPersona}"
                  </p>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="w-full space-y-6">
                <h2 className="text-3xl font-black text-white mb-4 px-2 tracking-tight italic">Patterns Identified.</h2>
                <div className="space-y-4">
                  {data.topThemes.map((theme, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-xl"
                    >
                      <h3 className="text-lg font-black text-white mb-2 uppercase tracking-wide">{theme.title}</h3>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">{theme.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="w-full space-y-8">
                <div className="bg-emerald-500/10 backdrop-blur-3xl p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 bg-emerald-500/10 blur-3xl rounded-full -mr-6 -mt-6" />
                   <div className="flex items-center gap-3 mb-4 text-emerald-400 font-black uppercase text-xs tracking-[0.2em]">
                     <Heart className="w-5 h-5 fill-emerald-400" /> Your Cravings
                   </div>
                   <p className="text-xl text-white font-bold leading-relaxed">{data.emotionalLandscape}</p>
                </div>

                <div className="bg-red-500/10 backdrop-blur-3xl p-8 rounded-3xl border border-red-500/20 shadow-2xl relative overflow-hidden">
                   <div className="absolute bottom-0 left-0 p-12 bg-red-500/10 blur-3xl rounded-full -ml-6 -mb-6" />
                   <div className="flex items-center gap-3 mb-4 text-red-400 font-black uppercase text-xs tracking-[0.2em]">
                     <Ghost className="w-5 h-5 fill-red-400" /> Your Avoidance
                   </div>
                   <p className="text-xl text-white font-bold leading-relaxed">{data.missing}</p>
                </div>
              </div>
            )}

            {currentSlide === 4 && (
              <div className="w-full px-2">
                <motion.div 
                  initial={{ rotate: -5, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  className="w-full bg-white text-black p-10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(255,255,255,0.1)] relative"
                >
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#DD2A7B] rounded-full flex items-center justify-center text-white shadow-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex justify-between items-center mb-8 border-b-2 border-black/5 pb-4">
                    <span className="font-black text-2xl tracking-tighter">HARD TRUTHS</span>
                  </div>
                  <p className="text-2xl font-bold leading-[1.3] tracking-tight">{data.blindSpots}</p>
                  <div className="mt-10 flex justify-center">
                     <div className="bg-black text-white px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase hover:scale-105 transition-transform cursor-pointer">
                       Keep Scrolling &gt;
                     </div>
                  </div>
                </motion.div>
              </div>
            )}

            {currentSlide === 5 && (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
                <div className="w-full aspect-[9/16] bg-gradient-to-br from-[#121212] to-black rounded-[2.5rem] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl ring-1 ring-white/20">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -mr-32 -mt-32" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full -ml-32 -mb-32" />

                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px] shadow-lg">
                         <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                           <Instagram className="w-7 h-7 text-white" />
                         </div>
                      </div>
                      <div>
                        <div className="font-black text-white text-xl tracking-tight leading-none">Explore Wrapped</div>
                        <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">2024 Identity Audit</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] to-[#bc1888] leading-none tracking-tighter">
                        {data.vibe}
                      </h2>
                      <p className="text-white/90 text-lg font-bold italic leading-snug">"{data.algorithmicPersona}"</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                        <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Primary Vibe</div>
                        <div className="text-white font-bold text-lg">{data.topThemes[0]?.title || "N/A"}</div>
                      </div>
                      <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10">
                        <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-2">Digital Void</div>
                        <div className="text-white font-bold leading-tight">{data.missing.split('.')[0]}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative z-10 pt-8 border-t border-white/10 flex justify-between items-end">
                     <div className="text-[10px] font-black tracking-widest text-white/30 uppercase">explorewrapped.ai</div>
                     <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                       <Instagram className="w-6 h-6 text-black" />
                     </div>
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1 bg-white/5 text-white border-white/10 hover:bg-white/10 rounded-2xl font-bold h-14 text-lg" onClick={onRestart}>
                    Restart
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-[#F58529] to-[#DD2A7B] text-white hover:opacity-90 rounded-2xl font-bold h-14 text-lg shadow-xl">
                    Share Story
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
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
                className="w-full h-18 text-2xl rounded-2xl bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:scale-[1.02] transition-all font-black italic shadow-2xl"
                onClick={() => setAppState("VIEWING")}
              >
                OPEN WRAPPED
              </Button>
            </div>
          </motion.div>
        )}

        {appState === "VIEWING" && analysisData && (
          <StoryView key="viewing" data={analysisData} onRestart={handleRestart} />
        )}
      </AnimatePresence>
    </div>
  );
}
