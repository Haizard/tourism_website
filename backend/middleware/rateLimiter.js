import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { message: 'Too many login attempts, try again later.' } });
export const bookingLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { message: 'Too many booking attempts, try again later.' } });
export const inquiryLimiter = rateLimit({ windowMs: 60 * 1000, max: 10, message: { message: 'Too many inquiries, try again later.' } });
export const chatLimiter = rateLimit({ windowMs: 60 * 1000, max: 20, message: { message: 'Too many chat messages, slow down.' } });
export const newsletterLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { message: 'Too many newsletter signups, try again later.' } });
