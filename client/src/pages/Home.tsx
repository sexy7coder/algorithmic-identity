import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Share2, Instagram, X, Heart, AlertTriangle, Ghost, Image as ImageIcon, Trash2, ShieldAlert, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import bgTexture from "@assets/generated_images/instagram_stories_gradient_background.png";
import html2canvas from "html2canvas";
import ShareCard from "@/components/ShareCard";
import { upload } from '@vercel/blob/client';

type AppState = "IDLE" | "PREVIEWING" | "ANALYZING" | "READY" | "VIEWING" | "ERROR";

interface ThemeItem {
  title: string;
  surface?: string;
  deeper?: string;
  description?: string;
}

interface AnalysisResult {
  vibe: string;
  algorithmicPersona: string;
  topThemes: ThemeItem[];
  emotionalLandscape?: string;
  missing: string;
  blindSpots: string;
  mirrorMoment?: string;
}

interface PreviewFile {
  file: File;
  preview: string;
}

const LOADING_MESSAGES = [
  "Reading your attention patterns...",
  "Detecting visual themes...",
  "Finding your vibe...",
  "Analyzing content preferences...",
  "Decoding the algorithm...",
  "Mapping your digital persona...",
  "Uncovering hidden patterns...",
  "Building your profile..."
];

const FloatingOrb = ({ delay = 0, size = "lg" }: { delay?: number; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64"
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.1, 0.3, 0.1],
        scale: [0.8, 1.1, 0.8],
        x: [0, 30, 0],
        y: [0, -20, 0]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut"
      }}
      className={`absolute ${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-3xl pointer-events-none`}
    />
  );
};

