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

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <BookOpen className="text-white" size={24} />
            <span className="text-white font-medium">API Documentation</span>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-transparent">
            API Guide
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Complete documentation for integrating with our API endpoints
          </p>
          <Link href="/keys">
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <KeyRound className="h-5 w-5" />
              Key Dashboard
            </Button>
          </Link>
        </div>

        {/* Authentication & Base URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Authentication Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cyan-500/20 rounded-xl">
                <KeyRound className="text-cyan-200" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">How Authentication Works</h2>
            </div>
            <div className="space-y-4 text-white/90">
              <p>
                Authenticate using the <code className="px-2 py-1 bg-black/30 rounded text-cyan-200 font-mono text-sm">x-api-key</code> header. Create a key in <code className="px-2 py-1 bg-black/30 rounded text-cyan-200 font-mono text-sm">/keys</code> and store it securely.
              </p>
              <Separator className="bg-white/20" />
              <div>
                <h3 className="font-semibold text-white mb-2">Base URL</h3>
                <pre className="overflow-x-auto bg-black/30 p-3 rounded-xl">
                  <code className="text-cyan-200 text-sm">{baseUrl + "/api"}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* GET Endpoint Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-500/20 rounded-xl">
                <Code className="text-teal-200" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">GET /api/ping</h2>
            </div>
            <div className="space-y-4">
              <pre className="overflow-x-auto bg-black/30 p-4 rounded-xl text-sm">
                <code className="text-cyan-200">{`curl -H 'x-api-key: <YOUR_KEY>' \\
${baseUrl}/api/ping`}</code>
              </pre>
              <pre className="overflow-x-auto bg-black/30 p-4 rounded-xl text-sm">
                <code className="text-cyan-200">{`const r = await fetch('${baseUrl}/api/ping', {
  headers: { 'x-api-key': process.env.MY_KEY! }
});`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* POST Endpoint Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Send className="text-emerald-200" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white">POST /api/echo</h2>
          </div>
          <div className="space-y-4">
            <pre className="overflow-x-auto bg-black/30 p-4 rounded-xl text-sm">
              <code className="text-cyan-200">{`curl -X POST \\
-H 'x-api-key: <YOUR_KEY>' \\
-H 'content-type: application/json' \\
-d '{"hello":"world"}' \\
${baseUrl}/api/echo`}</code>
            </pre>
            <pre className="overflow-x-auto bg-black/30 p-4 rounded-xl text-sm">
              <code className="text-cyan-200">{`const r = await fetch('${baseUrl}/api/echo', {
  method: 'POST',
  headers: { 'x-api-key': process.env.MY_KEY!, 'content-type': 'application/json' },
  body: JSON.stringify({ hello: 'world' })
});`}</code>
            </pre>
          </div>
        </div>

        {/* Interactive Tester */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-500/20 rounded-xl">
              <Terminal className="text-purple-200" size={28} />
            </div>
            <h2 className="text-3xl font-bold text-white">Interactive Tester</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-white text-lg font-semibold mb-2 block">API Key</Label>
              <Input
                type="password"
                placeholder="Paste your API Key (sk_...)"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 text-lg"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={runGET}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Code size={20} />
                Test GET /api/echo
              </button>
              <button
                onClick={runPOST}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-teal-600 hover:to-cyan-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Send size={20} />
                Test POST /api/echo
              </button>
              <button
                onClick={runOPTIONS}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Terminal size={20} />
                Test OPTIONS /api/echo
              </button>
            </div>

            <div>
              <Label className="text-white text-lg font-semibold mb-2 block">POST body (JSON)</Label>
              <Textarea
                rows={5}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="w-full px-4 py-4 bg-black/20 border border-white/20 rounded-xl text-white font-mono text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-transparent transition-all duration-300 resize-none"
                placeholder='{"hello":"world"}'
              />
            </div>

            <div>
              <Label className="text-white text-lg font-semibold mb-2 block">Response</Label>
              <Textarea
                readOnly
                value={out}
                className="w-full px-4 py-4 bg-black/30 border border-white/20 rounded-xl text-cyan-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-transparent transition-all duration-300 resize-y"
                rows={16}
                placeholder="Response will appear here..."
              />
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />
        
        <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
          <p className="text-white text-lg">
            💡 <span className="font-semibold">Tip:</span> Call secured endpoints with the{" "}
            <code className="px-2 py-1 bg-black/30 rounded text-cyan-200 font-mono text-sm">
              x-api-key
            </code>{" "}
            header. See{" "}
            <Link
              href="/keys"
              className="font-semibold underline text-cyan-300 hover:text-cyan-100 transition-colors"
            >
              Keys Dashboard
            </Link>{" "}
            to manage your API keys.
          </p>
        </div>
      </div>
    </div>
  );
}