import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";
import { Icons } from "@/ui/icons";
import { Heart, Users, Code, Shield, GraduationCap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useTranslations } from "next-intl";

export default function AboutUs() {
    const t = useTranslations("AboutPage");

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="h-8 w-8 text-primary" />
                    <h1 className="text-4xl font-bold">{t("title")}</h1>
                </div>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {t("subtitle")}
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
                                    {t("roleDeveloper")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-muted-foreground">
                            {t("bioJan")}
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
                                    {t("roleQA")}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <p className="text-muted-foreground">
                            {t("bioStefan")}
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
                        {t("missionTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("missionText")}
                    </p>
                </CardContent>
            </Card>

            {/* Independence Section */}
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                        <Icons.gitHub className="h-5 w-5" />
                        {t("independenceTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong>{t("important")}</strong> {t("independenceText")}
                    </p>
                </CardContent>
            </Card>

            {/* Contact Section */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("contactTitle")}</CardTitle>
                    <CardDescription>
                        {t("contactDescription")}
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
                    <span>{t("footerSlogan")}</span>
                </div>
            </div>
        </div>
    );
}
