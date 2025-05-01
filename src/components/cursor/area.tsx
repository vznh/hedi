"use client"

import type React from "react"
import { useCallback } from "react"
import { useCursor } from "./ctx"
import type { CursorAreaProps } from "./types"

export const CursorArea: React.FC<CursorAreaProps> = ({
  type,
  className = "",
  style = {},
  children,
  text = "info",
  color = "#002FA7",
  devMode = false,
}) => {
  const { setCursorType, setCursorColor, setCursorText } = useCursor()

  const handleMouseEnter = useCallback(() => {
    setCursorType(type)
    setCursorColor(color)
    if (type === "square-with-text") {
      setCursorText(text)
    }
  }, [type, color, text, setCursorType, setCursorColor, setCursorText])

  const handleMouseLeave = useCallback(() => {
    setCursorType("square")
    setCursorColor("#002FA7")
    setCursorText(null)
  }, [setCursorType, setCursorColor, setCursorText])

  const devStyles = devMode
    ? {
        border: "1px dashed rgba(0, 0, 0, 0.2)",
        position: "relative",
      }
    : {}

  return (
    <div
      className={`cursor-none ${className}`}
      style={{
        ...style,
        ...(devStyles as React.CSSProperties)
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {devMode && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            background: "rgba(0, 0, 0, 0.1)",
            color: "#000",
            fontSize: "10px",
            padding: "2px 4px",
            pointerEvents: "none",
          }}
        >
          {type}
        </div>
      )}
      {children}
    </div>
  )
}
