"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useCursor } from "./ctx"

export const Cursor: React.FC = () => {
  const { cursorType, cursorColor, cursorText } = useCursor()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  // Define the cursor dimensions based on type
  const cursorDimensions = {
    square: { width: 10, height: 10 },
    line: { width: 3, height: 42 },
    "square-with-text": { width: 10, height: 10 },
  }

  if (!isVisible) return null

  return (
    <div className="fixed pointer-events-none z-50" style={{ left: 0, top: 0 }}>
      <motion.div
        animate={{
          width: cursorDimensions[cursorType].width,
          height: cursorDimensions[cursorType].height,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="absolute"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
          backgroundColor: cursorColor,
        }}
      />

      {/* Text that appears without animation for square-with-text type */}
      {cursorType === "square-with-text" && cursorText && (
        <div
          className="absolute text-sm font-medium uppercase"
          style={{
            left: position.x + 10,
            top: position.y + 10,
            color: cursorColor,
          }}
        >
          {cursorText}
        </div>
      )}
    </div>
  )
}
