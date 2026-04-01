-- ============================================================
-- Seed Data for Car Dealership
-- Run this after your Supabase migrations are applied.
-- ============================================================
-- Expected table schemas (summary):
--
--  cars (id uuid, stock_number text, make text, model text, year int,
--        variant text, price numeric, mileage int, transmission text,
--        fuel_type text, body_type text, exterior_color text,
--        status text, is_featured bool, condition_rating text,
--        condition_details jsonb, requirements_docs jsonb,
--        images jsonb, description text,
--        created_at timestamptz, updated_at timestamptz)
--
--  testimonials (id uuid, customer_name text, message text,
--                rating int, car_purchased text, is_approved bool,
--                avatar_url text, created_at timestamptz)
--
--  seller_submissions (id uuid, full_name text, email text,
--                      phone text, make text, model text, year int,
--                      mileage int, asking_price numeric,
--                      condition_notes text, income_range text,
--                      selling_reason text, status text,
--                      images jsonb, created_at timestamptz,
--                      updated_at timestamptz)
-- ============================================================

-- ----------------------------------------------------------------
-- CARS  (10 listings: 7 available · 1 reserved · 2 sold · 2 featured)
-- ----------------------------------------------------------------
INSERT INTO cars (
  id, stock_number, make, model, year, variant,
  price, mileage, transmission, fuel_type, body_type, exterior_color,
  status, is_featured, condition_rating,
  condition_details, requirements_docs, images, description,
  created_at, updated_at
) VALUES

-- 1. Toyota Fortuner 2020 · available · featured
(
  '10000000-0000-0000-0000-000000000001',
  'STK-260401-0001',
  'Toyota', 'Fortuner', 2020, 'V 4x4 AT',
  1750000, 45000, 'automatic', 'diesel', 'suv', 'Pearl White',
  'available', TRUE, 'excellent',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "excellent",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0001-ef/800/600",   "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0001-er/800/600",   "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0001-if/800/600",   "category": "interior_front",  "label": "Interior Front", "is_primary": false},
    {"url": "https://placehold.co/800x600/1e3a5f/ffffff?text=Engine+Bay", "category": "engine", "label": "Engine Bay",  "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0001-od/800/600",   "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  'Well-maintained 2020 Toyota Fortuner V 4x4 AT in Pearl White. Single owner, complete service records. Features leather seats, Android Auto/Apple CarPlay, and a panoramic sunroof. Perfect family SUV in near-new condition.',
  NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
),

-- 2. Honda CR-V 2019 · available
(
  '10000000-0000-0000-0000-000000000002',
  'STK-260401-0002',
  'Honda', 'CR-V', 2019, 'S+ AWD CVT',
  1450000, 62000, 'cvt', 'gasoline', 'suv', 'Modern Steel Metallic',
  'available', FALSE, 'very_good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "Minor tune-up done at 60,000 km.",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "good",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0002-ef/800/600",   "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0002-er/800/600",   "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Interior+Front", "category": "interior_front", "label": "Interior Front", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0002-en/800/600",   "category": "engine",          "label": "Engine Bay",     "is_primary": false}
  ]'::jsonb,
  '2019 Honda CR-V S+ AWD CVT in Modern Steel Metallic. Dual panoramic sunroof, Honda Sensing safety suite, and wireless Apple CarPlay. Well-cared for with complete PMS records from Honda dealership.',
  NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
),

-- 3. Mitsubishi Montero Sport 2021 · available
(
  '10000000-0000-0000-0000-000000000003',
  'STK-260401-0003',
  'Mitsubishi', 'Montero Sport', 2021, 'GT Premium 4WD AT',
  1650000, 28000, 'automatic', 'diesel', 'suv', 'Quartz White Pearl',
  'available', FALSE, 'excellent',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "excellent",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale", "Loan Release Documents"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0003-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0003-el/800/600",  "category": "exterior_left",   "label": "Left Side",      "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0003-if/800/600",  "category": "interior_front",  "label": "Interior Front", "is_primary": false},
    {"url": "https://placehold.co/800x600/1e3a5f/ffffff?text=Engine+Bay", "category": "engine", "label": "Engine Bay", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0003-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  '2021 Mitsubishi Montero Sport GT Premium 4WD AT. Low mileage at only 28,000 km. Packed with advanced driver-assistance features, 360-degree camera, and premium Nappa leather upholstery. Practically brand new.',
  NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
),

