"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";
import { CursorOverlay } from "./cursor/overlay";
import { CursorArea } from "./cursor/area";

export interface DialMenuItem {
  label: string;
  disabled?: boolean;
  color?: string;
  content?: ReactNode;
}

interface SplitViewDialProps {
  items: DialMenuItem[];
  onSelect?: (item: DialMenuItem, index: number) => void;
  highlightColor?: string;
  itemHeight?: number;
  visibleItems?: number;
  defaultIndex?: number;
}

export default function SplitViewDial({
  items = [],
  onSelect,
  highlightColor = "#880808",
  itemHeight = 60,
  visibleItems = 5,
  defaultIndex = 0,
}: SplitViewDialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const DRAG_SENSITIVITY = 0.5;
  const NON_SELECTED_LINE_SCALE = 0.7;

  const scrollY = useMotionValue(-(defaultIndex * itemHeight));

  const springScrollY = useSpring(scrollY, { damping: 30, stiffness: 300 });

  const middleVisibleIndex = Math.floor(visibleItems / 2);

  const getBlurAmount = (distance: number) => {
    if (distance === 0) return "blur(0px)";
    if (distance === 1) return "blur(1px)";
    if (distance === 2) return "blur(2px)";
    return "blur(3px)";
  };

  const getOpacityAmount = (distance: number) => {
    if (distance === 0) return 1;
    if (distance === 1) return 0.9;
    if (distance === 2) return 0.8;
    return 0.7;
  };

  useEffect(() => {
    const unsubscribe = springScrollY.onChange((latest) => {
      const rawIndex = Math.round(-latest / itemHeight);
      const newSelectedIndex = Math.max(
        0,
        Math.min(items.length - 1, rawIndex),
      );

      if (newSelectedIndex !== selectedIndex) {
        setSelectedIndex(newSelectedIndex);

        if (!isDragging && onSelect && !items[newSelectedIndex].disabled) {
          onSelect(items[newSelectedIndex], newSelectedIndex);
        }
      }
    });

    return unsubscribe;
  }, [springScrollY, selectedIndex, items, itemHeight, isDragging, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();

        const direction = e.key === "ArrowUp" ? -1 : 1;
        const newIndex = selectedIndex + direction;

        if (newIndex >= 0 && newIndex < items.length) {
          if (items[newIndex].disabled) {
            let nextIndex = newIndex;
            while (
              nextIndex >= 0 &&
              nextIndex < items.length &&
              items[nextIndex].disabled
            ) {
              nextIndex += direction;
            }

            if (
              nextIndex >= 0 &&
              nextIndex < items.length &&
              !items[nextIndex].disabled
            ) {
              scrollToIndex(nextIndex);
            }
          } else {
            scrollToIndex(newIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, items, isFocused]);

  const scrollToIndex = (index: number) => {
    const targetY = -(index * itemHeight);
    animate(scrollY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const currentY = scrollY.get();

      const newY = currentY + e.deltaY * 0.5;

      const minY = -(items.length - 1) * itemHeight;
      const maxY = 0;

      const targetY = Math.max(minY, Math.min(maxY, newY));

      scrollY.set(targetY);

      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        snapToNearestItem();
      }, 150);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [items.length, itemHeight]);

  const wheelTimer = useRef<NodeJS.Timeout | null>(null);

  const snapToNearestItem = () => {
    const currentY = scrollY.get();

    const minY = -(items.length - 1) * itemHeight;
    const maxY = 0;

    let targetY = Math.round(currentY / itemHeight) * itemHeight;
    targetY = Math.max(minY, Math.min(maxY, targetY));

    animate(scrollY, targetY, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (_: any, info: any) => {
    const newY = scrollY.get() + info.delta.y * DRAG_SENSITIVITY;

    const minY = -(items.length - 1) * itemHeight;
    const maxY = 0;

    if (newY > maxY) {
      scrollY.set(maxY + (newY - maxY) * 0.2);
    } else if (newY < minY) {
      scrollY.set(minY + (newY - minY) * 0.2);
    } else {
      scrollY.set(newY);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    snapToNearestItem();

    if (onSelect && !items[selectedIndex].disabled) {
      onSelect(items[selectedIndex], selectedIndex);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row w-full h-screen relative"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-black via-black to-gray-900" />
      </div>
      <div className="relative z-10 w-full md:w-1/3 lg:w-1/4 h-[300px] md:h-screen">
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden"
        >
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[60px] pointer-events-none z-10 border-y-2 border-gray-800/30" />

          <motion.div
            onPanStart={handleDragStart}
            onPan={handleDrag}
            onPanEnd={handleDragEnd}
            style={{ y: springScrollY }}
            className="absolute left-0 right-0 cursor-grab active:cursor-grabbing select-none"
          >
            <div style={{ height: `${middleVisibleIndex * itemHeight}px` }} />

            {items.map((item, index) => {
              const isSelected = index === selectedIndex;
              const isDisabled = item.disabled === true;
              const distanceFromSelected = Math.abs(index - selectedIndex);

              const itemBlur = isDisabled
                ? "blur(2px)"
                : getBlurAmount(distanceFromSelected);
              const itemOpacity = isDisabled
                ? 0.5
                : getOpacityAmount(distanceFromSelected);

              const itemColor = isDisabled
                ? "#666666"
                : item.color || "#000000";

              const lineColor = isSelected
                ? isDisabled
                  ? "#666666"
                  : highlightColor
                : "#6b7280";

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
                      initial={{
                        width: isSelected
                          ? "100%"
                          : `${NON_SELECTED_LINE_SCALE * 100}%`,
                      }}
                      animate={{
                        width: isSelected
                          ? "100%"
                          : `${NON_SELECTED_LINE_SCALE * 100}%`,
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
              );
            })}

            <div style={{ height: `${middleVisibleIndex * itemHeight}px` }} />
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full md:w-2/3 lg:w-3/4 h-screen overflow-auto p-8">
        {items[selectedIndex]?.content || (
          <div className="flex items-center justify-center h-full text-gray-400">
            No content available for this item
          </div>
        )}
      </div>
    </div>
  );
}
