import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Icons } from "@/ui/icons";
import { Heart, Users, Code, Shield, GraduationCap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function AboutUs() {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">Über uns</h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Zwei Physik-Masterstudenten, die das Studierendenleben an der Uni Ulm einfacher und übersichtlicher gestalten wollten.
                </p>
            </div>

            {/* Team Section */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Jan Bulling */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                    <CardHeader className="relative">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                    src="/img/jan.jpg"
                                    alt="Jan Bulling"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Jan Bulling</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Code className="h-4 w-4" />
                                    Entwickler der Website
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-muted-foreground">
                            Jan studiert Physik im Master an der Uni Ulm und entwickelt die Ulmiversität-Website. Mit seinem technischen Hintergrund und Interesse an Webentwicklung hat er diese Plattform erstellt, um Studierenden den Unialltag zu erleichtern.
                        </p>
                    </CardContent>
                </Card>

                {/* Stefan Rau */}
                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10" />
                    <CardHeader className="relative">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <img
                                    src="/img/stefan.jpg"
                                    alt="Stefan Rau"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Stefan Rau</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Qualitätssicherung
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-muted-foreground">
                            Stefan studiert ebenfalls Physik im Master an der Uni Ulm und kümmert sich um die Qualitätssicherung der Website. Er sorgt dafür, dass alle Inhalte korrekt und aktuell sind und die Bedürfnisse der Studierenden erfüllt werden.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            {/* Mission Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-red-500" />
                        Unser Ziel
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        Als Studierende kennen wir die typischen Probleme des Unialltags: Hörsäle finden, Mensa-Speisepläne checken, wichtige Termine im Blick behalten. Mit der Ulmiversität-Website wollten wir eine zentrale Anlaufstelle schaffen, die diese Informationen übersichtlich und schnell zugänglich macht.
                    </p>
                </CardContent>
            </Card>

            {/* Independence Section */}
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <Icons.gitHub className="h-5 w-5" />
                        Unabhängigkeit
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong>Wichtig:</strong> Wir sind vollständig unabhängig von der Universität Ulm und der Studierendenvertretung (StuVe). Diese Plattform entwickeln wir extern und aus eigenem Antrieb heraus.
                    </p>
                </CardContent>
            </Card>

            {/* Contact Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Kontakt & Feedback</CardTitle>
                    <CardDescription>
                        Habt ihr Fragen, Anregungen oder Feedback? Wir freuen uns über eure Nachrichten!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Icons.gitHub className="h-4 w-4" />
                                GitHub
                                <ExternalLink className="h-3 w-3" />
                            </Button>
                        </Link>
                        <Link href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="flex items-center gap-2">
                                <Icons.instagram className="h-4 w-4" />
                                Instagram
                                <ExternalLink className="h-3 w-3" />
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Von Studierenden für Studierende</span>
                </div>
            </div>
        </div>
    );
}
