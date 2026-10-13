import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "BigRedHub â€” YouTube Shorts comments, turned into tracked sales.";

// next/og ships a single regular-weight face, so every bold weight silently
// renders as regular. These are the same Geist files next/font/google already
// loads for the site, vendored so the share card matches the app.
export const runtime = "nodejs";

const fontDir = join(process.cwd(), "src", "fonts");

async function loadFonts() {
  const [regular, bold] = await Promise.all([
    readFile(join(fontDir, "geist-regular.woff")),
    readFile(join(fontDir, "geist-bold.woff")),
  ]);
  return [
    {
      name: "Geist",
      data: regular,
      style: "normal" as const,
      weight: 400 as const,
    },
    {
      name: "Geist",
      data: bold,
      style: "normal" as const,
      weight: 700 as const,
    },
  ];
}

// Diagonal gradient sampled from brand/bigredhub-mark-512.png (top-left -> bottom-right).
const RED_LIGHT = "#E13542";
const RED_DEEP = "#CC213F";
const INK = "#09090B";

function Mark({ size: px }: { size: number }) {
  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: Math.round(px * 0.24),
        backgroundImage: `linear-gradient(135deg, ${RED_LIGHT} 0%, ${RED_DEEP} 100%)`,
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.round(px * 0.46),
        fontWeight: 700,
        letterSpacing: -Math.round(px * 0.03),
      }}
    >
      BR
    </div>
  );
}

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: INK,
          backgroundImage: `radial-gradient(900px 520px at 8% 0%, ${RED_DEEP}3D 0%, ${INK} 70%)`,
          padding: 80,
          fontFamily: "Geist",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Mark size={132} />
            <div
              style={{
                display: "flex",
                marginLeft: 34,
                fontSize: 74,
                fontWeight: 700,
                letterSpacing: -3,
                color: "#FFFFFF",
              }}
            >
              Big
              <span style={{ color: RED_LIGHT }}>Red</span>
              Hub
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 62,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1.15,
                color: "#FFFFFF",
                maxWidth: 940,
              }}
            >
              YouTube comments, turned into tracked sales.
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 32,
                color: "#A1A1AA",
                maxWidth: 940,
              }}
            >
              Detect buyer intent, auto-reply, and link every comment to a
              trackable destination.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              color: "#71717A",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 44,
                height: 4,
                marginRight: 20,
                borderRadius: 2,
                backgroundImage: `linear-gradient(90deg, ${RED_LIGHT} 0%, ${RED_DEEP} 100%)`,
              }}
            />
            bigredhub.info
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: await loadFonts(),
    },
  );
}