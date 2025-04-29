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
  onComplete?: () => void;
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
  fadeOutDuration = 2.5,
  nextSentenceDelay = 5,
  fontSize = "text-sm",
  lineHeight = "leading-relaxed",
  onSkip,
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

    sentences.forEach((sentence, sentenceIndex) => {
      const words = sentence.split(" ")

      let sentenceBaseDelay = 0
      if (sentenceIndex > 0) {
        sentenceBaseDelay = sentenceIndex * nextSentenceDelay * 1000
      }

      words.forEach((word, wordIndex) => {
        const wordKey = `${sentenceIndex}-${wordIndex}`
        const wordAppearDelay = sentenceBaseDelay + (wordDelay + wordIndex * staggerDelay) * 1000

        addTimeout(() => {
          setWordStates((prev) => ({
            ...prev,
            [wordKey]: { visible: true, fading: false },
          }))

          addTimeout(() => {
            setWordStates((prev) => ({
              ...prev,
              [wordKey]: { visible: true, fading: true },
            }))
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
          const words = sentence.split(" ")

          return (
            <div key={`sentence-${sentenceIndex}`} className={`mb-1 ${fontSize} ${lineHeight}`}>
              <div className="relative">
                <div className="opacity-0 select-none" aria-hidden="true">
                  {sentence}
                </div>

                <div className="absolute top-0 left-0 flex flex-wrap">
                  {words.map((word, wordIndex) => {
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
