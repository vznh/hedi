"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface AnimatedTextProps {
  sentences: string[]
  className?: string
  wordDelay?: number
  staggerDelay?: number
  moveDuration?: number
  displayDuration?: number
  fadeOutDuration?: number
  nextSentenceDelay?: number
  fontSize?: string
  lineHeight?: string
  onSkip?: () => void
  onComplete?: () => void
}

interface WordState {
  visible: boolean
  fading: boolean
}

export default function AnimatedText({
  sentences,
  className = "",
  wordDelay = 1.2,
  staggerDelay = 0.4,
  moveDuration = 1.5,
  displayDuration = 10,
  fadeOutDuration = 4,
  nextSentenceDelay = 5,
  fontSize = "text-sm",
  lineHeight = "leading-relaxed",
  onSkip,
  onComplete,
}: AnimatedTextProps) {
  const [wordStates, setWordStates] = useState<Record<string, WordState>>({})
  const [isAnimating, setIsAnimating] = useState(false)
  const [isSkipped, setIsSkipped] = useState(false)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current = []
  }

  const addTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay)
    timeoutRefs.current.push(timeout)
    return timeout
  }

  const startAnimation = () => {
    if (isAnimating) return

    setIsAnimating(true)
    clearAllTimeouts()
    setWordStates({})

    // Calculate total words to track the last one
    let totalWordCount = 0
    let lastSentenceIndex = 0
    let lastWordIndex = 0

    sentences.forEach((sentence, idx) => {
      const words = sentence.split(" ").filter((word) => word.trim() !== "")
      totalWordCount += words.length
      if (words.length > 0) {
        lastSentenceIndex = idx
        lastWordIndex = words.length - 1
      }
    })

    sentences.forEach((sentence, sentenceIndex) => {
      // Handle indentation by preserving leading spaces
      const leadingSpaces = sentence.match(/^(\s+)/) ? sentence.match(/^(\s+)/)![0].length : 0
      const words = sentence.trim().split(" ")

      let sentenceBaseDelay = 0
      if (sentenceIndex > 0) {
        sentenceBaseDelay = sentenceIndex * nextSentenceDelay * 1000
      }

      words.forEach((word, wordIndex) => {
        if (word === "") return // Skip empty words

        const wordKey = `${sentenceIndex}-${wordIndex}`
        const wordAppearDelay = sentenceBaseDelay + (wordDelay + wordIndex * staggerDelay) * 1000

        addTimeout(() => {
          setWordStates((prev) => ({
            ...prev,
            [wordKey]: { visible: true, fading: false },
          }))

          // Set timeout for fading out
          addTimeout(() => {
            setWordStates((prev) => ({
              ...prev,
              [wordKey]: { visible: true, fading: true },
            }))

            // Check if this is the last word of the last sentence
            if (sentenceIndex === lastSentenceIndex && wordIndex === lastWordIndex) {
              // Add timeout for completion after the fade out duration
              addTimeout(() => {
                if (onComplete) {
                  onComplete()
                }
              }, fadeOutDuration * 1000)
            }
          }, displayDuration * 1000)
        }, wordAppearDelay)
      })
    })
  }

  const handleSkip = () => {
    setIsSkipped(true)
    clearAllTimeouts()
    if (onSkip) onSkip()
  }

  useEffect(() => {
    startAnimation()

    return () => {
      clearAllTimeouts()
    }
  }, [])

  if (isSkipped) {
    return null
  }

  return (
    <div className={`${className} relative w-full h-full flex items-center justify-center`}>
      <div className="max-w-full">
        {sentences.map((sentence, sentenceIndex) => {
          // Extract indentation information
          const leadingSpaces = sentence.match(/^(\s+)/) ? sentence.match(/^(\s+)/)![0] : ""
          const indentSize = leadingSpaces.length * 0.25 // 0.25em per space
          const words = sentence.trim().split(" ")

          return (
            <div
              key={`sentence-${sentenceIndex}`}
              className={`mb-1 ${fontSize} ${lineHeight}`}
              style={{ paddingLeft: `${indentSize}em` }}
            >
              <div className="relative">
                <div className="opacity-0 select-none" aria-hidden="true">
                  {sentence.trim()}
                </div>

                <div className="absolute top-0 left-0 flex flex-wrap">
                  {words.map((word, wordIndex) => {
                    if (word === "") return null // Skip empty words

                    const wordKey = `${sentenceIndex}-${wordIndex}`
                    const wordState = wordStates[wordKey] || {
                      visible: false,
                      fading: false,
                    }

                    return (
                      <motion.span
                        key={`word-${wordKey}`}
                        className="inline-block mr-[0.25em]"
                        initial={{ y: "70vh", opacity: 0 }}
                        animate={{
                          y: wordState.visible ? 0 : "70vh",
                          opacity: wordState.visible ? (wordState.fading ? 0 : 1) : 0,
                        }}
                        transition={{
                          y: {
                            duration: moveDuration,
                            ease: [0.25, 0.1, 0.25, 1.0],
                            type: "tween",
                          },
                          opacity: {
                            duration: wordState.fading ? fadeOutDuration : moveDuration,
                            ease: "easeInOut",
                          },
                        }}
                      >
                        {word}
                      </motion.span>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleSkip}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 text-gray-500 border-b border-dotted border-gray-500 hover:text-gray-700 transition-colors text-xs"
      >
        SKIP<span>↗</span>
      </button>
    </div>
  )
}
