import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = req.admin!.id;

    // Run all queries in parallel
    const [
      activeListingsRes,
      pendingSubmissionsRes,
      newInquiriesTodayRes,
      reservedCarsRes,
      soldThisMonthRes,
      recentActivityRes,
    ] = await Promise.all([
      // Active listings (available + reserved)
      supabaseAdmin
        .from('cars')
        .select('id', { count: 'exact', head: true })
        .in('status', ['available', 'reserved']),

      // Pending submissions
      supabaseAdmin
        .from('seller_submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),

      // New inquiries today
      supabaseAdmin
        .from('inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new')
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),

      // Reserved cars
      supabaseAdmin
        .from('cars')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'reserved'),

      // Sold this month
      supabaseAdmin
        .from('cars')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'sold')
        .gte('sold_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),

      // Recent activity (last 20 notifications)
      supabaseAdmin
        .from('notifications')
        .select('*')
        .eq('admin_user_id', adminId)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

    // Check for errors
    for (const r of [activeListingsRes, pendingSubmissionsRes, newInquiriesTodayRes, reservedCarsRes, soldThisMonthRes, recentActivityRes]) {
      if (r.error) throw new AppError(r.error.message, 500);
    }

    res.json({
      data: {
        active_listings: activeListingsRes.count || 0,
        pending_submissions: pendingSubmissionsRes.count || 0,
        new_inquiries_today: newInquiriesTodayRes.count || 0,
        reserved_cars: reservedCarsRes.count || 0,
        sold_this_month: soldThisMonthRes.count || 0,
        recent_activity: recentActivityRes.data || [],
      },
    });
  } catch (err) {
    next(err);
  }
}
