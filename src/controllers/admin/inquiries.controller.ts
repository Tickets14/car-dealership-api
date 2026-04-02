import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getInquiries(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = '1',
      limit = '20',
      type,
      status,
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '20', 10)));
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('inquiries')
      .select('*, cars(id, make, model, year, stock_number), inquiry_messages(id)', { count: 'exact' });

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);

    const inquiries = (data || []).map((inq: Record<string, unknown>) => {
      const messages = inq.inquiry_messages as Array<{ id: string }> | null;
      const { inquiry_messages: _, ...rest } = inq;
      return { ...rest, message_count: (messages || []).length };
    });

    const total = count || 0;
    res.json({
      data: inquiries,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}

export async function getInquiryById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data: inquiry, error } = await supabaseAdmin
      .from('inquiries')
      .select('*, cars(id, make, model, year, stock_number, price_cash, status), inquiry_messages(*)')
      .eq('id', id)
      .single();

    if (error || !inquiry) throw new AppError('Inquiry not found', 404);

    // Fetch pre_qualification data if this is a pre_qualification type
    let preQualification = null;
    if (inquiry.type === 'pre_qualification') {
      const { data: preQual } = await supabaseAdmin
        .from('pre_qualifications')
        .select('*')
        .eq('inquiry_id', id)
        .single();

      preQualification = preQual;
    }

    // Sort messages by created_at
    const messages = (inquiry.inquiry_messages as Array<Record<string, unknown>> || [])
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime()
      );

    const { inquiry_messages: _, ...rest } = inquiry;

    res.json({
      data: {
        ...rest,
        messages,
        pre_qualification: preQualification,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateInquiry(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) throw new AppError('status is required', 400);

    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!data) throw new AppError('Inquiry not found', 404);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function addMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) throw new AppError('message is required', 400);

    // Verify inquiry exists
    const { data: inquiry, error: fetchError } = await supabaseAdmin
      .from('inquiries')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !inquiry) throw new AppError('Inquiry not found', 404);

    const { data, error } = await supabaseAdmin
      .from('inquiry_messages')
      .insert({
        inquiry_id: id,
        sender: 'admin',
        message,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    // Update inquiry status to 'contacted' if it's still 'new'
    await supabaseAdmin
      .from('inquiries')
      .update({ status: 'contacted' })
      .eq('id', id)
      .eq('status', 'new');

    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}
