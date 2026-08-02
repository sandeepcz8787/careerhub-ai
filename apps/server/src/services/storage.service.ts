import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.config';
import { logger } from '../utils/logger.util';

export interface FileUploadPayload {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  folder?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  sizeBytes: number;
}

export class StorageService {
  /**
   * Upload an image file (PNG, JPEG, WebP, SVG, GIF)
   */
  static async uploadImage(
    file: FileUploadPayload,
    folder = 'images',
  ): Promise<UploadResult> {
    logger.info(`Uploading image ${file.originalName} to folder careerhub/${folder}`);
    const res = await uploadToCloudinary(file.buffer, {
      folder,
      resourceType: 'image',
    });
    return {
      url: res.url,
      publicId: res.publicId,
      format: file.mimeType,
      sizeBytes: file.buffer.length,
    };
  }

  /**
   * Upload a PDF or Document
   */
  static async uploadDocument(
    file: FileUploadPayload,
    folder = 'documents',
  ): Promise<UploadResult> {
    logger.info(`Uploading document ${file.originalName} to folder careerhub/${folder}`);
    const res = await uploadToCloudinary(file.buffer, {
      folder,
      resourceType: 'raw',
    });
    return {
      url: res.url,
      publicId: res.publicId,
      format: file.mimeType,
      sizeBytes: file.buffer.length,
    };
  }

  /**
   * Upload Video Media
   */
  static async uploadVideo(
    file: FileUploadPayload,
    folder = 'videos',
  ): Promise<UploadResult> {
    logger.info(`Uploading video ${file.originalName} to folder careerhub/${folder}`);
    const res = await uploadToCloudinary(file.buffer, {
      folder,
      resourceType: 'video',
    });
    return {
      url: res.url,
      publicId: res.publicId,
      format: file.mimeType,
      sizeBytes: file.buffer.length,
    };
  }

  /**
   * Delete file by public ID
   */
  static async deleteFile(publicId: string): Promise<void> {
    logger.info(`Deleting file with publicId: ${publicId}`);
    await deleteFromCloudinary(publicId);
  }
}
