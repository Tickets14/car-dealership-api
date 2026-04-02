import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { AdminProfile } from '../lib/types.js';

declare global {
  namespace Express {
    interface Request {
      admin?: AdminProfile;
    }
  }
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: { message: 'Missing or invalid authorization header', statusCode: 401 } });
      return;
    }

    const token = authHeader.slice(7);

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      res.status(401).json({ error: { message: 'Invalid or expired token', statusCode: 401 } });
      return;
    }

    // Check that user exists in admin_profiles
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !adminProfile) {
      res.status(401).json({ error: { message: 'Not authorized as admin', statusCode: 401 } });
      return;
    }

    req.admin = adminProfile as AdminProfile;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Authentication failed', statusCode: 401 } });
  }
}
