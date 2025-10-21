"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Key, BookOpen, Crown } from "lucide-react";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-gray-800 bg-black/50 backdrop-blur-md p-4 text-xl font-semibold sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-white hover:text-gray-300 transition-colors">
          <span className="text-2xl font-black">🏛️ Museum API</span>
        </Link>
        
        <SignedIn>
          <div className="flex items-center gap-3">
            <Link href="/keys">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10"
              >
                <Key className="w-4 h-4" />
                Keys
              </Button>
            </Link>
            
            <Link href="/docs">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-gray-300 hover:text-white hover:bg-white/10"
              >
                <BookOpen className="w-4 h-4" />
                Docs
              </Button>
            </Link>
            
            <Link href="/pricing">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                <Crown className="w-4 h-4" />
                Pricing
              </Button>
            </Link>
          </div>
        </SignedIn>
      </div>

      <div>
        <SignedOut>
          <div className="cursor-pointer">
            <SignInButton>
              <Button className="bg-white text-black hover:bg-gray-200">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}