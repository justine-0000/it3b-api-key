"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookMarked, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

const baseUrl =
  typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

export default function DocsPage() {
  const [key, setKey] = useState("");
  const [out, setOut] = useState("");
  const [postBody, setPostBody] = useState("");

  async function runGET() {
    try {
      const res = await fetch(`${baseUrl}/api/ping`, {
        headers: { "x-api-key": key },
      });

      let data: unknown;
      try {
        data = (await res.json()) as unknown;
      } catch {
        data = { error: "No JSON returned", status: res.status };
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

  async function runPOST() {
    try {
      const res = await fetch(`${baseUrl}/api/echo`, {
        method: "POST",
        headers: { "x-api-key": key, "content-type": "application/json" },
        body: JSON.stringify({ postBody }),
      });

      const data: unknown = await res.json();
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
    <div className="relative min-h-screen">
      {/* Full-page background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        style={{ backgroundImage: "url('/bg1.jpg')" }}
      />
      <div className="fixed inset-0 bg-black/30 -z-5" />

      <div className="space-y-8 relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BookMarked /> API Guide
          </h1>
          <Link href="/keys">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg border-gray-300 bg-white/80 text-base text-gray-700 shadow-sm hover:bg-blue-600 hover:text-white transition"
            >
              <KeyRound className="h-5 w-5" />
              Key Dashboard
            </Button>
          </Link>
        </div>

        {/* Authentication & Base URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="relative bg-cover bg-center text-white shadow-lg overflow-hidden"
            style={{ backgroundImage: "url('/card1.jpg')" }}
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
            <div className="relative p-4 rounded-xl">
              <CardHeader>
                <CardTitle>How Authentication Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>
                  Authenticate using the <code>x-api-key</code> header. Create a key
                  in <code>/keys</code> and store it securely.
                </p>
                <Separator />
                <div>
                  <h3 className="font-semibold">Base URL</h3>
                  <pre className="overflow-x-auto">
                    <code>{baseUrl + "/api"}</code>
                  </pre>
                </div>
              </CardContent>
            </div>
          </Card>

          <Card
            className="relative bg-cover bg-center text-white shadow-lg overflow-hidden"
            style={{ backgroundImage: "url('/card1.jpg')" }}
          >
            <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
            <div className="relative p-4 rounded-xl">
              <CardHeader>
                <CardTitle>GET /api/ping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <pre className="overflow-x-auto text-sm">
                  <code>{`curl -H 'x-api-key: <YOUR_KEY>' \\
${baseUrl}/api/ping`}</code>
                </pre>
                <pre className="overflow-x-auto text-sm">
                  <code>{`const r = await fetch('${baseUrl}/api/ping', {
  headers: { 'x-api-key': process.env.MY_KEY! }
});`}</code>
                </pre>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* POST /api/echo */}
        <Card
          className="relative bg-cover bg-center text-white shadow-lg overflow-hidden"
          style={{ backgroundImage: "url('/card1.jpg')" }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
          <div className="relative p-4 rounded-xl">
            <CardHeader>
              <CardTitle>POST /api/echo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <pre className="overflow-x-auto text-sm">
                <code>{`curl -X POST \\
-H 'x-api-key: <YOUR_KEY>' \\
-H 'content-type: application/json' \\
-d '{"hello":"world"}' \\
${baseUrl}/api/echo`}</code>
              </pre>
              <pre className="overflow-x-auto text-sm">
                <code>{`const r = await fetch('${baseUrl}/api/echo', {
  method: 'POST',
  headers: { 'x-api-key': process.env.MY_KEY!, 'content-type': 'application/json' },
  body: JSON.stringify({ hello: 'world' })
});`}</code>
              </pre>
            </CardContent>
          </div>
        </Card>

        {/* Interactive Tester */}
        <Card
          className="relative bg-cover bg-center text-white shadow-lg overflow-hidden"
          style={{ backgroundImage: "url('/card1.jpg')" }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40" />
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
                className="text-lg p-3 rounded-lg"
              />

              <div className="flex flex-wrap gap-3">
                <Button onClick={runGET} className="text-lg px-6 py-3 rounded-xl">
                  Test GET /api/ping
                </Button>
                <Button
                  onClick={runPOST}
                  variant="secondary"
                  className="text-lg px-6 py-3 rounded-xl"
                >
                  Test POST /api/echo
                </Button>
              </div>

              <Label className="text-lg font-semibold">POST body (JSON)</Label>
              <Textarea
                rows={5}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="text-base p-4 rounded-lg bg-gray-100 text-black"
              />

              <Label className="text-lg font-semibold">Response</Label>
              <Textarea
                readOnly
                value={out}
                className="h-64 resize-y text-base p-4 font-mono rounded-lg bg-gray-100 text-black"
                rows={16}
              />
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
