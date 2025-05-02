// views/entrance/index.tsx

import AnimatedRandomLinks from "@/components/RandomLinks";

// I'm at the right place, at the right time, doing the right thing.
// If someone were to describe my life, it'd be chance and sweat.
// But I don't believe in the concept of chance. I believe that
// everything was placed for a reason and all of the events
// that lead up to that moment where "chance" is applied
// is what actually determined the result.

// It's not chance that I was here.

// I hear people think I'm a cornball when it comes to expressing myself. I honestly
// think I am too. But I really like to live! After all, it's my only life!
// I really like my life and being able to express myself through many ways:
// an example (out of numerous) would be altering my clothes and
// (ripping & tearing, regretting, and then shamefully) wearing it.

// The people that have known me the longest know I'm a corny
// ass dude, but they don't care. And that's what I love about life.
// People don't care. So why should I care if they don't?

// Be unapologetic! Be intentional!

// I think it's been said over & over, but if you haven't experienced it,
// the feeling of regret that you could have done it hurts more than realizing
// that you did it.

export const EntranceView = () => {
  const links = [
    { id: 1, text: "about", url: "/about" },
    { id: 2, text: "works", url: "/about" },
    { id: 3, text: "designs", url: "/projects" },
    { id: 4, text: "competitions", url: "/competitions" },
    { id: 5, text: "philosophy", url: "/blog" },
    { id: 6, text: "products", url: "/resume" },
    { id: 7, text: "guestboard", url: "/guestboard" },
  ];

  return (
    <AnimatedRandomLinks links={links} />
  );
};
