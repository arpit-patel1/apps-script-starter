/** Seed rows for WordProblems sheet (header + data). */
export const WORD_PROBLEM_HEADERS = [
  'id',
  'grade',
  'type',
  'prompt',
  'answer',
  'answer_unit',
  'difficulty',
  'active',
];

/** Helper keeps seed rows compact and consistent. */
const wp = (id, grade, type, prompt, answer, difficulty, answerUnit = '') => [
  id,
  grade,
  type,
  prompt,
  answer,
  answerUnit,
  difficulty,
  true,
];

/**
 * Curated grade 3–5 word problems across all types and difficulties.
 * New ids are merged into the Sheet on page load via ensureDatabase().
 */
export const WORD_PROBLEM_SEED = [
  // ── Grade 3 · operations ──────────────────────────────────────────
  wp('wp-g3-operations-001', 3, 'operations', 'Maya has 24 stickers. She gives 9 to her friend. How many stickers does Maya have left?', 15, 'easy'),
  wp('wp-g3-operations-002', 3, 'operations', 'A box holds 6 crayons. How many crayons are in 4 boxes?', 24, 'easy'),
  wp('wp-g3-operations-003', 3, 'operations', 'Leo has 18 marbles. He finds 7 more. How many marbles does he have now?', 25, 'easy'),
  wp('wp-g3-operations-004', 3, 'operations', 'A farmer packs 36 apples into bags of 9. How many bags does he fill?', 4, 'medium'),
  wp('wp-g3-operations-005', 3, 'operations', 'There are 8 rows of chairs with 7 chairs in each row. How many chairs are there in all?', 56, 'medium'),
  wp('wp-g3-operations-006', 3, 'operations', 'A school library has 145 fiction books and 87 nonfiction books. How many books is that altogether?', 232, 'hard'),

  // ── Grade 3 · add_then_subtract ───────────────────────────────────
  wp('wp-g3-add_then_subtract-001', 3, 'add_then_subtract', 'Liam collected 18 shells, then found 7 more. Later he lost 5. How many shells does he have now?', 20, 'easy'),
  wp('wp-g3-add_then_subtract-002', 3, 'add_then_subtract', 'Ava had 12 points. She scored 9 more, then lost 4. How many points does she have now?', 17, 'easy'),
  wp('wp-g3-add_then_subtract-003', 3, 'add_then_subtract', 'A bus had 28 passengers. At the next stop, 15 got on and 9 got off. How many passengers are on the bus now?', 34, 'medium'),
  wp('wp-g3-add_then_subtract-004', 3, 'add_then_subtract', 'Sam saved 45 stickers, earned 28 more, then traded away 19. How many stickers does he have left?', 54, 'medium'),
  wp('wp-g3-add_then_subtract-005', 3, 'add_then_subtract', 'A store had 216 pencils. It received 84 new pencils, then sold 97. How many pencils remain?', 203, 'hard'),

  // ── Grade 3 · multiply_and_divide ─────────────────────────────────
  wp('wp-g3-multiply_and_divide-001', 3, 'multiply_and_divide', 'There are 3 packs of erasers with 5 erasers in each pack. The erasers are shared equally among 5 friends. How many does each friend get?', 3, 'easy'),
  wp('wp-g3-multiply_and_divide-002', 3, 'multiply_and_divide', 'Priya buys 4 bags of apples with 6 apples in each bag. She puts them into boxes of 8. How many full boxes can she fill?', 3, 'medium'),
  wp('wp-g3-multiply_and_divide-003', 3, 'multiply_and_divide', 'A coach orders 5 boxes of water bottles with 12 bottles in each box. The bottles are shared equally among 10 players. How many bottles does each player get?', 6, 'medium'),
  wp('wp-g3-multiply_and_divide-004', 3, 'multiply_and_divide', 'A bakery makes 8 trays of muffins with 6 muffins on each tray. The muffins are packed into boxes of 4. How many boxes are needed?', 12, 'hard'),

  // ── Grade 3 · time ────────────────────────────────────────────────
  wp('wp-g3-time-001', 3, 'time', 'Recess starts at 10:00 and lasts 20 minutes. What time does recess end? Write the time as minutes past 10 (for example, 20 means 10:20).', 20, 'easy', 'minutes past 10'),
  wp('wp-g3-time-002', 3, 'time', 'Soccer practice starts at 4:00 and lasts 45 minutes. What time does practice end? Write minutes past 4.', 45, 'easy', 'minutes past 4'),
  wp('wp-g3-time-003', 3, 'time', 'A class starts at 9:15 and lasts 30 minutes. How many minutes past 9:00 does class end?', 45, 'medium', 'minutes past 9:00'),
  wp('wp-g3-time-004', 3, 'time', 'Noah reads from 7:20 to 8:05. How many minutes does he read?', 45, 'medium', 'minutes'),
  wp('wp-g3-time-005', 3, 'time', 'A movie starts at 1:40 and runs for 95 minutes. How many minutes past 1:00 does it end?', 135, 'hard', 'minutes past 1:00'),

  // ── Grade 3 · money ───────────────────────────────────────────────
  wp('wp-g3-money-001', 3, 'money', 'Sofia has $2. She earns $3 more helping with chores. How many dollars does she have now?', 5, 'easy', 'dollars'),
  wp('wp-g3-money-002', 3, 'money', 'Kenji has $8. He spends $3 on a snack. How many dollars does he have left?', 5, 'easy', 'dollars'),
  wp('wp-g3-money-003', 3, 'money', 'A notebook costs $4 and a folder costs $2. How many dollars do both cost?', 6, 'easy', 'dollars'),
  wp('wp-g3-money-004', 3, 'money', 'Maya buys a book for $7 and a bookmark for $2. She pays with a $10 bill. How many dollars does she get back?', 1, 'medium', 'dollars'),
  wp('wp-g3-money-005', 3, 'money', 'Jordan saves $5 each week for 3 weeks. He then spends $8 on art supplies. How many dollars does he have left?', 7, 'medium', 'dollars'),
  wp('wp-g3-money-006', 3, 'money', 'Elena has $12. She buys 3 stickers for $2 each and a pencil for $1. How many dollars does she have left?', 5, 'hard', 'dollars'),

  // ── Grade 3 · measurement ─────────────────────────────────────────
  wp('wp-g3-measurement-001', 3, 'measurement', 'A ribbon is 15 inches long. Sam cuts off 6 inches. How many inches are left?', 9, 'easy', 'inches'),
  wp('wp-g3-measurement-002', 3, 'measurement', 'A desk is 3 feet long. How many inches long is the desk?', 36, 'easy', 'inches'),
  wp('wp-g3-measurement-003', 3, 'measurement', 'A rope is 4 yards long. How many feet long is the rope?', 12, 'medium', 'feet'),
  wp('wp-g3-measurement-004', 3, 'measurement', 'A board is 48 inches long. How many feet long is the board?', 4, 'medium', 'feet'),
  wp('wp-g3-measurement-005', 3, 'measurement', 'A path is 5 yards long. If each yard is 3 feet, and each foot is 12 inches, how many inches long is the path?', 180, 'hard', 'inches'),

  // ── Grade 4 · operations ──────────────────────────────────────────
  wp('wp-g4-operations-001', 4, 'operations', 'A classroom has 28 desks arranged equally in 4 rows. How many desks are in each row?', 7, 'easy'),
  wp('wp-g4-operations-002', 4, 'operations', 'A school orders 36 packs of paper. Each pack has 50 sheets. How many sheets is that in all?', 1800, 'medium'),
  wp('wp-g4-operations-003', 4, 'operations', 'There are 456 students at a school. 189 are in fourth grade. How many students are not in fourth grade?', 267, 'medium'),
  wp('wp-g4-operations-004', 4, 'operations', 'A warehouse ships 125 boxes each day for 8 days. How many boxes does it ship in total?', 1000, 'hard'),
  wp('wp-g4-operations-005', 4, 'operations', 'A stadium has 2,480 seats. If 1,375 seats are filled, how many seats are empty?', 1105, 'hard'),

  // ── Grade 4 · add_then_subtract ───────────────────────────────────
  wp('wp-g4-add_then_subtract-001', 4, 'add_then_subtract', 'A library had 145 books. It received 38 new books, then loaned out 27. How many books are there now?', 156, 'easy'),
  wp('wp-g4-add_then_subtract-002', 4, 'add_then_subtract', 'A garden had 62 tomato plants. Gardeners planted 45 more, then removed 18 that were sick. How many plants remain?', 89, 'medium'),
  wp('wp-g4-add_then_subtract-003', 4, 'add_then_subtract', 'A park had 328 visitors in the morning. 156 more arrived after lunch, then 209 left. How many visitors are still there?', 275, 'medium'),
  wp('wp-g4-add_then_subtract-004', 4, 'add_then_subtract', 'A store started with 1,250 bottles of water. It received 480 more, then sold 795. How many bottles are left?', 935, 'hard'),

  // ── Grade 4 · multiply_and_divide ─────────────────────────────────
  wp('wp-g4-multiply_and_divide-001', 4, 'multiply_and_divide', 'There are 6 packs of markers with 8 markers in each pack. The markers are shared equally among 4 tables. How many markers does each table get?', 12, 'easy'),
  wp('wp-g4-multiply_and_divide-002', 4, 'multiply_and_divide', 'A teacher buys 7 boxes of folders with 12 folders in each box. The folders are shared equally among 6 classrooms. How many folders does each classroom get?', 14, 'medium'),
  wp('wp-g4-multiply_and_divide-003', 4, 'multiply_and_divide', 'A farm collects 9 crates of eggs with 24 eggs in each crate. The eggs are packed into cartons of 12. How many cartons are needed?', 18, 'medium'),
  wp('wp-g4-multiply_and_divide-004', 4, 'multiply_and_divide', 'A factory makes 15 trays of cups with 18 cups on each tray. The cups are packed into boxes of 9. How many boxes are needed?', 30, 'hard'),

  // ── Grade 4 · time ────────────────────────────────────────────────
  wp('wp-g4-time-001', 4, 'time', 'A movie starts at 2:15 and runs for 45 minutes. How many minutes past 2:00 does the movie end? (for example, 60 means 3:00).', 60, 'easy', 'minutes past 2:00'),
  wp('wp-g4-time-002', 4, 'time', 'Soccer practice starts at 3:30 and lasts 50 minutes. How many minutes past 3:00 does practice end?', 80, 'medium', 'minutes past 3:00'),
  wp('wp-g4-time-003', 4, 'time', 'A train leaves at 11:40 and travels for 85 minutes. How many minutes past 11:00 does it arrive?', 125, 'medium', 'minutes past 11:00'),
  wp('wp-g4-time-004', 4, 'time', 'Chloe starts homework at 4:25 and finishes at 5:50. How many minutes did she work?', 85, 'hard', 'minutes'),

  // ── Grade 4 · money ───────────────────────────────────────────────
  wp('wp-g4-money-001', 4, 'money', 'Jordan buys a notebook for $4 and a pack of pencils for $3. He pays with a $10 bill. How many dollars does he get back?', 3, 'easy', 'dollars'),
  wp('wp-g4-money-002', 4, 'money', 'Ava buys 3 erasers for $2 each. How many dollars does she spend?', 6, 'easy', 'dollars'),
  wp('wp-g4-money-003', 4, 'money', 'Sam has $25. He buys a ball for $12 and snacks for $5. How many dollars does he have left?', 8, 'medium', 'dollars'),
  wp('wp-g4-money-004', 4, 'money', 'Priya earns $9 each week for 4 weeks. She spends $18 on a gift. How many dollars does she have left?', 18, 'medium', 'dollars'),
  wp('wp-g4-money-005', 4, 'money', 'A family budget has $120 for groceries. They spend $45 on produce and $38 on dairy. How many dollars remain for other groceries?', 37, 'hard', 'dollars'),

  // ── Grade 4 · measurement ─────────────────────────────────────────
  wp('wp-g4-measurement-001', 4, 'measurement', 'A hallway is 9 feet long. How many inches long is the hallway?', 108, 'easy', 'inches'),
  wp('wp-g4-measurement-002', 4, 'measurement', 'A jug holds 3 gallons. How many quarts is that?', 12, 'easy', 'quarts'),
  wp('wp-g4-measurement-003', 4, 'measurement', 'A bag of flour weighs 5 pounds. How many ounces is that?', 80, 'medium', 'ounces'),
  wp('wp-g4-measurement-004', 4, 'measurement', 'A race is 2 kilometers long. How many meters is that?', 2000, 'medium', 'meters'),
  wp('wp-g4-measurement-005', 4, 'measurement', 'A container holds 4 liters of juice. How many milliliters is that?', 4000, 'hard', 'milliliters'),

  // ── Grade 5 · operations ──────────────────────────────────────────
  wp('wp-g5-operations-001', 5, 'operations', 'A factory ships 48 boxes each day for 7 days. How many boxes does it ship in total?', 336, 'easy'),
  wp('wp-g5-operations-002', 5, 'operations', 'A town has 3,456 households. If 1,289 get a flyer, how many do not?', 2167, 'medium'),
  wp('wp-g5-operations-003', 5, 'operations', 'A truck travels 256 miles each day for 9 days. How many miles does it travel in total?', 2304, 'medium'),
  wp('wp-g5-operations-004', 5, 'operations', 'A warehouse stores 12,480 cans. Workers ship 3,795 cans. How many cans remain?', 8685, 'hard'),
  wp('wp-g5-operations-005', 5, 'operations', 'A printer makes 875 pages per hour for 6 hours. How many pages does it print?', 5250, 'hard'),

  // ── Grade 5 · add_then_subtract ───────────────────────────────────
  wp('wp-g5-add_then_subtract-001', 5, 'add_then_subtract', 'A museum had 2,450 visitors on Monday. It gained 865 on Tuesday, then 1,120 left early. How many visitors are still counted?', 2195, 'easy'),
  wp('wp-g5-add_then_subtract-002', 5, 'add_then_subtract', 'A fundraiser started with $1,280. Donors added $645, then organizers spent $490 on supplies. How many dollars remain?', 1435, 'medium', 'dollars'),
  wp('wp-g5-add_then_subtract-003', 5, 'add_then_subtract', 'A lake measured 3,600 fish. Rangers added 875 fish, then 1,240 were caught. How many fish remain?', 3235, 'medium'),
  wp('wp-g5-add_then_subtract-004', 5, 'add_then_subtract', 'An online store had 8,420 orders. It received 2,365 new orders, then canceled 1,988. How many orders remain active?', 8797, 'hard'),

  // ── Grade 5 · multiply_and_divide ─────────────────────────────────
  wp('wp-g5-multiply_and_divide-001', 5, 'multiply_and_divide', 'A bakery makes 9 trays of muffins with 12 muffins on each tray. The muffins are packed into boxes of 6. How many boxes are needed?', 18, 'easy'),
  wp('wp-g5-multiply_and_divide-002', 5, 'multiply_and_divide', 'A school orders 14 cartons of juice with 24 bottles in each carton. The bottles are shared equally among 8 classes. How many bottles does each class get?', 42, 'medium'),
  wp('wp-g5-multiply_and_divide-003', 5, 'multiply_and_divide', 'A factory packs 16 crates with 36 toys in each crate. The toys are placed into gift bags of 8. How many gift bags are needed?', 72, 'medium'),
  wp('wp-g5-multiply_and_divide-004', 5, 'multiply_and_divide', 'A farm harvests 25 baskets with 48 apples in each. The apples are packed into boxes of 12. How many boxes are filled?', 100, 'hard'),

  // ── Grade 5 · time ────────────────────────────────────────────────
  wp('wp-g5-time-001', 5, 'time', 'Priya practices piano for 25 minutes on Monday and 35 minutes on Tuesday. How many total minutes did she practice?', 60, 'easy', 'minutes'),
  wp('wp-g5-time-002', 5, 'time', 'A flight leaves at 6:50 and lasts 2 hours 35 minutes. How many minutes past 6:00 does it land?', 285, 'medium', 'minutes past 6:00'),
  wp('wp-g5-time-003', 5, 'time', 'Ben studies from 7:15 to 8:40, then from 9:00 to 9:25. How many total minutes did he study?', 110, 'medium', 'minutes'),
  wp('wp-g5-time-004', 5, 'time', 'A workshop starts at 10:35 and ends at 12:20. How many minutes long is the workshop?', 105, 'hard', 'minutes'),

  // ── Grade 5 · money ───────────────────────────────────────────────
  wp('wp-g5-money-001', 5, 'money', 'Ava saves $15 each week for 4 weeks. She then spends $22 on a gift. How many dollars does she have left?', 38, 'easy', 'dollars'),
  wp('wp-g5-money-002', 5, 'money', 'A family buys 5 movie tickets for $9 each. They pay with a $50 bill. How many dollars do they get back?', 5, 'medium', 'dollars'),
  wp('wp-g5-money-003', 5, 'money', 'Omar earns $18 an hour for 6 hours. He spends $45 on supplies. How many dollars does he have left?', 63, 'medium', 'dollars'),
  wp('wp-g5-money-004', 5, 'money', 'A club raises $240. They buy 8 posters for $7 each and save the rest. How many dollars do they save?', 184, 'hard', 'dollars'),

  // ── Grade 5 · measurement ─────────────────────────────────────────
  wp('wp-g5-measurement-001', 5, 'measurement', 'A trail is 2 kilometers long. If each kilometer is 1000 meters, how many meters long is the trail?', 2000, 'easy', 'meters'),
  wp('wp-g5-measurement-002', 5, 'measurement', 'A bottle holds 750 milliliters. How many of these bottles equal 3 liters?', 4, 'medium'),
  wp('wp-g5-measurement-003', 5, 'measurement', 'A suitcase weighs 12 kilograms. How many grams is that?', 12000, 'medium', 'grams'),
  wp('wp-g5-measurement-004', 5, 'measurement', 'A fence is 15 yards long. How many inches long is the fence?', 540, 'hard', 'inches'),
];

