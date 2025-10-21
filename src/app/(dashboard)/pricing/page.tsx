// app/(dashboard)/pricing/page.tsx

"use client";

import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Check, Sparkles, Zap, Crown, Rocket, Key, ArrowRight } from "lucide-react";

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

  const handleSubscribe = async (tier: Tier) => {
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
        alert(`Successfully upgraded to ${tier.toUpperCase()}!`);
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
        backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>

      <SignedOut>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center shadow-2xl border border-gray-700">
              <Sparkles className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-400 text-lg">
              Please sign in to view pricing and manage your subscription
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="relative z-10 mx-auto max-w-7xl space-y-12 p-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
              <Sparkles className="text-white" size={24} />
              <span className="text-white font-medium">Subscription Plans</span>
            </div>
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Scale your API key creation based on your needs. Start free, upgrade anytime.
            </p>
            {subscription && (
              <div className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md rounded-2xl border border-blue-700/50">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">
                    Current Plan: {subscription.tierName}
                  </p>
                  <p className="text-blue-300 text-sm">
                    {subscription.remaining}/{subscription.limit} keys remaining today
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isCurrentTier = subscription?.tier === tier.id;
              
              return (
                <div
                  key={tier.id}
                  className={`relative bg-white/5 backdrop-blur-md rounded-3xl p-8 border transition-all duration-300 ${
                    tier.popular
                      ? "border-blue-500 ring-2 ring-blue-500/50 transform scale-105 shadow-2xl shadow-blue-500/20"
                      : `${tier.borderColor} hover:border-white/30`
                  } ${isCurrentTier ? "ring-2 ring-green-500/50 shadow-xl shadow-green-500/20" : ""}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ⭐MostPopular
                      </span>
                    </div>
                  )}
                  {isCurrentTier && (
                    <div className="absolute -top-4 right-4">
                      <span className="bg-gradient-to-r from-green-600 to-green-800 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active
                      </span>
                    </div>
                  )}

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-black text-white">{tier.price}</span>
                    <span className="text-gray-400 ml-2 text-sm">/ {tier.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8 min-h-[240px]">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isCurrentTier || loading === tier.id}
                    className={`w-full py-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                      isCurrentTier
                        ? "bg-green-900/30 text-green-400 border border-green-800 cursor-default"
                        : `bg-gradient-to-r ${tier.color} text-white hover:opacity-90 transform hover:scale-105 shadow-lg`
                    }`}
                  >
                    {loading === tier.id ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : isCurrentTier ? (
                      "Current Plan"
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        {tier.id === "free" ? "Downgrade" : "Upgrade Now"}
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Features Comparison */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              All Plans Include
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold">Artifact Management</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Store and manage your museum artifacts with secure API keys and comprehensive metadata
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mx-auto shadow-lg">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold">Secure API Keys</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Industry-standard SHA-256 encryption and security best practices for all your keys
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center mx-auto shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-semibold">Rate Limiting</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Built-in rate limiting to protect your resources and ensure optimal performance
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl overflow-x-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Feature Comparison
            </h2>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 text-gray-300 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 text-gray-300 font-semibold">Pro</th>
                  <th className="text-center py-4 px-4 text-gray-300 font-semibold">Premium</th>
                  <th className="text-center py-4 px-4 text-gray-300 font-semibold">Premium+</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Keys per Day</td>
                  <td className="py-4 px-4 text-center text-gray-300">10</td>
                  <td className="py-4 px-4 text-center text-gray-300">50</td>
                  <td className="py-4 px-4 text-center text-gray-300">200</td>
                  <td className="py-4 px-4 text-center text-gray-300">1,000</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Rate Limit</td>
                  <td className="py-4 px-4 text-center text-gray-300">3/10s</td>
                  <td className="py-4 px-4 text-center text-gray-300">10/10s</td>
                  <td className="py-4 px-4 text-center text-gray-300">50/10s</td>
                  <td className="py-4 px-4 text-center text-gray-300">200/10s</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Support</td>
                  <td className="py-4 px-4 text-center text-gray-300">Community</td>
                  <td className="py-4 px-4 text-center text-gray-300">Email</td>
                  <td className="py-4 px-4 text-center text-gray-300">24/7</td>
                  <td className="py-4 px-4 text-center text-gray-300">Dedicated</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Analytics</td>
                  <td className="py-4 px-4 text-center text-gray-300">Basic</td>
                  <td className="py-4 px-4 text-center text-gray-300"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center text-gray-300"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center text-gray-300"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-4 px-4 text-white">Custom Integrations</td>
                  <td className="py-4 px-4 text-center text-gray-300">-</td>
                  <td className="py-4 px-4 text-center text-gray-300">-</td>
                  <td className="py-4 px-4 text-center text-gray-300"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="py-4 px-4 text-center text-gray-300"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-white">White-label</td>
                  <td className="py-4 px-4 text-center text-gray-300">-</td>
                  <td className="py-4 px-4 text-center text-gray-300">-</td>
                  <td className="py-4 px-4 text-center text-gray-300">-</td>
                  <td className="py-4 px-4 text-center text-gray-300"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Can I change plans anytime?</h3>
                <p className="text-gray-400">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">What happens when I reach my daily limit?</h3>
                <p className="text-gray-400">
                  Your daily limit resets at midnight UTC. You can upgrade your plan anytime to get a higher limit immediately.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Are my API keys secure?</h3>
                <p className="text-gray-400">
                  Absolutely! All keys are hashed using SHA-256 encryption and stored securely. You only see the full key once during creation.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white">Do unused keys roll over to the next day?</h3>
                <p className="text-gray-400">
                  No, daily limits reset each day. This ensures fair usage across all users and optimal system performance.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
              <p className="text-gray-400 text-lg">
                Start with our free plan and upgrade as you grow
              </p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/keys">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-6 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl"
                >
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}