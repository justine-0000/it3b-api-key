"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Check, Copy } from "lucide-react";

type Props = {value: string; ariaLabel?: string};
export default function CopyButton({
    value,
     ariaLabel="Copy to Clipboard",
    }: Props){
    const [ok, setOK] = useState(false);

        return(
           <Button 
           variant={"outline"}
           size={"sm"}
           onClick={async() =>{ navigator.clipboard.writeText(value);
            setOK(true);
            setTimeout(() => setOK(false), 2000);
           }}
           aria-label={ariaLabel}
           >
            {/* {ok ? "Copied!" : "Copy"} */}
            {ok ? (
                <div className="flex flex-row items-center gap-2">
            <Check /> Copied
            </div>
         ):(
            <div className="flex flex-row items-center gap-2">
          <Copy />Copy
          </div>
          )}
           </Button> 
        );
    }