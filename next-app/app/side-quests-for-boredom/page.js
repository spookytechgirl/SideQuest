import SeoLandingPage from "@/components/seo-landing-page";
import {
  createSeoLandingMetadata,
  getSeoLandingPage,
} from "@/lib/seo-landing-pages";

const slug = "side-quests-for-boredom";

export const metadata = createSeoLandingMetadata(slug);

export default function SideQuestsForBoredomPage() {
  return <SeoLandingPage page={getSeoLandingPage(slug)} />;
}
