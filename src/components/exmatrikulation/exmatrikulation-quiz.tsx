"use client";

import * as React from "react";
import { Button } from "@/ui/button";
import { CheckIcon, Share2 } from "lucide-react";

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
  const [started, setStarted] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [showResult, setShowResult] = React.useState(false);
  const [hasCopied, setHasCopied] = React.useState(false);

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
    setCurrentQuestionIndex(0);
    setStarted(false);
    setHasCopied(false);
  }

  async function handleShare() {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    try {
      setHasCopied(true);
      navigator.clipboard.writeText(window.location.href);
    } catch {
      // noop
    }
  }

  return (
    <div className="space-y-8">
      {!started && !showResult && (
        <div className="flex h-24 flex-col items-center justify-center gap-4 py-16 text-center">
          <p className="text-normal">Exmatrikulations-Quiz starten?</p>
          <Button onClick={() => setStarted(true)} className="w-full sm:w-auto">
            Los geht&apos;s
          </Button>
        </div>
      )}

      {started && !showResult && (
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
              disabled={hasCopied}
            >
              {hasCopied ? <CheckIcon /> : <Share2 />}
              {hasCopied ? "Link kopiert!" : "Share"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
