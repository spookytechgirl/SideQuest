import "server-only";

import { cache } from "react";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  QUEST_CATEGORIES,
  QUEST_EFFORTS,
  MAX_QUEST_LENGTH,
} from "@/lib/quest-options";

const QUEST_COLUMNS = "id, quest_text, category, effort, created_at";

function isValidQuestRow(quest) {
  return (
    Number.isSafeInteger(Number(quest?.id)) &&
    Number(quest.id) > 0 &&
    typeof quest.quest_text === "string" &&
    quest.quest_text.trim().length > 0 &&
    quest.quest_text.trim().length <= MAX_QUEST_LENGTH &&
    QUEST_CATEGORIES.includes(quest.category) &&
    QUEST_EFFORTS.includes(quest.effort)
  );
}

function normalizeQuest(quest) {
  return {
    id: Number(quest.id),
    quest_text: quest.quest_text.trim(),
    category: quest.category,
    effort: quest.effort,
    created_at: quest.created_at,
  };
}

export function slugifyQuestText(value) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72)
    .replace(/-+$/g, "");

  return slug || "sidequest";
}

export function getQuestRouteSegment(quest) {
  return `${quest.id}-${slugifyQuestText(quest.quest_text)}`;
}

export function getQuestPath(quest) {
  return `/quests/${getQuestRouteSegment(quest)}`;
}

export function parseQuestRouteSegment(segment) {
  const match = /^(\d+)(?:-([a-z0-9-]+))?$/.exec(segment || "");

  if (!match) {
    return null;
  }

  const id = Number(match[1]);

  if (!Number.isSafeInteger(id) || id < 1) {
    return null;
  }

  return { id, slug: match[2] || "" };
}

async function queryQuestCatalog() {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("quests")
    .select(QUEST_COLUMNS)
    .order("id", { ascending: true });

  if (error) {
    throw new Error("The public quest catalog could not be loaded.", {
      cause: error,
    });
  }

  return (data || []).filter(isValidQuestRow).map(normalizeQuest);
}

export const getPublicQuests = cache(queryQuestCatalog);

async function queryQuestById(id) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("quests")
    .select(QUEST_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("The requested quest could not be loaded.", {
      cause: error,
    });
  }

  return isValidQuestRow(data) ? normalizeQuest(data) : null;
}

export const getPublicQuestById = cache(queryQuestById);

export async function getRelatedPublicQuests(quest, limit = 3) {
  const quests = await getPublicQuests();
  const candidates = quests
    .filter((candidate) => candidate.id !== quest.id)
    .sort((first, second) => {
      const firstScore =
        Number(first.category === quest.category) * 2 +
        Number(first.effort === quest.effort);
      const secondScore =
        Number(second.category === quest.category) * 2 +
        Number(second.effort === quest.effort);

      return secondScore - firstScore || first.id - second.id;
    });

  return candidates.slice(0, limit);
}

