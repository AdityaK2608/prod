-- PrepPath: Bihar STET Computer Science syllabus foundation
-- Source: user-provided Bihar STET Computer Science Exam Pattern/Syllabus 2026.

create table if not exists public.exam_syllabus_units (
  id uuid primary key default gen_random_uuid(),
  exam_variant_id uuid not null references public.exam_variants(id) on delete cascade,
  unit_number integer not null,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  unique (exam_variant_id, unit_number)
);

create table if not exists public.exam_syllabus_topics (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.exam_syllabus_units(id) on delete cascade,
  topic_number integer not null,
  title text not null,
  created_at timestamptz not null default now(),
  unique (unit_id, topic_number)
);

alter table public.exam_syllabus_units enable row level security;
alter table public.exam_syllabus_topics enable row level security;

create policy "Anyone can read syllabus units" on public.exam_syllabus_units
  for select using (true);

create policy "Anyone can read syllabus topics" on public.exam_syllabus_topics
  for select using (true);

with variant as (
  select ev.id
  from public.exam_variants ev
  join public.exam_catalog ec on ec.id = ev.exam_id
  where ec.code = 'BIHAR_STET'
    and ev.paper = 'II'
    and ev.subject = 'Computer Science'
  limit 1
), units(unit_number, title) as (
  values
    (1, 'Digital Logic'),
    (2, 'Computer Organization & Architecture'),
    (3, 'Programming & Data Structures'),
    (4, 'Algorithms'),
    (5, 'Operating System'),
    (6, 'Database Management System'),
    (7, 'Computer Networks'),
    (8, 'Software Engineering'),
    (9, 'Object-Oriented Programming'),
    (10, 'Web-Based Application Development'),
    (11, 'Theory of Computation'),
    (12, 'Internet of Things (IoT)'),
    (13, 'Artificial Intelligence'),
    (14, 'Fundamentals of E-Commerce'),
    (15, 'Multimedia')
)
insert into public.exam_syllabus_units (exam_variant_id, unit_number, title)
select variant.id, units.unit_number, units.title
from variant cross join units
on conflict (exam_variant_id, unit_number) do update
set title = excluded.title;

