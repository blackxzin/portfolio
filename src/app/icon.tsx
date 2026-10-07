import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#09090c",
          fontFamily: "Georgia, serif",
        }}
      >
        <span style={{ color: "#ff334f", fontSize: 22, fontStyle: "italic" }}>L</span>
      </div>
    ),
    size
  );
}
