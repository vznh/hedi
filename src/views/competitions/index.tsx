// views/competitions/index
import DialMenu from "@/components/DialMenu";
import SplitViewDial from "@/components/CheckDial";

// I find that I'm a very competitive person. I
// end up being in one-sided (but not obsessive)
// competitions with everyone all of the time.
// Some may view this as a trait that indicates
// unhealthy argumentative foreshadowing, but
// physically to digitally, I am someone
// that strives to perform my very best because
// my life is truly mine, and I choose to make
// the best of it.

export const CompetitionView = () => {
  const items: DialMenuItem[] = [
    { label: "San Francisco 2021", color: "gray" },
    { label: "Riot Games 2022", color: "gray" },
    { label: "HackDavis 2023", color: "gray" },
    { label: "Berkeley 2023", color: "gray" },
    { label: "Berkeley A.I. 2024", color: "gray" },
    { label: "Berkeley Skydeck 2024", color: "gray" },
    { label: "Santa Cruz 2024", color: "gray" },
    { label: "HackDavis 2024", color: "gray" },
    { label: "Stanford 2024", color: "gray" },
    { label: "GitHub 2024", color: "gray" },
    { label: "Design Buddies 2024", color: "gray" },
    { label: "Google Foobar 2024", color: "gray" },
    { label: "ICPC 2024", color: "gray" },
    { label: "Tastyhacks 2024", color: "gray" },
    { label: "Hyperbolic 2024", color: "gray" },
    { label: "Amazon Web Services 2024", color: "gray" },
    { label: "Cloudflare 2024", color: "gray" },
    { label: "Stanford VR 2024", color: "gray" },
    { label: "Berkeley 2024", color: "gray" },
    { label: "X/Twitter 2024", color: "gray" },
    { label: "Stanford 2025", color: "gray" },
    { label: "Anthropic 2025", color: "gray" },
    { label: "GitHub 2025", color: "gray" },
    { label: "Google Foobar 2025", color: "gray" },
    { label: "IMC Prosperity 2025", color: "gray" },
    { label: "Next.js 2025", color: "gray" },
    { label: "ACTIVATE @ GitHub 2025", color: "gray" },
    { label: "Y Combinator 2025", color: "gray" },
  ];

  function handleSelect() {
    console.log("Selected");
  }
  return (
    <SplitViewDial items={items} onSelect={handleSelect} highlightColor="#fc3d39" />
  );
};
