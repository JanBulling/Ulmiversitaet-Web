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

  async function guruRequest() {
    setState("LOADING");

    try {
      const response = await fetch(
        "https://mensa.ulmiversitaet.de/api/v1/guru",
        {
          headers: {
            Authorization: `Bearer ${process.env.GURU_SECRET}`,
          },
        },
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
        <div className="relative flex h-32 w-full items-center justify-center gap-2 overflow-x-clip text-white">
          <SmokeEffect className="absolute h-full w-full" />
          <span className="z-10 font-mono">Der Guru denkt nach</span>
          <Loader2 className="animate-spin" />
        </div>
      )}
      {state === "ERROR" && (
        <div className="border-destructive text-destructive mx-4 w-full max-w-xl rounded-xl border-2 px-2 py-4 text-center font-semibold">
          {content}
        </div>
      )}
      {state === "SUCCESS" && (
        <div className="relative mx-4 w-full max-w-xl rounded-xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-indigo-400/20 px-2 py-4 text-center font-mono text-sm font-semibold">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={2}
            duration={10}
          />
          {content}
        </div>
      )}
    </div>
  );
}
