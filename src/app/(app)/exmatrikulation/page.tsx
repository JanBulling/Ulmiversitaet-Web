import SiteLayout from "@/layouts/site-layout";
import ExmatrikulationQuiz from "@/components/exmatrikulation/exmatrikulation-quiz";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exmatrikulation",
    description:
        "Quiz zur Exmatrikulation, das dir helfen soll, zu entscheiden, ob du dich exmatrikulieren solltest.",
};


export default function ExmatrikulationPage() {
    return (
        <SiteLayout>
            <div className="px-4">
                <h1 className="text-2xl font-bold">Exmatrikulation</h1>
                <p className="text-muted-foreground text-sm">
                    Du bist dir nicht sicher, ob du das Studium weiterhin möchtest?
                    Wir haben ein Quiz für dich erstellt, das dir helfen soll,
                    zu entscheiden, ob du dich exmatrikulieren solltest.
                </p>
            </div>

            <div className="my-6 border bg-card shadow px-4 py-6 md:rounded-xl">
                <ExmatrikulationQuiz />
            </div>
        </SiteLayout>
    );
}


