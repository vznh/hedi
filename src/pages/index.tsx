import { EntranceView, IntroductionView } from "@/views";
import { useSequenceStore } from "@/stores/useSequenceStore";
import RandomLinks from "@/components/RandomLinks";

export default function Home() {
  const currentView = useSequenceStore((state) => state.currentView);

  const links = [
    { id: 1, text: "about", url: "/about" },
    { id: 2, text: "works", url: "/about" },
    { id: 3, text: "designs", url: "/projects" },
    { id: 4, text: "competitions", url: "/contact" },
    { id: 5, text: "philosophy", url: "/blog" },
    { id: 6, text: "products", url: "/resume" },
    { id: 7, text: "chatting", url: "/services" },
  ];

  switch (currentView) {
    case "intro":
      return <IntroductionView />;
    case "entrance":
      return <EntranceView />;
    default:
      return <p>Defaulted</p>;
  }
}