export const CONFIG_HEADERS = ['key', 'value'];

export const CONFIG_SEED = [
  ['mult_grade_3_min', 1],
  ['mult_grade_3_max', 10],
  ['mult_grade_4_min', 1],
  ['mult_grade_4_max', 12],
  ['mult_grade_5_min', 2],
  ['mult_grade_5_max', 15],
  ['home_quote_count', 3],
];

export const QUOTE_HEADERS = ['id', 'quote', 'author', 'theme', 'active'];

export const QUOTE_SEED = [
  ['q-001', 'The only way to learn mathematics is to do mathematics.', 'Paul Halmos', 'math', true],
  [
    'q-002',
    'It always seems impossible until it is done.',
    'Nelson Mandela',
    'perseverance',
    true,
  ],
  [
    'q-003',
    'Reading is to the mind what exercise is to the body.',
    'Joseph Addison',
    'ela',
    true,
  ],
  [
    'q-004',
    'Curiosity is the wick in the candle of learning.',
    'William Arthur Ward',
    'curiosity',
    true,
  ],
  [
    'q-005',
    'Geography is the subject which holds the key to our past, present and future.',
    'Michael Palin',
    'geography',
    true,
  ],
  [
    'q-006',
    'Mistakes are proof that you are trying.',
    'Jennifer Lim',
    'growth',
    true,
  ],
  [
    'q-007',
    'The more that you read, the more things you will know.',
    'Dr. Seuss',
    'ela',
    true,
  ],
  [
    'q-008',
    'Geometry is the archetype of the beauty of the world.',
    'Johannes Kepler',
    'geometry',
    true,
  ],
  [
    'q-009',
    'Small steps every day still take you somewhere new.',
    'Kids Playground',
    'growth',
    true,
  ],
  [
    'q-010',
    'Ask questions. Try again. Celebrate the try.',
    'Kids Playground',
    'curiosity',
    true,
  ],
];
