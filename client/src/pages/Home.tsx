import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles, Share2, Instagram, ArrowRight, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import bgTexture from "@assets/generated_images/holographic_dark_iridescent_texture.png";

// Types
type AppState = "IDLE" | "ANALYZING" | "READY" | "VIEWING";

// Mock Data for the Wrapped Experience
const WRAPPED_DATA = {
  vibe: "Neon Cyber-Realism",
  description: "You're living in the future, but you're also kind of nostalgic about it. Your feed is a mix of high-tech aesthetics, moody nightscapes, and the occasional cat meme to keep it grounded.",
  topNiches: [
    { name: "3D Art", percent: 42, color: "var(--chart-1)" },
    { name: "Interior Design", percent: 28, color: "var(--chart-2)" },
    { name: "Street Photography", percent: 15, color: "var(--chart-3)" },
    { name: "Memes", percent: 15, color: "var(--chart-4)" },
  ],
  scrollTime: "142 hours",
  scrollEquivalent: "Watching the entire LOTR trilogy 12 times",
  topKeywords: ["Aesthetic", "Render", "Cozy", "Cyberpunk", "POV"]
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
        if (prev === 30) setStatus("Identifying aesthetics...");
        if (prev === 60) setStatus("Judging your choices...");
        if (prev === 85) setStatus("Generating vibe check...");
        
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
            <div className="text-primary">&gt; analyzing colors</div>
            <div className="text-accent">&gt; detecting mood</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-blue-400">&gt; parsing hashtags</div>
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
  const totalSlides = 5;

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
               currentSlide === 1 ? "from-blue-600 to-green-900" :
               currentSlide === 2 ? "from-orange-600 to-red-900" :
               currentSlide === 3 ? "from-purple-600 to-pink-900" :
               "from-indigo-600 to-cyan-900"}
           `} />
        </div>

        {/* Content Container */}
        <div className="relative h-full text-white cursor-pointer">
          
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
                Your 2024<br/>Explore<br/>Wrapped
              </h1>
              <p className="text-xl font-medium opacity-80">
                We saw everything. Even that weird phase in February.
              </p>
            </div>
          </StorySlide>

          {/* SLIDE 2: TOP NICHES */}
          <StorySlide active={currentSlide === 1} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center space-y-8">
              <h2 className="text-4xl font-bold font-display leading-tight">
                You really<br/>couldn't stop<br/>looking at...
              </h2>
              
              <div className="space-y-4 mt-8">
                {WRAPPED_DATA.topNiches.map((niche, i) => (
                  <motion.div 
                    key={niche.name}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="text-4xl font-black opacity-30 w-8">0{i+1}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-lg font-bold mb-1">
                        <span>{niche.name}</span>
                        <span>{niche.percent}%</span>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${niche.percent}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                          className="h-full"
                          style={{ backgroundColor: niche.color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </StorySlide>

          {/* SLIDE 3: VIBE CHECK */}
          <StorySlide active={currentSlide === 2} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="uppercase tracking-widest text-sm font-bold mb-4 opacity-70">Your Core Aesthetic</div>
              <motion.h1 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl md:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-8"
              >
                {WRAPPED_DATA.vibe}
              </motion.h1>
              
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-lg leading-relaxed">
                "{WRAPPED_DATA.description}"
              </div>

              <div className="flex flex-wrap gap-2 justify-center mt-8">
                {WRAPPED_DATA.topKeywords.map((keyword, i) => (
                  <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">#{keyword}</span>
                ))}
              </div>
            </div>
          </StorySlide>

           {/* SLIDE 4: SCROLL TIME */}
           <StorySlide active={currentSlide === 3} onNext={nextSlide} onPrev={prevSlide}>
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <h2 className="text-2xl font-bold mb-12">Time spent "researching"</h2>
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="text-8xl font-black font-display mb-4 text-yellow-400"
              >
                {WRAPPED_DATA.scrollTime}
              </motion.div>
              
              <p className="text-xl opacity-80 max-w-xs mx-auto">
                That's equivalent to {WRAPPED_DATA.scrollEquivalent}.
              </p>
              
              <div className="mt-12 opacity-50 text-sm">
                (We won't tell your boss)
              </div>
            </div>
          </StorySlide>

          {/* SLIDE 5: SUMMARY CARD */}
          <StorySlide active={currentSlide === 4} onNext={() => {}} onPrev={prevSlide}>
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
                      <div className="font-bold text-lg">My Explore Wrapped</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-widest">2024 Edition</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Vibe</div>
                      <div className="text-2xl font-bold font-display">{WRAPPED_DATA.vibe}</div>
                    </div>
                    
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Top Niche</div>
                      <div className="text-2xl font-bold font-display text-primary">{WRAPPED_DATA.topNiches[0].name}</div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Time Doomed</div>
                      <div className="text-2xl font-bold font-display text-accent">{WRAPPED_DATA.scrollTime}</div>
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
              Reveal Your Wrapped <ArrowRight className="ml-2 w-6 h-6" />
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
