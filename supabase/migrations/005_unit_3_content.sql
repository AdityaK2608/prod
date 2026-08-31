-- PrepPath: Bihar STET Computer Science — Unit 3 content
-- Source: user-provided Bihar STET Computer Science Syllabus 2026.

with topic_map as (
  select t.id, t.topic_number
  from public.exam_syllabus_topics t
  join public.exam_syllabus_units u on u.id = t.unit_id
  join public.exam_variants ev on ev.id = u.exam_variant_id
  join public.exam_catalog ec on ec.id = ev.exam_id
  where ec.code = 'BIHAR_STET'
    and ev.paper = 'II'
    and ev.subject = 'Computer Science'
    and u.unit_number = 3
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
    when 1 then '## Data types, abstract data types and algorithm design\n\nThis topic establishes the vocabulary used throughout data structures. A data type defines the kind of values and operations a program can work with, while an Abstract Data Type (ADT) describes behaviour and operations without requiring a particular implementation.\n\n### Study focus\n- Primitive and composite data types.\n- ADT as a specification of data and allowed operations.\n- Separating an interface from an implementation.\n- Basic algorithm design techniques and choosing an appropriate representation.\n\n### Exam check\nBe ready to distinguish a data type, an ADT and a concrete implementation, and to match a problem with an appropriate data representation.'
    when 2 then '## Arrays, sparse matrices, recursion and backtracking\n\nArrays store elements in indexed positions and may be one-dimensional or multi-dimensional. Sparse matrices contain many zero or default entries and can benefit from compact representations. Recursion solves a problem by reducing it to smaller instances of itself; backtracking explores choices and reverses them when a partial solution cannot succeed.\n\n### Study focus\n- 1D and 2D array operations.\n- Sparse matrix representation and motivation.\n- Base cases and recursive cases.\n- Backtracking as systematic trial, checking and undoing of choices.\n\n### Exam check\nTrace array indices carefully and identify the stopping condition before tracing a recursive or backtracking procedure.'
    when 3 then '## Linked lists\n\nLinked lists represent a sequence using nodes connected through links. Study singly, doubly and circular linked lists, along with operations involving polynomial representation.\n\n### Study focus\n- Node structure and pointer/reference links.\n- Insertion and deletion in singly linked lists.\n- Forward and backward traversal in doubly linked lists.\n- Circular list traversal and termination.\n- Representing and operating on polynomials using linked nodes.\n\n### Exam check\nFor insertion or deletion questions, identify the links that must change before changing the node references.'
    when 4 then '## Stack and expression processing\n\nA stack follows Last In, First Out (LIFO). Study the core push and pop operations and common expression-processing applications, especially prefix and postfix evaluation.\n\n### Study focus\n- Push, pop and peek operations.\n- Stack overflow and underflow concepts.\n- Prefix and postfix notation.\n- Using a stack to evaluate or transform expressions.\n\n### Exam check\nPractise expression traces step by step, recording the stack contents after each operator or operand.'
    when 5 then '## Queues\n\nA queue follows First In, First Out (FIFO). This topic covers ordinary queues as well as circular queues, deques and priority queues.\n\n### Study focus\n- Enqueue and dequeue operations.\n- Front and rear concepts.\n- Circular queue wrap-around.\n- Deque operations at both ends.\n- Priority-based removal in a priority queue.\n\n### Exam check\nKnow how the front and rear positions change after each operation, especially when a circular queue wraps around.'
    when 6 then '## Searching\n\nSearching locates a required value in a collection. Linear search checks elements sequentially. Binary search repeatedly divides a sorted search interval. Hashing uses a hash function to map keys to locations for fast average-case lookup.\n\n### Study focus\n- Linear search process and cost.\n- Binary search requirements and interval reduction.\n- Hash tables, keys and hash functions.\n- Collision handling at a conceptual level.\n\n### Exam check\nBefore choosing binary search, verify that the data is sorted and that the representation supports the required access pattern.'
    when 7 then '## Sorting\n\nSorting arranges data according to a chosen order. Compare insertion, selection, bubble, heap, counting and bucket sorting by method, typical time cost and data assumptions.\n\n### Study focus\n- Core idea of each sorting method.\n- Number of comparisons and moves at a high level.\n- Heap as a priority-based structure for heap sort.\n- Counting and bucket methods as non-comparison approaches under suitable assumptions.\n\n### Exam check\nWhen comparing algorithms, focus on the defining operation and the conditions under which an algorithm is appropriate.'
    when 8 then '## Trees\n\nTrees model hierarchical relationships. Study binary trees, Binary Search Trees (BSTs), AVL trees, B-trees and Huffman coding.\n\n### Study focus\n- Tree terminology and traversals.\n- BST ordering property.\n- AVL balance and rotations.\n- B-tree structure for large indexed data.\n- Huffman coding as a frequency-based tree construction technique.\n\n### Exam check\nTrace insertion or traversal questions by drawing the tree first; for balanced trees, identify where imbalance occurs and which rotation is required.'
    when 9 then '## Graphs, DFS and BFS\n\nGraphs model relationships between vertices connected by edges. Study common graph representations and the two fundamental traversals: Depth-First Search (DFS) and Breadth-First Search (BFS).\n\n### Study focus\n- Adjacency matrix and adjacency list representations.\n- Visited-state tracking.\n- DFS using depth-oriented exploration.\n- BFS using level-by-level exploration.\n- Recognising traversal order from a given graph.\n\n### Exam check\nFor traversal questions, fix the neighbour-selection order when one is specified and keep a clear visited set.'
  end,
  case topic_number
    when 1 then array['Distinguish data types, ADTs and implementations.','Describe basic algorithm design choices.']
    when 2 then array['Explain array representations and sparse matrices.','Trace recursion and backtracking with correct base and choice cases.']
    when 3 then array['Perform core linked-list operations.','Compare singly, doubly and circular lists.']
    when 4 then array['Explain LIFO behaviour.','Use stacks for prefix/postfix processing.']
    when 5 then array['Explain FIFO behaviour.','Trace circular, deque and priority-queue operations.']
    when 6 then array['Compare linear and binary search.','Explain hashing and the purpose of collision handling.']
    when 7 then array['Compare common sorting approaches.','Identify when counting or bucket methods are suitable.']
    when 8 then array['Explain BST and balanced-tree properties.','Describe AVL, B-tree and Huffman concepts.']
    when 9 then array['Represent graphs in common ways.','Trace DFS and BFS traversal order.']
  end,
  case topic_number
    when 1 then '[{"term":"ADT","meaning":"Abstract Data Type; a behavioural specification independent of implementation"},{"term":"Algorithm","meaning":"A finite, ordered procedure for solving a problem"}]'::jsonb
    when 2 then '[{"term":"Recursion","meaning":"A solution technique in which a function refers to smaller instances of itself"},{"term":"Backtracking","meaning":"A search technique that undoes a choice when a partial solution fails"}]'::jsonb
    when 3 then '[{"term":"Node","meaning":"A linked-list element containing data and link fields"},{"term":"Circular list","meaning":"A linked list in which the final node links back into the list"}]'::jsonb
    when 4 then '[{"term":"LIFO","meaning":"Last In, First Out ordering"},{"term":"Postfix","meaning":"Expression notation in which operators follow their operands"}]'::jsonb
    when 5 then '[{"term":"FIFO","meaning":"First In, First Out ordering"},{"term":"Deque","meaning":"Double-ended queue supporting operations at both ends"}]'::jsonb
    when 6 then '[{"term":"Binary search","meaning":"Search technique that repeatedly halves a sorted search interval"},{"term":"Hash function","meaning":"Function mapping a key to a hash-table location"}]'::jsonb
    when 7 then '[{"term":"Heap sort","meaning":"Sorting method based on a heap data structure"},{"term":"Counting sort","meaning":"Non-comparison sort based on counting key frequencies"}]'::jsonb
    when 8 then '[{"term":"BST","meaning":"Binary Search Tree with an ordering property for keys"},{"term":"AVL tree","meaning":"Self-balancing binary search tree"},{"term":"Huffman coding","meaning":"Frequency-based tree construction used for prefix coding"}]'::jsonb
    when 9 then '[{"term":"DFS","meaning":"Depth-First Search graph traversal"},{"term":"BFS","meaning":"Breadth-First Search graph traversal"},{"term":"Adjacency list","meaning":"Graph representation listing neighbours for each vertex"}]'::jsonb
  end,
  case when topic_number in (2,7,8,9) then 50 else 40 end,
  case when topic_number in (2,7,8,9) then 'hard' when topic_number in (3,6) then 'medium' else 'easy' end,
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
