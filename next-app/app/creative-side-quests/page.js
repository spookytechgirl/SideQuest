import SeoLandingPage from "@/components/seo-landing-page";
import {
  createSeoLandingMetadata,
  getSeoLandingPage,
} from "@/lib/seo-landing-pages";

const slug = "creative-side-quests";

export const metadata = createSeoLandingMetadata(slug);

export default function CreativeSideQuestsPage() {
  return <SeoLandingPage page={getSeoLandingPage(slug)} />;
}
