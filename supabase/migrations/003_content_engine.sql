-- PrepPath content engine + per-user topic progress
-- Built on the Bihar STET Computer Science syllabus tables from migration 002.

create table if not exists public.exam_topic_content (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null unique references public.exam_syllabus_topics(id) on delete cascade,
  lesson_markdown text,
  learning_objectives text[] not null default '{}',
  key_terms jsonb not null default '[]'::jsonb,
  estimated_minutes integer not null default 30 check (estimated_minutes between 5 and 240),
  difficulty text not null default 'medium' check (difficulty in ('easy','medium','hard')),
  status text not null default 'draft' check (status in ('draft','review','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id uuid not null references public.exam_syllabus_topics(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started','in_progress','completed')),
  confidence integer check (confidence between 1 and 5),
  first_started_at timestamptz,
  completed_at timestamptz,
  last_studied_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, topic_id)
);

alter table public.exam_topic_content enable row level security;
alter table public.user_topic_progress enable row level security;

create policy "Published topic content is readable"
on public.exam_topic_content
for select using (status = 'published');

create policy "Users can read own topic progress"
on public.user_topic_progress
for select using (auth.uid() = user_id);

create policy "Users can insert own topic progress"
on public.user_topic_progress
for insert with check (auth.uid() = user_id);

