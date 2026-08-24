export default function QuestMetadata({ category, effort }) {
  return (
    <>
      <p className="quest-label">{category}</p>
      <p className="quest-effort">{effort}</p>
    </>
  );
}
