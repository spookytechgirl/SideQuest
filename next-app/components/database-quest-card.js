import Link from "next/link";
import { getQuestPath } from "@/lib/public-quests";

export default function DatabaseQuestCard({ quest, headingLevel = "h2" }) {
  const Heading = headingLevel;

  return (
    <article className="database-quest-card">
      <div className="database-quest-meta" aria-label="Quest details">
        <span>{quest.category}</span>
        <span>{quest.effort}</span>
      </div>
      <Heading>
        <Link href={getQuestPath(quest)}>{quest.quest_text}</Link>
      </Heading>
      <Link className="database-quest-link" href={getQuestPath(quest)}>
        Open this quest <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

