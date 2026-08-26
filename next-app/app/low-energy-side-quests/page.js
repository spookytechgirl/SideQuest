import SeoLandingPage from "@/components/seo-landing-page";
import {
  createSeoLandingMetadata,
  getSeoLandingPage,
} from "@/lib/seo-landing-pages";

const slug = "low-energy-side-quests";

export const metadata = createSeoLandingMetadata(slug);

export default function LowEnergySideQuestsPage() {
  return <SeoLandingPage page={getSeoLandingPage(slug)} />;
}
