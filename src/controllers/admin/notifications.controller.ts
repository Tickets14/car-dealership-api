import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.admin!.id;
    const { is_read } = req.query as { is_read?: string };

    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('admin_user_id', adminId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (is_read === 'true') query = query.eq('is_read', true);
    if (is_read === 'false') query = query.eq('is_read', false);

    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500);

    res.json({ data: data || [] });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.admin!.id;
    const { ids, all } = req.body as { ids?: string[]; all?: boolean };

    if (all) {
      const { error } = await supabaseAdmin
        .from('notifications')
        .update({ is_read: true })
        .eq('admin_user_id', adminId)
        .eq('is_read', false);

      if (error) throw new AppError(error.message, 500);

      res.json({ data: { message: 'All notifications marked as read' } });
      return;
    }

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('ids array or all: true is required', 400);
    }

    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('admin_user_id', adminId)
      .in('id', ids);

    if (error) throw new AppError(error.message, 500);

    res.json({ data: { message: `${ids.length} notification(s) marked as read` } });
  } catch (err) {
    next(err);
  }
}
