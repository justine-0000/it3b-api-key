"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { KeyRound, BookOpen, Code, Send, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

const baseUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://it3b-api-key-act6.vercel.app/";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("");

  async function runGET() {
    try {
      const res = await fetch(`${baseUrl}/api/echo`, {
        headers: { "x-api-key": key },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Response not JSON", status: res.status };
      }

      setOut(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOut(`Request failed: ${err.message}`);
      } else {
        setOut("Request failed: Unknown error");
      }
    }
  }

  async function runOPTIONS() {
    const res = await fetch(`${baseUrl}/api/echo`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://it3b-api-key-act6.vercel.app/",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "x-api-key, content-type",
      },
    });
    setOut(
      `Status: ${res.status}\n` +
        Array.from(res.headers.entries())
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n")
    );
  }

  async function runPOST() {
    try {
      const res = await fetch(`${baseUrl}/api/echo`, {
        method: "POST",
        headers: {
          "x-api-key": key,
          "content-type": "application/json",
        },
        body: JSON.stringify({ postBody }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { error: "Response not JSON", status: res.status };
      }

      setOut(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOut(`Request failed: ${err.message}`);
      } else {
        setOut("Request failed: Unknown error");
      }
    }
  }

  const router = useRouter();
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) return null;

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>

      <div className="space-y-8 relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            📖Guide
          </h1>
          <Link href="/keys">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-white/30 bg-white/20 backdrop-blur-md text-base text-white shadow-sm hover:bg-white/30 transition"
            >
              <KeyRound className="h-5 w-5" />
              Key Dashboard
            </Button>
          </Link>
        </div>

        {/* Authentication & Base URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First card */}
          <Card className="relative bg-white/10 backdrop-blur-md text-white shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-white/20">
            <div className="relative p-4 rounded-xl">
              <CardHeader>
                <CardTitle>How Authentication Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Authenticate using the <code className="px-2 py-1 bg-black/30 rounded text-cyan-200 font-mono text-sm">x-api-key</code> header. Create a
                  key in <code className="px-2 py-1 bg-black/30 rounded text-cyan-200 font-mono text-sm">/keys</code> and store it securely.
                </p>
                <Separator className="bg-white/20" />
                <div>
                  <h3 className="font-semibold">Base URL</h3>
                  <pre className="overflow-x-auto bg-black/30 p-3 rounded-xl mt-2">
                    <code className="text-cyan-200 text-sm">{baseUrl + "/api"}</code>
                  </pre>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Second card */}
          <Card className="relative bg-white/10 backdrop-blur-md text-white shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-white/20">
            <div className="relative p-4 rounded-xl">
              <CardHeader>
                <CardTitle>GET /api/ping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="overflow-x-auto text-sm bg-black/30 p-3 rounded-xl">
                  <code className="text-cyan-200">{`curl -H 'x-api-key: <YOUR_KEY>' \\
${baseUrl}/api/ping`}</code>
                </pre>
                <pre className="overflow-x-auto text-sm bg-black/30 p-3 rounded-xl">
                  <code className="text-cyan-200">{`const r = await fetch('${baseUrl}/api/ping', {
  headers: { 'x-api-key': process.env.MY_KEY! }
});`}</code>
                </pre>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Third card */}
        <Card className="relative bg-white/10 backdrop-blur-md text-white shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-white/20">
          <div className="relative p-4 rounded-xl">
            <CardHeader>
              <CardTitle>POST /api/echo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <pre className="overflow-x-auto text-sm bg-black/30 p-3 rounded-xl">
                <code className="text-cyan-200">{`curl -X POST \\
-H 'x-api-key: <YOUR_KEY>' \\
-H 'content-type: application/json' \\
-d '{"hello":"world"}' \\
${baseUrl}/api/echo`}</code>
              </pre>
              <pre className="overflow-x-auto text-sm bg-black/30 p-3 rounded-xl">
                <code className="text-cyan-200">{`const r = await fetch('${baseUrl}/api/echo', {
  method: 'POST',
  headers: { 'x-api-key': process.env.MY_KEY!, 'content-type': 'application/json' },
  body: JSON.stringify({ hello: 'world' })
});`}</code>
              </pre>
            </CardContent>
          </div>
        </Card>

        {/* Interactive Tester */}
        <Card className="relative bg-white/10 backdrop-blur-md text-white shadow-lg overflow-hidden border border-white/20">
          <div className="relative p-6 rounded-xl space-y-5">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Interactive Tester
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-lg">
              <Input
                placeholder="Paste your API Key (sk_...)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="text-lg p-3 rounded-lg bg-white/10 border-white/20 text-white placeholder-white/50"
              />

              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={runGET} 
                  className="text-lg px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  Test GET /api/echo
                </Button>
                <Button
                  onClick={runPOST}
                  variant="secondary"
                  className="text-lg px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white"
                >
                  Test POST /api/echo
                </Button>
                <Button 
                  onClick={runOPTIONS} 
                  variant={"secondary"}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
                  Test OPTIONS /api/echo
                </Button>
              </div>

              <Label className="text-lg font-semibold">POST body (JSON)</Label>
              <Textarea
                rows={5}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="text-base p-4 rounded-lg bg-black/20 border-white/20 text-white font-mono placeholder-white/50"
              />

              <Label className="text-lg font-semibold">Response</Label>
              <Textarea
                readOnly
                value={out}
                className="h-64 resize-y text-base p-4 font-mono rounded-lg bg-black/30 border-white/20 text-cyan-200"
                rows={16}
              />
            </CardContent>
          </div>
        </Card>

        <Separator className="my-6 bg-white/20" />
        <p className="text-center text-white">
          💡 Tip: Call secured endpoints with the{" "}
          <code className="rounded bg-black/30 px-2 py-1 text-cyan-200 font-mono text-sm">
            x-api-key
          </code>{" "}
          header. See{" "}
          <Link
            href="/keys"
            className="font-medium underline text-cyan-300 hover:text-cyan-100"
          >
            Keys
          </Link>
        </p>
      </div>
    </div>
  );
}