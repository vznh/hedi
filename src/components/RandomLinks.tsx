"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobile } from "@/hooks/useMobile"

interface Link {
  id: number
  text: string
  url: string
}

interface Position {
  x: number
  y: number
}

interface AnimatedRandomLinksProps {
  links: Link[]
}

// Die symbols array
const dieSymbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"]

// Dark aura colors (grayscale as in your remote version)
const auraColors = [
  "rgba(0, 0, 0, 0.6)",
  "rgba(20, 20, 20, 0.6)",
  "rgba(30, 30, 30, 0.6)",
  "rgba(40, 40, 40, 0.6)",
  "rgba(50, 50, 50, 0.6)",
  "rgba(60, 60, 60, 0.6)",
]

// Updated placeholder texts from your remote version
const placeholderTexts = ["fortuitous?", "chaos theory doesn't apply here", "nice", "beautiful"]

export default function AnimatedRandomLinks({ links }: AnimatedRandomLinksProps) {
  const [positions, setPositions] = useState<Position[]>([])
  const [shuffleCount, setShuffleCount] = useState(0)
  const [currentDie, setCurrentDie] = useState(0) // Index of current die symbol
  const [isShufflingDie, setIsShufflingDie] = useState(false)
  const [isShufflingLinks, setIsShufflingLinks] = useState(false)
  const [auraColor, setAuraColor] = useState(auraColors[0])
  const [remainingShuffles, setRemainingShuffles] = useState(0)
  const [showText, setShowText] = useState(false)
  const [randomText, setRandomText] = useState("")
  const isMobile = useMobile()

  // Generate random positions for each link
  const generatePositions = useCallback(() => {
    // Get the container dimensions
    const containerWidth = window.innerWidth
    const containerHeight = window.innerHeight

    // Updated bounds from your remote version
    const boundWidth = containerWidth * 0.2
    const boundHeight = containerHeight * 0.2
    const boundLeft = containerWidth * 0.4
    const boundTop = containerHeight * 0.4

    // Generate a position for each link
    const newPositions = links.map(() => {
      return {
        x: boundLeft + Math.random() * boundWidth,
        y: boundTop + Math.random() * boundHeight,
      }
    })

    setPositions(newPositions)
    setShuffleCount((prev) => prev + 1)
  }, [links])

  // Handle die click
  const handleDieClick = () => {
    if (isShufflingDie || isShufflingLinks) return

    // Hide any previous text
    setShowText(false)

    // Start shuffling die
    setIsShufflingDie(true)

    // Random duration between 1-3 seconds
    const shuffleDuration = 1000 + Math.random() * 2000
    const startTime = Date.now()
    const shuffleInterval = 100 // Change die every 100ms for smooth animation

    // Function to update die during animation
    const updateDie = () => {
      // Change aura color
      setAuraColor(auraColors[Math.floor(Math.random() * auraColors.length)])

      // Change die symbol
      setCurrentDie(Math.floor(Math.random() * 6))

      const elapsed = Date.now() - startTime

      if (elapsed < shuffleDuration) {
        setTimeout(updateDie, shuffleInterval)
      } else {
        // Shuffling die finished
        const finalDie = Math.floor(Math.random() * 6)
        setCurrentDie(finalDie)
        setIsShufflingDie(false)

        // Start shuffling links
        const shuffleCount = finalDie + 1 // 1-6 shuffles based on die value
        setRemainingShuffles(shuffleCount)
        setIsShufflingLinks(true)

        // Schedule link shuffles
        performLinkShuffles(shuffleCount)
      }
    }

    // Start the die animation
    updateDie()
  }

  // Perform link shuffles with intervals
  const performLinkShuffles = (count: number) => {
    if (count <= 0) {
      setIsShufflingLinks(false)
      setRemainingShuffles(0)

      // Show random text after shuffling is complete
      const text = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)]
      setRandomText(text)
      setShowText(true)

      // Hide text after 4 seconds
      setTimeout(() => {
        setShowText(false)
      }, 4000)

      return
    }

    // Perform one shuffle
    generatePositions()
    setRemainingShuffles(count - 1)

    // Schedule next shuffle if needed
    if (count > 1) {
      setTimeout(() => performLinkShuffles(count - 1), 1000)
    } else {
      setTimeout(() => {
        performLinkShuffles(0) // This will trigger the completion logic
      }, 1000)
    }
  }

  // Generate positions on mount and window resize
  useEffect(() => {
    generatePositions()

    const handleResize = () => {
      generatePositions()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [generatePositions])

  // Get the die symbol for the current countdown number
  const getCountdownDieSymbol = () => {
    // Map countdown number (1-6) to die symbol (⚀-⚅)
    // We need to convert the remainingShuffles to the correct die symbol
    // remainingShuffles counts down from (finalDie+1) to 0

    // When remainingShuffles is 0, we're done, so no symbol
    if (remainingShuffles === 0) return ""

    // Map the countdown number to the correct die symbol
    // Die symbols are ordered ⚀(1) to ⚅(6), so we need to map:
    // remainingShuffles 1 → die symbol ⚀ (index 0)
    // remainingShuffles 2 → die symbol ⚁ (index 1)
    // ...
    // remainingShuffles 6 → die symbol ⚅ (index 5)
    return dieSymbols[remainingShuffles - 1]
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
      {/* Screen edge aura animation - more blended version */}
      <AnimatePresence>
        {(isShufflingDie || isShufflingLinks) && (
          <>
            {/* Subtle vignette overlay for overall darkening */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.3) 70%)",
                mixBlendMode: "multiply",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 1.8 }}
            />

            {/* Top edge aura - more subtle */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[30vh] pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 100%)",
                backdropFilter: "blur(1px)",
              }}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30, transition: { duration: 0.4 } }}
              transition={{ duration: 1.8 }}
            />

            {/* Bottom edge aura - more subtle */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[30vh] pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 100%)",
                backdropFilter: "blur(1px)",
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30, transition: { duration: 0.4 } }}
              transition={{ duration: 1.8 }}
            />

            {/* Left edge aura - more subtle */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-[30vw] pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 100%)",
                backdropFilter: "blur(1px)",
              }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30, transition: { duration: 0.4 } }}
              transition={{ duration: 1.8 }}
            />

            {/* Right edge aura - more subtle */}
            <motion.div
              className="absolute top-0 bottom-0 right-0 w-[30vw] pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to left, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 100%)",
                backdropFilter: "blur(1px)",
              }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30, transition: { duration: 0.4 } }}
              transition={{ duration: 1.8 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Large background die symbol during countdown */}
      <AnimatePresence mode="wait">
        {isShufflingLinks && remainingShuffles > 0 && (
          <motion.div
            key={`background-die-${remainingShuffles}`}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="text-[16rem] text-white"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 10,
              }}
            >
              {getCountdownDieSymbol()}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {links.map((link, index) => (
          <motion.a
            key={`${link.id}-${shuffleCount}`}
            href={link.url}
            className={`font-favorit absolute font-normal border-b border-dotted border-current text-white ${
              isShufflingDie || isShufflingLinks ? "pointer-events-none text-gray-400" : ""
            }`}
            style={{
              left: positions[index]?.x,
              top: positions[index]?.y,
              transform: "translate(-50%, -50%)",
              zIndex: 30,
              opacity: isShufflingDie || isShufflingLinks ? 0.5 : 1,
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isShufflingDie || isShufflingLinks ? 0.5 : 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{ opacity: isShufflingDie || isShufflingLinks ? 0.5 : 0.7 }}
          >
            {link.text.toLowerCase()}↗
          </motion.a>
        ))}
      </AnimatePresence>

      {/* Die button with animation and pre-allocated text space */}
      <div className="absolute bottom-8 right-8 flex flex-col items-end z-40">
        <motion.button
          onClick={handleDieClick}
          disabled={isShufflingDie || isShufflingLinks}
          className="relative px-3 py-1 text-6xl text-white disabled:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isShufflingDie ? 1 : 0.8,
            scale: isShufflingDie ? 1.1 : 1,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Show either countdown number or die symbol - REVERTED to original implementation */}
          {isShufflingLinks ? (
            <motion.span
              className="font-bold"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              key={remainingShuffles} // Key changes with each update to trigger animation
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 10,
              }}
            >
              {remainingShuffles}
            </motion.span>
          ) : (
            <motion.span
              key="die"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              {dieSymbols[currentDie]}
            </motion.span>
          )}
        </motion.button>

        {/* Pre-allocated space for text that appears below the die */}
        <div className="font-gaisyr min-h-[1.5rem] mt-2 mr-3 text-sm text-right text-white z-40">
          <motion.div
            animate={{ opacity: showText ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="whitespace-nowrap"
          >
            {randomText}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
