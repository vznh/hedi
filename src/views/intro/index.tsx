// views/intro/index.tsx

// This poem found on Heli Slimane's website circa 2005
// was an engineering marvel to me. An enigma among the
// countless PHP websites. They took it upon themself to
// design, animate, and code the poem into their artistic
// expression. The lengths that someone will take to
// express their relation and compassion to others amazes,
// inspires, and drives me.

import AnimatedText from "@/components/AnimatedText";
import { useSequenceStore } from "@/stores/useSequenceStore";
import { useState } from "react";

export const IntroductionView = () => {
  const [showAnimation, setShowAnimation] = useState(true);
  const completeIntro = useSequenceStore((state) => state.completeIntro);

  const sentences = [
    "I DONT KNOW WHAT HAPPENED LAST NIGHT  。 ",
    "AND I TRULY HOPE THAT EVERYTHING IS ALRIGHT  。 ",
    "I AM ONE OF THOSE WHO IS HOLDING BACK FROM JUDGING  。 ",
    "THE WORST THING IS NO MATTER HOW MUCH YOU LET ME DOWN  ，  ",
    "I CANNOT STOP CARING  。 ",
    "MY HEART IS IN TATTERS  。 ",
    "AND FOR WHAT  ？ ",
    "FOR SOMEONE WHO I HAVE NO CONTACT WITH  。 ",
    "I DONT UNDERSTAND  。 ",
    "THIS IS HOW MUCH I CARE  。 ",
    "YOU CAN TURN AROUND  ，  BREAK HUNDREDS OF HEARTS A SINGLE INSTANT  … ",
    "SOMETHING I COULD NEVER COMPREHEND IN GENERAL  。 ",
    "MY HEART IS BROKEN  。 ",
    "AND THE WORST PART IS I FEEL RESPONSIBLE  。 ",
    "✺ HEDI SLIMANE",
  ];

  function handleComplete() {
    setShowAnimation(false);
    completeIntro();
  }

  return (
    <main className="flex flex-col h-screen relative overflow-hidden">
      <div className="flex-1 flex items-center justify-center p-8 bg-white min-h-[80vh]">
        <div className="max-w-3xl mx-auto relative z-10">
          {showAnimation ? (
            <AnimatedText
              sentences={sentences}
              className="font-bold text-gray-800"
              wordDelay={1.2}
              staggerDelay={0.4}
              moveDuration={5}
              displayDuration={10}
              fadeOutDuration={2.5}
              nextSentenceDelay={4}
              onSkip={handleComplete}
            />
          ) : (
            <p>Skipped</p>
          )}
        </div>
      </div>

      {showAnimation && (
        <div className="h-[20vh] w-full relative">
          <div
            className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent"
            aria-hidden="true"
          ></div>
        </div>
      )}
    </main>
  );
};
