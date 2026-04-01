import { z } from 'zod';

const currentYear = new Date().getFullYear();

// ----------------------------------------------------------------
// carSchema
// ----------------------------------------------------------------
export const carSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number({ error: 'Year must be a number' })
    .int()
    .min(1990, 'Year must be 1990 or later')
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  transmission: z.enum(['automatic', 'manual', 'cvt', 'dct', 'amt']),
  fuel_type: z.enum(['gasoline', 'diesel', 'hybrid', 'electric', 'plug_in_hybrid']),
  mileage: z
    .number({ error: 'Mileage must be a number' })
    .min(0, 'Mileage cannot be negative'),
  price_cash: z
    .number({ error: 'Price must be a number' })
    .positive('Price must be greater than 0'),
  condition_rating: z.enum(['excellent', 'very_good', 'good', 'fair', 'poor']),
  status: z.enum(['available', 'reserved', 'sold']),
  // Optional fields
  body_type: z.string().optional(),
  color: z.string().optional(),
  variant: z.string().optional(),
  description: z.string().optional(),
  price_installment: z.number().positive().optional(),
  stock_number: z.string().optional(),
  is_featured: z.boolean().optional(),
});

export type CarInput = z.infer<typeof carSchema>;

// ----------------------------------------------------------------
// carPhotoSchema
// ----------------------------------------------------------------
export const carPhotoSchema = z.object({
  car_id: z.string().uuid('car_id must be a valid UUID'),
  url: z.string().url('url must be a valid URL'),
  category: z.enum([
    'exterior_front',
    'exterior_rear',
    'exterior_left',
    'exterior_right',
    'interior_front',
    'interior_rear',
    'engine',
    'dashboard',
    'odometer',
    'trunk',
    'other',
  ]),
  sort_order: z.number().int().min(0).default(0),
  is_primary: z.boolean().optional(),
});

export type CarPhotoInput = z.infer<typeof carPhotoSchema>;

// ----------------------------------------------------------------
// sellerSubmissionSchema
// ----------------------------------------------------------------
export const sellerSubmissionSchema = z.object({
  seller_name: z.string().min(1, 'Seller name is required'),
  seller_email: z.string().email('A valid email address is required'),
  seller_phone: z.string().min(1, 'Seller phone is required'),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z
    .number({ error: 'Year must be a number' })
    .int()
    .min(1990, 'Year must be 1990 or later')
    .max(currentYear + 1, `Year cannot exceed ${currentYear + 1}`),
  asking_price: z
    .number({ error: 'Asking price must be a number' })
    .positive('Asking price must be greater than 0'),
  // Optional fields
  transmission: z.string().optional(),
  fuel_type: z.string().optional(),
  mileage: z.number().min(0).optional(),
  color: z.string().optional(),
  description: z.string().optional(),
  selling_reason: z.string().optional(),
  has_existing_loan: z.boolean().optional(),
  reference_number: z.string().optional(),
});

export type SellerSubmissionInput = z.infer<typeof sellerSubmissionSchema>;

// ----------------------------------------------------------------
// inquirySchema
// ----------------------------------------------------------------
export const inquirySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('A valid email address is required'),
  phone: z.string().optional(),
  message: z.string().optional(),
  car_id: z.string().uuid().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

// ----------------------------------------------------------------
// visitRequestSchema  (extends inquirySchema)
// ----------------------------------------------------------------
export const visitRequestSchema = inquirySchema.extend({
  preferred_visit_date: z
    .string()
    .min(1, 'Preferred visit date is required')
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, 'Preferred visit date must be a future date'),
  preferred_visit_time: z.string().min(1, 'Preferred visit time is required'),
  notes: z.string().optional(),
});

export type VisitRequestInput = z.infer<typeof visitRequestSchema>;

// ----------------------------------------------------------------
// preQualificationSchema
// ----------------------------------------------------------------
export const preQualificationSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  contact_number: z.string().min(1, 'Contact number is required'),
  email: z.string().email('A valid email address is required'),
  employment_status: z.string().min(1, 'Employment status is required'),
  monthly_income_range: z.string().min(1, 'Monthly income range is required'),
  // Optional fields
  car_id: z.string().uuid().optional(),
  desired_loan_amount: z.number().positive().optional(),
  preferred_term_months: z.number().int().positive().optional(),
  notes: z.string().optional(),
});

export type PreQualificationInput = z.infer<typeof preQualificationSchema>;

// ----------------------------------------------------------------
// testimonialSchema
// ----------------------------------------------------------------
export const testimonialSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  quote: z.string().min(1, 'Quote is required'),
  rating: z
    .number({ error: 'Rating must be a number' })
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  // Optional fields
  car_purchased: z.string().optional(),
  location: z.string().optional(),
  is_published: z.boolean().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;

// ----------------------------------------------------------------
// installmentTermsSchema  (site_settings installment config)
// ----------------------------------------------------------------
export const installmentTermsSchema = z.object({
  annual_interest_rate: z
    .number({ error: 'Annual interest rate must be a number' })
    .min(0, 'Interest rate cannot be negative')
    .max(100, 'Interest rate cannot exceed 100'),
  available_terms_months: z
    .array(z.number().int().positive())
    .min(1, 'At least one term option is required'),
  minimum_down_payment_percent: z
    .number()
    .min(0, 'Minimum down payment cannot be negative')
    .max(100, 'Minimum down payment cannot exceed 100'),
  maximum_loan_amount: z.number().positive().optional(),
  processing_fee: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type InstallmentTermsInput = z.infer<typeof installmentTermsSchema>;

// ----------------------------------------------------------------
// counterOfferSchema
// ----------------------------------------------------------------
export const counterOfferSchema = z.object({
  counter_offer_price: z
    .number({ error: 'Counter offer price must be a number' })
    .positive('Counter offer price must be greater than 0'),
  counter_offer_message: z.string().min(1, 'Counter offer message is required'),
  submission_id: z.string().uuid().optional(),
});

export type CounterOfferInput = z.infer<typeof counterOfferSchema>;
