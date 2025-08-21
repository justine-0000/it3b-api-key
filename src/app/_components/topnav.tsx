import { SignedIn, SignedOut,SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";

export function TopNav(){
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl 
    font-semibold">
        <div>API-keys</div>
        <div>
            <SignedOut>
                <div className="cursor-pointer">                    
                <SignInButton></SignInButton>
                </div>
            </SignedOut>
            <SignedIn>
             {/*<SignOutButton>Sign Out</SignOutButton>*/}
             <UserButton />
            </SignedIn>
        </div>
    </nav>
  );
}
