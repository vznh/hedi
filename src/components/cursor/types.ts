import type React from "react"
export type CursorType = "square" | "line" | "square-with-text"

export interface CursorAreaProps {
  type: CursorType
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  text?: string
  color?: string
  devMode?: boolean
}

export interface CursorProviderProps {
  defaultType?: CursorType
  defaultColor?: string
  children: React.ReactNode
}

export interface CursorContextType {
  cursorType: CursorType
  cursorColor: string
  cursorText: string | null
  setCursorType: (type: CursorType) => void
  setCursorColor: (color: string) => void
  setCursorText: (text: string | null) => void
}
