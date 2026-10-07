import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090c",
          color: "#ececea",
          padding: "80px 96px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a3a29d",
          }}
        >
          {profile.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 104, lineHeight: 1 }}>{profile.name.split(" ")[0]}</span>
          <span
            style={{
              fontSize: 104,
              lineHeight: 1,
              fontStyle: "italic",
              color: "#ff334f",
              fontFamily: "Georgia, serif",
            }}
          >
            {profile.name.split(" ").slice(1).join(" ")}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 2,
            color: "#a3a29d",
            borderTop: "1px solid rgba(236,236,234,0.2)",
            paddingTop: 32,
          }}
        >
          <span>{profile.location}</span>
          <span style={{ color: "#ff334f" }}>{profile.status}</span>
        </div>
      </div>
    ),
    size
  );
}
