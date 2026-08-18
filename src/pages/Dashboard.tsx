import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  ArrowRight,
  Edit3,
  Check,
  X,
  User as UserIcon,
  ExternalLink,
  Gift,
  KeyRound,
  Copy,
  MessageCircle,
  Eye,
  EyeOff,
  Wallet,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUpdateProfile, useChangePassword } from "@/api/auth";
import { useWishlist } from "@/api/wishlist";
import { useMyEnquiries } from "@/api/enquiries";
import { useReferralCode, useReferralBalance, useReferredUsers } from "@/api/referrals";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { formatDate, formatINR } from "@/lib/format";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/cn";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;
const strengthMeta: Record<StrengthLevel, { label: string; color: string; bg: string }> = {
  0: { label: "Very Weak", color: "text-rose-400", bg: "bg-rose-500/30" },
  1: { label: "Weak", color: "text-rose-400", bg: "bg-rose-500" },
  2: { label: "Fair", color: "text-amber-400", bg: "bg-amber-400" },
  3: { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-400" },
  4: { label: "Very Strong", color: "text-emerald-400", bg: "bg-emerald-400" },
};

function passwordStrength(pw: string): StrengthLevel {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const { data: wishlist = [], isLoading: loadingWishlist } = useWishlist();
  const { data: enquiries = [], isLoading: loadingEnquiries } = useMyEnquiries();
  const { data: referralCodeData } = useReferralCode();
  const { data: balanceData } = useReferralBalance();
  const { data: referredUsersData } = useReferredUsers();

  const [activeTab, setActiveTab] = useState<"wishlist" | "enquiries">("wishlist");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Referral Copy State
  const [copiedReferral, setCopiedReferral] = useState(false);

  const referralCode = referralCodeData?.code;
  const referralLink = referralCode ? `https://projects.hextorq.tech/explore?ref=${referralCode}` : "";

  const pwLevel = useMemo(() => passwordStrength(newPassword), [newPassword]);
  const pwMeta = strengthMeta[pwLevel];

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent("/dashboard")}`);
    } else {
      setEditName(user.name);
      setEditPhone(user.phone || "");
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      { name: editName, phone: editPhone || null },
      {
        onSuccess: () => {
          setIsEditingProfile(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        },
      }
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }

    changePassword.mutate(
      {
        currentPassword: currentPassword || undefined,
        newPassword,
      },
      {
        onSuccess: () => {
          setIsChangingPassword(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSuccess(true);
          setTimeout(() => setPasswordSuccess(false), 4000);
        },
        onError: (err: any) => {
          setPasswordError(err.message || "Failed to update password. Please verify current password.");
        },
      }
    );
  };

  const handleCopyReferral = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    });
  };

  const handleWhatsAppShare = () => {
    if (!referralLink) return;
    const msg = `Hey! Check out final-year engineering projects on HexTorq: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

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
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto aurora grain space-y-6 md:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-line pb-6 md:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg font-display">
            Student Dashboard
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
            <p className="text-muted text-xs sm:text-sm">
              Welcome back, <span className="text-cyan font-bold">{user.name}</span>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(true)}
              className="h-7 text-xs px-2.5 flex items-center gap-1.5"
            >
              <Edit3 className="h-3 w-3 text-cyan" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPasswordError("");
                setIsChangingPassword(true);
              }}
              className="h-7 text-xs px-2.5 flex items-center gap-1.5 hover:border-violet/40 text-fg"
            >
              <KeyRound className="h-3 w-3 text-violet-txt" />
              Change Password
            </Button>
            {saveSuccess && (
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="h-3 w-3" /> Profile Updated
              </span>
            )}
            {passwordSuccess && (
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Check className="h-3 w-3" /> Password Changed Successfully
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2.5 text-xs text-faint">
          <div className="rounded-xl border border-line bg-surface p-2.5 sm:p-3 text-center flex-1 sm:min-w-28">
            <span className="block font-bold text-fg text-base sm:text-lg">{wishlist.length}</span>
            Saved Projects
          </div>
          <div className="rounded-xl border border-line bg-surface p-2.5 sm:p-3 text-center flex-1 sm:min-w-28">
            <span className="block font-bold text-fg text-base sm:text-lg">{enquiries.length}</span>
            Enquiries Sent
          </div>
        </div>
      </div>

      {/* Dedicated Referral & Earn Hub Card in Profile */}
      <div className="glass rounded-2xl border border-emerald-500/30 bg-surface/40 p-5 sm:p-6 md:p-7 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6 relative z-10">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              <Gift className="h-3.5 w-3.5" />
              Refer & Earn Program
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-fg">
              Earn <span className="text-gradient">₹100 Cash</span> for every friend who buys a project
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Share your personal link with classmates. When they join and buy any project, ₹100 is credited to your wallet for instant UPI withdrawal.
            </p>
            {referralLink ? (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 bg-bg/80 border border-line rounded-xl px-2.5 py-1.5 max-w-full">
                  <span className="text-xs font-mono font-bold text-violet-txt select-all truncate max-w-[200px] sm:max-w-xs">
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopyReferral}
                    className="text-muted hover:text-emerald-400 transition-colors p-1"
                    title="Copy Referral Link"
                  >
                    {copiedReferral ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="text-[#25D366] hover:opacity-80 transition-opacity p-1"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-current" />
                  </button>
                </div>
                {referralCode && (
                  <span className="text-xs font-mono bg-violet/10 border border-violet/20 px-2.5 py-1 rounded-lg text-fg font-semibold">
                    Code: <strong>{referralCode}</strong>
                  </span>
                )}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0 border-t lg:border-t-0 border-line/60 pt-4 lg:pt-0">
            <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto text-center">
              <div className="rounded-xl border border-line bg-surface-hi/40 p-2.5 min-w-[70px] sm:min-w-20">
                <span className="block font-bold text-emerald-400 text-sm sm:text-base">
                  ₹{balanceData?.availableBalance ?? 0}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted">Withdrawable</span>
              </div>
              <div className="rounded-xl border border-line bg-surface-hi/40 p-2.5 min-w-[70px] sm:min-w-20">
                <span className="block font-bold text-fg text-sm sm:text-base">
                  ₹{balanceData?.totalEarned ?? 0}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted">Total Earned</span>
              </div>
              <div className="rounded-xl border border-line bg-surface-hi/40 p-2.5 min-w-[70px] sm:min-w-20">
                <span className="block font-bold text-cyan text-sm sm:text-base">
                  {referredUsersData?.users.length ?? 0}
                </span>
                <span className="text-[9px] sm:text-[10px] text-muted">Friends Joined</span>
              </div>
            </div>

            <Link to="/refer-and-earn" className="w-full sm:w-auto">
              <Button variant="primary" size="sm" className="w-full gap-2 shadow-md">
                <Wallet className="h-4 w-4" />
                Open Refer & Earn Hub
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <div className="glass rounded-2xl border border-line p-5 sm:p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-base sm:text-lg text-fg flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-cyan" />
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-muted hover:text-fg transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Field label="Full Name">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </Field>
              <Field label="Phone Number (WhatsApp Updates)">
                <Input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 9876543210"
                />
              </Field>
              <Field label="Email Address">
                <Input value={user.email} disabled className="opacity-60 cursor-not-allowed" />
              </Field>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditingProfile(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
          <div className="glass rounded-2xl border border-line p-5 sm:p-6 max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <h3 className="font-display font-bold text-base sm:text-lg text-fg flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-violet" />
                Change Password
              </h3>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="text-muted hover:text-fg transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {passwordError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-400">
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Field label="Current Password" hint="Leave blank if you registered with Google">
                <div className="relative">
                  <Input
                    type={showCurrentPw ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg p-1"
                  >
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field label="New Password">
                <div className="relative">
                  <Input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg p-1"
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-hi overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all duration-300", pwMeta.bg)}
                          style={{
                            width:
                              pwLevel <= 1
                                ? "25%"
                                : pwLevel === 2
                                ? "50%"
                                : pwLevel === 3
                                ? "75%"
                                : "100%",
                          }}
                        />
                      </div>
                      <span className={cn("text-[11px] font-semibold", pwMeta.color)}>
                        {pwMeta.label}
                      </span>
                    </div>
                  </div>
                )}
              </Field>

              <Field label="Confirm New Password">
                <Input
                  type={showNewPw ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  minLength={6}
                />
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsChangingPassword(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={changePassword.isPending}>
                  {changePassword.isPending ? "Updating Password..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-line mb-6 md:mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("wishlist")}
          className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 px-3 sm:px-4 transition-colors -mb-[2px] whitespace-nowrap cursor-pointer ${
            activeTab === "wishlist"
              ? "border-violet text-violet"
              : "border-transparent text-muted hover:text-fg"
          }`}
        >
          <Heart className="h-4 w-4" />
          Wishlist ({wishlist.length})
        </button>
        <button
          onClick={() => setActiveTab("enquiries")}
          className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-semibold border-b-2 px-3 sm:px-4 transition-colors -mb-[2px] whitespace-nowrap cursor-pointer ${
            activeTab === "enquiries"
              ? "border-violet text-violet"
              : "border-transparent text-muted hover:text-fg"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Enquiries ({enquiries.length})
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "wishlist" ? (
          loadingWishlist ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 rounded-2xl bg-surface-hi/40 animate-pulse border border-line" />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-12 md:py-16 border border-dashed border-line rounded-2xl bg-surface/30 px-4">
              <Heart className="h-10 w-10 text-faint mx-auto mb-3" />
              <h3 className="font-display font-semibold text-base sm:text-lg text-fg">Your Wishlist is Empty</h3>
              <p className="text-muted text-xs sm:text-sm mt-1 mb-6 max-w-sm mx-auto">
                Explore HexTorq's catalogue and tap the heart icon to save projects for your final year.
              </p>
              <Link to="/explore">
                <Button variant="primary" className="mx-auto flex items-center gap-2">
                  Browse Catalog
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )
        ) : loadingEnquiries ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-24 rounded-xl bg-surface-hi/40 animate-pulse border border-line" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12 md:py-16 border border-dashed border-line rounded-2xl bg-surface/30 px-4">
            <MessageSquare className="h-10 w-10 text-faint mx-auto mb-3" />
            <h3 className="font-display font-semibold text-base sm:text-lg text-fg">No Enquiries Yet</h3>
            <p className="text-muted text-xs sm:text-sm mt-1 mb-6 max-w-sm mx-auto">
              When you enquire about a project or custom requirements, details will show up here.
            </p>
            <Link to="/explore">
              <Button variant="outline" className="mx-auto">
                Explore Projects
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="glass rounded-xl border border-line p-4 sm:p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-violet/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <Badge color={getStatusColor(enq.status)}>
                      {enq.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-faint">{formatDate(enq.rowCreatedTime)}</span>
                  </div>
                  <h4 className="font-display font-semibold text-fg text-sm sm:text-base md:text-lg">
                    {enq.project ? (
                      <Link to={`/project/${enq.project.id}`} className="hover:text-cyan transition-colors inline-flex items-center gap-1">
                        {enq.project.projectTitle}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      "Custom Project Request"
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm text-muted line-clamp-2 max-w-2xl bg-bg-soft/40 border border-line/20 p-2.5 rounded-lg italic">
                    "{enq.message}"
                  </p>
                  {enq.project && (
                    <div className="text-xs text-faint">
                      Quoted Price: <span className="text-fg font-semibold">{formatINR(enq.project.discountedPrice ?? enq.project.recommendedPrice)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center md:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResumeChat(enq)}
                    className="w-full md:w-auto text-xs"
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