-- 4. Toyota Vios 2021 · available
(
  '10000000-0000-0000-0000-000000000004',
  'STK-260401-0004',
  'Toyota', 'Vios', 2021, '1.3 XLE CVT',
  650000, 38500, 'cvt', 'gasoline', 'sedan', 'Super White',
  'available', FALSE, 'very_good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "good",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0004-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0004-er/800/600",  "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Dashboard", "category": "dashboard", "label": "Dashboard", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0004-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  '2021 Toyota Vios 1.3 XLE CVT in Super White. Fuel-efficient city car with Toyota Safety Sense, 7-inch infotainment system, and rear parking camera. Ideal first car or daily driver.',
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'
),

-- 5. Honda Civic 2020 · available · featured
(
  '10000000-0000-0000-0000-000000000005',
  'STK-260401-0005',
  'Honda', 'Civic', 2020, '1.5 RS Turbo CVT',
  950000, 55000, 'cvt', 'gasoline', 'sedan', 'Lunar Silver Metallic',
  'available', TRUE, 'very_good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": ["front_bumper"],
    "repaint_notes": "Minor scrape on front bumper repainted to factory colour. No structural damage.",
    "mechanical_issues": false,
    "mechanical_notes": "",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "good",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0005-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0005-er/800/600",  "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0005-if/800/600",  "category": "interior_front",  "label": "Interior Front", "is_primary": false},
    {"url": "https://placehold.co/800x600/1e3a5f/ffffff?text=Engine+Bay", "category": "engine", "label": "Engine Bay", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0005-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  '2020 Honda Civic 1.5 RS Turbo CVT in Lunar Silver Metallic. Sporty and practical with Honda Sensing, paddle shifters, and sport seats. Complete service history. A minor touch-up on the front bumper — paint is perfect match.',
  NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),

-- 6. Ford Everest 2018 · reserved
(
  '10000000-0000-0000-0000-000000000006',
  'STK-260401-0006',
  'Ford', 'Everest', 2018, 'Titanium+ 4WD BiTurbo AT',
  1350000, 78000, 'automatic', 'diesel', 'suv', 'Smoke Grey',
  'reserved', FALSE, 'good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "Timing belt replaced at 70,000 km. All fluids recently changed.",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "fair",
    "modifications": true,
    "modification_notes": "Aftermarket roof rack and side steps installed. Easily removable."
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale", "Insurance Policy"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0006-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0006-er/800/600",  "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Interior", "category": "interior_front", "label": "Interior Front", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0006-en/800/600",  "category": "engine",          "label": "Engine Bay",     "is_primary": false}
  ]'::jsonb,
  '2018 Ford Everest Titanium+ 4WD BiTurbo AT in Smoke Grey. 7-seater with SYNC 3 infotainment, adaptive cruise control, and bi-xenon HID headlights. Recently serviced. Currently reserved — contact us for waitlist.',
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 days'
),

-- 7. Hyundai Tucson 2019 · available
(
  '10000000-0000-0000-0000-000000000007',
  'STK-260401-0007',
  'Hyundai', 'Tucson', 2019, '2.0 CRDi GL 6AT 4WD',
  1100000, 67000, 'automatic', 'diesel', 'suv', 'Magnetic Force',
  'available', FALSE, 'good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "Brake pads replaced at 65,000 km.",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "good",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0007-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Exterior+Rear", "category": "exterior_rear", "label": "Rear View", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0007-if/800/600",  "category": "interior_front",  "label": "Interior Front", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0007-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  '2019 Hyundai Tucson 2.0 CRDi GL 6AT 4WD in Magnetic Force. Smart cruise control, lane-departure warning, and panoramic sunroof. Reliable everyday SUV with consistent Hyundai dealer maintenance.',
  NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'
),

