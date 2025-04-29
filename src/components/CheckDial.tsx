"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { motion, useMotionValue, useSpring, animate } from "framer-motion"

// Define the menu item interface
export interface DialMenuItem {
  label: string
  disabled?: boolean
  color?: string
  content?: ReactNode
}

// Define the component props
interface SplitViewDialProps {
  items: DialMenuItem[]
  onSelect?: (item: DialMenuItem, index: number) => void
  highlightColor?: string
  itemHeight?: number
  visibleItems?: number
  defaultIndex?: number
}

export default function SplitViewDial({
  items = [],
  onSelect,
  highlightColor = "#880808", // Default blood red highlight color
  itemHeight = 60,
  visibleItems = 5,
  defaultIndex = 0,
}: SplitViewDialProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
  const [isDragging, setIsDragging] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Constants
  const DRAG_SENSITIVITY = 0.5
  const NON_SELECTED_LINE_SCALE = 0.7

  // Create a motion value for the scroll position
  const scrollY = useMotionValue(-(defaultIndex * itemHeight))

  // Create a spring-based motion value for smoother scrolling
  const springScrollY = useSpring(scrollY, { damping: 30, stiffness: 300 })

  // Calculate the middle index for the visible items
  const middleVisibleIndex = Math.floor(visibleItems / 2)

  // Calculate blur based on distance from selected item
  const getBlurAmount = (distance: number) => {
    if (distance === 0) return "blur(0px)"
    if (distance === 1) return "blur(1px)" // 10% blur for items one away
    if (distance === 2) return "blur(2px)" // 20% blur for items two away
    return "blur(3px)" // 30% blur for items further away
  }

  // Calculate opacity based on distance from selected item
  const getOpacityAmount = (distance: number) => {
    if (distance === 0) return 1
    if (distance === 1) return 0.9 // 90% opacity for items one away
    if (distance === 2) return 0.8 // 80% opacity for items two away
    return 0.7 // 70% opacity for items further away
  }

  // Update selected index based on scroll position
  useEffect(() => {
    const unsubscribe = springScrollY.onChange((latest) => {
      // Calculate which item is centered based on scroll position
      const rawIndex = Math.round(-latest / itemHeight)
      // Clamp the index between 0 and items.length - 1
      const newSelectedIndex = Math.max(0, Math.min(items.length - 1, rawIndex))

      if (newSelectedIndex !== selectedIndex) {
        setSelectedIndex(newSelectedIndex)

        // Call onSelect callback when selection changes and not dragging
        if (!isDragging && onSelect && !items[newSelectedIndex].disabled) {
          onSelect(items[newSelectedIndex], newSelectedIndex)
        }
      }
    })

    return unsubscribe
  }, [springScrollY, selectedIndex, items, itemHeight, isDragging, onSelect])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault()

        const direction = e.key === "ArrowUp" ? -1 : 1
        const newIndex = selectedIndex + direction

        // Check if the new index is within bounds
        if (newIndex >= 0 && newIndex < items.length) {
          // Skip disabled items
          if (items[newIndex].disabled) {
            // Try to find the next non-disabled item in the same direction
            let nextIndex = newIndex
            while (nextIndex >= 0 && nextIndex < items.length && items[nextIndex].disabled) {
              nextIndex += direction
            }

            // If we found a valid item, use it, otherwise keep the current selection
            if (nextIndex >= 0 && nextIndex < items.length && !items[nextIndex].disabled) {
              scrollToIndex(nextIndex)
            }
          } else {
            scrollToIndex(newIndex)
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, items, isFocused])

  // Scroll to a specific index
  const scrollToIndex = (index: number) => {
    const targetY = -(index * itemHeight)
    animate(scrollY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }

  // Handle wheel events for scrolling
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Get current scroll position
      const currentY = scrollY.get()

      // Calculate new position based on wheel delta
      const newY = currentY + e.deltaY * 0.5

      // Calculate the bounds
      const minY = -(items.length - 1) * itemHeight
      const maxY = 0

      // Apply bounds with some elasticity for bounce effect
      const targetY = Math.max(minY, Math.min(maxY, newY))

      // Animate to the target position with a spring effect
      scrollY.set(targetY)

      // Snap to nearest item after a short delay
      clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => {
        snapToNearestItem()
      }, 150)
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [items.length, itemHeight])

  const wheelTimer = useRef<NodeJS.Timeout | null>(null)

  // Snap to nearest item
  const snapToNearestItem = () => {
    const currentY = scrollY.get()

    // Calculate the bounds
    const minY = -(items.length - 1) * itemHeight
    const maxY = 0

    // Snap to the nearest item position within bounds
    let targetY = Math.round(currentY / itemHeight) * itemHeight
    targetY = Math.max(minY, Math.min(maxY, targetY))

    // Animate to the target position with a spring effect
    animate(scrollY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    })
  }

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true)
  }

  // Handle drag with reduced sensitivity
  const handleDrag = (_, info) => {
    // Apply reduced sensitivity to make dragging less extreme
    const newY = scrollY.get() + info.delta.y * DRAG_SENSITIVITY

    // Calculate the bounds to prevent scrolling beyond the first and last items
    const minY = -(items.length - 1) * itemHeight
    const maxY = 0

    // Apply bounds with some elasticity for bounce effect
    if (newY > maxY) {
      // Apply resistance when trying to scroll past the first item
      scrollY.set(maxY + (newY - maxY) * 0.2)
    } else if (newY < minY) {
      // Apply resistance when trying to scroll past the last item
      scrollY.set(minY + (newY - minY) * 0.2)
    } else {
      scrollY.set(newY)
    }
  }

  // Handle drag end with bounce effect
  const handleDragEnd = () => {
    setIsDragging(false)
    snapToNearestItem()

    // Call onSelect callback when drag ends
    if (onSelect && !items[selectedIndex].disabled) {
      onSelect(items[selectedIndex], selectedIndex)
    }
  }

  return (
    <div
      className="flex flex-col md:flex-row w-full h-screen relative"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-black via-black to-gray-900" />
      </div>

      {/* Dial Menu - Left Side */}
      <div className="relative z-10 w-full md:w-1/3 lg:w-1/4 h-[300px] md:h-screen">
        <div ref={containerRef} className="relative w-full h-full overflow-hidden">
          {/* Center indicator line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[60px] pointer-events-none z-10 border-y-2 border-gray-800/30" />

          <motion.div
            // Use custom handlers for more control
            onPanStart={handleDragStart}
            onPan={handleDrag}
            onPanEnd={handleDragEnd}
            style={{ y: springScrollY }}
            className="absolute left-0 right-0 cursor-grab active:cursor-grabbing select-none"
          >
            {/* Add empty space at the top to position the first item correctly */}
            <div style={{ height: `${middleVisibleIndex * itemHeight}px` }} />

            {/* Render all items (not just visible ones) to ensure smooth scrolling */}
            {items.map((item, index) => {
              const isSelected = index === selectedIndex
              const isDisabled = item.disabled === true
              const distanceFromSelected = Math.abs(index - selectedIndex)

              // Calculate blur and opacity based on distance from selected item and disabled state
              const itemBlur = isDisabled ? "blur(2px)" : getBlurAmount(distanceFromSelected)
              const itemOpacity = isDisabled ? 0.5 : getOpacityAmount(distanceFromSelected)

              // Use custom color if provided, otherwise use default or disabled color
              const itemColor = isDisabled ? "#666666" : item.color || "#000000"

              // Use custom highlight color if provided
              const lineColor = isSelected ? (isDisabled ? "#666666" : highlightColor) : "#6b7280"

              return (
                <div
                  key={index}
                  className="flex items-center px-6"
                  style={{
                    filter: itemBlur,
                    opacity: itemOpacity,
                    transition: "filter 0.3s ease, opacity 0.3s ease",
                    height: `${itemHeight}px`,
                  }}
                >
                  <div className="flex-grow flex items-center">
                    <motion.div
                      className="h-0.5"
                      style={{
                        backgroundColor: lineColor,
                      }}
                      initial={{ width: isSelected ? "100%" : `${NON_SELECTED_LINE_SCALE * 100}%` }}
                      animate={{
                        width: isSelected ? "100%" : `${NON_SELECTED_LINE_SCALE * 100}%`,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                  <div
                    className="font-gaisyr ml-4 text-xl font-medium transition-colors duration-150 select-none"
                    style={{
                      color: itemColor,
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              )
            })}

            {/* Add empty space at the bottom to position the last item correctly */}
            <div style={{ height: `${middleVisibleIndex * itemHeight}px` }} />
          </motion.div>
        </div>
      </div>

      {/* Content Area - Right Side */}
      <div className="relative z-10 w-full md:w-2/3 lg:w-3/4 h-screen overflow-auto p-8">
        {items[selectedIndex]?.content || (
          <div className="flex items-center justify-center h-full text-gray-400">
            No content available for this item
          </div>
        )}
      </div>
    </div>
  )
}
