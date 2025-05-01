"use client"

import type React from "react"
import { CursorProvider } from "./ctx"
import { Cursor } from "./cursor"

interface CursorOverlayProps {
  children: React.ReactNode
  devMode?: boolean
  defaultCursorType?: "square" | "line" | "square-with-text"
  defaultCursorColor?: string
}

export const CursorOverlay: React.FC<CursorOverlayProps> = ({
  children,
  devMode = false,
  defaultCursorType = "square",
  defaultCursorColor = "#002FA7",
}) => {
  return (
    <CursorProvider defaultType={defaultCursorType} defaultColor={defaultCursorColor}>
      <div className="cursor-overlay">
        {children}
        <Cursor />
      </div>
    </CursorProvider>
  )
}