-- 8. Toyota Camry 2018 · available
(
  '10000000-0000-0000-0000-000000000008',
  'STK-260401-0008',
  'Toyota', 'Camry', 2018, '2.5V AT',
  1200000, 82000, 'automatic', 'gasoline', 'sedan', 'Midnight Black Metallic',
  'available', FALSE, 'good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "Engine oil and all filters changed at 80,000 km.",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "good",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0008-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0008-er/800/600",  "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://placehold.co/800x600/1e3a5f/ffffff?text=Interior+Front", "category": "interior_front", "label": "Interior Front", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0008-en/800/600",  "category": "engine",          "label": "Engine Bay",     "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0008-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  '2018 Toyota Camry 2.5V AT in Midnight Black Metallic. Executive sedan with JBL premium sound, 10-inch touchscreen, wireless charging, and Toyota Safety Sense. Smooth highway cruiser with well-documented PMS history.',
  NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'
),

-- 9. Mitsubishi Lancer 2016 · sold
(
  '10000000-0000-0000-0000-000000000009',
  'STK-260401-0009',
  'Mitsubishi', 'Lancer', 2016, 'EX 2.0 GTA',
  450000, 125000, 'automatic', 'gasoline', 'sedan', 'Labrador White',
  'sold', FALSE, 'fair',
  '{
    "accident_history": true,
    "accident_notes": "Minor rear-end collision in 2019. Repaired at Mitsubishi authorised body shop. No chassis damage.",
    "flood_damage": false,
    "repainted_panels": ["rear_bumper", "trunk_lid"],
    "repaint_notes": "Rear bumper and trunk lid repainted after repair. Good colour match.",
    "mechanical_issues": false,
    "mechanical_notes": "All mechanicals sound. New battery installed 2025.",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "fair",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0009-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Rear+View", "category": "exterior_rear", "label": "Rear View", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0009-if/800/600",  "category": "interior_front",  "label": "Interior Front", "is_primary": false}
  ]'::jsonb,
  '2016 Mitsubishi Lancer EX 2.0 GTA — SOLD. Sporty Lancer with Rockford Fosgate sound system and leather seats. High mileage but well maintained.',
  NOW() - INTERVAL '45 days', NOW() - INTERVAL '30 days'
),

-- 10. Hyundai Accent 2020 · sold
(
  '10000000-0000-0000-0000-000000000010',
  'STK-260401-0010',
  'Hyundai', 'Accent', 2020, '1.4 GL 6AT',
  380000, 48000, 'automatic', 'gasoline', 'sedan', 'Polar White',
  'sold', FALSE, 'good',
  '{
    "accident_history": false,
    "accident_notes": "",
    "flood_damage": false,
    "repainted_panels": [],
    "repaint_notes": "",
    "mechanical_issues": false,
    "mechanical_notes": "",
    "dashboard_warnings": false,
    "ac_functional": true,
    "power_accessories_working": true,
    "tire_condition": "good",
    "modifications": false,
    "modification_notes": ""
  }'::jsonb,
  '["OR/CR (Official Receipt / Certificate of Registration)", "Government-issued ID", "Proof of Billing", "Notarized Deed of Sale"]'::jsonb,
  '[
    {"url": "https://picsum.photos/seed/stk0010-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/stk0010-er/800/600",  "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Dashboard", "category": "dashboard", "label": "Dashboard", "is_primary": false},
    {"url": "https://picsum.photos/seed/stk0010-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  '2020 Hyundai Accent 1.4 GL 6AT — SOLD. Compact and fuel-efficient sedan with Apple CarPlay, Android Auto, and rear camera. Great entry-level choice for city driving.',
  NOW() - INTERVAL '40 days', NOW() - INTERVAL '28 days'
);

-- ----------------------------------------------------------------
-- TESTIMONIALS  (4 approved reviews)
-- ----------------------------------------------------------------
INSERT INTO testimonials (
  id, customer_name, message, rating, car_purchased,
  is_approved, avatar_url, created_at
) VALUES

