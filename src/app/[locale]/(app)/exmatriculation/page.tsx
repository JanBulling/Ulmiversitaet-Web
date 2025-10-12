import SiteLayout from "@/layouts/site-layout";
import ExmatrikulationQuiz from "@/components/exmatriculation/exmatriculation-quiz";
import { Metadata } from "next";

// Wrong since already statically generated using internationalization
// export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Exmatrikulation",
  description:
    "Quiz zur Exmatrikulation, das dir helfen soll, zu entscheiden, ob du dich exmatrikulieren solltest.",
};

export default function ExmatriculationPage() {
  return (
    <SiteLayout>
      <div className="px-4">
        <h1 className="text-2xl font-bold">Exmatrikulation</h1>
        <p className="text-muted-foreground text-sm">
          Du bist dir nicht sicher, ob du das Studium weiterhin möchtest? Wir
          haben ein Quiz für dich erstellt, das dir helfen soll, zu entscheiden,
          ob du dich exmatrikulieren solltest.
        </p>
      </div>

      <div className="bg-card my-6 border px-4 py-6 shadow md:rounded-xl">
        <ExmatrikulationQuiz />
      </div>
    </SiteLayout>
  );
}
