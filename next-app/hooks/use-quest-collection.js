"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getServerQuestCollectionSnapshot,
  parseStoredQuests,
  readQuestCollectionSnapshot,
  subscribeToQuestCollection,
} from "@/lib/quest-storage";

export default function useQuestCollection(
  key,
  maximum = Number.POSITIVE_INFINITY,
) {
  const subscribe = useCallback(
    (onStoreChange) => subscribeToQuestCollection(key, onStoreChange),
    [key],
  );
  const getSnapshot = useCallback(() => readQuestCollectionSnapshot(key), [key]);
  const serialized = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerQuestCollectionSnapshot,
  );

  return useMemo(
    () => parseStoredQuests(serialized, maximum),
    [maximum, serialized],
  );
}
