"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Check, Sparkles, Zap, Crown, Rocket, Key, ArrowRight, X, Star, TrendingUp } from "lucide-react";

type Tier = "free" | "pro" | "premium" | "premium_plus";

type SubscriptionData = {
  tier: Tier;
  tierName: string;
  keysCreatedToday: number;
  limit: number;
  remaining: number;
};

const tiers = [
  {
    id: "free" as Tier,
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Key,
    color: "from-gray-600 to-gray-800",
    borderColor: "border-gray-700",
    glowColor: "shadow-gray-500/20",
    features: [
      "10 API keys per day",
      "3 requests per 10 seconds",
      "Basic artifact management",
      "Community support",
      "Standard documentation",
    ],
  },
  {
    id: "pro" as Tier,
    name: "Pro",
    price: "$9",
    period: "per month",
    icon: Zap,
    color: "from-blue-600 to-blue-800",
    borderColor: "border-blue-500",
    glowColor: "shadow-blue-500/30",
    features: [
      "50 API keys per day",
      "10 requests per 10 seconds",
      "Advanced artifact management",
      "Priority email support",
      "API analytics dashboard",
      "Advanced documentation",
    ],
    popular: true,
  },
  {
    id: "premium" as Tier,
    name: "Premium",
    price: "$29",
    period: "per month",
    icon: Crown,
    color: "from-purple-600 to-purple-800",
    borderColor: "border-purple-500",
    glowColor: "shadow-purple-500/30",
    features: [
      "200 API keys per day",
      "50 requests per 10 seconds",
      "Unlimited artifacts storage",
      "Premium support (24/7)",
      "Advanced analytics & insights",
      "Custom integrations",
      "Webhook notifications",
    ],
  },
  {
    id: "premium_plus" as Tier,
    name: "Premium+",
    price: "$99",
    period: "per month",
    icon: Rocket,
    color: "from-amber-600 to-amber-800",
    borderColor: "border-amber-500",
    glowColor: "shadow-amber-500/30",
    features: [
      "1,000 API keys per day",
      "200 requests per 10 seconds",
      "Unlimited everything",
      "24/7 dedicated support",
      "White-label options",
      "Custom SLA guarantees",
      "Personal account manager",
      "Priority feature requests",
    ],
  },
];

