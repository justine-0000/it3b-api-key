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
    } catch (error: unknown) {
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
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/30 to-stone-50/50">
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-6 p-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Key className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Authentication Required</h2>
            <p className="text-slate-600 text-lg">
              Please sign in to manage your museum artifacts API keys
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mx-auto max-w-6xl space-y-8 p-6">
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  API KEYS (Artifacts)
                </h1>
                <p className="text-slate-600">Create artifact entries with API keys</p>
              </div>
            </div>
            <Link href={"/docs"}>
              <Button variant="outline" className="flex items-center gap-2 bg-amber-50 border-amber-200">
                <BookOpenText className="w-4 h-4" />
                View API Documentation
              </Button>
            </Link>
          </div>

          {/* Create Artifact + Key */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-amber-50/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-700" />
                  Register Artifact API Key
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Each artifact gets its own API key (visible once)
                </CardDescription>
              </div>
              <Button
                onClick={createKey}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-700 to-amber-800 text-white"
              >
                {loading ? "Creating..." : <><Plus className="h-4 w-4" /> Create</>}
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-sm font-medium">Artifact Name</label>
                  <input
                    placeholder="e.g. Ancient Vase"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Period</label>
                  <input
                    placeholder="e.g. Ming Dynasty"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Origin</label>
                  <input
                    placeholder="e.g. China"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Estimated Value</label>
                  <input
                    placeholder="e.g. 10000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Image URL</label>
                  <input
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border rounded-md p-2 w-full"
                  />
                </div>
              </div>

              {justCreated && (
                <div className="rounded-lg border bg-amber-50 p-4">
                  <p className="text-sm font-medium text-yellow-800">Here is your API Key:</p>
                  <div className="mt-2 flex items-center gap-2 p-3 bg-white rounded-md border">
                    <code className="text-sm break-all font-mono flex-1">{justCreated.key}</code>
                    <CopyButton value={justCreated.key} />
                  </div>
                  <p className="text-yellow-700 mt-2 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Save this key securely. You won’t be able to see it again.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Keys Table */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Artifact Keys</CardTitle>
              <CardDescription>Manage your registered artifacts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Artifact</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.period}</TableCell>
                      <TableCell>{row.origin}</TableCell>
                      <TableCell>${row.value}</TableCell>
                      <TableCell>
                        {row.imageUrl ? (
                          <img src={row.imageUrl} alt={row.name} className="h-12 w-12 object-cover rounded" />
                        ) : "—"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{row.masked}</TableCell>
                      <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                      <TableCell>
                        {row.revoked ? (
                          <Badge variant="secondary">Revoked</Badge>
                        ) : (
                          <Badge>Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={row.revoked}
                          onClick={() => revokeKey(row.id)}
                        >
                          Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {items.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12">
                        No artifact keys yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Separator />

          <div className="rounded-xl bg-amber-50 border p-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p>
                Use the{" "}
                <code className="bg-yellow-100 px-2 py-0.5 rounded text-sm font-mono">x-api-key</code>{" "}
                header when accessing secured endpoints. See{" "}
                <Link href="/docs" className="underline text-yellow-800">
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
