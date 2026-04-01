// ============================================================
// Static constants for the car dealership platform
// ============================================================

// ----------------------------------------------------------------
// Car makes (25 popular brands)
// ----------------------------------------------------------------
export const CAR_MAKES = [
  'Toyota',
  'Honda',
  'Mitsubishi',
  'Ford',
  'Hyundai',
  'Nissan',
  'Suzuki',
  'Mazda',
  'Isuzu',
  'Kia',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Subaru',
  'Chevrolet',
  'Jeep',
  'Land Rover',
  'Lexus',
  'Volvo',
  'BYD',
  'Geely',
  'MG',
  'Chery',
  'Peugeot',
] as const;

// ----------------------------------------------------------------
// Car models mapped to each make
// ----------------------------------------------------------------
export const CAR_MODELS: Record<string, string[]> = {
  Toyota: [
    'Fortuner', 'Vios', 'Camry', 'Corolla Altis', 'Innova',
    'HiLux', 'Rush', 'Land Cruiser', 'RAV4', 'Wigo',
    'Avanza', 'Yaris', 'GR86', 'Veloz',
  ],
  Honda: [
    'CR-V', 'Civic', 'City', 'HR-V', 'BR-V',
    'Jazz', 'Accord', 'Pilot', 'Mobilio', 'WR-V',
  ],
  Mitsubishi: [
    'Montero Sport', 'Outlander', 'Eclipse Cross', 'Strada',
    'Mirage', 'Mirage G4', 'Xpander', 'L300', 'Lancer',
  ],
  Ford: [
    'Everest', 'Ranger', 'Explorer', 'EcoSport',
    'Mustang', 'F-150', 'Territory', 'Bronco',
  ],
  Hyundai: [
    'Tucson', 'Santa Fe', 'Accent', 'Elantra',
    'Starex', 'Kona', 'Creta', 'Ioniq 5', 'Palisade',
  ],
  Nissan: [
    'Navara', 'Terra', 'Almera', 'Patrol',
    'X-Trail', 'Kicks', 'Juke', 'GT-R',
  ],
  Suzuki: [
    'Vitara', 'Jimny', 'Swift', 'Ertiga',
    'Dzire', 'Celerio', 'Alto', 'S-Presso',
  ],
  Mazda: [
    'CX-5', 'CX-3', 'CX-30', 'CX-90',
    'Mazda3', 'Mazda2', 'BT-50', 'MX-5',
  ],
  Isuzu: ['D-Max', 'mu-X', 'Crosswind'],
  Kia: [
    'Sportage', 'Sorento', 'Carnival', 'Stonic',
    'Soluto', 'Picanto', 'EV6', 'Seltos',
  ],
  Volkswagen: [
    'Golf', 'Polo', 'Tiguan', 'T-Cross',
    'Lamando', 'Lavida', 'Santana',
  ],
  BMW: [
    '3 Series', '5 Series', '7 Series',
    'X1', 'X3', 'X5', 'X7', 'M3', 'M5',
  ],
  'Mercedes-Benz': [
    'A-Class', 'C-Class', 'E-Class', 'S-Class',
    'GLA', 'GLC', 'GLE', 'GLS', 'AMG GT',
  ],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron'],
  Subaru: ['Forester', 'Outback', 'XV', 'BRZ', 'WRX', 'Levorg'],
  Chevrolet: ['Colorado', 'Trailblazer', 'Captiva', 'Spark', 'Camaro'],
  Jeep: ['Wrangler', 'Compass', 'Cherokee', 'Grand Cherokee', 'Renegade'],
  'Land Rover': ['Discovery', 'Range Rover', 'Defender', 'Freelander', 'Evoque'],
  Lexus: ['LX', 'GX', 'RX', 'NX', 'UX', 'ES', 'IS', 'LS'],
  Volvo: ['XC90', 'XC60', 'XC40', 'S60', 'V60', 'EX30'],
  BYD: ['Atto 3', 'Seal', 'Dolphin', 'Han', 'Tang'],
  Geely: ['Coolray', 'Okavango', 'Emgrand X7', 'Radar RD6'],
  MG: ['ZS', 'ZS EV', 'HS', 'VS', 'RX5'],
  Chery: ['Tiggo 8 Pro', 'Tiggo 7 Pro', 'Tiggo 5x', 'Omoda 5'],
  Peugeot: ['2008', '3008', '5008', '508', 'Partner'],
};

// ----------------------------------------------------------------
// Vehicle body types
// ----------------------------------------------------------------
export const BODY_TYPES = [
  { value: 'sedan',       label: 'Sedan' },
  { value: 'hatchback',   label: 'Hatchback' },
  { value: 'suv',         label: 'SUV' },
  { value: 'crossover',   label: 'Crossover' },
  { value: 'pickup',      label: 'Pickup Truck' },
  { value: 'van',         label: 'Van' },
  { value: 'mpv',         label: 'MPV / Minivan' },
  { value: 'coupe',       label: 'Coupe' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'wagon',       label: 'Station Wagon' },
] as const;

// ----------------------------------------------------------------
// Transmission types
// ----------------------------------------------------------------
export const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatic (AT)' },
  { value: 'manual',    label: 'Manual (MT)' },
  { value: 'cvt',       label: 'Continuously Variable (CVT)' },
  { value: 'dct',       label: 'Dual-Clutch (DCT)' },
  { value: 'amt',       label: 'Automated Manual (AMT)' },
] as const;