export default function PricingPage() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState<Tier | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successTier, setSuccessTier] = useState<string>("");

  const fetchSubscription = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/subscription");
      if (res.ok) {
        const data = await res.json();
        setSubscription(data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription", error);
    }
  }, [user]);

  useEffect(() => {
    void fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscribe = async (tier: Tier, tierName: string) => {
    if (!user) return;
    setLoading(tier);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier }),
      });

      if (res.ok) {
        await fetchSubscription();
        setSuccessTier(tierName);
        setShowSuccessModal(true);
      } else {
        const data = await res.json();
        alert(data.error ?? "Failed to update subscription");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <SignedOut>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl border border-blue-500/30 transform hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-400 text-lg max-w-md">
              Please sign in to view pricing and manage your subscription
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative z-10 mx-auto max-w-7xl space-y-16 p-8 py-20">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-md rounded-full border border-blue-500/30 shadow-lg">
              <Sparkles className="text-blue-400 animate-pulse" size={24} />
              <span className="text-white font-semibold text-lg">Subscription Plans</span>
            </div>
            <h1 className="text-7xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
              Choose Your Plan
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Scale your API key creation based on your needs. Start free, upgrade anytime.
            </p>
            {subscription && (
              <div className="mt-10 inline-flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-emerald-900/40 to-green-900/40 backdrop-blur-md rounded-2xl border border-emerald-500/40 shadow-xl">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 shadow-lg"></span>
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">
                    Current Plan: {subscription.tierName}
                  </p>
                  <p className="text-emerald-300 text-sm font-medium">
                    {subscription.remaining}/{subscription.limit} keys remaining today
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isCurrentTier = subscription?.tier === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 hover:transform hover:-translate-y-2 ${
                    tier.popular
                      ? `border-blue-500 ring-4 ring-blue-500/30 shadow-2xl ${tier.glowColor} scale-105`
                      : `${tier.borderColor} hover:border-white/40 shadow-xl hover:shadow-2xl`
                  } ${isCurrentTier ? "ring-4 ring-green-500/40 shadow-2xl shadow-green-500/20" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-2xl flex items-center gap-2 animate-pulse">
                        <Star className="w-4 h-4 fill-white" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  {isCurrentTier && (
                    <div className="absolute -top-5 right-6">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-2">
                        <Check className="w-4 h-4" />
                        Active Plan
                      </div>
                    </div>
                  )}

                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-8 shadow-2xl transform hover:rotate-12 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-3xl font-black text-white mb-3">{tier.name}</h3>
                  <div className="mb-8">
                    <span className="text-6xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {tier.price}
                    </span>
                    <span className="text-gray-400 ml-2 text-base font-medium">/ {tier.period}</span>
                  </div>

                  <ul className="space-y-4 mb-10 min-h-[280px]">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                          <Check className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(tier.id, tier.name)}
                    disabled={isCurrentTier || loading === tier.id}
                    className={`w-full py-7 rounded-2xl font-bold text-lg transition-all duration-300 ${
                      isCurrentTier
                        ? "bg-green-900/30 text-green-400 border-2 border-green-700 cursor-default"
                        : `bg-gradient-to-r ${tier.color} text-white hover:opacity-90 transform hover:scale-105 shadow-xl hover:shadow-2xl`
                    }`}
                  >
                    {loading === tier.id ? (
                      <span className="flex items-center gap-3 justify-center">
                        <span className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : isCurrentTier ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Check className="w-5 h-5" />
                        Current Plan
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        {tier.id === "free" ? "Downgrade" : "Upgrade Now"}
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-12 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center space-y-5 group">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-white font-bold">Artifact Management</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Store and manage your museum artifacts with secure API keys and comprehensive metadata
                </p>
              </div>
              <div className="text-center space-y-5 group">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Key className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-white font-bold">Secure API Keys</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Industry-standard SHA-256 encryption and security best practices for all your keys
                </p>
              </div>
              <div className="text-center space-y-5 group">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl text-white font-bold">Rate Limiting</h3>
                <p className="text-gray-400 text-base leading-relaxed">
                  Built-in rate limiting to protect your resources and ensure optimal performance
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl overflow-x-auto">
            <h2 className="text-4xl font-black text-white mb-12 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Feature Comparison
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-700">
                  <th className="text-left py-6 px-6 text-gray-300 font-bold text-lg">Feature</th>
                  <th className="text-center py-6 px-6 text-gray-300 font-bold text-lg">Free</th>
                  <th className="text-center py-6 px-6 text-blue-400 font-bold text-lg">Pro</th>
                  <th className="text-center py-6 px-6 text-purple-400 font-bold text-lg">Premium</th>
                  <th className="text-center py-6 px-6 text-amber-400 font-bold text-lg">Premium+</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 text-white font-semibold">Keys per Day</td>
                  <td className="py-5 px-6 text-center text-gray-300 font-medium">10</td>
                  <td className="py-5 px-6 text-center text-blue-400 font-bold">50</td>
                  <td className="py-5 px-6 text-center text-purple-400 font-bold">200</td>
                  <td className="py-5 px-6 text-center text-amber-400 font-bold">1,000</td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 text-white font-semibold">Rate Limit</td>
                  <td className="py-5 px-6 text-center text-gray-300 font-medium">3/10s</td>
                  <td className="py-5 px-6 text-center text-blue-400 font-bold">10/10s</td>
                  <td className="py-5 px-6 text-center text-purple-400 font-bold">50/10s</td>
                  <td className="py-5 px-6 text-center text-amber-400 font-bold">200/10s</td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 text-white font-semibold">Support</td>
                  <td className="py-5 px-6 text-center text-gray-300 font-medium">Community</td>
                  <td className="py-5 px-6 text-center text-blue-400 font-medium">Email</td>
                  <td className="py-5 px-6 text-center text-purple-400 font-medium">24/7</td>
                  <td className="py-5 px-6 text-center text-amber-400 font-medium">Dedicated</td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 text-white font-semibold">Analytics</td>
                  <td className="py-5 px-6 text-center text-gray-300">Basic</td>
                  <td className="py-5 px-6 text-center"><Check className="w-6 h-6 text-green-400 mx-auto" /></td>
                  <td className="py-5 px-6 text-center"><Check className="w-6 h-6 text-green-400 mx-auto" /></td>
                  <td className="py-5 px-6 text-center"><Check className="w-6 h-6 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800 hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 text-white font-semibold">Custom Integrations</td>
                  <td className="py-5 px-6 text-center text-gray-600">-</td>
                  <td className="py-5 px-6 text-center text-gray-600">-</td>
                  <td className="py-5 px-6 text-center"><Check className="w-6 h-6 text-green-400 mx-auto" /></td>
                  <td className="py-5 px-6 text-center"><Check className="w-6 h-6 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-5 px-6 text-white font-semibold">White-label</td>
                  <td className="py-5 px-6 text-center text-gray-600">-</td>
                  <td className="py-5 px-6 text-center text-gray-600">-</td>
                  <td className="py-5 px-6 text-center text-gray-600">-</td>
                  <td className="py-5 px-6 text-center"><Check className="w-6 h-6 text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FAQ Section */}
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-12 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="space-y-3 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-bold text-white">Can I change plans anytime?</h3>
                <p className="text-gray-400 leading-relaxed">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll see your new limits right away.
                </p>
              </div>
              <div className="space-y-3 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-bold text-white">What happens when I reach my daily limit?</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your daily limit resets at midnight UTC. You can upgrade your plan anytime to get a higher limit immediately without waiting.
                </p>
              </div>
              <div className="space-y-3 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-bold text-white">Are my API keys secure?</h3>
                <p className="text-gray-400 leading-relaxed">
                  Absolutely! All keys are hashed using SHA-256 encryption and stored securely. You only see the full key once during creation for maximum security.
                </p>
              </div>
              <div className="space-y-3 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors">
                <h3 className="text-xl font-bold text-white">Do unused keys roll over to the next day?</h3>
                <p className="text-gray-400 leading-relaxed">
                  No, daily limits reset each day. This ensures fair usage across all users and optimal system performance for everyone.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-8 py-12">
            <div className="space-y-5">
              <h2 className="text-5xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Ready to get started?
              </h2>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
                Start with our free plan and upgrade as you grow. No credit card required.
              </p>
            </div>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/keys">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-10 py-7 text-xl rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 font-bold">
                  Go to Dashboard
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  variant="outline"
                  className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-10 py-7 text-xl rounded-2xl font-bold transform hover:scale-110 transition-all duration-300"
                >
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SignedIn>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-gray-900 via-emerald-900/20 to-gray-900 rounded-3xl max-w-md w-full border-2 border-emerald-500/40 shadow-2xl transform animate-in zoom-in-95 duration-300">
            {/* Animated success header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-green-600/20 to-emerald-600/20 animate-pulse"></div>
              <div className="relative p-10 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform animate-bounce">
                  <Check className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-black text-white mb-3">
                  Success! 🎉
                </h2>
                <p className="text-emerald-300 text-lg font-semibold">
                  You've upgraded to {successTier}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 pt-0 space-y-6">
              <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-500/30">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">Your new benefits are active!</h3>
                    <p className="text-emerald-200 text-sm leading-relaxed">
                      You can now create more API keys and enjoy enhanced features. Start building amazing things!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all duration-300 border border-gray-700"
                >
                  Close
                </button>
                <Link href="/keys" className="flex-1">
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Start Creating
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}