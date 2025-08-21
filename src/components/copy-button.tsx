"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

type Props = { value: string; ariaLabel?: string };

export default function CopyButton({
  value,
  ariaLabel = "Copy to Clipboard",
}: Props) {
  const [ok, setOK] = useState(false);

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value); // ✅ await the promise
          setOK(true);
          setTimeout(() => setOK(false), 2000);
        } catch (err) {
          console.error("Failed to copy text:", err);
        }
      }}
      aria-label={ariaLabel}
    >
      {ok ? (
        <div className="flex flex-row items-center gap-2">
          <Check /> Copied
        </div>
      ) : (
        <div className="flex flex-row items-center gap-2">
          <Copy /> Copy
        </div>
      )}
    </Button>
  );
}
