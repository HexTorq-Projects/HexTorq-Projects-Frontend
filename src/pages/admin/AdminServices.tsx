import { useState, useEffect } from "react";
import { Layers, Sparkles, Check, X, Edit3, Save, Eye, ShieldCheck } from "lucide-react";
import { useAdminServiceMatrix, useUpdateServiceMatrix } from "@/api/admin";
import type { ServiceMatrix, ServiceMatrixTier } from "@/api/types";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";

const TIERS = ["BASIC", "STANDARD", "PREMIUM", "ELITE"] as const;

export default function AdminServices() {
  const { data, isLoading } = useAdminServiceMatrix();
  const updateMutation = useUpdateServiceMatrix();

  const [matrix, setMatrix] = useState<ServiceMatrix | null>(null);
  const [selectedPreviewTier, setSelectedPreviewTier] = useState<keyof ServiceMatrix["tiers"]>("PREMIUM");

  useEffect(() => {
    if (data) {
      setMatrix(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  const handleToggleService = (tierKey: keyof ServiceMatrix["tiers"], serviceKey: string) => {
    if (!matrix) return;
    const current = matrix.tiers[tierKey].services[serviceKey].included;
    const next = !current;
    setMatrix({
      ...matrix,
      tiers: {
        ...matrix.tiers,
        [tierKey]: {
          ...matrix.tiers[tierKey],
          services: {
            ...matrix.tiers[tierKey].services,
            [serviceKey]: {
              ...matrix.tiers[tierKey].services[serviceKey],
              included: next,
            },
          },
        },
      },
    });
  };

  const handlePriceChange = (tierKey: keyof ServiceMatrix["tiers"], price: number) => {
    if (!matrix) return;
    setMatrix({
      ...matrix,
      tiers: {
        ...matrix.tiers,
        [tierKey]: {
          ...matrix.tiers[tierKey],
          defaultPrice: price,
        },
      },
    });
  };

  const handleSave = () => {
    if (!matrix) return;
    updateMutation.mutate(matrix);
  };

  if (isLoading || !matrix) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Spinner className="h-8 w-8 text-cyan" />
        <span className="text-xs font-medium text-muted">Loading Service Matrix...</span>
      </div>
    );
  }

  const previewTier = matrix.tiers[selectedPreviewTier];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-fg flex items-center gap-2.5">
            <Layers className="h-6 w-6 text-violet" />
            Service Catalog & Tier Matrix
          </h1>
          <p className="text-xs text-muted">
            Configure reusable service items, tier bundles (`BASIC`, `STANDARD`, `PREMIUM`, `ELITE`), and live student view cards.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="gap-1.5 shadow-md shadow-violet-500/20"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? "Saving changes..." : "Save Service Matrix"}
        </Button>
      </div>

      {/* Interactive Service Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {TIERS.map((tierKey) => {
          const tier = matrix.tiers[tierKey];
          return (
            <div
              key={tierKey}
              className="glass rounded-3xl border border-line p-5 space-y-4 flex flex-col justify-between bg-surface/60 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-bold text-fg">{tier.name}</span>
                  <span className="font-mono font-bold text-xs text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded-md">
                    {tierKey}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed min-h-[32px]">{tier.tagline}</p>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">
                    Default List Price (INR)
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-bold text-xs">₹</span>
                    <Input
                      type="number"
                      className="pl-7 font-mono font-bold text-emerald-400 text-sm bg-surface-hi"
                      value={tier.defaultPrice}
                      onChange={(e) => handlePriceChange(tierKey, Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-3 space-y-2 border-t border-line/40">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Included Services
                  </span>
                  {Object.entries(tier.services).map(([sKey, sVal]) => (
                    <button
                      key={sKey}
                      type="button"
                      onClick={() => handleToggleService(tierKey, sKey)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                        sVal.included
                          ? "border-emerald-500/30 bg-emerald-500/10 text-fg font-semibold"
                          : "border-line bg-surface/30 text-muted hover:border-line/80"
                      }`}
                    >
                      <span className="text-[11px] text-left pr-2">{sVal.label}</span>
                      {sVal.included ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-muted shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedPreviewTier(tierKey)}
                className="w-full py-2 text-[11px] font-bold text-cyan hover:bg-cyan/10 rounded-xl border border-cyan/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5" /> Preview Card
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Student Card Preview */}
      <div className="glass rounded-3xl border border-line p-6 bg-surface/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-line/60">
          <div className="space-y-0.5">
            <h3 className="font-display font-bold text-base text-fg flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan" />
              Live Student Presentation Preview ({selectedPreviewTier})
            </h3>
            <p className="text-xs text-muted">
              How this tier package card renders to students on the project detail page and checkout.
            </p>
          </div>
        </div>

        <div className="max-w-md mx-auto rounded-3xl border border-violet/40 bg-[#131722]/95 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-violet uppercase tracking-wider block">Recommended Tier</span>
              <h4 className="font-display text-xl font-black text-fg">{previewTier.name}</h4>
            </div>
            <span className="font-mono text-2xl font-black text-emerald-400">
              ₹{previewTier.defaultPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="text-xs text-muted leading-relaxed">{previewTier.tagline}</p>

          <div className="space-y-2 pt-2 border-t border-line/40">
            {Object.entries(previewTier.services)
              .filter(([_, s]) => s.included)
              .map(([sKey, sVal]) => (
                <div key={sKey} className="flex items-center gap-2 text-xs text-fg">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{sVal.label}</span>
                </div>
              ))}
          </div>

          <Button className="w-full h-11 text-xs shadow-lg shadow-violet-500/25" variant="primary">
            Select {previewTier.name} & Checkout with Pay-Panda
          </Button>
        </div>
      </div>
    </div>
  );
}
