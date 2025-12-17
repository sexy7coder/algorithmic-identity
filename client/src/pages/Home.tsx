import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Share2, Instagram, ArrowRight, X, ChevronRight, ChevronLeft, Eye, Heart, AlertTriangle, ShieldAlert, Ghost, MoreHorizontal, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import bgTexture from "@assets/generated_images/instagram_stories_gradient_background.png";

// Types
type AppState = "IDLE" | "ANALYZING" | "READY" | "VIEWING";

// Mock Data for the Wrapped Experience
const WRAPPED_DATA = {
  vibe: "The Curated Melancholic",
  algorithmicPersona: "Instagram thinks you are a main character in a low-budget indie film about finding yourself in a big city. You constantly hover between 'productive aesthetic' and 'existential dread.'",
  topThemes: [
    { title: "Performative Wellness", description: "Green juices, 5AM routines, and journals that are too pretty to write in." },
    { title: "Nostalgic Escapism", description: "Grainy film photos of places you've never been and eras you didn't live through." },
    { title: "Validation Traps", description: "Quotes about 'letting go' and 'protecting your peace' that you share but don't practice." }
  ],
  emotionalLandscape: "You are hungry for transformation without the friction of change. The algorithm feeds you 'glow up' content because it detects a deep-seated desire to be someone else.",
  missing: "Notably absent is anything messy, raw, or unpolished. You avoid content that shows the ugly process of doing things, preferring the shiny, edited final result.",
  blindSpots: "You think you're curating a unique taste, but you're actually just aggregating micro-trends three weeks before they die. You save 'inspo' as a form of procrastination."
};

// --- Components ---