const LandingView = ({ onFilesSelected }: { onFilesSelected: (files: PreviewFile[]) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const previews = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      onFilesSelected(previews);
    },
    accept: { 'image/*': [] },
    maxFiles: 10,
    multiple: true,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <FloatingOrb delay={0} size="lg" />
      <FloatingOrb delay={2} size="md" />
      <FloatingOrb delay={4} size="sm" />
      
      <div className="w-full max-w-md space-y-10 relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-5"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 3 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-[2.5rem] blur-xl opacity-60 animate-pulse" />
            <div className="relative w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] shadow-2xl shadow-pink-500/30">
              <div className="w-full h-full bg-black rounded-[2.3rem] flex items-center justify-center">
                <Instagram className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF]"
          >
            Algorithmic Identity
          </motion.h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-xl font-medium text-white/90">
            Discover what your attention patterns reveal about you
          </p>
          <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Upload screenshots of your explore page to reveal what the algorithm really thinks of you.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div 
            {...getRootProps()} 
            className={`
              w-full aspect-[4/3] rounded-3xl border-2 border-dashed
              flex flex-col items-center justify-center cursor-pointer transition-all duration-500
              backdrop-blur-sm relative overflow-hidden group
              ${isDragActive || isDragging 
                ? "border-[#DD2A7B] bg-[#DD2A7B]/10 scale-[1.02]" 
                : "border-zinc-700/50 bg-zinc-900/30 hover:border-zinc-600 hover:bg-zinc-900/50"
              }
            `}
          >
            <input {...getInputProps()} data-testid="input-file-upload" />
          
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <motion.div 
            animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex flex-col items-center space-y-5 relative z-10"
          >
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`
                w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isDragActive 
                  ? "bg-gradient-to-br from-[#f09433] to-[#dc2743] shadow-lg shadow-pink-500/30" 
                  : "bg-zinc-800/80 group-hover:bg-zinc-700/80"
                }
              `}
            >
              <Upload className={`w-9 h-9 transition-colors duration-300 ${isDragActive ? "text-white" : "text-zinc-300"}`} strokeWidth={1.5} />
            </motion.div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-white">
                {isDragActive ? "Drop your screenshots" : "Upload Screenshots"}
              </p>
              <p className="text-sm text-zinc-500">Drag & drop or tap to browse</p>
              <p className="text-xs text-zinc-600">JPG, PNG • Up to 10 images</p>
            </div>
          </motion.div>
        </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-xs text-zinc-500"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="font-medium">Private & Secure • Images aren't stored</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const PreviewView = ({ 
  files, 
  onRemove, 
  onAddMore, 
  onAnalyze, 
  onCancel 
}: { 
  files: PreviewFile[]; 
  onRemove: (index: number) => void;
  onAddMore: (newFiles: PreviewFile[]) => void;
  onAnalyze: () => void;
  onCancel: () => void;
}) => {
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      const previews = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      onAddMore(previews);
    },
    accept: { 'image/*': [] },
    maxFiles: 10 - files.length,
    multiple: true,
    noClick: true,
    noKeyboard: true
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col min-h-screen p-6 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      
      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onCancel}
            className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
            data-testid="button-cancel-preview"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-white">Review Screenshots</h2>
          <div className="w-10" />
        </div>

        <div {...getRootProps()} className="flex-1">
          <input {...getInputProps()} />
          
          <div className="grid grid-cols-3 gap-3">
            {files.map((file, index) => (
              <motion.div
                key={file.preview}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="relative aspect-[9/16] rounded-xl overflow-hidden group"
              >
                <img 
                  src={file.preview} 
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => onRemove(index)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                  data-testid={`button-remove-image-${index}`}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </motion.button>
              </motion.div>
            ))}
            
            {files.length < 10 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={open}
                className="aspect-[9/16] rounded-xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/30 hover:bg-zinc-900/50 flex flex-col items-center justify-center gap-2 transition-all"
                data-testid="button-add-more-images"
              >
                <ImageIcon className="w-6 h-6 text-zinc-500" />
                <span className="text-xs text-zinc-500">Add more</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-zinc-500">
            {files.length} screenshot{files.length !== 1 ? 's' : ''} selected
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onAnalyze}
              className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 font-semibold shadow-lg shadow-pink-500/20 transition-all"
              data-testid="button-analyze"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze My Feed
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const AnalyzingView = ({ imageCount }: { imageCount: number }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const estimatedTime = Math.max(30, imageCount * 8);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + (100 / estimatedTime), 95));
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [estimatedTime]);

  const remainingTime = Math.max(0, estimatedTime - elapsed);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
      <FloatingOrb delay={0} size="lg" />
      <FloatingOrb delay={1} size="md" />
      
      <div className="w-full max-w-xs space-y-10 text-center relative z-10">
        <div className="relative w-32 h-32 mx-auto">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f09433" />
                  <stop offset="50%" stopColor="#dc2743" />
                  <stop offset="100%" stopColor="#bc1888" />
                </linearGradient>
              </defs>
              <circle
                className="text-zinc-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
              />
              <circle
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="transparent"
                r="44"
                cx="50"
                cy="50"
                strokeDasharray="276"
                strokeDashoffset={276 - (276 * progress) / 100}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Instagram className="w-10 h-10 text-white/80" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.h2
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-semibold text-white"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.h2>
          </AnimatePresence>
          
          <div className="space-y-2">
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-zinc-500">
              About {remainingTime > 60 ? `${Math.ceil(remainingTime / 60)} min` : `${remainingTime}s`} remaining
            </p>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-xs text-zinc-600"
        >
          Analyzing {imageCount} screenshot{imageCount !== 1 ? 's' : ''} with AI
        </motion.p>
      </div>
    </motion.div>
  );
};

const StoryProgressBar = ({ count, activeIndex, duration }: { count: number; activeIndex: number; duration: number }) => (
  <div className="absolute top-4 left-3 right-3 z-50 flex gap-1 h-[3px]">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex-1 bg-white/20 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-white"
          initial={{ width: i < activeIndex ? "100%" : "0%" }}
          animate={{ width: i < activeIndex ? "100%" : i === activeIndex ? "100%" : "0%" }}
          transition={{ duration: i === activeIndex ? duration : 0.3, ease: "linear" }}
        />
      </div>
    ))}
  </div>
);

const StoryHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute top-10 left-4 right-4 z-40 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
          <Instagram className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white drop-shadow-lg">Algorithmic Identity</span>
        <span className="text-xs text-white/70 drop-shadow-lg">what Instagram thinks of you</span>
      </div>
    </div>
    <button 
      onClick={onClose}
      className="p-2 text-white/80 hover:text-white transition-colors"
      data-testid="button-close-story"
    >
      <X className="w-6 h-6 drop-shadow-lg" />
    </button>
  </div>
);

const slideTransition = {
  initial: { opacity: 0, x: 50, scale: 0.95 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -50, scale: 0.95 },
  transition: { duration: 0.4, ease: "easeOut" as const }
};

const StoryView = ({ data, onRestart }: { data: AnalysisResult; onRestart: () => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 8;
  const slideDuration = 10;
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) setCurrentSlide(c => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  const handleSaveImage = async () => {
    if (!shareCardRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0a0a',
        logging: false,
        width: 540,
        height: 960,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);
        a.href = url;
        a.download = 'algorithmic-identity.png';
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      }, 'image/png');
    } catch (err) {
      console.error('Image generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInviteFriend = async () => {
    const siteUrl = 'https://algorithmic-identity.vercel.app';
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Algorithmic Identity',
          text: 'Discover what Instagram\'s algorithm thinks you are.',
          url: siteUrl,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(siteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable — silent fail
      }
    }
  };

  const getThemeContent = (theme: ThemeItem) => {
    if (theme.surface && theme.deeper) {
      return { surface: theme.surface, deeper: theme.deeper };
    }
    return { surface: theme.description || '', deeper: '' };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col md:items-center md:justify-center font-sans">
      <ShareCard ref={shareCardRef} data={data} />
      <div className="relative w-full h-full md:max-w-[420px] md:h-[85vh] md:max-h-[820px] md:rounded-[2.5rem] overflow-hidden bg-black md:border border-zinc-800/50 shadow-2xl md:shadow-pink-500/10">
        
        <StoryProgressBar count={totalSlides} activeIndex={currentSlide} duration={slideDuration} />
        <StoryHeader onClose={onRestart} />

        <div className="absolute inset-0 z-30 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={prevSlide} data-testid="button-prev-slide" />
          <div className="w-2/3 h-full cursor-pointer" onClick={nextSlide} data-testid="button-next-slide" />
        </div>

        <div className="absolute inset-0 z-0">
          <img src={bgTexture} alt="" className="w-full h-full object-cover opacity-50 blur-2xl scale-125" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        <AnimatePresence mode="wait">
          {currentSlide === 0 && (
            <motion.div
              key="slide-0"
              {...slideTransition}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="mb-8 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative w-28 h-28 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
                  <Instagram className="w-14 h-14 text-white" />
                </div>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-white mb-4 leading-tight"
              >
                Your Algorithmic<br/>Identity
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg text-white/70"
              >
                A deep dive into your digital self
              </motion.p>
            </motion.div>
          )}

          {currentSlide === 1 && (
            <motion.div
              key="slide-1"
              {...slideTransition}
              className="absolute inset-0 flex flex-col justify-start pt-20 px-6 pb-6 z-10 overflow-y-auto"
            >
              <div className="bg-black/50 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 text-center space-y-5 shadow-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs font-bold uppercase tracking-[0.2em] text-pink-400"
                >
                  The Algorithm Sees You As
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]"
                >
                  {data.vibe || "Your Vibe"}
                </motion.h2>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto" />
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm leading-relaxed text-white/80 font-light"
                >
                  "{data.algorithmicPersona || "Loading..."}"
                </motion.p>
              </div>
            </motion.div>
          )}

          {currentSlide === 2 && (
            <motion.div
              key="slide-2"
              {...slideTransition}
              className="absolute inset-0 flex flex-col justify-start pt-20 px-5 pb-5 z-10 overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-white mb-4">Visible Themes</h2>
              <div className="space-y-3">
                {(data.topThemes || []).slice(0, 3).map((theme, i) => {
                  const content = getThemeContent(theme);
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg"
                    >
                      <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] to-[#dc2743] mb-2">{theme.title}</h3>
                      {content.surface && (
                        <p className="text-xs text-white/60 mb-1"><span className="text-white/40">Surface:</span> {content.surface}</p>
                      )}
                      {content.deeper && (
                        <p className="text-xs text-white/60"><span className="text-emerald-400/80">Deeper:</span> {content.deeper}</p>
                      )}
                      {!content.deeper && content.surface && (
                        <p className="text-sm text-white/70 leading-relaxed">{content.surface}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {currentSlide === 3 && (
            <motion.div
              key="slide-3"
              {...slideTransition}
              className="absolute inset-0 flex flex-col justify-start pt-20 px-5 pb-5 z-10 overflow-y-auto"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-rose-500/10 backdrop-blur-xl p-6 rounded-2xl border border-rose-500/20 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-rose-400">Your Emotional Landscape</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{data.emotionalLandscape || "What your feed reveals about your emotional needs..."}</p>
              </motion.div>
            </motion.div>
          )}

          {currentSlide === 4 && (
            <motion.div
              key="slide-4"
              {...slideTransition}
              className="absolute inset-0 flex flex-col justify-start pt-20 px-5 pb-5 z-10 overflow-y-auto"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-500/10 backdrop-blur-xl p-6 rounded-2xl border border-slate-500/20 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center">
                    <Ghost className="w-4 h-4 text-slate-400" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wide text-slate-400">What's Missing</span>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{data.missing || "What your feed reveals by its absence..."}</p>
              </motion.div>
            </motion.div>
          )}

          {currentSlide === 5 && (
            <motion.div
              key="slide-5"
              {...slideTransition}
              className="absolute inset-0 flex flex-col items-center justify-start pt-20 px-5 pb-5 z-10 overflow-y-auto"
            >
              <motion.div
                initial={{ rotate: -2, scale: 0.9 }}
                animate={{ rotate: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-full bg-gradient-to-br from-white to-zinc-100 text-zinc-900 p-6 rounded-3xl shadow-2xl shadow-black/50"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-200">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="font-bold text-lg text-zinc-800">Hard Truths</span>
                </div>
                <p className="text-base leading-relaxed text-zinc-700">
                  {data.blindSpots || "Loading..."}
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentSlide === 6 && (
            <motion.div
              key="slide-6"
              {...slideTransition}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 text-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 150 }}
                className="space-y-8"
              >
                <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
                  The Mirror Moment
                </div>
                <motion.blockquote 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-white leading-relaxed italic"
                >
                  "{data.mirrorMoment || "The algorithm knows you better than you know yourself."}"
                </motion.blockquote>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-24 h-1 bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] mx-auto rounded-full"
                />
              </motion.div>
            </motion.div>
          )}

          {currentSlide === 7 && (
            <motion.div
              key="slide-7"
              {...slideTransition}
              className="absolute inset-0 flex flex-col items-center justify-center p-5 z-10"
            >
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full max-h-[55vh] bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/10 p-5 flex flex-col relative overflow-hidden shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500/20 blur-[50px] rounded-full pointer-events-none" />

                <div className="relative z-10 flex-1 overflow-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[2px]">
                      <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">My Algorithmic Self</div>
                      <div className="text-white/50 text-[10px] uppercase tracking-wider">Algorithmic Identity</div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f09433] to-[#dc2743] mb-2">
                    {data.vibe || "Your Vibe"}
                  </h2>
                  
                  {data.mirrorMoment && (
                    <p className="text-white/60 text-xs italic mb-4">"{data.mirrorMoment}"</p>
                  )}

                  <div className="space-y-2">
                    {(data.topThemes || []).slice(0, 2).map((theme, i) => (
                      <div key={i} className="bg-white/5 p-3 rounded-xl border border-white/5">
                        <div className="text-white text-sm font-medium">{theme.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10 pt-3 mt-3 border-t border-white/10">
                  <div className="text-[10px] font-mono text-white/30 text-center">algorithmic-identity.vercel.app</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 w-full max-w-xs space-y-3"
              >
                <Button
                  className="w-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 rounded-2xl font-semibold py-4 shadow-lg shadow-pink-500/20 transition-all disabled:opacity-60"
                  onClick={handleSaveImage}
                  disabled={isGenerating}
                  data-testid="button-save-image"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Save as Image'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white/70 hover:text-white hover:border-white/40 bg-transparent rounded-2xl font-semibold py-4 transition-all"
                  onClick={handleInviteFriend}
                  data-testid="button-invite-friend"
                >
                  {copied ? (
                    '✓ Link copied!'
                  ) : (
                    <><Share2 className="w-4 h-4 mr-2" />Invite a friend</>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("IDLE");
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      previewFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, []);

  const handleFilesSelected = useCallback((files: PreviewFile[]) => {
    setPreviewFiles(files);
    setAppState("PREVIEWING");
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setPreviewFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      if (newFiles.length === 0) {
        setAppState("IDLE");
      }
      return newFiles;
    });
  }, []);

  const handleAddMore = useCallback((newFiles: PreviewFile[]) => {
    setPreviewFiles(prev => [...prev, ...newFiles].slice(0, 10));
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (previewFiles.length === 0) return;

    setAppState("ANALYZING");

    try {
      // Upload each image directly to Vercel Blob (bypasses the 4.5 MB function body limit)
      const uploads = await Promise.all(
        previewFiles.map(({ file }) =>
          upload(file.name || 'screenshot.jpg', file, {
            access: 'public',
            handleUploadUrl: '/api/blob-upload',
          })
        )
      );
      const urls = uploads.map((u) => u.url);

      // Send the blob URLs — tiny JSON payload, no size limit issues
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Analysis failed.');
        } else {
          throw new Error(`Request failed (${response.status}).`);
        }
      }

      const data = await response.json();
      setAnalysisData(data);
      setAppState("READY");
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message);
      setAppState("ERROR");
    }
  }, [previewFiles]);

  const handleRestart = useCallback(() => {
    previewFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setPreviewFiles([]);
    setAppState("IDLE");
    setAnalysisData(null);
    setError(null);
  }, [previewFiles]);

  const handleCancelPreview = useCallback(() => {
    previewFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setPreviewFiles([]);
    setAppState("IDLE");
  }, [previewFiles]);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {appState === "IDLE" && (
          <LandingView key="idle" onFilesSelected={handleFilesSelected} />
        )}

        {appState === "PREVIEWING" && (
          <PreviewView
            key="previewing"
            files={previewFiles}
            onRemove={handleRemoveFile}
            onAddMore={handleAddMore}
            onAnalyze={handleAnalyze}
            onCancel={handleCancelPreview}
          />
        )}
        
        {appState === "ANALYZING" && (
          <AnalyzingView key="analyzing" imageCount={previewFiles.length} />
        )}

        {appState === "ERROR" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
            
            <div className="w-full max-w-sm space-y-6 relative z-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto"
              >
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </motion.div>
              <h1 className="text-2xl font-bold text-white">Analysis Failed</h1>
              <p className="text-zinc-400 leading-relaxed">{error || "Something went wrong. Please try again."}</p>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  className="w-full py-5 text-lg rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 font-semibold shadow-lg shadow-pink-500/20"
                  onClick={handleRestart}
                  data-testid="button-try-again"
                >
                  Try Again
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {appState === "READY" && (
          <motion.div
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black" />
            <FloatingOrb delay={0} size="lg" />
            
            <div className="w-full max-w-sm text-center space-y-8 relative z-10">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative w-36 h-36 mx-auto"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full blur-xl opacity-60" 
                />
                <div className="relative w-full h-full bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Sparkles className="w-16 h-16 text-white" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h1 className="text-3xl font-bold text-white">Your Wrapped is Ready</h1>
                <p className="text-zinc-400">Tap to discover your algorithmic identity</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 font-semibold shadow-lg shadow-pink-500/30 transition-all"
                  onClick={() => setAppState("VIEWING")}
                  data-testid="button-open-wrapped"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Open Wrapped
                </Button>
              </motion.div>
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
