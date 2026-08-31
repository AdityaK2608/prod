-- PrepPath: Bihar STET Computer Science - Unit 2 content
-- Source scope: user-provided Bihar STET Computer Science syllabus.
-- Unit 2: Computer Organization & Architecture

with topic_map as (
  select
    t.id,
    t.topic_number
  from public.exam_syllabus_topics t
  join public.exam_syllabus_units u on u.id = t.unit_id
  join public.exam_variants ev on ev.id = u.exam_variant_id
  join public.exam_catalog ec on ec.id = ev.exam_id
  where ec.code = 'BIHAR_STET'
    and ev.paper = 'II'
    and ev.subject = 'Computer Science'
    and u.unit_number = 2
)
insert into public.exam_topic_content (
  topic_id,
  lesson_markdown,
  learning_objectives,
  key_terms,
  estimated_minutes,
  difficulty,
  status
)
select
  id,
  case topic_number
    when 1 then '## Number systems and binary arithmetic\n\nComputer systems use positional representations to store and process numeric information. For exam preparation, focus on converting between common bases and carrying out binary arithmetic accurately.\n\n### Study focus\n- Binary, octal, decimal and hexadecimal representation.\n- Positional weights and base conversion.\n- Binary addition and subtraction.\n- Basic use of complements in arithmetic.\n\n### Exam check\nPractice conversions without a calculator and verify the result by converting back to the original base.'
    when 2 then '## Error detection and correction codes\n\nDigital data can be corrupted during storage or transmission. Error-control techniques add redundancy so that a receiver can detect, and in some cases correct, errors.\n\n### Study focus\n- Parity as a simple error-detection method.\n- Checksums as compact summaries used for integrity checking.\n- Hamming codes and the idea of using redundant bits to locate certain errors.\n\n### Exam check\nKnow what each technique is designed to detect or correct and understand the trade-off between additional redundancy and protection.'
    when 3 then '## Character and code representations\n\nComputer systems also use standardized codes to represent characters and values. The STET syllabus specifically calls out ASCII, EBCDIC, Gray code and BCD.\n\n### Study focus\n- ASCII as a character encoding scheme.\n- EBCDIC as a character coding scheme used in some legacy environments.\n- BCD for representing decimal digits using binary-coded groups.\n- Gray code and its single-bit transition property between adjacent values.\n\n### Exam check\nBe able to distinguish numerical representation from character encoding and recognize the key property of each code.'
    when 4 then '## CPU, addressing modes and memory\n\nThe CPU executes instructions and coordinates data movement between processing, memory and I/O components. Addressing modes describe how an instruction identifies the operand it needs.\n\n### Study focus\n- CPU roles: control, arithmetic/logic processing and register use.\n- Common addressing-mode ideas such as immediate, direct and indirect addressing.\n- SRAM versus DRAM.\n- ROM families including PROM, EPROM and EEPROM.\n\n### Exam check\nFor an addressing mode, identify where the operand value comes from. For memory, compare speed, volatility and programmability at a conceptual level.'
    when 5 then '## Microprocessors and microcontrollers\n\nMicroprocessors and microcontrollers both contain processing capability, but they are used in different system designs.\n\n### Study focus\n- Core role of a microprocessor as a CPU-centric component.\n- Microcontrollers as integrated devices that combine processing with memory and peripheral resources.\n- Typical differences in integration, application scope and system design.\n\n### Exam check\nBe able to explain why a microcontroller is attractive in embedded systems and how it differs from a general-purpose microprocessor.'
    when 6 then '## Logic gates, K-maps and ALU design\n\nDigital computation is built from logic operations. K-maps provide a visual method for simplifying Boolean expressions, while an Arithmetic Logic Unit (ALU) performs arithmetic and logical operations inside a processor.\n\n### Study focus\n- Basic and derived logic gates.\n- Truth tables and Boolean expressions.\n- K-map grouping for expression simplification.\n- ALU as a combination of arithmetic and logical functions.\n\n### Exam check\nPractice moving between Boolean expressions, truth tables and simplified circuits, then relate those circuits to the operations an ALU must perform.'
  end,
  case topic_number
    when 1 then array['Convert values between common number systems.','Perform basic binary arithmetic accurately.']
    when 2 then array['Explain parity, checksum and Hamming techniques.','Distinguish error detection from error correction.']
    when 3 then array['Differentiate ASCII, EBCDIC, BCD and Gray code.','Recognize the main purpose of each coding scheme.']
    when 4 then array['Explain core CPU functions and addressing-mode concepts.','Compare SRAM, DRAM and ROM-family characteristics.']
    when 5 then array['Explain the role of a microprocessor.','Compare microprocessors and microcontrollers conceptually.']
    when 6 then array['Use truth tables and Boolean expressions for logic circuits.','Explain K-map simplification and the role of the ALU.']
  end,
  case topic_number
    when 1 then '[{"term":"Base","meaning":"Radix of a positional number system"},{"term":"Complement","meaning":"Representation used to support binary arithmetic and subtraction"}]'::jsonb
    when 2 then '[{"term":"Parity","meaning":"Redundant bit used for simple error detection"},{"term":"Checksum","meaning":"Computed value used to detect data-integrity errors"},{"term":"Hamming code","meaning":"Error-control coding method using redundant bits"}]'::jsonb
    when 3 then '[{"term":"ASCII","meaning":"Character encoding standard"},{"term":"EBCDIC","meaning":"Character coding scheme used in some legacy systems"},{"term":"BCD","meaning":"Binary-coded decimal representation"},{"term":"Gray code","meaning":"Code in which adjacent values differ by one bit"}]'::jsonb
    when 4 then '[{"term":"CPU","meaning":"Central processing unit"},{"term":"Addressing mode","meaning":"Method by which an instruction specifies an operand"},{"term":"SRAM","meaning":"Static random-access memory"},{"term":"DRAM","meaning":"Dynamic random-access memory"}]'::jsonb
    when 5 then '[{"term":"Microprocessor","meaning":"Processor-centric integrated CPU component"},{"term":"Microcontroller","meaning":"Integrated controller combining processing, memory and peripheral resources"}]'::jsonb
    when 6 then '[{"term":"K-map","meaning":"Visual technique for Boolean-expression simplification"},{"term":"ALU","meaning":"Arithmetic Logic Unit"}]'::jsonb
  end,
  case topic_number
    when 1 then 35
    when 2 then 40
    when 3 then 30
    when 4 then 45
    when 5 then 30
    when 6 then 45
  end,
  case
    when topic_number in (2,4,6) then 'hard'
    when topic_number in (1,3) then 'medium'
    else 'easy'
  end,
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
