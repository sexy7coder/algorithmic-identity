import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Share2, Instagram, ArrowRight, X, ChevronRight, ChevronLeft, Eye, Heart, AlertTriangle, ShieldAlert, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import bgTexture from "@assets/generated_images/holographic_dark_iridescent_texture.png";

// Types
type AppState = "IDLE" | "ANALYZING" | "READY" | "VIEWING";

// Mock Data for the Wrapped Experience - UPDATED with user's structure
const WRAPPED_DATA = {
  vibe: "The Curated Melancholic",
  algorithmicPersona: "Instagram thinks you are a main character in a low-budget indie film about finding yourself in a big city. You constantly hover between 'productive aesthetic' and 'existential dread.' The algorithm sees you as someone who buys books for the cover art, drinks oat milk not for the taste but for the status, and saves workout videos you will absolutely never do. You are aspiring to a life of organized minimalism while currently living in chaotic maximalism.",
  topThemes: [
    { title: "Performative Wellness", description: "Green juices, 5AM routines, and journals that are too pretty to write in." },
    { title: "Nostalgic Escapism", description: "Grainy film photos of places you've never been and eras you didn't live through." },
    { title: "Validation Traps", description: "Quotes about 'letting go' and 'protecting your peace' that you share but don't practice." }
  ],
  emotionalLandscape: "You are hungry for transformation without the friction of change. The algorithm feeds you 'glow up' content because it detects a deep-seated desire to be someone else—specifically, someone with better skin and a cleaner apartment.",
  missing: "Notably absent is anything messy, raw, or unpolished. You avoid content that shows the ugly process of doing things, preferring the shiny, edited final result. Real politics and uncomfortable truths are scrolled past instantly.",
  blindSpots: "You think you're curating a unique taste, but you're actually just aggregating micro-trends three weeks before they die. You save 'inspo' as a form of procrastination. You confuse consuming content about a hobby with actually having that hobby. The algorithm knows you're lonely before you do."
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
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center z-10 relative"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" />
      
      <motion.div 
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-8"
      >
        <Instagram className="w-20 h-20 text-white opacity-90 drop-shadow-[0_0_15px_rgba(255,0,128,0.5)]" />
      </motion.div>

      <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 font-display">
        EXPLORE<br/>WRAPPED
      </h1>
      
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-lg font-light">
        What does your doomscroll say about your soul? Upload your screenshots to find out.
      </p>

      <div 
        {...getRootProps()} 
        className={`
          w-full max-w-md aspect-[4/3] rounded-3xl border-2 border-dashed 
          flex flex-col items-center justify-center cursor-pointer transition-all duration-300
          hover:scale-[1.02] hover:border-primary/50 hover:bg-white/5
          ${isDragActive ? "border-primary bg-primary/10 scale-[1.02]" : "border-white/20 bg-black/20"}
        `}
      >
        <input {...getInputProps()} />
        <div className="p-8 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium text-white">
            {isDragActive ? "Drop them here!" : "Drop screenshots here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select files
          </p>
        </div>
      </div>

      <div className="mt-8 flex gap-4 text-xs text-muted-foreground uppercase tracking-widest">
        <span>Privacy First</span>
        <span>•</span>
        <span>AI Powered</span>
        <span>•</span>
        <span>Est. 2024</span>
      </div>
    </motion.div>
  );
};

