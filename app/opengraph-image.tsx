import { ImageResponse } from "next/og";

export const alt = "Vigil — intrusion alerts without cameras";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0a0a0a", color: "#f5f5f5" }}>
        <div style={{ fontSize: 40, color: "#fcd34d" }}>Vigil</div>
        <div style={{ fontSize: 68, marginTop: 24, lineHeight: 1.1 }}>Intrusion alerts for your home, without cameras</div>
        <div style={{ fontSize: 30, marginTop: 32, color: "#a3a3a3" }}>You, then your trusted contacts, then a person. Student demo.</div>
      </div>
    ),
    size
  );
}