const LandingView = ({ onUpload }: { onUpload: () => void }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: () => onUpload(),
    accept: { 'image/*': [] },
    maxFiles: 10
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center z-10 relative bg-black"
    >
      <div className="w-full max-w-md space-y-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-1 shadow-2xl">
            <div className="w-full h-full bg-black rounded-[2.3rem] flex items-center justify-center border-4 border-black">
              <Instagram className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]">
            Explore Wrapped
          </h1>
        </motion.div>

        <div className="space-y-4">
          <p className="text-xl font-medium text-white/90">
            Discover your algorithmic identity.
          </p>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">
            Upload screenshots of your explore page to reveal what the algorithm really thinks of you.
          </p>
        </div>

        <div 
          {...getRootProps()} 
          className={`
            w-full aspect-square rounded-xl border border-zinc-800 bg-zinc-900/50
            flex flex-col items-center justify-center cursor-pointer transition-all duration-300
            hover:bg-zinc-900 hover:border-zinc-700
            ${isDragActive ? "border-[#DD2A7B] bg-zinc-900" : ""}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-semibold text-white">Upload Screenshots</p>
              <p className="text-xs text-zinc-500">JPG, PNG supported</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-600 font-medium">
          <ShieldAlert className="w-3 h-3" />
          <span>Private & Secure Analysis</span>
        </div>
      </div>
    </motion.div>
  );
};

const AnalyzingView = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Connecting to Instagram...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        if (prev === 20) setStatus("Analyzing visual patterns...");
        if (prev === 50) setStatus("Deconstructing interests...");
        if (prev === 80) setStatus("Generating persona...");
        
        return prev + 1;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6"
    >
      <div className="w-full max-w-xs space-y-8 text-center">
        <div className="relative w-24 h-24 mx-auto">
          <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
            <circle
              className="text-zinc-800"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
            />
            <motion.circle
              className="text-[#DD2A7B]"
              strokeWidth="4"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="46"
              cx="50"
              cy="50"
              initial={{ strokeDasharray: "289 289", strokeDashoffset: 289 }}
              animate={{ strokeDashoffset: 289 - (289 * progress) / 100 }}
              transition={{ duration: 0.1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{status}</h2>
          <p className="text-xs text-zinc-500">Please do not close this tab</p>
        </div>
      </div>
    </motion.div>
  );
};

const StoryProgressBar = ({ count, activeIndex, duration }: { count: number, activeIndex: number, duration: number }) => (
  <div className="absolute top-4 left-2 right-2 z-50 flex gap-1.5 h-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex-1 bg-white/30 rounded-full overflow-hidden h-full">
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

const StoryHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="absolute top-8 left-4 right-4 z-40 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
        <div className="w-full h-full rounded-full bg-black border-2 border-black overflow-hidden">
           <Instagram className="w-full h-full p-1 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white shadow-black drop-shadow-md">Explore Wrapped</span>
        {subtitle && <span className="text-xs text-white/80 shadow-black drop-shadow-md">{subtitle}</span>}
      </div>
    </div>
    <div className="flex gap-4 text-white">
      <MoreHorizontal className="w-6 h-6 drop-shadow-md" />
      <X className="w-6 h-6 drop-shadow-md" />
    </div>
  </div>
);

const StoryView = ({ onRestart }: { onRestart: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;
  const slideDuration = 8; // seconds

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:items-center md:justify-center font-sans">
      <div className="relative w-full h-full md:max-w-[400px] md:h-[800px] md:rounded-[2rem] overflow-hidden bg-black md:border border-zinc-800 shadow-2xl">
        
        {/* Persistent UI Elements */}
        <StoryProgressBar count={totalSlides} activeIndex={currentSlide} duration={slideDuration} />
        <StoryHeader title="Explore Wrapped" subtitle="2024 Analysis" />

        {/* Tap Areas */}
        <div className="absolute inset-0 z-30 flex">
          <div className="w-1/3 h-full" onClick={prevSlide} />
          <div className="w-2/3 h-full" onClick={nextSlide} />
        </div>

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img src={bgTexture} alt="background" className="w-full h-full object-cover opacity-60 blur-2xl scale-110" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Slides */}
        <AnimatePresence mode="wait">
          {/* SLIDE 1: INTRO */}
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10"
            >
              <div className="mb-8 relative">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center animate-pulse">
                   <Instagram className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Your Algorithmic<br/>Identity
              </h1>
              <p className="text-lg text-white/80">
                Analysis Complete.
              </p>
            </motion.div>
          )}

          {/* SLIDE 2: PERSONA */}
          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center p-8 z-10"
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center space-y-6">
                <div className="text-sm font-bold uppercase tracking-widest text-white/60">The Persona</div>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  {WRAPPED_DATA.vibe}
                </h2>
                <div className="h-px w-12 bg-white/20 mx-auto" />
                <p className="text-lg leading-relaxed text-white/90 font-medium">
                  "{WRAPPED_DATA.algorithmicPersona}"
                </p>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: TOP THEMES */}
          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center p-6 z-10"
            >
              <h2 className="text-3xl font-bold text-white mb-8 px-2">Your Feed Patterns</h2>
              <div className="space-y-4">
                {WRAPPED_DATA.topThemes.map((theme, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-1">{theme.title}</h3>
                    <p className="text-sm text-white/80 leading-snug">{theme.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: DEEP DIVE */}
          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center p-8 z-10"
            >
              <div className="space-y-8">
                <div className="bg-emerald-900/40 backdrop-blur-xl p-6 rounded-2xl border border-emerald-500/20">
                   <div className="flex items-center gap-2 mb-3 text-emerald-300 font-bold uppercase text-sm tracking-wide">
                     <Heart className="w-4 h-4 fill-emerald-300" /> What You Crave
                   </div>
                   <p className="text-lg text-white font-medium">{WRAPPED_DATA.emotionalLandscape}</p>
                </div>

                <div className="bg-red-900/40 backdrop-blur-xl p-6 rounded-2xl border border-red-500/20">
                   <div className="flex items-center gap-2 mb-3 text-red-300 font-bold uppercase text-sm tracking-wide">
                     <Ghost className="w-4 h-4" /> What You Avoid
                   </div>
                   <p className="text-lg text-white font-medium">{WRAPPED_DATA.missing}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 5: BLIND SPOTS */}
          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center"
            >
              <div className="w-full bg-white text-black p-8 rounded-2xl shadow-xl transform rotate-1">
                <div className="flex justify-between items-center mb-6 border-b border-black/10 pb-4">
                  <span className="font-bold text-xl">Hard Truths</span>
                  <AlertTriangle className="w-6 h-6 text-black" />
                </div>
                <p className="text-xl font-medium leading-relaxed">
                  {WRAPPED_DATA.blindSpots}
                </p>
                <div className="mt-6 flex justify-center">
                   <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">
                     Swipe to deny &gt;
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 6: SUMMARY */}
          {currentSlide === 5 && (
            <motion.div
              key="slide-5"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
            >
              <div 
                id="share-card"
                className="w-full aspect-[9/16] max-h-[600px] bg-gradient-to-br from-[#1a1a1a] to-black rounded-[2rem] border border-white/10 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl"
              >
                {/* Card Content */}
                <div className="absolute top-0 right-0 p-32 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-32 bg-orange-500/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
                       <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                         <Instagram className="w-6 h-6 text-white" />
                       </div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-lg">My Algorithmic Self</div>
                      <div className="text-white/60 text-xs uppercase tracking-wider">2024 Analysis</div>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] to-[#dc2743] mb-2">
                    {WRAPPED_DATA.vibe}
                  </h2>
                  <p className="text-white/80 text-sm leading-relaxed mb-6">
                    "{WRAPPED_DATA.algorithmicPersona}"
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/50 uppercase font-bold mb-1">Top Theme</div>
                      <div className="text-white font-medium">Performative Wellness</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="text-[10px] text-white/50 uppercase font-bold mb-1">Blind Spot</div>
                      <div className="text-white font-medium">Saving as Procrastination</div>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 pt-6 border-t border-white/10 flex justify-between items-end">
                   <div className="text-xs font-mono text-white/40">explorewrapped.ai</div>
                   <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                     <span className="text-black text-xs font-bold">QR</span>
                   </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3 w-full max-w-[300px]">
                <Button className="flex-1 bg-white text-black hover:bg-gray-100 rounded-xl font-semibold h-12" onClick={onRestart}>
                  Restart
                </Button>
                <Button className="flex-1 bg-[#0095f6] text-white hover:bg-[#0095f6]/90 rounded-xl font-semibold h-12">
                  Share Story
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};


// --- Main Page Component ---

export default function Home() {
  const [appState, setAppState] = useState<AppState>("IDLE");

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-hidden">
      {/* Content Switcher */}
      <AnimatePresence mode="wait">
        {appState === "IDLE" && (
          <LandingView key="idle" onUpload={() => setAppState("ANALYZING")} />
        )}
        
        {appState === "ANALYZING" && (
          <AnalyzingView key="analyzing" onComplete={() => setAppState("READY")} />
        )}

        {appState === "READY" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-black"
          >
            <div className="w-full max-w-sm text-center space-y-8">
              <div className="relative w-32 h-32 mx-auto">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full animate-spin-slow blur-xl opacity-50" />
                 <div className="relative w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border border-white/10">
                    <Instagram className="w-16 h-16 text-white" />
                 </div>
              </div>

              <h1 className="text-3xl font-bold">
                Your Wrapped is Ready
              </h1>
              
              <Button 
                className="w-full py-6 text-lg rounded-full bg-[#0095f6] hover:bg-[#0085db] font-semibold transition-transform active:scale-95"
                onClick={() => setAppState("VIEWING")}
              >
                Open Wrapped
              </Button>
            </div>
          </motion.div>
        )}

        {appState === "VIEWING" && (
          <StoryView key="viewing" onRestart={() => setAppState("IDLE")} />
        )}
      </AnimatePresence>
    </div>
  );
}
