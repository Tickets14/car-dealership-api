import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/supabase.js';
import { AppError } from '../../middleware/error-handler.js';

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify user is an admin
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !adminProfile) {
      throw new AppError('Not authorized as admin', 401);
    }

    res.json({
      data: {
        user: adminProfile,
        session: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          expires_at: authData.session.expires_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      // Sign out using admin client
      await supabaseAdmin.auth.admin.signOut(req.admin!.id);
    }

    res.json({ data: { message: 'Logged out successfully' } });
  } catch (err) {
    next(err);
  }
}

export async function getSession(req: Request, res: Response) {
  // requireAdmin already verified and attached the admin profile
  res.json({ data: { user: req.admin } });
}

export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new AppError('refresh_token is required', 400);
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token });

    if (error || !data.session) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Verify user is still an admin
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('*')
      .eq('id', data.user!.id)
      .single();

    if (profileError || !adminProfile) {
      throw new AppError('Not authorized as admin', 401);
    }

    res.json({
      data: {
        user: adminProfile,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