with unit_map as (
  select u.id, u.unit_number
  from public.exam_syllabus_units u
  join public.exam_variants ev on ev.id = u.exam_variant_id
  join public.exam_catalog ec on ec.id = ev.exam_id
  where ec.code = 'BIHAR_STET'
    and ev.paper = 'II'
    and ev.subject = 'Computer Science'
), topics(unit_number, topic_number, title) as (
  values
    (1, 1, 'Number systems: Binary, Octal, Hexadecimal, BCD, ASCII, EBCDIC, Gray codes.'),
    (1, 2, 'Binary arithmetic, complements, Boolean algebra, Venn diagrams.'),
    (1, 3, 'Logic gates: truth tables, SOP & POS forms, K-map simplification.'),
    (1, 4, 'Combinational circuits: Adder, Subtractor, Encoder, Decoder, Multiplexer, Comparator, Parity Generator.'),
    (1, 5, 'Memory systems: RAM, ROM, EPROM, EEPROM, PLDs & PLAs.'),
    (1, 6, 'Sequential circuits: Flip-Flops (SR, JK, D, T), Registers, Counters, State diagrams.'),
    (1, 7, 'A/D and D/A conversion, Logic families (TTL, ECL, MOS, CMOS).'),
    (2, 1, 'Number systems and conversions, Binary arithmetic.'),
    (2, 2, 'Error detection/correction codes (Parity, Checksum, Hamming).'),
    (2, 3, 'ASCII, EBCDIC, Gray codes, BCD.'),
    (2, 4, 'CPU, Addressing modes, RAM (SRAM, DRAM), ROM (PROM, EPROM, EEPROM).'),
    (2, 5, 'Microprocessor & Microcontroller basics.'),
    (2, 6, 'Logic gates, K-map simplification, ALU design.'),
    (3, 1, 'Data types, Abstract data types, Algorithm design techniques.'),
    (3, 2, 'Arrays (1D, 2D, Sparse Matrices), Recursion & Backtracking.'),
    (3, 3, 'Linked lists: Single, Double, Circular, Polynomial operations.'),
    (3, 4, 'Stack: operations, applications (prefix/postfix evaluation).'),
    (3, 5, 'Queue: Circular, Dequeue, Priority Queue.'),
    (3, 6, 'Searching: Linear, Binary, Hashing.'),
    (3, 7, 'Sorting: Insertion, Selection, Bubble, Heap, Counting, Bucket.'),
    (3, 8, 'Trees: Binary Trees, BST, AVL, B-Tree, Huffman Coding.'),
    (3, 9, 'Graphs: Representation, DFS, BFS.'),
    (4, 1, 'Time & space complexity, Big-O, recurrence relations.'),
    (4, 2, 'Divide & Conquer: Binary search, Merge sort.'),
    (4, 3, 'Dynamic Programming, Graph algorithms, NP-completeness.'),
    (5, 1, 'Functions, structures, and types of OS.'),
    (5, 2, 'Processes: states, scheduling, synchronization, deadlock handling.'),
    (5, 3, 'Memory management: Paging, Segmentation, Virtual memory.'),
    (5, 4, 'File system: organization, allocation, directories, I/O.'),
    (5, 5, 'Protection, security, recovery.'),
    (6, 1, 'DBMS vs File system, 3-level architecture.'),
    (6, 2, 'Relational model: keys, ER model, schema.'),
    (6, 3, 'Normalization (1NF, 2NF, 3NF, BCNF).'),
    (6, 4, 'Transactions, concurrency control, locking, 2-phase commit.'),
    (7, 1, 'Network topologies, models (OSI, TCP/IP).'),
    (7, 2, 'Data transmission, encoding, compression, impairments.'),
    (7, 3, 'Data link layer: framing, flow & error control.'),
    (7, 4, 'Network layer: routing, congestion control, IPv4, ARP.'),
    (7, 5, 'Transport & application layers: UDP, TCP, HTTP, FTP, SMTP.'),
    (8, 1, 'Characteristics & models: Waterfall, Spiral, Prototype.'),
    (8, 2, 'Project estimation (LOC, FP, COCOMO).'),
    (8, 3, 'SRS documentation, structured & object-oriented design.'),
    (8, 4, 'Testing: Unit, System, Black-box, White-box.'),
    (8, 5, 'Software quality & maintenance.'),
    (9, 1, 'Classes, objects, encapsulation, inheritance, polymorphism.'),
    (9, 2, 'Constructors, destructors, abstract classes & methods.'),
    (9, 3, 'Exception handling.'),
    (10, 1, 'Internet basics, HTML, CSS, JavaScript, jQuery.'),
    (10, 2, 'Node.js, Git, PHP, MySQL integration.'),
    (10, 3, 'DOM, XML, Sessions, HTTP forms.'),
    (11, 1, 'DFA, NFA, Regular expressions, Minimization of FA.'),
    (11, 2, 'Context-Free Grammar, CNF, GNF, PDA.'),
    (11, 3, 'Turing Machines, Recursive languages, Halting problem.'),
    (12, 1, 'IoT architecture, Middleware, Protocols (Zigbee, Modbus, RFID).'),
    (12, 2, 'Cloud & Mobile Computing in IoT.'),
    (12, 3, 'IIoT (Industrial IoT), Security & Privacy.'),
    (13, 1, 'Problem-solving, Search strategies (DFS, BFS, Hill climbing).'),
    (13, 2, 'Knowledge representation: Predicate logic, Frames, Rules.'),
    (13, 3, 'Inference: Forward & Backward chaining, Bayesian networks.'),
    (13, 4, 'Planning, Machine Learning, Expert Systems.'),
    (14, 1, 'E-commerce framework & applications.'),
    (14, 2, 'Internet as infrastructure, Firewalls, Network security.'),
    (14, 3, 'Payment systems: Smart cards, Credit cards, Digital tokens.'),
    (14, 4, 'EDI, Digital libraries, Corporate data warehouses.'),
    (15, 1, 'Multimedia basics: Hardware, Software, Applications.'),
    (15, 2, 'Audio (MP3, MIDI), Graphics, Text, Animation, Video.'),
    (15, 3, 'Multimedia project design, Tools, and Future trends.')
)
insert into public.exam_syllabus_topics (unit_id, topic_number, title)
select unit_map.id, topics.topic_number, topics.title
from unit_map join topics using (unit_number)
on conflict (unit_id, topic_number) do update
set title = excluded.title;

comment on table public.exam_syllabus_units is 'Structured syllabus units for supported exam variants.';
comment on table public.exam_syllabus_topics is 'Structured syllabus topics for supported exam units.';
