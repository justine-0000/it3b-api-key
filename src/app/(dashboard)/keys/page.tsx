import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import CopyButton from "~/components/copy-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";

export default function KeysPage() {
  const sampleApiKey = "hhjghkgkgghjgyjfyjdthfthdd";

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg1.jpg')" }}
    >
      {/* -------------------- Page Overlay -------------------- */}
      <div className="backdrop-blur-sm bg-black/20 min-h-screen">

        {/* ---------------------- SIGNED OUT MESSAGE ---------------------- */}
        <SignedOut>
          <div className="flex h-screen w-full items-center justify-center text-center text-2xl font-semibold text-white">
            🚪 Please Sign in above to Continue!
          </div>
        </SignedOut>

        {/* ---------------------- SIGNED IN CONTENT ---------------------- */}
        <SignedIn>
          <div className="mx-auto max-w-5xl space-y-8 p-8">

            {/* ---------------------- TOP TOOLBAR ---------------------- */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                🔑 API Key Manager
              </h1>
              <Link href={"/docs"}>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-lg border-gray-300 bg-white/80 text-base text-gray-700 shadow-sm hover:bg-blue-600 hover:text-white transition"
                  aria-label="Open API Guide"
                >
                  <BookOpen className="h-5 w-5" />
                  API Documentation
                </Button>
              </Link>
            </div>

            {/* ---------------------- GENERATE KEY CARD ---------------------- */}
            <Card className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{ backgroundImage: "url('/card1.jpg')" }}
              />
              {/* Overlay for contrast */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Card Content */}
              <div className="relative p-6">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-white">
                    Generate API Key
                  </CardTitle>
                  <Button className="flex items-center gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                    <Plus className="h-5 w-5" />
                    Create
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Key Name (e.g production)"
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 bg-white/90 text-gray-900"
                  />
                </CardContent>
              </div>
            </Card>

            {/* ---------------------- NEW API KEY DISPLAY CARD ---------------------- */}
            <Card className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{ backgroundImage: "url('/card1.jpg')" }}
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative p-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">
                    Your New API Key
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-200">
                    Here is your API Key (visible once):
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-white/90 p-2">
                    <code className="break-all font-mono text-sm text-gray-900">
                      {sampleApiKey}
                    </code>
                    <CopyButton value={sampleApiKey} />
                  </div>
                  <p className="mt-2 text-xs text-gray-300">
                    💡 Save this key securely. You won’t be able to see it again.
                  </p>
                </CardContent>
              </div>
            </Card>

            {/* ---------------------- KEYS LIST CARD ---------------------- */}
            <Card className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{ backgroundImage: "url('/card-bg3.jpg')" }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative p-6">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-white">
                    Your Keys
                  </CardTitle>
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
                        <TableRow className="hover:bg-gray-50 transition">
                          <TableCell>Name of Key</TableCell>
                          <TableCell className="font-mono text-sm text-gray-800">
                            {sampleApiKey}
                          </TableCell>
                          <TableCell>8/22/2025</TableCell>
                          <TableCell>
                            <Badge variant="secondary">Revoked</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              className="rounded-md"
                            >
                              Revoke
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* ---------------------- SEPARATOR & TIP ---------------------- */}
            <Separator className="my-6" />
            <p className="text-center text-white">
              💡 Tip: Call secured endpoints with the{" "}
              <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-sm">
                x-api-key
              </code>{" "}
              header. See{" "}
              <Link
                className="font-medium underline text-blue-400 hover:text-indigo-300"
                href="/docs"
              >
                Docs
              </Link>
            </p>

          </div>
        </SignedIn>
      </div>
    </div>
  );
}
