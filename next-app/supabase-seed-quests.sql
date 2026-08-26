-- Run this file manually in the Supabase SQL Editor.
-- It seeds public.quests from the existing SideQuest homepage generator catalog.
-- IDs and created_at values are intentionally left to the table defaults.

with seed_quests (quest_text, category, effort) as (
  values
    (
      'Take a 15-minute walk without your phone.',
      'Outdoors',
      'Easy'
    ),
    (
      'Try a snack or drink you have never had before.',
      'Food',
      'Quick'
    ),
    (
      'Write and send a kind note to someone you appreciate.',
      'Random',
      'Quick'
    ),
    (
      'Visit a nearby park and find the best view.',
      'Local Adventure',
      'Adventure'
    ),
    (
      'Learn how to say hello in three new languages.',
      'Random',
      'Quick'
    ),
    (
      'Sketch something in the room using your non-dominant hand.',
      'Creative',
      'A Little Effort'
    ),
    (
      'Put on one song and dance until it ends.',
      'Random',
      'Quick'
    ),
    (
      'Take five photos of things that share the same color.',
      'Creative',
      'A Little Effort'
    ),
    (
      'Read ten pages of a book you have been meaning to start.',
      'Relaxing',
      'Easy'
    ),
    (
      'Make a tiny meal using only ingredients you already have.',
      'Food',
      'A Little Effort'
    ),
    (
      'Step outside and watch the sky for five quiet minutes.',
      'Outdoors',
      'Easy'
    ),
    (
      'Rearrange one small corner of your space.',
      'Relaxing',
      'A Little Effort'
    ),
    (
      'Learn one simple magic trick.',
      'Creative',
      'A Little Effort'
    ),
    (
      'Leave a positive review for a local place you enjoy.',
      'Local Adventure',
      'Quick'
    ),
    (
      'Make a three-song playlist for your current mood.',
      'Relaxing',
      'Easy'
    )
)
insert into public.quests (quest_text, category, effort)
select seed.quest_text, seed.category, seed.effort
from seed_quests as seed
where not exists (
  select 1
  from public.quests as existing
  where lower(trim(existing.quest_text)) = lower(trim(seed.quest_text))
);
