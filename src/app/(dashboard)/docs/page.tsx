"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { KeyRound, BookOpen, Code, Send, Terminal, Zap, Lock, Play } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-48 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="space-y-8 relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-purple-400" />
              API Documentation
            </h1>
            <p className="text-slate-300 mt-2">Interactive guide and testing environment</p>
          </div>
          <Link href="/keys">
            <Button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 px-6 py-3">
              <KeyRound className="h-5 w-5" />
              Key Dashboard
            </Button>
          </Link>
        </div>

        {/* Authentication & Base URL */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Card */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-slate-900/40 backdrop-blur-md border border-purple-500/30 shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 group">
            <CardHeader className="border-b border-purple-500/20">
              <CardTitle className="flex items-center gap-2 text-2xl text-purple-300">
                <Lock className="h-6 w-6" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-slate-300 leading-relaxed">
                Authenticate requests using the <code className="px-3 py-1 bg-purple-500/20 rounded-lg text-purple-300 font-mono text-sm border border-purple-500/30">x-api-key</code> header. Generate your secure API key from the dashboard.
              </p>
              <Separator className="bg-purple-500/20" />
              <div>
                <h3 className="font-semibold text-pink-300 mb-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Base URL
                </h3>
                <pre className="overflow-x-auto bg-slate-950/50 p-4 rounded-xl border border-purple-500/20">
                  <code className="text-blue-300 text-sm">{baseUrl + "/api"}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* GET Endpoint Card */}
          <Card className="bg-gradient-to-br from-blue-900/40 to-slate-900/40 backdrop-blur-md border border-blue-500/30 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500">
            <CardHeader className="border-b border-blue-500/20">
              <CardTitle className="flex items-center gap-2 text-2xl text-blue-300">
                <Code className="h-6 w-6" />
                GET /api/ping
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-3">
                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">cURL Example</p>
                <pre className="overflow-x-auto text-sm bg-slate-950/50 p-4 rounded-xl border border-blue-500/20">
                  <code className="text-emerald-300">{`curl -H 'x-api-key: <YOUR_KEY>' \\
${baseUrl}/api/ping`}</code>
                </pre>
              </div>
              <div className="space-y-3">
                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">JavaScript Example</p>
                <pre className="overflow-x-auto text-sm bg-slate-950/50 p-4 rounded-xl border border-blue-500/20">
                  <code className="text-emerald-300">{`const r = await fetch('${baseUrl}/api/ping', {
  headers: { 'x-api-key': process.env.MY_KEY! }
});`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* POST Endpoint Card */}
        <Card className="bg-gradient-to-br from-pink-900/40 to-slate-900/40 backdrop-blur-md border border-pink-500/30 shadow-2xl hover:shadow-pink-500/30 transition-all duration-500">
          <CardHeader className="border-b border-pink-500/20">
            <CardTitle className="flex items-center gap-2 text-2xl text-pink-300">
              <Send className="h-6 w-6" />
              POST /api/echo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-3">
              <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">cURL Example</p>
              <pre className="overflow-x-auto text-sm bg-slate-950/50 p-4 rounded-xl border border-pink-500/20">
                <code className="text-emerald-300">{`curl -X POST \\
-H 'x-api-key: <YOUR_KEY>' \\
-H 'content-type: application/json' \\
-d '{"hello":"world"}' \\
${baseUrl}/api/echo`}</code>
              </pre>
            </div>
            <div className="space-y-3">
              <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">JavaScript Example</p>
              <pre className="overflow-x-auto text-sm bg-slate-950/50 p-4 rounded-xl border border-pink-500/20">
                <code className="text-emerald-300">{`const r = await fetch('${baseUrl}/api/echo', {
  method: 'POST',
  headers: { 'x-api-key': process.env.MY_KEY!, 'content-type': 'application/json' },
  body: JSON.stringify({ hello: 'world' })
});`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Tester */}
        <Card className="bg-gradient-to-br from-slate-900/60 to-purple-900/60 backdrop-blur-md border border-purple-400/30 shadow-2xl">
          <CardHeader className="border-b border-purple-400/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent flex items-center gap-3">
              <Zap className="h-7 w-7 text-yellow-400" />
              Interactive API Tester
            </CardTitle>
            <p className="text-slate-300 mt-2">Test your API endpoints in real-time</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                API Key
              </Label>
              <Input
                placeholder="sk_..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="text-lg p-4 rounded-xl bg-slate-950/50 border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400 transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={runGET} 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                GET /api/echo
              </Button>
              <Button
                onClick={runPOST}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                POST /api/echo
              </Button>
              <Button 
                onClick={runOPTIONS} 
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold shadow-lg hover:shadow-pink-500/50 transition-all duration-300 flex items-center gap-2"
              >
                <Terminal className="h-4 w-4" />
                OPTIONS /api/echo
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold">POST Body (JSON)</Label>
              <Textarea
                rows={5}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="text-base p-4 rounded-xl bg-slate-950/50 border-purple-500/30 text-white font-mono placeholder-slate-500 focus:border-purple-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold">Response Output</Label>
              <Textarea
                readOnly
                value={out}
                placeholder="Response will appear here..."
                className="h-64 resize-y text-base p-4 font-mono rounded-xl bg-slate-950/70 border-purple-500/30 text-emerald-300 placeholder-slate-600"
                rows={16}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer Tip */}
        <div className="backdrop-blur-sm bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-400/20">
          <p className="text-center text-slate-200 text-lg">
            💡 <span className="font-semibold">Pro Tip:</span> All secured endpoints require the{" "}
            <code className="rounded-lg bg-purple-500/20 px-3 py-1 text-purple-300 font-mono text-sm border border-purple-500/30 mx-1">
              x-api-key
            </code>{" "}
            header. Manage your keys in the{" "}
            <Link
              href="/keys"
              className="font-semibold underline text-pink-300 hover:text-pink-200 transition-colors"
            >
              Key Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}