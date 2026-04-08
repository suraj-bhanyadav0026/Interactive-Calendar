// === FILE: SpiralBinding.jsx ===
import React from "react";

export function SpiralBinding() {
  return (
    <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", padding: "10px 10px 6px" }} aria-hidden="true">
      {Array.from({ length: 28 }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid #888",
            background: "radial-gradient(circle at 30% 30%, #ffffff 0%, #ececec 45%, #d1d1d1 100%)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5)",
          }}
        />
      ))}
    </div>
  );
}
