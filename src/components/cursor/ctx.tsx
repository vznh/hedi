"use client"

import type React from "react"
import { createContext, useState, useContext } from "react"
import type { CursorContextType, CursorType } from "./types"

const CursorContext = createContext<CursorContextType | undefined>(undefined)

export const useCursor = () => {
  const context = useContext(CursorContext)
  if (context === undefined) {
    throw new Error("useCursor must be used within a CursorProvider")
  }
  return context
}

export const CursorProvider: React.FC<{
  children: React.ReactNode
  defaultType?: CursorType
  defaultColor?: string
}> = ({ children, defaultType = "square", defaultColor = "#002FA7" }) => {
  const [cursorType, setCursorType] = useState<CursorType>(defaultType)
  const [cursorColor, setCursorColor] = useState<string>(defaultColor)
  const [cursorText, setCursorText] = useState<string | null>(null)

  const value = {
    cursorType,
    cursorColor,
    cursorText,
    setCursorType,
    setCursorColor,
    setCursorText,
  }

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
}
