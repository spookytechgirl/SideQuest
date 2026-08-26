import SeoLandingPage from "@/components/seo-landing-page";
import {
  createSeoLandingMetadata,
  getSeoLandingPage,
} from "@/lib/seo-landing-pages";

const slug = "indoor-side-quests";

export const metadata = createSeoLandingMetadata(slug);

export default function IndoorSideQuestsPage() {
  return <SeoLandingPage page={getSeoLandingPage(slug)} />;
}
