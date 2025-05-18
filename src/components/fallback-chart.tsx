import type React from "react"

interface FallbackChartProps {
  height?: number
  width?: string | number
  text?: string
}

export const FallbackChart: React.FC<FallbackChartProps> = ({
  height = 300,
  width = "100%",
  text = "Loading chart...",
}) => {
  return (
    <div
      style={{
        height,
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.03)",
        borderRadius: "8px",
      }}
    >
      <div style={{ textAlign: "center", color: "rgba(0, 0, 0, 0.45)" }}>{text}</div>
    </div>
  )
}
