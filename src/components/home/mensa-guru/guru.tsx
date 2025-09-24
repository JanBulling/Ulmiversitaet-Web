"use client";

import * as React from "react";
import GuruButton from "./guru-btn";
import SmokeEffect from "./smoke-effect";
import { ShineBorder } from "@/ui/effects/shine-border";
import { Loader2 } from "lucide-react";

type GuruState = "INITIAL" | "LOADING" | "ERROR" | "SUCCESS";

export default function MensaGuru() {
  const [state, setState] = React.useState<GuruState>("INITIAL");
  const [content, setContent] = React.useState<string>();
  const [typedText, setTypedText] = React.useState<string>("");

  React.useEffect(() => {
    if (state === "SUCCESS" && content) {
      setTypedText("");
      let index = 0;
      const speedMs = 5;
      const interval = setInterval(() => {
        index += 1;
        setTypedText(content.slice(0, index));
        if (index >= content.length) {
          clearInterval(interval);
        }
      }, speedMs);

      return () => clearInterval(interval);
    }
  }, [state, content]);

  async function guruRequest() {
    setState("LOADING");

    try {
      const response = await fetch(
        "https://mensa.ulmiversitaet.de/api/v1/guru",
      );
      const jsonResponse = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setContent(jsonResponse["message"]);
      setState("SUCCESS");
    } catch (error) {
      console.error("[GURU]", "General Error", error);
      setState("ERROR");
      setContent("Es ist ein unerwarteter Guru-Fehler aufgetreten!");
    }
  }

  return (
    <div className="flex w-full items-center justify-center">
      {state === "INITIAL" && (
        <GuruButton onClick={guruRequest} className="mx-4" />
      )}
      {state === "LOADING" && (
        <div className="relative flex h-32 w-full items-center justify-center gap-2 overflow-x-clip">
          <SmokeEffect className="absolute h-full w-full" />
          <span className="z-10 font-mono">Der Guru denkt nach</span>
          <Loader2 className="z-10 animate-spin" />
        </div>
      )}
      {state === "ERROR" && (
        <div className="border-destructive text-destructive mx-4 w-full max-w-xl rounded-xl border-2 px-2 py-4 text-center font-semibold">
          {content}
        </div>
      )}
      {state === "SUCCESS" && (
        <div className="relative mx-4 w-full max-w-xl rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-600 px-3 py-4 font-mono text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]">
          {/*<ShineBorder
            shineColor={["#22d3ee", "#60a5fa", "#ec4899"]}
            borderWidth={2}
            duration={10}
          /> */}
          <span aria-live="polite">
            {typedText}
            {typedText.length < (content?.length ?? 0) && (
              <span className="animate-pulse">▋</span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}
