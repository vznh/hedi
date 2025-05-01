// components/Guestboard.tsx
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Cookies from "js-cookie"
import { motion } from "framer-motion"

import { getGuestNotes, addGuestNote } from "@/services/GuestboardService";
import type { GuestNoteInterface } from "@/services/GuestboardService";

interface Note {
  id: string
  x: number
  y: number
  city: string
  message: string
  color: string
  textColor: string
}

interface Position {
  x: number
  y: number
}

const COOKIE_NAME = "guestboard_signed"
const COOKIE_EXPIRY = 365 // days

export default function Guestboard() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isPlacing, setIsPlacing] = useState(false)
  const [city, setCity] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 })
  const [cursorPos, setCursorPos] = useState<Position>({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const [cursorColor, setCursorColor] = useState<string>("#333333")
  const [cursorTextColor, setCursorTextColor] = useState<string>("#cccccc")
  const [cursorMessage, setCursorMessage] = useState<string>("")
  const boardRef = useRef<HTMLDivElement>(null)
  const [hasSignedBefore, setHasSignedBefore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      setIsLoading(true);

      try {
        const guestNotes = await getGuestNotes();
        const formattedNotes: Note[] = guestNotes.map(note => {
          const { color, textColor } = getRandomDarkColor();

          return {
            id: note.id || Date.now().toString(),
            x: note.position.x,
            y: note.position.y,
            city: note.city || "Somewhere",
            message: note.message || `Hello from ${note.city}`,
            color,
            textColor
          };
        });

        setTimeout(() => {
          setNotes(formattedNotes);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        let errorMessage = "";
        errorMessage += "* Error loading notes.\n";
        errorMessage += error;
        console.error(errorMessage);
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Check if user has already signed the guestboard and request geolocation automatically
  useEffect(() => {
    const hasSigned = Cookies.get(COOKIE_NAME) === "true"
    setHasSignedBefore(hasSigned)

    if (!hasSigned) {
      requestGeolocation()
    }
  }, [])

  // Generate a random dark monochrome color
  const getRandomDarkColor = () => {
    // Generate a dark grayscale color (between #222222 and #666666)
    const value = Math.floor(Math.random() * 68) + 34 // 34-102 in decimal (darker range)
    const hex = value.toString(16).padStart(2, "0")
    const color = `#${hex}${hex}${hex}`

    // Invert the color for text
    const invertedValue = 255 - value
    const invertedHex = invertedValue.toString(16).padStart(2, "0")
    const invertedColor = `#${invertedHex}${invertedHex}${invertedHex}`

    return { color, textColor: invertedColor }
  }

  const getRandomGreeting = (city: string) => {
    const greetings = [
      `Hello from ${city}`,
      `Someone says hi from ${city}`,
      `Someone from ${city} was here`,
      `Hailing from ${city}`,
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  // Request geolocation
  const requestGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Use reverse geocoding to get city name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10`,
            )
            const data = await response.json()

            // Extract city from response (address.city or address.town or address.village)
            const cityName = data.address.city || data.address.town || data.address.village || null

            if (cityName) {
              setCity(cityName)
              const message = getRandomGreeting(cityName)
              setCursorMessage(message)

              // Generate random color for cursor
              const { color, textColor } = getRandomDarkColor()
              setCursorColor(color)
              setCursorTextColor(textColor)

              setIsPlacing(true)
            }
          } catch (error) {
            console.error("Error getting location:", error)
          }
        },
        (error) => {
          console.log("Geolocation error:", error)
          // Silently fail - no error message
        },
      )
    }
  }

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePos({ x, y })
      }
    }

    if (isPlacing && boardRef.current) {
      boardRef.current.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      if (boardRef.current) {
        boardRef.current.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [isPlacing])

  // Spring animation for cursor
  useEffect(() => {
    if (!isPlacing) return

    // Spring animation parameters
    const springStrength = 0.15 // Lower = more delay, Higher = less delay

    const updateCursorPosition = (time: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = time
      }

      // Calculate new position with spring physics
      const dx = mousePos.x - cursorPos.x
      const dy = mousePos.y - cursorPos.y

      // Apply spring force
      const newX = cursorPos.x + dx * springStrength
      const newY = cursorPos.y + dy * springStrength

      setCursorPos({ x: newX, y: newY })

      // Continue animation
      animationRef.current = requestAnimationFrame(updateCursorPosition)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(updateCursorPosition)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        lastTimeRef.current = 0
      }
    }
  }, [isPlacing, mousePos, cursorPos])

  const handlePlaceNote = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacing || !boardRef.current || !city || hasSignedBefore) return

    const rect = boardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Generate a new random color for the placed note
    const { color, textColor } = getRandomDarkColor()

    const newNote: Note = {
      id: Date.now().toString(),
      x,
      y,
      city,
      message: cursorMessage,
      color,
      textColor,
    }

    setNotes([...notes, newNote])

    try {
      await addGuestNote({
        name: "",
        city: city,
        message: cursorMessage,
        position: {
          x: x,
          y: y,
        }
      });
    } catch (error) {
      let errorMessage = "";
      errorMessage += "* Error saving note.\n";
      errorMessage += error;
      console.error(errorMessage);
    }

    // Set cookie to prevent adding more notes
    Cookies.set(COOKIE_NAME, "true", { expires: COOKIE_EXPIRY })
    setHasSignedBefore(true)
    setIsPlacing(false)
  }

  return (
    <div
      ref={boardRef}
      className={`relative w-full h-full bg-slate-100 overflow-hidden ${isPlacing ? "cursor-none" : "cursor-default"}`}
      onClick={handlePlaceNote}
    >
      {isPlacing && city && !hasSignedBefore && (
        <div
          className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-50"
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        >
          <div
            className="w-[150px] h-[75px] p-3 shadow-md rotate-3 flex items-start justify-start text-left text-sm"
            style={{
              backgroundColor: cursorColor,
              color: cursorTextColor,
            }}
          >
            <p className="uppercase">{cursorMessage}</p>
          </div>
        </div>
      )}

      {notes.map((note) => (
        <motion.div
          key={note.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${note.x}%`, top: `${note.y}%` }}
          initial={{ rotate: Math.random() * 6 - 3 }}
          whileHover={{
            height: "60px", // Decrease height from 75px to 60px
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            y: -5, // Lift up slightly
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            className="p-3 shadow-md max-w-[200px] h-[75px] flex items-start justify-start text-left"
            style={{
              backgroundColor: note.color,
              color: note.textColor,
            }}
          >
            <p className="text-sm uppercase">{note.message}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
