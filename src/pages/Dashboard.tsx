import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, ArrowRight, ExternalLink } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlist } from "@/api/wishlist";
import { useMyEnquiries } from "@/api/enquiries";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatINR } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { data: wishlist = [], isLoading: loadingWishlist } = useWishlist();
  const { data: enquiries = [], isLoading: loadingEnquiries } = useMyEnquiries();
  const [activeTab, setActiveTab] = useState<"wishlist" | "enquiries">("wishlist");

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/dashboard")}`);
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleResumeChat = (enq: any) => {
    const projectTitle = enq.project?.projectTitle || "Custom Project";
    const text = `Hi Hextorq Team,\n\nI want to follow up on my enquiry (ID: ${enq.id}) for the project: "${projectTitle}".\nMy message: "${enq.message}"`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#10b981"; // emerald
      case "processing":
      case "in_progress":
        return "#3b82f6"; // blue
      default:
        return "#f59e0b"; // amber (pending)
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto aurora grain">
      {/* Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg font-display">
            Student Dashboard
          </h1>
          <p className="text-muted mt-1.5 text-sm">
            Welcome back, <span className="text-cyan font-semibold">{user.name}</span>. Track your saved projects and custom requests here.
          </p>
        </div>
        <div className="flex gap-3 text-xs text-faint">
          <div className="rounded-xl border border-line bg-surface p-3 text-center min-w-28">
            <span className="block font-bold text-fg text-lg">{wishlist.length}</span>
            Saved Projects
          </div>
          <div className="rounded-xl border border-line bg-surface p-3 text-center min-w-28">
            <span className="block font-bold text-fg text-lg">{enquiries.length}</span>
            Enquiries Sent
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-line mb-8">
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 px-4 transition-colors -mb-[2px] ${
            activeTab === "wishlist"
              ? "border-violet text-violet"
              : "border-transparent text-muted hover:text-fg"
          }`}
        >
          <Heart className="h-4.5 w-4.5" />
          Wishlist ({wishlist.length})
        </button>
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 px-4 transition-colors -mb-[2px] ${
            activeTab === "enquiries"
              ? "border-violet text-violet"
              : "border-transparent text-muted hover:text-fg"
          }`}
        >
          <MessageSquare className="h-4.5 w-4.5" />
          Enquiries ({enquiries.length})
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "wishlist" ? (
          loadingWishlist ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-surface-hi/40 animate-pulse border border-line" />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-line rounded-2xl bg-surface/30">
              <Heart className="h-10 w-10 text-faint mx-auto mb-3" />
              <h3 className="font-display font-semibold text-lg text-fg">Your Wishlist is Empty</h3>
              <p className="text-muted text-sm mt-1 mb-6">
                Explore Hextorq's catalogue and tap the heart icon to save projects.
              </p>
              <Link to="/explore">
                <Button variant="primary" className="mx-auto flex items-center gap-2">
                  Browse Catalog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )
        ) : loadingEnquiries ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-24 rounded-xl bg-surface-hi/40 animate-pulse border border-line" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-line rounded-2xl bg-surface/30">
            <MessageSquare className="h-10 w-10 text-faint mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-fg">No Enquiries Yet</h3>
            <p className="text-muted text-sm mt-1 mb-6">
              When you enquire about a project, details will show up here.
            </p>
            <Link to="/explore">
              <Button variant="outline" className="mx-auto">
                Explore Projects
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="glass rounded-xl border border-line p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center flex-wrap gap-2.5">
                    <Badge color={getStatusColor(enq.status)}>
                      {enq.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-faint">{formatDate(enq.rowCreatedTime)}</span>
                  </div>
                  <h4 className="font-display font-semibold text-fg text-base md:text-lg">
                    {enq.project ? (
                      <Link to={`/project/${enq.project.id}`} className="hover:text-cyan transition-colors flex items-center gap-1">
                        {enq.project.projectTitle}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      "Custom IT Agency Request"
                    )}
                  </h4>
                  <p className="text-sm text-muted line-clamp-2 max-w-2xl bg-bg-soft/40 border border-line/20 p-2.5 rounded-lg italic">
                    "{enq.message}"
                  </p>
                  {enq.project && (
                    <div className="text-xs text-faint">
                      Pricing Quoted: <span className="text-fg font-semibold">{formatINR(enq.project.discountedPrice ?? enq.project.recommendedPrice)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResumeChat(enq)}
                    className="w-full md:w-auto"
                  >
                    Resume WhatsApp Chat
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
