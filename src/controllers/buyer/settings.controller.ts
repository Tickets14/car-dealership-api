import { Request, Response, NextFunction } from 'express';
import { supabasePublic } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { keys } = req.query as { keys?: string };

    if (!keys) {
      throw new AppError('Query parameter "keys" is required', 400);
    }

    const keyList = keys.split(',').map((k) => k.trim()).filter(Boolean);

    if (keyList.length === 0) {
      throw new AppError('At least one key must be provided', 400);
    }

    const { data, error } = await supabasePublic
      .from('site_settings')
      .select('key, value, updated_at')
      .in('key', keyList);

    if (error) throw new AppError(error.message, 500);

    // Return as key-value map for easy consumption
    const settings: Record<string, unknown> = {};
    for (const row of data || []) {
      settings[row.key] = row.value;
    }

    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
}
