"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import CopyButton from "~/components/copy-button";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";

import {
  BookOpenText,
  Plus,
  Key,
  Shield,
  AlertCircle,
  Sparkles,
  Camera,
  X,
  Upload,
  Image as ImageIcon,
  TrendingUp,
  Crown,
} from "lucide-react";

type KeyItem = {
  id: string;
  name: string;
  period: string;
  origin: string;
  value: number;
  imageUrl?: string | null;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

type KeysApiResponse = {
  items?: KeyItem[];
  key?: string;
  id?: string;
  error?: string;
  current?: number;
  limit?: number;
  tier?: string;
};

type SubscriptionData = {
  tier: string;
  tierName: string;
  keysCreatedToday: number;
  limit: number;
  remaining: number;
};

export default function KeysPage() {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [origin, setOrigin] = useState("");
  const [value, setValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitModalData, setLimitModalData] = useState<{
    error: string;
    current: number;
    limit: number;
    tier: string;
  } | null>(null);

  // Load subscription info
  const loadSubscription = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription", { cache: "no-store" });
      if (res.ok) {
        const data: SubscriptionData = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to load subscription", error);
    }
  }, []);

  // Load artifacts
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/keys", { cache: "no-store" });
      const data: KeysApiResponse = await res.json();
      setItems(data.items ?? []);
    } catch (error) {
      console.error("Failed to load keys", error);
    }
  }, []);

  // Create artifact + key with limit check
  const createKey = useCallback(async () => {
    setLoading(true);
    try {
      if (!name || !period || !origin || !value) {
        alert("Please fill artifact name, period, origin, and value");
        setLoading(false);
        return;
      }

      const body = {
        name,
        period,
        origin,
        value: Number(value),
        imageUrl: imageUrl || undefined,
      };

      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: KeysApiResponse = await res.json();

      if (res.status === 429) {
        // Daily limit reached - show enhanced error message
        const errorTitle = "🚫 Daily Limit Reached";
        const errorDetails = [
          `📊 Usage: ${data.current}/${data.limit} keys today`,
          `🎯 Current Plan: ${data.tier?.toUpperCase() || 'FREE'}`,
          `⏰ Resets: Midnight UTC`,
          ``,
          `💡 Upgrade to create more keys instantly!`
        ].join('\n');
        
        alert(`${errorTitle}\n\n${data.error}\n\n${errorDetails}`);
        setLoading(false);
        return;
      }

      if (res.ok && data.key && data.id) {
        setJustCreated({ key: data.key, id: data.id });
        setName("");
        setPeriod("");
        setOrigin("");
        setValue("");
        setImageUrl("");
        await load();
        await loadSubscription(); // Refresh subscription info
      } else {
        alert(data.error ?? "Failed to create artifact key");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create key (see console)");
    } finally {
      setLoading(false);
    }
  }, [name, period, origin, value, imageUrl, load, loadSubscription]);

  // Revoke key
  const revokeKey = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
        const data: KeysApiResponse = await res.json();
        if (!res.ok) alert(data.error ?? "Failed to revoke");
        await load();
      } catch (error) {
        console.error(error);
      }
    },
    [load]
  );

  // Initial load
  useEffect(() => {
    void load();
    void loadSubscription();
  }, [load, loadSubscription]);

  const isLimitReached = subscription ? subscription.remaining <= 0 : false;
  const isNearLimit = subscription ? subscription.remaining > 0 && subscription.remaining <= 3 : false;

  return (
    <main 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #0d1117 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      <SignedOut>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-2xl border border-gray-700">
              <Key className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Authentication Required</h2>
            <p className="text-gray-400 text-lg">
              Please sign in to manage your museum artifacts API keys
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative z-10 mx-auto max-w-7xl space-y-8 p-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Camera className="text-white" size={24} />
              <span className="text-white font-medium">Museum Collection</span>
            </div>
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              COLLECTIONS (Artifacts)
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create artifact entries with API keys using our modern management interface
            </p>
            <div className="flex gap-4 justify-center mt-6">
              <Link href={"/docs"}>
                <Button variant="outline" className="flex items-center gap-2 bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300">
                  <BookOpenText className="w-4 h-4" />
                  View Documentation
                </Button>
              </Link>
              <Link href={"/pricing"}>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300">
                  <Crown className="w-4 h-4" />
                  View Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* Subscription Status Banner */}
          {subscription && (
            <div className={`bg-gradient-to-r ${
              isLimitReached 
                ? 'from-red-900/30 to-red-800/30 border-red-700' 
                : isNearLimit 
                ? 'from-yellow-900/30 to-yellow-800/30 border-yellow-700'
                : 'from-blue-900/30 to-purple-900/30 border-blue-700'
            } backdrop-blur-md rounded-2xl p-6 border shadow-lg`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    isLimitReached ? 'bg-red-900/50' : isNearLimit ? 'bg-yellow-900/50' : 'bg-blue-900/50'
                  }`}>
                    <Crown className={`w-6 h-6 ${
                      isLimitReached ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-white">
                        {subscription.tierName} Plan
                      </h3>
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        isLimitReached ? 'bg-red-900/50 text-red-300 border border-red-700' : 
                        isNearLimit ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' : 
                        'bg-green-900/50 text-green-300 border border-green-700'
                      }`}>
                        {isLimitReached ? '⚠️ Limit Reached' : `✓ ${subscription.remaining} remaining`}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">
                      {subscription.keysCreatedToday} of {subscription.limit} keys used today
                    </p>
                    <div className="mt-2 w-64 h-2 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isLimitReached ? 'bg-red-500' : isNearLimit ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(subscription.keysCreatedToday / subscription.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                {(isLimitReached || isNearLimit) && (
                  <Link href="/pricing">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Upgrade Plan
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Create Artifact + Key */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700/50 rounded-xl">
                  <Sparkles className="text-gray-300" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Register Artifact</h2>
                  <p className="text-gray-400">Each artifact gets its own API key (visible once)</p>
                </div>
              </div>
              <button
                onClick={createKey}
                disabled={loading || uploading || isLimitReached}
                className={`flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold transform transition-all duration-300 shadow-lg ${
                  isLimitReached 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:from-gray-600 hover:to-gray-800 hover:scale-105'
                }`}
                title={isLimitReached ? 'Daily limit reached. Upgrade to create more keys.' : ''}
              >
                {loading ? "Creating..." : <><Plus className="h-4 w-4" /> Create</>}
              </button>
            </div>

            {/* Limit Warning Messages */}
            {isLimitReached && (
              <div className="mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-900/40 to-red-800/30 border-2 border-red-600/50 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30 flex-shrink-0">
                      <AlertCircle className="w-7 h-7 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-red-200">⛔ Daily Limit Reached</h3>
                        <span className="px-3 py-1 bg-red-500/30 border border-red-500/50 rounded-full text-xs font-bold text-red-200">
                          {subscription?.keysCreatedToday}/{subscription?.limit}
                        </span>
                      </div>
                      <p className="text-red-100 text-sm leading-relaxed mb-3">
                        You've reached your daily limit of <strong>{subscription?.limit} API keys</strong> for the <strong>{subscription?.tierName}</strong> tier. 
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <div className="flex-1 bg-black/30 rounded-lg p-3 border border-red-500/20">
                          <p className="text-xs text-red-300 mb-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
                            Next Reset
                          </p>
                          <p className="text-red-100 font-semibold">Midnight UTC (Today)</p>
                        </div>
                        <div className="flex-1 bg-black/30 rounded-lg p-3 border border-red-500/20">
                          <p className="text-xs text-red-300 mb-1">💡 Quick Solution</p>
                          <p className="text-red-100 font-semibold">Upgrade Your Plan</p>
                        </div>
                      </div>
                    </div>
                    <Link href="/pricing">
                      <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
                        <TrendingUp className="w-4 h-4" />
                        Upgrade Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {isNearLimit && !isLimitReached && (
              <div className="mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-yellow-500/5"></div>
                <div className="relative bg-gradient-to-br from-yellow-900/30 to-amber-900/20 border border-yellow-600/40 rounded-2xl p-5 backdrop-blur-sm shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-yellow-500/20 rounded-lg border border-yellow-500/30 flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-lg font-bold text-yellow-200">⚠️ Approaching Daily Limit</h3>
                        <span className="px-2.5 py-0.5 bg-yellow-500/30 border border-yellow-500/50 rounded-full text-xs font-bold text-yellow-200">
                          {subscription?.remaining} left
                        </span>
                      </div>
                      <p className="text-yellow-100 text-sm">
                        You have <strong>{subscription?.remaining} keys remaining</strong> out of {subscription?.limit} today. Consider upgrading to avoid interruptions.
                      </p>
                    </div>
                    <Link href="/pricing">
                      <button className="px-5 py-2.5 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm whitespace-nowrap">
                        <Crown className="w-4 h-4" />
                        View Plans
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Artifact Name</label>
                  <input
                    placeholder="e.g. Ancient Vase"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLimitReached}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Period</label>
                  <input
                    placeholder="e.g. Ming Dynasty"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    disabled={isLimitReached}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Origin</label>
                  <input
                    placeholder="e.g. China"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    disabled={isLimitReached}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Value ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isLimitReached}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Artifact Image</label>
                  {imageUrl ? (
                    <div className="relative">
                      <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <img 
                            src={imageUrl} 
                            alt="Artifact preview" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-300 truncate">{imageUrl}</p>
                          <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                            Image uploaded successfully
                          </p>
                        </div>
                        <button
                          onClick={() => setImageUrl("")}
                          disabled={isLimitReached}
                          className="p-2 hover:bg-red-900/30 rounded-lg transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full">
                      <UploadButton<OurFileRouter, "artifactImage">
                        endpoint="artifactImage"
                        disabled={isLimitReached}
                        onUploadBegin={() => {
                          setUploading(true);
                        }}
                        onClientUploadComplete={(res) => {
                          setUploading(false);
                          if (res && res[0]) {
                            setImageUrl(res[0].url);
                          }
                        }}
                        onUploadError={(error: Error) => {
                          setUploading(false);
                          alert(`Upload failed: ${error.message}`);
                        }}
                        appearance={{
                          button: `w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 ut-uploading:opacity-50 ut-uploading:cursor-not-allowed ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`,
                          container: "w-full",
                          allowedContent: "hidden",
                        }}
                        content={{
                          button: ({ ready, isUploading }) => {
                            if (isUploading) return (
                              <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                <span>Uploading...</span>
                              </div>
                            );
                            if (ready) return (
                              <div className="flex items-center justify-center gap-2">
                                <Upload className="w-4 h-4" />
                                <span>Upload Image (Max 4MB)</span>
                              </div>
                            );
                            return "Loading...";
                          },
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        Supported: JPG, PNG, GIF (up to 4MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {justCreated && (
                <div className="rounded-2xl border bg-gray-900/50 border-gray-700 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-200 mb-4">🎉 Here is your API Key:</p>
                  <div className="flex items-center gap-2 p-4 bg-black/50 rounded-xl border border-gray-700">
                    <code className="text-sm break-all font-mono flex-1 text-gray-300">{justCreated.key}</code>
                    <CopyButton value={justCreated.key} />
                  </div>
                  <p className="text-gray-400 mt-3 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Save this key securely. You won't be able to see it again.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Keys Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-gray-700/50 rounded-xl">
                <Shield className="text-gray-300" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Your Artifact Keys</h2>
                <p className="text-gray-400">Manage your registered artifacts</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Artifact</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Key</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Created</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Status</th>
                    <th className="text-right py-4 px-4 text-gray-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-b border-gray-800 hover:bg-white/5 transition-all duration-300">
                      <td className="py-4 px-4 text-white font-medium">{row.name}</td>
                      <td className="py-4 px-4 font-mono text-sm text-gray-400">{row.masked}</td>
                      <td className="py-4 px-4 text-gray-300 text-sm">{new Date(row.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-4">
                        {row.revoked ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span>
                            Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          disabled={row.revoked}
                          onClick={() => revokeKey(row.id)}
                          className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-xl font-semibold hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                          <Key className="w-12 h-12 text-gray-700" />
                          <p>No artifact keys yet</p>
                          <p className="text-sm text-gray-600">Create your first artifact above to get started</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-900/30 border border-gray-700 p-6 backdrop-blur-sm">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-gray-300">
                Use the{" "}
                <code className="bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-gray-200">x-api-key</code>{" "}
                header when accessing secured endpoints. See{" "}
                <Link href="/docs" className="underline text-gray-200 hover:text-white transition-colors">
                  Docs
                </Link>{" "}
                for examples. Daily limits reset at midnight UTC.
              </p>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}