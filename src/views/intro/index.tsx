// views/intro/index.tsx

// This poem found on Heli Slimane's website circa 2005
// was an engineering marvel to me. An enigma among the
// countless PHP websites. They took it upon themself to
// design, animate, and code the poem into their artistic
// expression.

// He found a way to express himself despite the technological
// challenges. We have no idea how, but he did it.

// Just finding a solution to a seemingly bounded problem was why I chose
// this path of mine to pursue.

import AnimatedText from "@/components/AnimatedText";
import { useSequenceStore } from "@/stores/useSequenceStore";
import { useState } from "react";

export const IntroductionView = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const completeIntro = useSequenceStore((state) => state.completeIntro);

  const sentences = [
    "I DON'T KNOW",
    "WHAT HAPPENED LAST NIGHT.",
    "AND I TRULY HOPE THAT EVERYTHING IS ALRIGHT.",
    "I AM ONE OF THOSE WHO IS HOLDING BACK FROM JUDGING.",
    "THE WORST THING IS NO MATTER HOW MUCH YOU LET ME DOWN, I CANNOT STOP CARING.",
    "MY HEART IS IN TATTERS. ",
    "AND FOR WHAT?",
    "FOR SOMEONE WHO I HAVE NO CONTACT WITH.",
    "I DONT UNDERSTAND. ",
    "THIS IS HOW MUCH I CARE. ",
    "                                                                                                YOU CAN TURN AROUND",
    "BREAK HUNDREDS OF HEARTS",
    "A SINGLE INSTANT",
    "                                                                                 SOMETHING I COULD NEVER COMPREHEND",
    "IN GENERAL",
    "                                                                                                 MY HEART IS BROKEN.",
    "AND THE WORST PART IS",
    "I FEEL RESPONSIBLE.",
  ];

  function handleComplete() {
    completeIntro();
  }

  return (
    <div className="flex flex-col h-screen relative overflow-hidden bg-white">
      {/* Adding a static text for reference (this will be visible) */}
      <div className="mt-20 text-center text-red-500 font-bold"></div>

      {/* Text container with visible border */}
      <div
        className="mt-32 mx-auto w-[80%] md:w-[50%] p-4  z-10"
        style={{ marginTop: "150px" }} // Inline style as a backup
      >
        <AnimatedText
          sentences={sentences}
          className=" text-gray-800"
          wordDelay={1.2}
          staggerDelay={0.4}
          moveDuration={3}
          displayDuration={10}
          fadeOutDuration={2.5}
          nextSentenceDelay={4}
          fontSize="text-sm"
          onSkip={handleComplete}
          onComplete={handleComplete}
        />
      </div>

      {showAnimation && (
        <div className="mt-auto h-[10vh] w-full relative">
          <div
            className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent"
            aria-hidden="true"
          ></div>
        </div>
      )}
    </div>
  );
};
