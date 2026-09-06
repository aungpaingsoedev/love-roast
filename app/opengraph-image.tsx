import { ImageResponse } from "next/og";

export const alt = "LoveRoast — We test your love. Then we roast it.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #e11d48 0%, #db2777 50%, #ea580c 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 64, fontWeight: 900 }}>❤️ LoveRoast</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 24,
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          <div style={{ display: "flex" }}>We test your love.</div>
          <div style={{ display: "flex" }}>Then we roast it. 😂❤️</div>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 26, opacity: 0.92 }}>
          Funny love calculator · relationship chaos · viral roasts
        </div>
      </div>
    ),
    { ...size }
  );
}
