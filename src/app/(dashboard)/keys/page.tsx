"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import CopyButton from "~/components/copy-button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "~/components/ui/table";

import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

import {
  BookOpenText,
  Plus,
  Key,
  Shield,
  AlertCircle,
  Sparkles,
  Camera,
} from "lucide-react";

type KeyItem = {
  id: string;
  name: string;       // Artifact name
  period: string;     // Historical period
  origin: string;     // Country/region
  value: number;      // Estimated value
  imageUrl?: string | null;
  masked: string;     // API key (masked)
  createdAt: string;
  revoked: boolean;
};

type KeysApiResponse = {
  items?: KeyItem[];
  key?: string;
  id?: string;
  error?: string;
};

export default function KeysPage() {
  const [name, setName] = useState("");
  const [period, setPeriod] = useState("");
  const [origin, setOrigin] = useState("");
  const [value, setValue] = useState(""); // keep as string for input
  const [imageUrl, setImageUrl] = useState("");

  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

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

  // Create artifact + key
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

      if (res.ok && data.key && data.id) {
        setJustCreated({ key: data.key, id: data.id });
        setName("");
        setPeriod("");
        setOrigin("");
        setValue("");
        setImageUrl("");
        await load();
      } else {
        alert(data.error ?? "Failed to create artifact key");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to create key (see console)");
    } finally {
      setLoading(false);
    }
  }, [name, period, origin, value, imageUrl, load]);

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
  }, [load]);

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
      {/* Background overlay */}
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
              API KEYS (Artifacts)
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Create artifact entries with API keys using our modern management interface
            </p>
            <Link href={"/docs"} className="inline-block mt-6">
              <Button variant="outline" className="flex items-center gap-2 bg-white/5 border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300">
                <BookOpenText className="w-4 h-4" />
                View API Documentation
              </Button>
            </Link>
          </div>

          {/* Create Artifact + Key */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700/50 rounded-xl">
                  <Sparkles className="text-gray-300" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Register Artifact API Key</h2>
                  <p className="text-gray-400">Each artifact gets its own API key (visible once)</p>
                </div>
              </div>
              <button
                onClick={createKey}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? "Creating..." : <><Plus className="h-4 w-4" /> Create</>}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Artifact Name</label>
                  <input
                    placeholder="e.g. Ancient Vase"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Period</label>
                  <input
                    placeholder="e.g. Ming Dynasty"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Origin</label>
                  <input
                    placeholder="e.g. China"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Estimated Value</label>
                  <input
                    placeholder="e.g. 10000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Image URL</label>
                  <input
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {justCreated && (
                <div className="rounded-2xl border bg-gray-900/50 border-gray-700 p-6 backdrop-blur-sm">
                  <p className="text-sm font-medium text-gray-200 mb-4">Here is your API Key:</p>
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
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Period</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Origin</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Value</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Image</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Key</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Created</th>
                    <th className="text-left py-4 px-4 text-gray-300 font-semibold">Status</th>
                    <th className="text-right py-4 px-4 text-gray-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => (
                    <tr key={row.id} className="border-b border-gray-800 hover:bg-white/5 transition-all duration-300">
                      <td className="py-4 px-4 text-white">{row.name}</td>
                      <td className="py-4 px-4 text-gray-300">{row.period}</td>
                      <td className="py-4 px-4 text-gray-300">{row.origin}</td>
                      <td className="py-4 px-4 text-green-400">${row.value}</td>
                      <td className="py-4 px-4">
                        {row.imageUrl ? (
                          <img src={row.imageUrl} alt={row.name} className="h-12 w-12 object-cover rounded-xl border border-gray-700" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-800 flex items-center justify-center rounded-xl border border-gray-700">
                            <Camera className="text-gray-500" size={16} />
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 font-mono text-sm text-gray-400">{row.masked}</td>
                      <td className="py-4 px-4 text-gray-300">{new Date(row.createdAt).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        {row.revoked ? (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">
                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                            Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          disabled={row.revoked}
                          onClick={() => revokeKey(row.id)}
                          className="px-4 py-2 bg-red-900/30 text-red-400 border border-red-800 rounded-xl font-semibold hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-gray-500">
                        No artifact keys yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-900/30 border border-gray-700 p-6 backdrop-blur-sm">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400" />
              <p className="text-gray-300">
                Use the{" "}
                <code className="bg-gray-800 px-2 py-0.5 rounded text-sm font-mono text-gray-200">x-api-key</code>{" "}
                header when accessing secured endpoints. See{" "}
                <Link href="/docs" className="underline text-gray-200 hover:text-white transition-colors">
                  Docs
                </Link>{" "}
                for examples.
              </p>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}