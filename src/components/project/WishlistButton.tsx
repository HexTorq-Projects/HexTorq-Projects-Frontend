import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { useWishlist, useAddWishlist, useRemoveWishlist } from "@/api/wishlist";
import type { Project } from "@/api/types";
import { cn } from "@/lib/cn";

export function WishlistButton({ project, className }: { project: Project; className?: string }) {
  const { user } = useAuthStore();
  const { openAuth } = useUiStore();
  const { data: wishlist = [] } = useWishlist();

  const addMutation = useAddWishlist();
  const removeMutation = useRemoveWishlist();

  const isLiked = wishlist.some((p) => p.id === project.id);
  const loading = addMutation.isPending || removeMutation.isPending;

  // Brief celebratory ping ring the moment something gets liked.
  const [justLiked, setJustLiked] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuth("login");
      return;
    }
    if (loading) return;

    if (isLiked) {
      removeMutation.mutate(project.id);
    } else {
      addMutation.mutate(project);
      setJustLiked(true);
      window.setTimeout(() => setJustLiked(false), 600);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full bg-surface/80 border border-line backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 active:scale-95",
        isLiked ? "border-rose-500/30 text-rose-500" : "text-muted hover:text-fg hover:border-line",
        className
      )}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {justLiked && (
        <span className="absolute inset-0 rounded-full bg-rose-500/40 animate-ping" />
      )}
      <motion.span
        key={isLiked ? "liked" : "unliked"}
        initial={{ scale: 0.55, rotate: isLiked ? -25 : 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 480, damping: 14 }}
        className="inline-flex"
      >
        <Heart className={cn("h-4.5 w-4.5", isLiked && "fill-current")} />
      </motion.span>
    </button>
  );
}
