import { Request, Response } from 'express';

interface test {
  data: string;
}

export const showLoginPage = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: false,
    message: 'Login endpoint is ready. Use POST /login with email and password.',
  });
};

export const loginUser = (req: Request, res: Response): void => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  if (email === 'admin@example.com' && password === '123456') {
    res.status(200).json({ success: true, message: 'Login successful!' });
    return;
  }

  res.status(401).json({ success: false, message: 'Invalid email or password.' });
};
