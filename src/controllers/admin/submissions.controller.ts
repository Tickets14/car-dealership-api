import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';
import { generateStockNumber } from '../../lib/utils.js';

export async function getSubmissions(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = '1',
      limit = '20',
      status,
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '20', 10)));
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('seller_submissions')
      .select('*, seller_submission_photos(id)', { count: 'exact' });

    if (status) query = query.eq('status', status);

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);

    const submissions = (data || []).map((s: Record<string, unknown>) => {
      const photos = s.seller_submission_photos as Array<{ id: string }> | null;
      const { seller_submission_photos: _, ...rest } = s;
      return { ...rest, photo_count: (photos || []).length };
    });

    const total = count || 0;
    res.json({
      data: submissions,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}

export async function getSubmissionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('seller_submissions')
      .select('*, seller_submission_photos(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new AppError('Submission not found', 404);

    const photos = (data.seller_submission_photos as Array<Record<string, unknown>> || [])
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.sort_order as number) - (b.sort_order as number));
    const { seller_submission_photos: _, ...submission } = data;

    res.json({ data: { ...submission, photos } });
  } catch (err) {
    next(err);
  }
}

export async function updateSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, admin_notes, counter_offer_price, counter_offer_message } = req.body;

    // Fetch the submission
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('seller_submissions')
      .select('*, seller_submission_photos(*)')
      .eq('id', id)
      .single();

    if (fetchError || !existing) throw new AppError('Submission not found', 404);

    const updates: Record<string, unknown> = {
      reviewed_at: new Date().toISOString(),
    };

    if (status === 'approved') {
      updates.status = 'approved';

      // Create a draft car listing pre-filled from submission data
      const stock_number = generateStockNumber();
      const { data: newCar, error: carError } = await supabaseAdmin
        .from('cars')
        .insert({
          stock_number,
          make: existing.make,
          model: existing.model,
          year: existing.year,
          variant: existing.variant || null,
          transmission: existing.transmission || 'automatic',
          fuel_type: existing.fuel_type || 'gasoline',
          mileage: existing.mileage || 0,
          color: existing.color || null,
          price_cash: existing.asking_price || 0,
          condition_rating: 'good',
          description: existing.description || null,
          status: 'draft',
        })
        .select()
        .single();

      if (carError) throw new AppError(carError.message, 500);

      // Copy submission photos to car-photos storage
      const submissionPhotos = existing.seller_submission_photos as Array<Record<string, unknown>> || [];
      for (let i = 0; i < submissionPhotos.length; i++) {
        const photo = submissionPhotos[i];
        const sourceUrl = photo.url as string;

        // Download the submission photo
        const sourceMatch = sourceUrl.match(/submission-photos\/(.+)$/);
        if (!sourceMatch) continue;

        const { data: fileData, error: downloadError } = await supabaseAdmin.storage
          .from('submission-photos')
          .download(sourceMatch[1]);

        if (downloadError || !fileData) continue;

        const buffer = Buffer.from(await fileData.arrayBuffer());
        const filename = `${Date.now()}-${i}.jpg`;
        const destPath = `car-photos/${stock_number}/${filename}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from('car-photos')
          .upload(destPath, buffer, { contentType: 'image/jpeg' });

        if (uploadError) continue;

        const { data: publicUrl } = supabaseAdmin.storage
          .from('car-photos')
          .getPublicUrl(destPath);

        await supabaseAdmin
          .from('car_photos')
          .insert({
            car_id: newCar.id,
            url: publicUrl.publicUrl,
            sort_order: i,
          });
      }

      updates.admin_notes = admin_notes || null;
    } else if (status === 'rejected') {
      updates.status = 'rejected';
      updates.admin_notes = admin_notes || null;
    } else if (status === 'counter_offered') {
      updates.status = 'counter_offered';
      updates.counter_offer_price = counter_offer_price;
      updates.counter_offer_message = counter_offer_message;
    } else if (status) {
      updates.status = status;
    }

    const { data: updated, error } = await supabaseAdmin
      .from('seller_submissions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}
