"use client";

import * as React from "react";

import { AuroraText } from "@/ui/effects/aura-text";
import { ShineBorder } from "@/ui/effects/shine-border";
import { Divide, Loader2 } from "lucide-react";

export default function GuruButton() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();
  const [guruResponse, setGuruResponse] = React.useState<string>();

  async function onButtonClick() {
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://mensa.ulmiversitaet.de/api/v1/guru",
      );

      const jsonResponse = await response.json();

      console.log(jsonResponse);

      setGuruResponse(jsonResponse.message);
      setIsLoading(false);
    } catch (err) {
      console.error("[GURU]", err);
      setError("Es ist ein unerwarteter Guru-Fehler aufgetreten!");
      setIsLoading(false);
    }
  }

  return (
    <>
      {!isLoading && !error && !guruResponse && (
        <button
          onClick={onButtonClick}
          className="relative max-w-xs cursor-pointer rounded-xl py-4 transition-colors ease-in-out hover:bg-gradient-to-tl hover:from-[#A07CFE]/30 hover:via-[#FE8FB5]/30 hover:to-[#FFBE7B]/30 hover:duration-500"
        >
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={2}
            duration={10}
          />

          <span className="font-mono text-lg font-bold">
            💫✨ <AuroraText>Frage den Guru</AuroraText> ✨💫
          </span>
        </button>
      )}
      {isLoading && (
        <div className="flex max-w-xs items-center gap-4">
          <span className="font-mono text-lg font-bold">
            Der Guru denkt nach ... <Loader2 className="animate-spin" />
          </span>
        </div>
      )}
      {guruResponse && (
        <div className="relative m-4 w-full rounded-xl px-8 py-4">
          <ShineBorder
            shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            borderWidth={2}
            duration={10}
          />
          <AuroraText>{guruResponse}</AuroraText>
        </div>
      )}
      {error && (
        <div className="text-center">
          <span className="text-destructive text-lg font-bold">{error}</span>
        </div>
      )}
    </>
  );
}
