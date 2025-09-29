import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

type FontAsset = {
  name: string;
  data: Buffer;
  weight: 400 | 600;
  style: "normal";
};
type ImageAsset = string;

async function loadAssets(): Promise<{
  fontAsset: FontAsset[];
  imageAsset: ImageAsset[];
}> {
  const [base64Logo] = await Promise.all([
    readFile(join(process.cwd(), "public", "logo.png"), "base64"),
  ]);

  const [
    { base64Font: normal },
    { base64Font: mono },
    { base64Font: semibold },
  ] = await Promise.all([
    import("./geist-regular-otf.json").then((mod) => mod.default || mod),
    import("./geistmono-regular-otf.json").then((mod) => mod.default || mod),
    import("./geist-semibold-otf.json").then((mod) => mod.default || mod),
  ]);

  return {
    imageAsset: [`data:image/png;base64,${base64Logo}`],
    fontAsset: [
      {
        name: "Geist",
        data: Buffer.from(normal, "base64"),
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Geist Mono",
        data: Buffer.from(mono, "base64"),
        weight: 400 as const,
        style: "normal" as const,
      },
      {
        name: "Geist",
        data: Buffer.from(semibold, "base64"),
        weight: 600 as const,
        style: "normal" as const,
      },
    ],
  };
}

const size = {
  width: 1200,
  height: 630,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Ulmiversität";
  const description =
    searchParams.get("description") ||
    "Inoffizielle Management-Seite der Universität Ulm";

  const { fontAsset, imageAsset } = await loadAssets();
  const [logo] = imageAsset;

  // 🎨 Design colors
  // const colors = {
  //   background: "#f9fafb",
  //   foreground: "#111827",
  //   muted: "#f3f4f6",
  //   mutedForeground: "#6b7280",
  //   primary: "#8199a9",
  //   secondary: "#b2c0cb",
  //   white: "#ffffff",
  // };
  const darkColors = {
    background: "#17171c",
    foreground: "#fafafa",
    muted: "#262626",
    mutedForeground: "#a1a1a1",
    primary: "#8199a9",
    secondary: "#b2c0cb",
    white: "#ffffff",
  };

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          background: `linear-gradient(135deg, ${darkColors.secondary} 0%, ${darkColors.primary} 100%)`,
          color: darkColors.foreground,
        }}
      >
        {/* Header / Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 48,
          }}
        >
          <img src={logo} height={90} style={{ filter: "invert(1)" }} />
          <p
            style={{
              fontSize: 64,
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-1px",
            }}
          >
            <span style={{ color: darkColors.primary }}>Ulm</span>iversität
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            borderRadius: 32,
            background: `${darkColors.muted}44`,
            backdropFilter: "blur(24px)",
            border: `1px solid ${darkColors.muted}`,
            padding: "56px",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                fontSize: 72,
                fontWeight: 700,
                margin: 0,
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <div
              style={{
                height: 6,
                width: "800px",
                backgroundColor: darkColors.primary,
                borderRadius: 4,
                margin: "-20px auto 0",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 40,
              fontWeight: 400,
              margin: "24px 0 0",
              maxWidth: "80%",
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontAsset,
    },
  );
}