const AnalyzingView = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        // Update status based on progress
        if (prev === 10) setStatus("Scanning pixels...");
        if (prev === 30) setStatus("Deconstructing ego...");
        if (prev === 60) setStatus("Judging attention span...");
        if (prev === 85) setStatus("Generating uncomfortable truths...");
        
        return prev + 1;
      });
    }, 40); // 4 seconds total
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 z-10 relative"
    >
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="relative w-32 h-32 mx-auto">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-primary border-r-accent border-b-transparent border-l-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-display">{status}</h2>
          <p className="text-muted-foreground font-mono text-sm">{Math.round(progress)}% COMPLETE</p>
        </div>

        <Progress value={progress} className="h-2 bg-white/10" indicatorClassName="bg-gradient-to-r from-primary to-accent" />
        
        <div className="grid grid-cols-2 gap-4 opacity-50 text-xs font-mono text-left">
          <div className="space-y-1">
            <div className="text-primary">&gt; analyzing desires</div>
            <div className="text-accent">&gt; detecting avoidance</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-blue-400">&gt; parsing insecurity</div>
            <div className="text-orange-400">&gt; calculating cringe</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StorySlide = ({ children, active, onNext, onPrev }: any) => (
  <AnimatePresence mode="wait">
    {active && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.05, y: -20 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="absolute inset-0 flex flex-col p-6 md:p-12 h-full"
        onClick={(e) => {
          const width = e.currentTarget.offsetWidth;
          const clickX = e.clientX;
          if (clickX > width / 2) onNext();
          else onPrev();
        }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

const StoryView = ({ onRestart }: { onRestart: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6; // Increased to 6 slides

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  return (
    <div className="fixed inset-0 z-20 bg-black flex flex-col md:items-center md:justify-center">
      {/* Progress Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex gap-2 max-w-md mx-auto">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: i < currentSlide ? "100%" : i === currentSlide ? "100%" : "0%" }}
              transition={{ duration: i === currentSlide ? 5 : 0 }}
              className="h-full bg-white"
            />
          </div>
        ))}
      </div>

      <div className="relative w-full md:max-w-md h-full md:h-[800px] md:rounded-3xl md:overflow-hidden bg-zinc-900 border-zinc-800 md:border shadow-2xl">
        {/* Background Gradient */}
        <div className="absolute inset-0 opacity-40">
           <div className={`absolute inset-0 bg-gradient-to-br transition-colors duration-1000
             ${currentSlide === 0 ? "from-pink-600 to-purple-900" : 
               currentSlide === 1 ? "from-indigo-600 to-blue-900" :
               currentSlide === 2 ? "from-green-600 to-emerald-900" :
               currentSlide === 3 ? "from-orange-600 to-red-900" :
               currentSlide === 4 ? "from-purple-600 to-pink-900" :
               "from-zinc-800 to-black"}
           `} />
        </div>

        {/* Content Container */}
        <div className="relative h-full text-white cursor-pointer font-sans">
          
          {/* SLIDE 1: INTRO */}
          <StorySlide active={currentSlide === 0} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} 
                className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex items-center justify-center shadow-lg mb-8"
              >
                <Instagram className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-5xl font-black font-display tracking-tighter uppercase">
                Your 2024<br/>Algorithmic<br/>Identity
              </h1>
              <p className="text-xl font-medium opacity-80">
                Who are you when no one is watching (except Meta)?
              </p>
            </div>
          </StorySlide>

          {/* SLIDE 2: ALGORITHMIC PERSONA */}
          <StorySlide active={currentSlide === 1} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8 opacity-70">
                <Ghost className="w-6 h-6" />
                <span className="uppercase tracking-widest text-sm font-bold">The Persona</span>
              </div>
              
              <h2 className="text-3xl font-bold font-display mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-indigo-300">
                {WRAPPED_DATA.vibe}
              </h2>
              
              <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border-l-4 border-primary text-lg leading-relaxed font-light">
                {WRAPPED_DATA.algorithmicPersona}
              </div>
            </div>
          </StorySlide>

          {/* SLIDE 3: TOP THEMES */}
          <StorySlide active={currentSlide === 2} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-8 opacity-70">
                <Heart className="w-6 h-6" />
                <span className="uppercase tracking-widest text-sm font-bold">Your Obsessions</span>
              </div>

              <h2 className="text-3xl font-bold font-display mb-8">
                Strongest Patterns
              </h2>
              
              <div className="space-y-6">
                {WRAPPED_DATA.topThemes.map((theme, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.2 }}
                    className="bg-white/10 p-4 rounded-xl"
                  >
                    <div className="text-xl font-bold text-emerald-300 mb-1">{theme.title}</div>
                    <div className="text-sm opacity-80 leading-relaxed">{theme.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </StorySlide>

           {/* SLIDE 4: EMOTIONAL LANDSCAPE & MISSING */}
           <StorySlide active={currentSlide === 3} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6 opacity-70">
                <Eye className="w-6 h-6" />
                <span className="uppercase tracking-widest text-sm font-bold">Deep Dive</span>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold font-display mb-3 text-orange-300">What You Crave</h3>
                  <p className="text-lg leading-relaxed opacity-90">
                    {WRAPPED_DATA.emotionalLandscape}
                  </p>
                </div>

                <div className="h-px bg-white/20 w-full" />

                <div>
                  <h3 className="text-2xl font-bold font-display mb-3 text-blue-300">What You Avoid</h3>
                  <p className="text-lg leading-relaxed opacity-90">
                    {WRAPPED_DATA.missing}
                  </p>
                </div>
              </div>
            </div>
          </StorySlide>

          {/* SLIDE 5: BLIND SPOTS */}
          <StorySlide active={currentSlide === 4} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
              
              <h2 className="text-4xl font-black font-display mb-8 text-red-100">
                Hard Truths
              </h2>
              
              <div className="bg-red-500/10 border border-red-500/30 p-8 rounded-2xl backdrop-blur-sm">
                <p className="text-xl leading-relaxed font-medium">
                  {WRAPPED_DATA.blindSpots}
                </p>
              </div>

              <div className="mt-8 text-sm opacity-50 uppercase tracking-widest">
                Don't shoot the messenger
              </div>
            </div>
          </StorySlide>

          {/* SLIDE 6: SUMMARY CARD */}
          <StorySlide active={currentSlide === 5} onNext={() => {}} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center items-center relative z-10">
              <Card className="w-full bg-black/80 backdrop-blur-xl border-white/20 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 opacity-50" />
                
                <div className="p-8 space-y-6 relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                        <Instagram className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">My Algorithmic Self</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest">2024 Edition</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Archetype</div>
                      <div className="text-2xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        {WRAPPED_DATA.vibe}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Core Desire</div>
                      <div className="text-lg font-medium leading-tight mt-1">
                        "Hungry for transformation without the friction of change."
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                       <div className="bg-white/5 p-3 rounded-lg">
                          <div className="text-[10px] text-muted-foreground uppercase">Top Theme</div>
                          <div className="font-bold text-sm">Performative Wellness</div>
                       </div>
                       <div className="bg-white/5 p-3 rounded-lg">
                          <div className="text-[10px] text-muted-foreground uppercase">Blind Spot</div>
                          <div className="font-bold text-sm">Saving as Procrastination</div>
                       </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                    <div className="text-xs font-mono opacity-50">generated by<br/>explorewrapped.ai</div>
                    <div className="h-12 w-12 bg-white text-black flex items-center justify-center rounded-lg font-bold text-xs">
                      QR
                    </div>
                  </div>
                </div>
              </Card>

              <div className="mt-8 flex gap-4 w-full">
                <Button className="flex-1 bg-white text-black hover:bg-gray-200 h-12 rounded-full font-bold" onClick={onRestart}>
                   Start Over
                </Button>
                <Button className="flex-1 bg-primary text-white hover:bg-primary/90 h-12 rounded-full font-bold">
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
            </div>
          </StorySlide>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---

export default function Home() {
  const [appState, setAppState] = useState<AppState>("IDLE");

  return (
    <div className="min-h-screen w-full bg-background text-foreground overflow-hidden font-sans selection:bg-pink-500/30">
      {/* Background Texture */}
      <div 
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url(${bgTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative z-10"
          >
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10" />
            
            <h1 className="text-4xl md:text-6xl font-bold font-display text-center mb-8">
              Analysis Complete
            </h1>
            
            <Button 
              size="lg" 
              className="text-xl px-12 py-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 border-none shadow-[0_0_30px_rgba(236,72,153,0.5)] animate-pulse"
              onClick={() => setAppState("VIEWING")}
            >
              Reveal Your Truth <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        )}

        {appState === "VIEWING" && (
          <StoryView key="viewing" onRestart={() => setAppState("IDLE")} />
        )}
      </AnimatePresence>
    </div>
  );
}