create policy "Users can update own topic progress"
on public.user_topic_progress
for update using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Initial authored content for Unit 1. This is PrepPath learning content
-- derived from the syllabus scope supplied for Bihar STET Computer Science.
with topic_map as (
  select t.id, t.topic_number
  from public.exam_syllabus_topics t
  join public.exam_syllabus_units u on u.id = t.unit_id
  join public.exam_variants ev on ev.id = u.exam_variant_id
  join public.exam_catalog ec on ec.id = ev.exam_id
  where ec.code = 'BIHAR_STET'
    and ev.paper = 'II'
    and ev.subject = 'Computer Science'
    and u.unit_number = 1
)
insert into public.exam_topic_content (topic_id, lesson_markdown, learning_objectives, key_terms, estimated_minutes, difficulty, status)
select id,
  case topic_number
    when 1 then '## Number systems\n\nComputers represent data using binary digits. In this topic, study the binary, octal and hexadecimal number systems and the relationships between them. Also cover BCD, ASCII, EBCDIC and Gray code, with emphasis on representation and conversion rather than memorising isolated values.\n\n### Study focus\n- Convert values between binary, octal and hexadecimal.\n- Distinguish positional number systems from character/data encoding schemes.\n- Understand why Gray code changes one bit between adjacent values.\n\n### Exam check\nBe able to perform conversions quickly and identify where BCD, ASCII, EBCDIC and Gray code are used.'
    when 2 then '## Binary arithmetic and Boolean foundations\n\nStudy binary addition, subtraction and complements before moving to Boolean algebra and Venn diagrams. The goal is to manipulate logical expressions and recognise equivalent forms.\n\n### Study focus\n- Binary addition and subtraction.\n- One’s and two’s complement concepts.\n- Boolean operators and identities.\n- Set-style visualisation with Venn diagrams.\n\n### Exam check\nPractice short calculations and simplification questions until the basic identities become automatic.'
    when 3 then '## Logic gates, SOP/POS and K-maps\n\nLearn the behaviour of basic logic gates through truth tables, then connect gate-level logic to Sum of Products (SOP) and Product of Sums (POS) forms. K-map simplification is used to reduce Boolean expressions.\n\n### Study focus\n- AND, OR, NOT and derived gates.\n- Truth-table construction.\n- Canonical SOP and POS forms.\n- K-map grouping and simplification.\n\n### Exam check\nA good practice cycle is: expression → truth table → canonical form → K-map → simplified circuit.'
    when 4 then '## Combinational circuits\n\nCombinational circuits produce outputs from the current inputs. Study adders, subtractors, encoders, decoders, multiplexers, comparators and parity generators with their truth tables and typical uses.\n\n### Study focus\n- Half and full adders.\n- Subtractor design.\n- Encoder and decoder roles.\n- Multiplexer as a data selector.\n- Comparator and parity generation.\n\n### Exam check\nFor each circuit, know its inputs, outputs, purpose and the core truth-table relationship.'
    when 5 then '## Memory systems\n\nStudy the role and characteristics of RAM, ROM, EPROM, EEPROM, PLDs and PLAs. Focus on how the technologies differ in volatility, programmability and typical use.\n\n### Study focus\n- Volatile versus non-volatile memory.\n- RAM versus ROM families.\n- EPROM and EEPROM concepts.\n- Programmable logic devices and arrays.\n\n### Exam check\nBuild a comparison table from memory instead of learning each technology as an isolated definition.'
    when 6 then '## Sequential circuits\n\nSequential circuits depend on stored state as well as present inputs. Study SR, JK, D and T flip-flops, then connect them to registers, counters and state diagrams.\n\n### Study focus\n- Flip-flop inputs, outputs and characteristic behaviour.\n- Registers as collections of storage elements.\n- Counter operation and state transitions.\n- Reading simple state diagrams.\n\n### Exam check\nFocus on characteristic tables and state transitions; they are the bridge between individual flip-flops and larger sequential systems.'
    when 7 then '## A/D, D/A and logic families\n\nStudy the purpose of analogue-to-digital and digital-to-analogue conversion and compare major logic families including TTL, ECL, MOS and CMOS.\n\n### Study focus\n- Why conversion is required at system boundaries.\n- Basic A/D and D/A roles.\n- Logic-family characteristics and trade-offs.\n\n### Exam check\nRemember the role of each technology and compare families by the properties emphasised in your study material.'
  end,
  case topic_number
    when 1 then array['Convert between binary, octal and hexadecimal.','Differentiate BCD, ASCII, EBCDIC and Gray code.']
    when 2 then array['Perform binary arithmetic.','Apply complements and Boolean identities.']
    when 3 then array['Construct truth tables.','Simplify Boolean expressions with K-maps.']
    when 4 then array['Explain common combinational circuits.','Relate circuits to their truth tables and uses.']
    when 5 then array['Compare memory technologies.','Distinguish volatility and programmability.']
    when 6 then array['Explain flip-flop behaviour.','Trace basic register, counter and state transitions.']
    when 7 then array['Explain A/D and D/A roles.','Compare common logic families at a conceptual level.']
  end,
  case topic_number
    when 1 then '[{"term":"Binary","meaning":"Base-2 positional representation"},{"term":"BCD","meaning":"Binary-coded decimal"},{"term":"ASCII","meaning":"Character encoding standard"},{"term":"Gray code","meaning":"Code designed for single-bit transitions between adjacent values"}]'::jsonb
    when 2 then '[{"term":"Complement","meaning":"Representation used to support binary arithmetic and subtraction"},{"term":"Boolean algebra","meaning":"Algebra of logical values and operations"}]'::jsonb
    when 3 then '[{"term":"SOP","meaning":"Sum of Products form"},{"term":"POS","meaning":"Product of Sums form"},{"term":"K-map","meaning":"Visual method for Boolean simplification"}]'::jsonb
    when 4 then '[{"term":"Multiplexer","meaning":"Selects one input from multiple inputs"},{"term":"Encoder","meaning":"Maps active inputs to a coded output"},{"term":"Decoder","meaning":"Maps coded input to one or more selected outputs"}]'::jsonb
    when 5 then '[{"term":"RAM","meaning":"Read/write memory generally used for working data"},{"term":"ROM","meaning":"Non-volatile read-mostly memory family"},{"term":"EEPROM","meaning":"Electrically erasable programmable ROM"}]'::jsonb
    when 6 then '[{"term":"Flip-flop","meaning":"One-bit state storage element"},{"term":"Register","meaning":"Group of storage elements"},{"term":"Counter","meaning":"Sequential circuit that advances through states"}]'::jsonb
    when 7 then '[{"term":"A/D","meaning":"Analogue-to-digital conversion"},{"term":"D/A","meaning":"Digital-to-analogue conversion"},{"term":"CMOS","meaning":"Complementary MOS logic family"}]'::jsonb
  end,
  case when topic_number in (3,4,6) then 45 else 35 end,
  case when topic_number in (3,6) then 'hard' when topic_number in (1,4) then 'medium' else 'easy' end,
  'published'
from topic_map
on conflict (topic_id) do update set
  lesson_markdown = excluded.lesson_markdown,
  learning_objectives = excluded.learning_objectives,
  key_terms = excluded.key_terms,
  estimated_minutes = excluded.estimated_minutes,
  difficulty = excluded.difficulty,
  status = excluded.status,
  updated_at = now();
