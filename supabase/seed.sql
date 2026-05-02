-- ====================================================================
-- ACADA WEB3 HACKATHON SEED FILE
-- Generated to provide a realistic, fully-populated database state
-- ====================================================================

-- 1. Organizations
INSERT INTO public.organizations (id, name, slug, logo_url)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Acada Tech Academy', 'acada-tech', 'https://bafybeicx2z3z4v.ipfs.nftstorage.link/logo.png')
ON CONFLICT (id) DO NOTHING;

-- 2. Users (Real Web3Auth users provided for the demo)
INSERT INTO public.users (id, email, full_name, role, solana_wallet_address)
VALUES 
  ('62cee7dc-d053-4dcf-87f2-5339af5ee604', 'eusang244132@stu.ui.edu.ng', 'Emmanuel Usang', 'STUDENT', 'AqCixpvqJrRE1KJPvp8DXv4tzXAc2Jeb2ntzmXudwFTt'),
  ('31f386f0-4062-4e1a-b9b7-083845ef6a09', 'kingusang09@gmail.com', 'King Usang', 'TUTOR', '4UXayqtV5shU6ZR7fqzZoeecDWHZ7RmAbL4LHYrZztyV')
ON CONFLICT (id) DO UPDATE SET 
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  solana_wallet_address = EXCLUDED.solana_wallet_address;

-- 3. Organization Members (Making King Usang an ORG_ADMIN as well so he can create courses)
INSERT INTO public.organization_members (id, organization_id, user_id, role)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '31f386f0-4062-4e1a-b9b7-083845ef6a09', 'ORG_ADMIN')
ON CONFLICT (id) DO NOTHING;

-- 4. Courses
INSERT INTO public.courses (id, organization_id, title, description, price_usdc)
VALUES 
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'O-level/UTME Physics', 'Master the fundamentals of Physics for O-level and UTME exams.', 15.00),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'O-level/UTME Chemistry', 'Comprehensive guide to organic and inorganic chemistry.', 15.00),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'MTH-102: Calculus and Trigonometry', 'Advanced mathematics covering differentiation, integration, and trig identities.', 20.00)
ON CONFLICT (id) DO NOTHING;

-- 5. Course Tutors (King Usang teaches all three)
INSERT INTO public.course_tutors (id, course_id, tutor_id)
VALUES 
  ('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', '31f386f0-4062-4e1a-b9b7-083845ef6a09'),
  ('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333332', '31f386f0-4062-4e1a-b9b7-083845ef6a09'),
  ('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333333', '31f386f0-4062-4e1a-b9b7-083845ef6a09')
ON CONFLICT (id) DO NOTHING;

-- 6. Lessons
INSERT INTO public.lessons (id, course_id, title, type, order_index)
VALUES 
  ('55555555-5555-5555-5555-555555555511', '33333333-3333-3333-3333-333333333331', 'Kinematics & Motion', 'RECORDED', 1),
  ('55555555-5555-5555-5555-555555555512', '33333333-3333-3333-3333-333333333331', 'Dynamics & Newtons Laws', 'LIVE', 2),
  ('55555555-5555-5555-5555-555555555513', '33333333-3333-3333-3333-333333333331', 'Work, Energy, and Power', 'LIVE', 3),
  ('55555555-5555-5555-5555-555555555521', '33333333-3333-3333-3333-333333333332', 'Atomic Structure', 'RECORDED', 1),
  ('55555555-5555-5555-5555-555555555531', '33333333-3333-3333-3333-333333333333', 'Limits and Continuity', 'LIVE', 1)
ON CONFLICT (id) DO NOTHING;