(
  '20000000-0000-0000-0000-000000000001',
  'Maria Santos',
  'I bought a Toyota Fortuner here and the whole experience was fantastic! The team was transparent about the car''s history and even let me bring it to my own mechanic before finalising. No pressure at all. I''ve already recommended them to three friends!',
  5,
  'Toyota Fortuner 2020 V 4x4 AT',
  TRUE,
  'https://picsum.photos/seed/avatar-maria/100/100',
  NOW() - INTERVAL '14 days'
),

(
  '20000000-0000-0000-0000-000000000002',
  'Juan dela Cruz',
  'Got my Honda Civic RS Turbo at a very competitive price. The stock number system made tracking the car easy and all the documents were ready on time. Transfer of ownership was smooth — done in less than a week!',
  5,
  'Honda Civic 2020 1.5 RS Turbo CVT',
  TRUE,
  'https://picsum.photos/seed/avatar-juan/100/100',
  NOW() - INTERVAL '9 days'
),

(
  '20000000-0000-0000-0000-000000000003',
  'Ana Reyes',
  'I was hesitant at first buying a used car, but the detailed condition report they provided — including photos of every panel — gave me full confidence. My Vios is running perfectly. Highly recommended for first-time buyers!',
  4,
  'Toyota Vios 2021 1.3 XLE CVT',
  TRUE,
  'https://picsum.photos/seed/avatar-ana/100/100',
  NOW() - INTERVAL '22 days'
),

(
  '20000000-0000-0000-0000-000000000004',
  'Roberto Garcia',
  'Sold my old car through their seller submission form and the process was stress-free. They gave a fair valuation within two days and handled everything from inspection to documentation. Will definitely transact with them again!',
  5,
  'Hyundai Tucson 2019 2.0 CRDi GL 6AT',
  TRUE,
  'https://picsum.photos/seed/avatar-roberto/100/100',
  NOW() - INTERVAL '6 days'
);

-- ----------------------------------------------------------------
-- SELLER SUBMISSIONS  (1 pending · 1 approved)
-- ----------------------------------------------------------------
INSERT INTO seller_submissions (
  id, full_name, email, phone,
  make, model, year, mileage, asking_price,
  condition_notes, income_range, selling_reason,
  status, images, created_at, updated_at
) VALUES

-- Pending submission
(
  '30000000-0000-0000-0000-000000000001',
  'Jose Mendoza',
  'jose.mendoza@email.com',
  '+639171234567',
  'Nissan', 'Navara', 2018, 95000, 900000,
  'Overall good condition. Some scratches on the driver-side door. Engine runs well. AC needs re-gassing. Complete OR/CR.',
  '₱50,001 – ₱100,000',
  'upgrade',
  'pending',
  '[
    {"url": "https://picsum.photos/seed/sub0001-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://picsum.photos/seed/sub0001-er/800/600",  "category": "exterior_rear",   "label": "Rear View",      "is_primary": false},
    {"url": "https://picsum.photos/seed/sub0001-if/800/600",  "category": "interior_front",  "label": "Interior Front", "is_primary": false}
  ]'::jsonb,
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
),

-- Approved submission
(
  '30000000-0000-0000-0000-000000000002',
  'Carmen Bautista',
  'carmen.bautista@email.com',
  '+639289876543',
  'Toyota', 'Innova', 2017, 110000, 820000,
  'Well-maintained Toyota Innova E MT Diesel. No accidents, no flood. Complete service records from Toyota dealer. Minor dent on rear quarter panel — priced accordingly.',
  '₱30,001 – ₱50,000',
  'too_many_vehicles',
  'approved',
  '[
    {"url": "https://picsum.photos/seed/sub0002-ef/800/600",  "category": "exterior_front",  "label": "Front View",     "is_primary": true},
    {"url": "https://placehold.co/800x600/374151/ffffff?text=Rear+View", "category": "exterior_rear", "label": "Rear View", "is_primary": false},
    {"url": "https://picsum.photos/seed/sub0002-en/800/600",  "category": "engine",          "label": "Engine Bay",     "is_primary": false},
    {"url": "https://picsum.photos/seed/sub0002-od/800/600",  "category": "odometer",        "label": "Odometer",       "is_primary": false}
  ]'::jsonb,
  NOW() - INTERVAL '10 days', NOW() - INTERVAL '7 days'
);
