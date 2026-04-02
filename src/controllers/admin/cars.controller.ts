import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';
import { carSchema } from '../../lib/validations.js';
import { generateStockNumber } from '../../lib/utils.js';
import sharp from 'sharp';

export async function getCars(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      search,
      featured,
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '20', 10)));
    const offset = (pageNum - 1) * limitNum;

    let query = supabaseAdmin
      .from('cars')
      .select('*, car_photos(id), inquiries(id)', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (featured === 'true') query = query.eq('is_featured', true);
    if (featured === 'false') query = query.eq('is_featured', false);
    if (search) query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%,variant.ilike.%${search}%,stock_number.ilike.%${search}%`);

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);

    const cars = (data || []).map((car: Record<string, unknown>) => {
      const photos = car.car_photos as Array<{ id: string }> | null;
      const inquiries = car.inquiries as Array<{ id: string }> | null;
      const { car_photos: _, inquiries: __, ...rest } = car;
      return {
        ...rest,
        photo_count: (photos || []).length,
        inquiry_count: (inquiries || []).length,
      };
    });

    const total = count || 0;
    res.json({
      data: cars,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    next(err);
  }
}

export async function getCarById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data: car, error } = await supabaseAdmin
      .from('cars')
      .select('*, car_photos(*)')
      .eq('id', id)
      .single();

    if (error || !car) throw new AppError('Car not found', 404);

    const photos = (car.car_photos as Array<Record<string, unknown>> || [])
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.sort_order as number) - (b.sort_order as number));
    const { car_photos: _, ...carData } = car;

    res.json({ data: { ...carData, photos } });
  } catch (err) {
    next(err);
  }
}

export async function createCar(req: Request, res: Response, next: NextFunction) {
  try {
    const result = carSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: { message: 'Validation failed', details: result.error.flatten() },
      });
      return;
    }

    const input = result.data;
    const stock_number = input.stock_number || generateStockNumber();

    const { data: car, error } = await supabaseAdmin
      .from('cars')
      .insert({ ...input, stock_number })
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);

    res.status(201).json({ data: car });
  } catch (err) {
    next(err);
  }
}

export async function updateCar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If status is being set to 'sold' and no sold_date provided, set it now
    if (updates.status === 'sold' && !updates.sold_date) {
      updates.sold_date = new Date().toISOString();
    }

    const { data: car, error } = await supabaseAdmin
      .from('cars')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(error.message, 500);
    if (!car) throw new AppError('Car not found', 404);

    res.json({ data: car });
  } catch (err) {
    next(err);
  }
}

export async function deleteCar(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    // Get car to find stock_number for storage cleanup
    const { data: car, error: fetchError } = await supabaseAdmin
      .from('cars')
      .select('stock_number')
      .eq('id', id)
      .single();

    if (fetchError || !car) throw new AppError('Car not found', 404);

    // Delete photos from storage
    const { data: storageFiles } = await supabaseAdmin.storage
      .from('car-photos')
      .list(`car-photos/${car.stock_number}`);

    if (storageFiles && storageFiles.length > 0) {
      const paths = storageFiles.map((f) => `car-photos/${car.stock_number}/${f.name}`);
      await supabaseAdmin.storage.from('car-photos').remove(paths);
    }

    // Delete car (cascades to car_photos via FK)
    const { error } = await supabaseAdmin
      .from('cars')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(error.message, 500);

    res.json({ data: { message: 'Car deleted successfully' } });
  } catch (err) {
    next(err);
  }
}

export async function uploadPhotos(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      throw new AppError('No files provided', 400);
    }

    // Get car for stock_number
    const { data: car, error: fetchError } = await supabaseAdmin
      .from('cars')
      .select('stock_number')
      .eq('id', id)
      .single();

    if (fetchError || !car) throw new AppError('Car not found', 404);

    // Get current max sort_order
    const { data: existingPhotos } = await supabaseAdmin
      .from('car_photos')
      .select('sort_order')
      .eq('car_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    let sortOrder = existingPhotos && existingPhotos.length > 0
      ? (existingPhotos[0].sort_order as number) + 1
      : 0;

    const uploaded: Array<Record<string, unknown>> = [];

    for (const file of files) {
      const processed = await sharp(file.buffer)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const filename = `${Date.now()}-${sortOrder}.jpg`;
      const storagePath = `car-photos/${car.stock_number}/${filename}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('car-photos')
        .upload(storagePath, processed, { contentType: 'image/jpeg' });

      if (uploadError) {
        console.error(`[UPLOAD] Failed: ${filename}`, uploadError.message);
        continue;
      }

      const { data: publicUrl } = supabaseAdmin.storage
        .from('car-photos')
        .getPublicUrl(storagePath);

      const { data: photo, error: insertError } = await supabaseAdmin
        .from('car_photos')
        .insert({
          car_id: id,
          url: publicUrl.publicUrl,
          sort_order: sortOrder,
        })
        .select()
        .single();

      if (!insertError && photo) uploaded.push(photo);
      sortOrder++;
    }

    res.status(201).json({ data: uploaded });
  } catch (err) {
    next(err);
  }
}

export async function reorderPhotos(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { photos } = req.body as { photos: Array<{ id: string; sort_order: number }> };

    if (!Array.isArray(photos)) {
      throw new AppError('photos array is required', 400);
    }

    // Update each photo's sort_order
    for (const photo of photos) {
      await supabaseAdmin
        .from('car_photos')
        .update({ sort_order: photo.sort_order })
        .eq('id', photo.id)
        .eq('car_id', id);
    }

    // Return updated photos
    const { data, error } = await supabaseAdmin
      .from('car_photos')
      .select('*')
      .eq('car_id', id)
      .order('sort_order', { ascending: true });

    if (error) throw new AppError(error.message, 500);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

export async function deletePhotos(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { ids } = req.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('ids array is required', 400);
    }

    // Get photo URLs for storage cleanup
    const { data: photos } = await supabaseAdmin
      .from('car_photos')
      .select('url')
      .eq('car_id', id)
      .in('id', ids);

    // Delete from storage
    if (photos && photos.length > 0) {
      for (const photo of photos) {
        const url = photo.url as string;
        // Extract storage path from public URL
        const match = url.match(/car-photos\/(.+)$/);
        if (match) {
          await supabaseAdmin.storage.from('car-photos').remove([`car-photos/${match[1]}`]);
        }
      }
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('car_photos')
      .delete()
      .eq('car_id', id)
      .in('id', ids);

    if (error) throw new AppError(error.message, 500);

    res.json({ data: { message: `${ids.length} photo(s) deleted` } });
  } catch (err) {
    next(err);
  }
}

export async function bulkUpdateStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { ids, status } = req.body as { ids: string[]; status: string };

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError('ids array is required', 400);
    }
    if (!status) {
      throw new AppError('status is required', 400);
    }

    const updates: Record<string, unknown> = { status };
    if (status === 'sold') {
      updates.sold_date = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('cars')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) throw new AppError(error.message, 500);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}