-- 7. Sessions (Livekit classes)
-- One completed session, one currently live, one future.
INSERT INTO public.sessions (id, lesson_id, title, livekit_room_name, scheduled_at, ended_at, recording_url, created_at)
VALUES 
  ('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555512', 'Newton''s Laws Masterclass', 'room-session-1', '2026-05-01T10:00:00Z', '2026-05-01T11:05:00Z', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', NOW()),
  ('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555513', 'Live Problem Solving: Energy', 'room-session-2', '2026-05-02T14:00:00Z', NULL, NULL, NOW()),
  ('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555531', 'Calculus Intro Q&A', 'room-session-3', '2026-05-10T10:00:00Z', NULL, NULL, NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. Enrollments (Emmanuel is enrolled in Physics and Calculus)
INSERT INTO public.enrollments (id, user_id, course_id, status)
VALUES 
  ('77777777-7777-7777-7777-777777777771', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333331', 'ACTIVE'),
  ('77777777-7777-7777-7777-777777777772', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333333', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 9. Payments (Realistic Solana Devnet transaction hashes)
INSERT INTO public.payments (id, user_id, course_id, amount, currency, status, transaction_ref)
VALUES 
  ('88888888-8888-8888-8888-888888888881', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333331', 15.00, 'USDC', 'COMPLETED', '4e5Xv3b9aPZ91LqK1Gv5mNnN8F3nDZ5KWeZ7Q9x2vE7oJ9M4qL'),
  ('88888888-8888-8888-8888-888888888882', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333333', 20.00, 'USDC', 'COMPLETED', '5yG2v3b9aPZ91LqK1Gv5mNnN8F3nDZ5KWeZ7Q9x2vE7oJ9M4qL')
ON CONFLICT (id) DO NOTHING;

-- 10. Course Progress
INSERT INTO public.course_progress (id, user_id, course_id, progress_percent, completed)
VALUES 
  ('99999999-9999-9999-9999-999999999991', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333331', 100, true),
  ('99999999-9999-9999-9999-999999999992', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333333', 25, false)
ON CONFLICT (id) DO NOTHING;

-- 11. Attendance Logs
-- Emmanuel fully attended session 1 (triggering the 70% threshold), and is currently in session 2.
INSERT INTO public.attendance_logs (id, session_id, user_id, join_time, leave_time)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666661', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '2026-05-01T10:06:00Z', '2026-05-01T11:04:00Z'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '66666666-6666-6666-6666-666666666662', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '2026-05-02T14:03:00Z', NULL)
ON CONFLICT (id) DO NOTHING;

-- 12. Quizzes
-- Quiz 1 is the final assessment (lesson_id IS NULL) which gates the certificate.
INSERT INTO public.quizzes (id, course_id, lesson_id, title, passing_score, quiz_data)
VALUES 
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '33333333-3333-3333-3333-333333333331', NULL, 'Final Assessment: UTME Physics', 80, 
   '{"time_limit_minutes": 30, "max_attempts": 3, "questions": [{"id": "q1", "type": "MULTIPLE_CHOICE", "question": "What is the SI unit of Force?", "options": ["Newton", "Joule", "Watt", "Pascal"], "correct_answer": 0, "marks": 50}, {"id": "q2", "type": "TRUE_FALSE", "question": "Acceleration is the rate of change of velocity.", "options": ["True", "False"], "correct_answer": 0, "marks": 50}]}'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '33333333-3333-3333-3333-333333333332', '55555555-5555-5555-5555-555555555521', 'Chemistry Quiz 1', 60, 
   '{"time_limit_minutes": 15, "max_attempts": 0, "questions": [{"id": "q3", "type": "SHORT_ANSWER", "question": "What is the atomic number of Carbon?", "marks": 100}]}')
ON CONFLICT (id) DO NOTHING;

-- 13. Quiz Attempts
-- Emmanuel took the final Physics quiz and passed with 100%.
INSERT INTO public.quiz_attempts (id, user_id, quiz_id, score, is_passed, answers, completed_at)
VALUES 
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', '62cee7dc-d053-4dcf-87f2-5339af5ee604', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 100, true, '{"q1": 0, "q2": 0}', '2026-05-01T12:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- 14. Milestones
-- Since Emmanuel attended the live class and passed the final quiz, his milestone is generated.
INSERT INTO public.milestones (id, user_id, course_id, type, status, transaction_hash, metadata)
VALUES 
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333331', 'COURSE_COMPLETE', 'MINTED', '4zHqU3h2zJjFMyb8p6R5eFqHkL2XkQ5vE7oJ9M4qL', '{"attendance_pct": 100, "quiz_score": 100}')
ON CONFLICT (id) DO NOTHING;

-- 15. Certificates
-- Emmanuel''s successfully minted NFT certificate.
INSERT INTO public.certificates (id, user_id, course_id, milestone_id, mint_address, ipfs_url)
VALUES 
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', '62cee7dc-d053-4dcf-87f2-5339af5ee604', '33333333-3333-3333-3333-333333333331', 'dddddddd-dddd-dddd-dddd-ddddddddddd1', '7dKzXv8CXwzYtP4o5Fk3N9mB2j1Vq6Rt8pXm4N', 'ipfs://bafkreifh3z3z4v2m4n5b6v7c8x9z0')
ON CONFLICT (id) DO NOTHING;
