import { v2 as cloudinary } from 'cloudinary';

import { env } from './env.config';
import { logger } from '../utils/logger.util';

/**
 * Initialize and export the configured Cloudinary instance.
 */
export function initCloudinary(): void {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  logger.info('✅ Cloudinary configured');
}

export { cloudinary };

/**
 * Upload a file buffer to Cloudinary.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    publicId?: string;
    transformation?: object[];
  },
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `careerhub/${options.folder}`,
        resource_type: options.resourceType ?? 'auto',
        public_id: options.publicId,
        transformation: options.transformation,
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error('Cloudinary upload failed'));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    stream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
