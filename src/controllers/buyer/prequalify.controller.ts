import { Request, Response, NextFunction } from 'express';
import { supabasePublic, supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';
import type { PreQualificationInput } from '../../lib/validations.js';

export async function createPreQualification(req: Request, res: Response, next: NextFunction) {
  try {
    const body = req.validated as PreQualificationInput;

    // Create inquiry record first
    const { data: inquiry, error: inquiryError } = await supabasePublic
      .from('inquiries')
      .insert({
        car_id: body.car_id || null,
        type: 'pre_qualification',
        name: body.full_name,
        email: body.email,
        phone: body.contact_number,
        message: body.notes || null,
      })
      .select()
      .single();

    if (inquiryError) throw new AppError(inquiryError.message, 500);

    // Create pre_qualifications record
    const { data: preQual, error: preQualError } = await supabasePublic
      .from('pre_qualifications')
      .insert({
        inquiry_id: inquiry.id,
        full_name: body.full_name,
        contact_number: body.contact_number,
        email: body.email,
        employment_status: body.employment_status,
        monthly_income_range: body.monthly_income_range,
      })
      .select()
      .single();

    if (preQualError) throw new AppError(preQualError.message, 500);

    // Create notification for admins
    const { data: admins } = await supabaseAdmin
      .from('admin_profiles')
      .select('id');

    if (admins && admins.length > 0) {
      const notifications = admins.map((admin: { id: string }) => ({
        admin_user_id: admin.id,
        type: 'pre_qual_submitted' as const,
        title: `New pre-qualification from ${body.full_name}`,
        message: `Income: ${body.monthly_income_range}, Employment: ${body.employment_status}`,
        related_id: inquiry.id,
        related_type: 'inquiry',
      }));

      await supabaseAdmin.from('notifications').insert(notifications);
    }

    res.status(201).json({
      data: {
        inquiry,
        pre_qualification: preQual,
      },
    });
  } catch (err) {
    next(err);
  }
}
