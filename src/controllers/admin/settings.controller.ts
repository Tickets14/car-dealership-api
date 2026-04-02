import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getSettings(_req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('*');

    if (error) throw new AppError(error.message, 500);

    // Return as key-value map
    const settings: Record<string, unknown> = {};
    for (const row of data || []) {
      settings[row.key] = { value: row.value, updated_at: row.updated_at };
    }

    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const { key, value } = req.body;

    if (!key) throw new AppError('key is required', 400);
    if (value === undefined) throw new AppError('value is required', 400);

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!data) throw new AppError('Setting not found', 404);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}
