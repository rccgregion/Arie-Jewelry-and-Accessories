import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { Request, Response } from 'express';
import { supabase } from './db';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const UPLOADS_DIR = path.resolve(process.cwd(), 'public/images/uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer memory storage to inspect buffer before saving
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5
  }
}).array('images', 5);

/**
 * Verify real file type using magic bytes (header inspection)
 */
export function verifyImageMagicBytes(buffer: Buffer): { isValid: boolean; extension: string; mimeType: string } {
  if (!buffer || buffer.length < 12) {
    return { isValid: false, extension: '', mimeType: '' };
  }

  // Check JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { isValid: true, extension: 'jpg', mimeType: 'image/jpeg' };
  }

  // Check PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { isValid: true, extension: 'png', mimeType: 'image/png' };
  }

  // Check WebP: RIFF .... WEBP
  const riff = buffer.toString('ascii', 0, 4);
  const webp = buffer.toString('ascii', 8, 12);
  if (riff === 'RIFF' && webp === 'WEBP') {
    return { isValid: true, extension: 'webp', mimeType: 'image/webp' };
  }

  return { isValid: false, extension: '', mimeType: '' };
}

/**
 * Handle image upload endpoint
 */
export async function handleImageUpload(req: Request, res: Response) {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files provided.' });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // 1. Check size limit (redundant safety)
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({ error: `File "${file.originalname}" exceeds the 5MB maximum limit.` });
      }

      // 2. Verify magic bytes
      const magic = verifyImageMagicBytes(file.buffer);
      if (!magic.isValid) {
        return res.status(400).json({
          error: `File "${file.originalname}" is not a valid JPEG, PNG, or WebP image.`
        });
      }

      // 3. Randomize filename with UUID to prevent directory traversal or collision
      const randomId = crypto.randomUUID();
      const filename = `${randomId}.${magic.extension}`;

      // 4. Try uploading to Supabase Storage bucket 'products'
      let publicUrl = '';
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('products')
          .upload(filename, file.buffer, {
            contentType: magic.mimeType,
            upsert: true
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from('products').getPublicUrl(filename);
          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload skipped or failed, saving locally:', err);
      }

      // If Supabase storage is not configured/bucket does not exist yet, save locally
      if (!publicUrl) {
        const localPath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(localPath, file.buffer);
        publicUrl = `/images/uploads/${filename}`;
      }

      uploadedUrls.push(publicUrl);
    }

    return res.json({
      success: true,
      urls: uploadedUrls
    });
  } catch (err: any) {
    console.error('Error during image upload:', err);
    return res.status(500).json({ error: 'Server error processing image upload.' });
  }
}
