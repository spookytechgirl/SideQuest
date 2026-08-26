import SeoLandingPage from "@/components/seo-landing-page";
import {
  createSeoLandingMetadata,
  getSeoLandingPage,
} from "@/lib/seo-landing-pages";

const slug = "weekend-side-quests";

export const metadata = createSeoLandingMetadata(slug);

export default function WeekendSideQuestsPage() {
  return <SeoLandingPage page={getSeoLandingPage(slug)} />;
}
