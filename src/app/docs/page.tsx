import { SignedIn, SignedOut } from "@clerk/nextjs";
import { BookMarked, KeyRound } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function DocsPage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/bg1.jpg')" }} // same background as KeysPage
    >
      <div className="backdrop-blur-sm bg-black/20 min-h-screen">
        {/* Show if user is NOT signed in */}
        <SignedOut>
          <div className="flex h-screen w-full items-center justify-center text-center text-2xl font-semibold text-white">
            🚪 Please Sign in above to Continue!
          </div>
        </SignedOut>

        {/* Show if user IS signed in */}
        <SignedIn>
          <div className="mx-auto max-w-4xl space-y-8 p-8">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <BookMarked /> API Guide
              </h1>
              <Link href="/keys">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 rounded-lg border-gray-300 bg-white/80 text-base text-gray-700 shadow-sm hover:bg-blue-600 hover:text-white transition"
                  aria-label="Open Key Dashboard"
                >
                  <KeyRound className="h-5 w-5" />
                  Key Dashboard
                </Button>
              </Link>
            </div>

            {/* Intro Section */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{ backgroundImage: "url('/card1.jpg')" }}
              />
              {/* Overlay for contrast */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Content */}
              <div className="relative p-6">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Welcome to the API Guide 🚀
                </h2>
                <p className="text-gray-200 leading-relaxed">
                  This guide will help you get started with using your API keys to
                  access secure endpoints. You’ll find examples, tips, and best
                  practices on how to make requests safely and effectively.
                </p>
              </div>
            </div>

            {/* Tip Section */}
            <p className="text-center text-white">
              💡 Tip: You can always manage your keys in the{" "}
              <Link
                href="/keys"
                className="font-medium underline text-blue-400 hover:text-indigo-300"
              >
                Key Dashboard
              </Link>
              .
            </p>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
