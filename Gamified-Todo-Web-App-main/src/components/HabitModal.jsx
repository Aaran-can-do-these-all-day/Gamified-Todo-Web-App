import { useState, useEffect, useRef } from "react";
import {
  X,
  Maximize2,
  Share2,
  MessageSquare,
  Star,
  MoreHorizontal,
  Calendar,
  AlertTriangle,
  Gift,
  Sigma,
  ChevronDown,
  Target,
} from "lucide-react";
import useScrollIndicator from "../hooks/useScrollIndicator";
import ScrollIndicator from "./ScrollIndicator";

function HabitModal({ isOpen, onClose, initialData }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("🏋️");
  // Using a Great Wave off Kanagawa image URL
  const [coverImage, setCoverImage] = useState(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg"
  );

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "Workout");
      setIcon(initialData?.icon || "🏋️");
    }
  }, [isOpen, initialData]);

  const scrollRef = useRef(null);
  const { canScroll, atBottom } = useScrollIndicator(scrollRef);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-5xl h-[90vh] bg-[#191919] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#d3d3d3] border border-white/10 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 bg-[#191919] z-10 shrink-0">
          <div className="flex items-center gap-2">
            <Maximize2
              size={14}
              className="text-white/40 hover:text-white/80 cursor-pointer transition-colors"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 hover:text-white/80 cursor-pointer transition-colors">
              Share
            </span>
            <MessageSquare
              size={16}
              className="text-white/40 hover:text-white/80 cursor-pointer transition-colors"
            />
            <Star
              size={16}
              className="text-white/40 hover:text-white/80 cursor-pointer transition-colors"
            />
            <MoreHorizontal
              size={16}
              className="text-white/40 hover:text-white/80 cursor-pointer transition-colors"
            />
            <X
              size={20}
              className="text-white/40 hover:text-white/80 cursor-pointer ml-2 transition-colors"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-1 overflow-y-auto scrollbar-hide" ref={scrollRef}>
          {/* Cover Image */}
          <div className="h-[30vh] w-full relative group">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
              <button className="bg-black/50 hover:bg-black/70 text-xs text-white px-3 py-1.5 rounded backdrop-blur-sm transition-colors">
                Change cover
              </button>
              <button className="bg-black/50 hover:bg-black/70 text-xs text-white px-3 py-1.5 rounded backdrop-blur-sm transition-colors">
                Reposition
              </button>
            </div>
          </div>

          <div className="px-16 pb-16 max-w-5xl mx-auto">
            {/* Icon */}
            <div className="-mt-12 mb-8 relative group w-24 h-24">
              <div className="text-7xl drop-shadow-2xl cursor-pointer hover:opacity-90 transition-opacity transform hover:scale-105 duration-200">
                {icon}
              </div>
            </div>

            {/* Title */}
            <div className="mb-8 group">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled"
                className="w-full bg-transparent text-5xl font-bold text-white placeholder:text-white/20 focus:outline-none"
              />
            </div>

            {/* Properties */}
            <div className="space-y-1 mb-12">
              {/* Today's Date */}
              <div className="flex items-center min-h-[34px] group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
                <div className="w-[180px] flex items-center gap-2 text-sm text-white/40">
                  <Sigma size={16} />
                  <span>Today's Date</span>
                </div>
                <div className="flex-1 text-sm text-white font-medium">
                  May 7, 2025
                </div>
              </div>

              {/* Date End */}
              <div className="flex items-center min-h-[34px] group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
                <div className="w-[180px] flex items-center gap-2 text-sm text-white/40">
                  <Calendar size={16} />
                  <span>Date End</span>
                </div>
                <div className="flex-1 text-sm text-white/20">Empty</div>
              </div>

              {/* Lost */}
              <div className="flex items-center min-h-[34px] group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
                <div className="w-[180px] flex items-center gap-2 text-sm text-white/40">
                  <Target size={16} />
                  <span>Lost</span>
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#2c1c1c] text-red-400 text-sm border border-red-900/30">
                    Lost <X size={12} />
                  </span>
                </div>
              </div>

              {/* Reward */}
              <div className="flex items-center min-h-[34px] group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
                <div className="w-[180px] flex items-center gap-2 text-sm text-white/40">
                  <Gift size={16} />
                  <span>Reward</span>
                </div>
                <div className="flex-1 text-sm text-white/20">Empty</div>
              </div>

              {/* Punishment */}
              <div className="flex items-center min-h-[34px] group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
                <div className="w-[180px] flex items-center gap-2 text-sm text-white/40">
                  <AlertTriangle size={16} />
                  <span>Punishment</span>
                </div>
                <div className="flex-1 text-sm text-white/20">Empty</div>
              </div>

              {/* Formula */}
              <div className="flex items-center min-h-[34px] group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
                <div className="w-[180px] flex items-center gap-2 text-sm text-white/40">
                  <Sigma size={16} />
                  <span>Formula</span>
                </div>
                <div className="flex-1 text-sm font-medium text-white flex items-center gap-2">
                  Days Remaining <span className="text-lg">🔥</span>
                </div>
              </div>

              {/* More properties toggle */}
              <div className="flex items-center min-h-[34px] group cursor-pointer hover:bg-white/5 -mx-2 px-2 rounded mt-2 transition-colors">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <ChevronDown size={16} />
                  <span>14 more properties</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10 my-8" />

            {/* Comments */}
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                  A
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none py-2"
                  />
                  <div className="text-[10px] text-white/30 mt-1">
                    Press Enter to post
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ScrollIndicator visible={canScroll && !atBottom} />
        </div>
      </div>
    </div>
  );
}

export default HabitModal;
