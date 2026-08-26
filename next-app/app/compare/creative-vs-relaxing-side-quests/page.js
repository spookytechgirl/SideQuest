import ComparisonPage from "@/components/comparison-page";
import {
  comparisonPages,
  getComparisonExamples,
} from "@/lib/comparison-pages";
import { getPublicQuests } from "@/lib/public-quests";
import { createPublicMetadata } from "@/lib/social-metadata";

const config = comparisonPages["creative-vs-relaxing-side-quests"];

export const metadata = createPublicMetadata({
  title: config.title,
  description: config.description,
  path: `/compare/${config.slug}`,
});

export const dynamic = "force-dynamic";

export default async function CreativeVsRelaxingPage() {
  let quests = [];

  try {
    quests = await getPublicQuests();
  } catch {
    quests = [];
  }

  return (
    <ComparisonPage
      config={config}
      leftExamples={getComparisonExamples(quests, config.left)}
      rightExamples={getComparisonExamples(quests, config.right)}
    />
  );
}
