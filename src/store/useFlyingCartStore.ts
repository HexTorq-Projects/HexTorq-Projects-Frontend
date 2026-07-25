import { create } from "zustand";

export interface FlyingParticle {
  id: string;
  startX: number;
  startY: number;
  title?: string;
  tier?: string | null;
  color?: string;
}

interface FlyingCartState {
  particles: FlyingParticle[];
  triggerFly: (particle: Omit<FlyingParticle, "id">) => void;
  removeParticle: (id: string) => void;
  cartBumpSignal: number;
  bumpCart: () => void;
}

export const useFlyingCartStore = create<FlyingCartState>((set) => ({
  particles: [],
  triggerFly: (particle) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((s) => ({ particles: [...s.particles, { ...particle, id }] }));
  },
  removeParticle: (id) =>
    set((s) => ({ particles: s.particles.filter((p) => p.id !== id) })),
  cartBumpSignal: 0,
  bumpCart: () => set((s) => ({ cartBumpSignal: s.cartBumpSignal + 1 })),
}));
