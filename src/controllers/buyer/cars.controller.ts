import { Request, Response, NextFunction } from 'express';
import { supabasePublic } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function getCars(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      page = '1',
      limit = '12',
      make,
      model,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      mileageMin,
      mileageMax,
      transmission,
      fuelType,
      bodyType,
      conditionRating,
      sort = 'newest',
      search,
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit || '12', 10)));
    const offset = (pageNum - 1) * limitNum;

    let query = supabasePublic
      .from('cars')
      .select('*, car_photos(id, url, sort_order)', { count: 'exact' })
      .in('status', ['available', 'reserved']);

    // Filters
    if (make) query = query.eq('make', make);
    if (model) query = query.eq('model', model);
    if (yearMin) query = query.gte('year', parseInt(yearMin, 10));
    if (yearMax) query = query.lte('year', parseInt(yearMax, 10));
    if (priceMin) query = query.gte('price_cash', parseFloat(priceMin));
    if (priceMax) query = query.lte('price_cash', parseFloat(priceMax));
    if (mileageMin) query = query.gte('mileage', parseInt(mileageMin, 10));
    if (mileageMax) query = query.lte('mileage', parseInt(mileageMax, 10));
    if (transmission) {
      const values = transmission.split(',').map((v) => v.trim());
      query = query.in('transmission', values);
    }
    if (fuelType) query = query.eq('fuel_type', fuelType);
    if (bodyType) query = query.eq('body_type', bodyType);
    if (conditionRating) query = query.eq('condition_rating', conditionRating);
    if (search) query = query.or(`make.ilike.%${search}%,model.ilike.%${search}%,variant.ilike.%${search}%`);

    // Sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price_cash', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price_cash', { ascending: false });
        break;
      case 'mileage_asc':
        query = query.order('mileage', { ascending: true });
        break;
      case 'year_desc':
        query = query.order('year', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    query = query.range(offset, offset + limitNum - 1);

    const { data, error, count } = await query;
    if (error) throw new AppError(error.message, 500);

    // Extract first photo as thumbnail
    const cars = (data || []).map((car: Record<string, unknown>) => {
      const photos = car.car_photos as Array<{ id: string; url: string; sort_order: number }> | null;
      const sorted = (photos || []).sort((a, b) => a.sort_order - b.sort_order);
      const { car_photos: _, ...rest } = car;
      return { ...rest, thumbnail: sorted[0]?.url || null };
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

export async function getFeaturedCars(_req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabasePublic
      .from('cars')
      .select('*, car_photos(id, url, sort_order)')
      .eq('is_featured', true)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) throw new AppError(error.message, 500);

    const cars = (data || []).map((car: Record<string, unknown>) => {
      const photos = car.car_photos as Array<{ id: string; url: string; sort_order: number }> | null;
      const sorted = (photos || []).sort((a, b) => a.sort_order - b.sort_order);
      const { car_photos: _, ...rest } = car;
      return { ...rest, thumbnail: sorted[0]?.url || null };
    });

    res.json({ data: cars });
  } catch (err) {
    next(err);
  }
}

export async function getRecentlySoldCars(_req: Request, res: Response, next: NextFunction) {
  try {
    const { data, error } = await supabasePublic
      .from('cars')
      .select('*, car_photos(id, url, sort_order)')
      .eq('status', 'sold')
      .order('sold_date', { ascending: false })
      .limit(8);

    if (error) throw new AppError(error.message, 500);

    const cars = (data || []).map((car: Record<string, unknown>) => {
      const photos = car.car_photos as Array<{ id: string; url: string; sort_order: number }> | null;
      const sorted = (photos || []).sort((a, b) => a.sort_order - b.sort_order);
      const { car_photos: _, ...rest } = car;
      return { ...rest, thumbnail: sorted[0]?.url || null };
    });

    res.json({ data: cars });
  } catch (err) {
    next(err);
  }
}

export async function getCarById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const { data: car, error } = await supabasePublic
      .from('cars')
      .select('*, car_photos(*)')
      .eq('id', id)
      .in('status', ['available', 'reserved'])
      .single();

    if (error || !car) throw new AppError('Car not found', 404);

    // Sort photos by sort_order
    const photos = (car.car_photos as Array<Record<string, unknown>> || [])
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.sort_order as number) - (b.sort_order as number));
    const { car_photos: _, ...carData } = car;

    // Similar cars: same make, exclude current, limit 4
    const { data: similar } = await supabasePublic
      .from('cars')
      .select('*, car_photos(id, url, sort_order)')
      .eq('make', car.make)
      .in('status', ['available', 'reserved'])
      .neq('id', id)
      .limit(4);

    const similarCars = (similar || []).map((s: Record<string, unknown>) => {
      const sPhotos = s.car_photos as Array<{ id: string; url: string; sort_order: number }> | null;
      const sorted = (sPhotos || []).sort((a, b) => a.sort_order - b.sort_order);
      const { car_photos: __, ...rest } = s;
      return { ...rest, thumbnail: sorted[0]?.url || null };
    });

    res.json({
      data: { ...carData, photos },
      similar: similarCars,
    });
  } catch (err) {
    next(err);
  }
}
