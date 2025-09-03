"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "~/components/copy-button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

type KeyItem = {
  id: string;
  name: string;
  masked: string;
  createdAt: string;
  revoked: boolean;
};

export default function KeysPage() {
  const [name, setName] = useState("");
  const [justCreated, setJustCreated] = useState<{ key: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<KeyItem[]>([]);

  async function createKey() {
    setLoading(true);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = (await res.json()) as { key: string; id: string; [k: string]: unknown };
      if (res.ok) {
        setJustCreated({ key: data.key, id: data.id });
        await load();
      } else {
        alert((data.error as string) ?? "Failed to create key");
      }
    } finally {
      setLoading(false);
    }
  }

  async function load() {
    const res = await fetch("/api/keys", { cache: "no-store" });
    const data = (await res.json()) as { items?: KeyItem[] };
    setItems(data.items ?? []);
  }

  async function revokeKey(id: string) {
    const res = await fetch(`/api/keys?keyId=${id}`, { method: "DELETE" });
    const data = (await res.json()) as { error?: string; success?: boolean };
    if (!res.ok) alert(data.error ?? "Failed to revoke key");
    await load();
  }

  
  useEffect(() => {
    void load();
  }, []);

  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) router.replace("/");
  }, [isSignedIn, router]);

  if (!isSignedIn) return null;

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: "url('/bg1.jpg')" }} />
      <div className="fixed inset-0 bg-black/30 -z-5" />

      <div className="space-y-8 relative z-10 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">🔑 API Key Manager</h1>
          <Link href="/docs">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-gray-300 bg-white/80 text-base text-gray-700 shadow-sm hover:bg-blue-600 hover:text-white transition"
            >
              <BookOpen className="h-5 w-5" />
              API Documentation
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-between gap-8">
          <Card className="w-full md:w-[48%] relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
            <div className="absolute inset-0 bg-cover bg-center filter blur-sm" style={{ backgroundImage: "url('/card1.jpg')" }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative p-6">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-white">Generate API Key</CardTitle>
                <Button
                  className="flex items-center gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => void createKey()}
                  disabled={loading}
                >
                  <Plus className="h-5 w-5" />
                  Create
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Key Name (e.g production)"
                  className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 bg-white/90 text-gray-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </CardContent>
            </div>
          </Card>

          <Card className="w-full md:w-[48%] relative rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300">
            <div className="absolute inset-0 bg-cover bg-center filter blur-sm" style={{ backgroundImage: "url('/card1.jpg')" }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative p-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">Your New API Key</CardTitle>
              </CardHeader>
              <CardContent>
                {justCreated && (
                  <>
                    <p className="text-sm text-gray-200">Here is your API Key (visible once):</p>
                    <div className="mt-2 flex items-center gap-2 rounded-md bg-white/90 p-2">
                      <code className="break-all font-mono text-sm text-gray-900">{justCreated.key}</code>
                      <CopyButton value={justCreated.key} />
                    </div>
                    <p className="mt-2 text-xs text-gray-300">💡 Save this key securely. You won’t be able to see it again.</p>
                  </>
                )}
              </CardContent>
            </div>
          </Card>
        </div>

        <Card className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
          <div className="absolute inset-0 bg-cover bg-center filter blur-sm" style={{ backgroundImage: "url('/card-bg3.jpg')" }} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative p-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Your Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <TableHead className="text-white">Name</TableHead>
                      <TableHead className="text-white">Key</TableHead>
                      <TableHead className="text-white">Created</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-right text-white">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white/90 divide-y divide-gray-200">
                    {items.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50 transition">
                        <TableCell>{row.name}</TableCell>
                        <TableCell className="font-mono text-sm text-gray-800">{row.masked}</TableCell>
                        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          {row.revoked ? <Badge variant="secondary">Revoked</Badge> : <Badge>Active</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-md"
                            disabled={row.revoked}
                            onClick={() => void revokeKey(row.id)}
                          >
                            Revoke
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-muted-foreground text-center text-sm">
                          No API Key yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </div>
        </Card>

        <Separator className="my-6" />
        <p className="text-center text-white">
          💡 Tip: Call secured endpoints with the <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-sm">x-api-key</code> header. See{" "}
          <Link href="/docs" className="font-medium underline text-blue-400 hover:text-indigo-300">Docs</Link>
        </p>
      </div>
    </div>
  );
}
