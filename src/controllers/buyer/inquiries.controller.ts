import { Request, Response, NextFunction } from 'express';
import { supabasePublic, supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';
import type { InquiryInput, VisitRequestInput } from '../../lib/validations.js';

export async function createInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.validated as InquiryInput | VisitRequestInput;

    // Determine type based on presence of visit fields
    const isVisitRequest = 'preferred_visit_date' in body && body.preferred_visit_date;
    const type = isVisitRequest ? 'visit_request' : 'buyer_inquiry';

    // Verify car exists if car_id provided
    if (body.car_id) {
      const { data: car, error: carError } = await supabasePublic
        .from('cars')
        .select('id')
        .eq('id', body.car_id)
        .single();

      if (carError || !car) throw new AppError('Car not found', 404);
    }

    const { data: inquiry, error } = await supabasePublic
      .from('inquiries')
      .insert({
        car_id: body.car_id || null,
        type,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        message: body.message || null,
        preferred_visit_date: isVisitRequest ? (body as VisitRequestInput).preferred_visit_date : null,
        preferred_visit_time: isVisitRequest ? (body as VisitRequestInput).preferred_visit_time : null,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    // Create notification for all admins
    const notificationType = isVisitRequest ? 'visit_scheduled' : 'new_inquiry';
    const title = isVisitRequest
      ? `New visit request from ${body.name}`
      : `New inquiry from ${body.name}`;

    const { data: admins } = await supabaseAdmin
      .from('admin_profiles')
      .select('id');

    if (admins && admins.length > 0) {
      const notifications = admins.map((admin: { id: string }) => ({
        admin_user_id: admin.id,
        type: notificationType,
        title,
        message: body.message || null,
        related_id: inquiry.id,
        related_type: 'inquiry',
      }));

      await supabaseAdmin.from('notifications').insert(notifications);
    }

    res.status(201).json({ data: inquiry });
  } catch (err) {
    next(err);
  }
}
