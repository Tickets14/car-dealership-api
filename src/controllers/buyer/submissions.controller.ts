import { Request, Response, NextFunction } from 'express';
import { supabasePublic, supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';
import { sellerSubmissionSchema } from '../../lib/validations.js';
import { generateReferenceNumber } from '../../lib/utils.js';
import sharp from 'sharp';

export async function createSubmission(req: Request, res: Response, next: NextFunction) {
  try {
    // Parse JSON fields from multipart form data
    const jsonFields: Record<string, unknown> = { ...req.body };

    // Convert numeric string fields
    if (typeof jsonFields.year === 'string') jsonFields.year = parseInt(jsonFields.year, 10);
    if (typeof jsonFields.asking_price === 'string') jsonFields.asking_price = parseFloat(jsonFields.asking_price);
    if (typeof jsonFields.mileage === 'string') jsonFields.mileage = parseInt(jsonFields.mileage, 10);
    if (typeof jsonFields.has_existing_loan === 'string') jsonFields.has_existing_loan = jsonFields.has_existing_loan === 'true';

    // Validate
    const result = sellerSubmissionSchema.safeParse(jsonFields);
    if (!result.success) {
      res.status(400).json({
        error: {
          message: 'Validation failed',
          details: result.error.flatten(),
        },
      });
      return;
    }

    const validated = result.data;
    const referenceNumber = generateReferenceNumber();

    // Create submission record
    const { data: submission, error } = await supabasePublic
      .from('seller_submissions')
      .insert({
        reference_number: referenceNumber,
        seller_name: validated.seller_name,
        seller_email: validated.seller_email,
        seller_phone: validated.seller_phone,
        make: validated.make,
        model: validated.model,
        year: validated.year,
        asking_price: validated.asking_price,
        transmission: validated.transmission || null,
        fuel_type: validated.fuel_type || null,
        mileage: validated.mileage ?? null,
        color: validated.color || null,
        description: validated.description || null,
        reason_for_selling: validated.selling_reason || null,
        has_existing_loan: validated.has_existing_loan ?? false,
      })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    // Process and upload photos
    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedPhotos: Array<{ url: string; label: string | null; sort_order: number }> = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Resize with sharp
        const processed = await sharp(file.buffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toBuffer();

        const filename = `${Date.now()}-${i}.jpg`;
        const storagePath = `submission-photos/${referenceNumber}/${filename}`;

        const { error: uploadError } = await supabaseAdmin.storage
          .from('submission-photos')
          .upload(storagePath, processed, {
            contentType: 'image/jpeg',
          });

        if (uploadError) {
          console.error(`[UPLOAD] Failed to upload ${filename}:`, uploadError.message);
          continue;
        }

        const { data: publicUrl } = supabaseAdmin.storage
          .from('submission-photos')
          .getPublicUrl(storagePath);

        uploadedPhotos.push({
          url: publicUrl.publicUrl,
          label: file.originalname || null,
          sort_order: i,
        });
      }

      // Insert photo records
      if (uploadedPhotos.length > 0) {
        await supabasePublic
          .from('seller_submission_photos')
          .insert(
            uploadedPhotos.map((p) => ({
              submission_id: submission.id,
              url: p.url,
              label: p.label,
              sort_order: p.sort_order,
            }))
          );
      }
    }

    // Create notification for admins
    const { data: admins } = await supabaseAdmin
      .from('admin_profiles')
      .select('id');

    if (admins && admins.length > 0) {
      const notifications = admins.map((admin: { id: string }) => ({
        admin_user_id: admin.id,
        type: 'new_submission' as const,
        title: `New seller submission: ${validated.year} ${validated.make} ${validated.model}`,
        message: `Reference: ${referenceNumber}`,
        related_id: submission.id,
        related_type: 'submission',
      }));

      await supabaseAdmin.from('notifications').insert(notifications);
    }

    res.status(201).json({
      data: {
        ...submission,
        photos: uploadedPhotos,
        reference_number: referenceNumber,
      },
    });
  } catch (err) {
    next(err);
  }
}
