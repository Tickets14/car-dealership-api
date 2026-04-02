import { Request, Response, NextFunction } from 'express';
import { supabasePublic } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getTestimonials(_req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabasePublic
      .from('testimonials')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    if (error) throw new AppError(error.message, 500);

    res.json({ data: data || [] });
  } catch (err) {
    next(err);
  }
}
