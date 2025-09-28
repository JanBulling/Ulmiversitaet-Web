"use client";

import * as React from "react";
import { Button } from "@/ui/button";
import { CheckIcon, Share2, WineOff } from "lucide-react";

const pdfURL =
  "https://www.uni-ulm.de/fileadmin/website_uni_ulm/studium/Studienorganisation/Beurlaubung__Rueckmeldung_und_Exmatrikulation/Exmatrikulation/antrag_exmatrikulation_WEB.pdf";

const questions = [
  "Bist du mit deinem Studium insgesamt zufrieden?",
  "Hast du das Gefühl, dass dein Studiengang zu dir passt?",
  "Kommst du mit der Studienbelastung gut zurecht?",
  "Findest du die Mensapreise angemessen?",
  "Siehst du eine klare Perspektive nach dem Abschluss?",
  "Hast du genügend Unterstützung (z. B. Beratung, Freundeskreis)?",
  "Motiviert dich der Studieninhalt?",
  "Würdest du deinen Studiengang erneut wählen?",
];

export default function ExmatrikulationQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    React.useState<number>(-1);
  const [showResult, setShowResult] = React.useState<boolean>(false);
  const [hasCopied, setHasCopied] = React.useState<string>();

  const isLastQuestion = currentQuestionIndex >= questions.length - 1;

  function handleJa() {
    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }

  function handleNein() {
    setShowResult(true);
  }

  function handleRestart() {
    setShowResult(false);
    setCurrentQuestionIndex(-1);
    setHasCopied(undefined);
  }

  async function handleShare() {
    if (typeof window === "undefined") return;

    const currentURL = window.location.href;

    const shareData = {
      title: "Soll ich mich exmatrikulieren?",
      text: "Quiz der Ulmiversität, ob eine Exmatrikulation für dich das Richtige wäre.",
      url: currentURL,
    };

    try {
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        setHasCopied("Seite geteilt");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentURL);
        setHasCopied("Link kopiert!");
      } else {
        setHasCopied("Teilen nicht möglich");
      }
    } catch {
      setHasCopied("Teilen nicht möglich");
    }
  }

  return (
    <div className="space-y-8">
      {currentQuestionIndex === -1 && !showResult && (
        <div className="flex h-24 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-normal">Exmatrikulations-Quiz starten?</p>
          <Button
            onClick={() => setCurrentQuestionIndex(0)}
            className="w-full sm:w-auto"
          >
            Los geht&apos;s
          </Button>
        </div>
      )}

      {currentQuestionIndex >= 0 && !showResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Frage {currentQuestionIndex + 1} von {questions.length}
            </p>
          </div>

          <div className="text-lg font-medium">
            {questions[currentQuestionIndex]}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleJa} variant="default">
              Ja
            </Button>
            <Button onClick={handleNein} variant="secondary">
              Nein
            </Button>
          </div>
        </div>
      )}

      {showResult && (
        <div className="space-y-6 pt-6">
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-muted-foreground">Die Ulmiversität empfielt:</p>
            <h2 className="text-2xl font-extrabold tracking-tight md:text-5xl">
              EXMATRIKULIERE DICH. JETZT.
            </h2>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={pdfURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button>Zum Antrag auf Exmatrikulation</Button>
            </a>
            <Button variant="outline" onClick={handleRestart}>
              Quiz erneut starten
            </Button>
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={handleShare}
              disabled={!!hasCopied}
            >
              {hasCopied ? <CheckIcon /> : <Share2 />}
              {hasCopied ?? "Teilen"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
