// views/entrance/index.tsx

import AnimatedRandomLinks from "@/components/RandomLinks";

// I'm at the right place, at the right time, doing the right thing.
// If someone were to describe my life, it'd be chance and sweat.
// But I don't believe in the concept of chance. I believe that
// everything was placed for a reason and all of the events
// that lead up to that moment where "chance" is applied
// is what actually determined the result.
//
// It's not chance that I was here.

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
