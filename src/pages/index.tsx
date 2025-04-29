import { EntranceView, IntroductionView, CompetitionView } from "@/views";
import { useSequenceStore } from "@/stores/useSequenceStore";
import RandomLinks from "@/components/RandomLinks";

export default function Home() {
  const currentView = useSequenceStore((state) => state.currentView);

  switch (currentView) {
    case "intro":
      return <IntroductionView />;
    case "entrance":
      return <EntranceView />;
    default:
      return <p>Defaulted</p>;
  }
}
