import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';
import { testimonialSchema } from '../../lib/validations.js';

export async function getTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw new AppError(error.message, 500);

    res.json({ data: data || [] });
  } catch (err) {
    next(err);
  }
}

export async function createTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const result = testimonialSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: result.error.flatten() },
      });
      return;
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert(result.data)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}

export async function updateTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!data) throw new AppError('Testimonial not found', 404);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deleteTestimonial(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);

    res.json({ data: { message: 'Testimonial deleted successfully' } });
  } catch (err) {
    next(err);
  }
}