// ----------------------------------------------------------------
// Fuel types
// ----------------------------------------------------------------
export const FUEL_TYPE_OPTIONS = [
  { value: 'gasoline',       label: 'Gasoline' },
  { value: 'diesel',         label: 'Diesel' },
  { value: 'hybrid',         label: 'Hybrid' },
  { value: 'electric',       label: 'Electric' },
  { value: 'plug_in_hybrid', label: 'Plug-in Hybrid (PHEV)' },
] as const;

// ----------------------------------------------------------------
// Condition ratings  (value · display · Tailwind color token · description)
// ----------------------------------------------------------------
export const CONDITION_RATINGS = [
  {
    value: 'excellent',
    label: 'Excellent',
    color: 'green',
    description: 'Near-new condition. No visible wear, fully functional, complete documentation.',
  },
  {
    value: 'very_good',
    label: 'Very Good',
    color: 'teal',
    description: 'Minor wear consistent with age. All systems functional, no major issues.',
  },
  {
    value: 'good',
    label: 'Good',
    color: 'blue',
    description: 'Normal wear for mileage and age. Minor cosmetic imperfections, mechanically sound.',
  },
  {
    value: 'fair',
    label: 'Fair',
    color: 'yellow',
    description: 'Noticeable wear or minor repairs needed. Still drivable and functional.',
  },
  {
    value: 'poor',
    label: 'Poor',
    color: 'red',
    description: 'Significant issues present. May require major repairs before regular use.',
  },
] as const;

// ----------------------------------------------------------------
// Car listing status options
// ----------------------------------------------------------------
export const CAR_STATUS_OPTIONS = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'reserved',  label: 'Reserved',  color: 'yellow' },
  { value: 'sold',      label: 'Sold',      color: 'red' },
] as const;

// ----------------------------------------------------------------
// Inquiry (lead) status options
// ----------------------------------------------------------------
export const INQUIRY_STATUS_OPTIONS = [
  { value: 'new',          label: 'New',            color: 'blue' },
  { value: 'contacted',    label: 'Contacted',      color: 'yellow' },
  { value: 'qualified',    label: 'Qualified',      color: 'teal' },
  { value: 'closed_won',   label: 'Closed – Won',   color: 'green' },
  { value: 'closed_lost',  label: 'Closed – Lost',  color: 'red' },
] as const;

// ----------------------------------------------------------------
// Seller submission status options
// ----------------------------------------------------------------
export const SUBMISSION_STATUS_OPTIONS = [
  { value: 'pending',       label: 'Pending Review', color: 'yellow' },
  { value: 'under_review',  label: 'Under Review',   color: 'blue' },
  { value: 'approved',      label: 'Approved',       color: 'green' },
  { value: 'rejected',      label: 'Rejected',       color: 'red' },
] as const;

// ----------------------------------------------------------------
// Monthly income ranges (Philippine Peso)
// ----------------------------------------------------------------
export const INCOME_RANGES = [
  'Below ₱15,000',
  '₱15,000 – ₱30,000',
  '₱30,001 – ₱50,000',
  '₱50,001 – ₱100,000',
  '₱100,001 – ₱200,000',
  'Above ₱200,000',
] as const;

// ----------------------------------------------------------------
// Reasons for selling a vehicle
// ----------------------------------------------------------------
export const SELLING_REASONS = [
  { value: 'upgrade',            label: 'Upgrading to a newer model' },
  { value: 'financial_need',     label: 'Financial need' },
  { value: 'relocation',         label: 'Relocating / Going abroad' },
  { value: 'too_many_vehicles',  label: 'Too many vehicles' },
  { value: 'rarely_used',        label: 'Rarely used' },
  { value: 'maintenance_issues', label: 'High maintenance cost' },
  { value: 'other',              label: 'Other' },
] as const;

// ----------------------------------------------------------------
// Photo upload categories for seller submissions / car listings
// ----------------------------------------------------------------
export const PHOTO_LABELS = [
  { category: 'exterior_front', label: 'Front View',      required: true },
  { category: 'exterior_rear',  label: 'Rear View',       required: true },
  { category: 'exterior_left',  label: 'Left Side',       required: false },
  { category: 'exterior_right', label: 'Right Side',      required: false },
  { category: 'interior_front', label: 'Interior Front',  required: true },
  { category: 'interior_rear',  label: 'Interior Rear',   required: false },
  { category: 'engine',         label: 'Engine Bay',      required: true },
  { category: 'dashboard',      label: 'Dashboard',       required: false },
  { category: 'odometer',       label: 'Odometer',        required: true },
  { category: 'trunk',          label: 'Trunk / Boot',    required: false },
  { category: 'other',          label: 'Other',           required: false },
] as const;

// ----------------------------------------------------------------
// Numeric range constants
// ----------------------------------------------------------------
export const PRICE_RANGE = {
  min: 100_000,
  max: 5_000_000,
  step: 50_000,
} as const;

export const YEAR_RANGE = {
  min: 1990,
  max: new Date().getFullYear() + 1,
} as const;

export const MILEAGE_RANGE = {
  min: 0,
  max: 300_000,
  step: 5_000,
} as const;
