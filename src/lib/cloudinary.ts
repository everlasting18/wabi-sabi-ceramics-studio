// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '',
};

// Image object interface
export interface CloudinaryImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
  thumbnailUrl?: string;
}

// Upload Widget result
export interface CloudinaryUploadResult {
  event: string;
  info: {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    thumbnail_url?: string;
    [key: string]: any;
  };
}

// Load Cloudinary Upload Widget script
export const loadCloudinaryUploadWidget = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.cloudinary) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cloudinary Upload Widget'));
    document.body.appendChild(script);
  });
};

// Load Cloudinary Media Editor script
export const loadCloudinaryMediaEditor = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.cloudinary?.mediaEditor) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://media-editor.cloudinary.com/all.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cloudinary Media Editor'));
    document.body.appendChild(script);
  });
};

// Create upload widget
export const createUploadWidget = (
  options: any,
  callback: (error: any, result: CloudinaryUploadResult) => void
) => {
  if (!window.cloudinary) {
    throw new Error('Cloudinary Upload Widget not loaded');
  }

  return window.cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      ...options,
    },
    callback
  );
};

// Open Media Editor
export const openMediaEditor = (
  publicId: string,
  options: any = {}
): Promise<CloudinaryImage> => {
  return new Promise((resolve, reject) => {
    if (!window.cloudinary?.mediaEditor) {
      reject(new Error('Cloudinary Media Editor not loaded'));
      return;
    }

    window.cloudinary.mediaEditor().update({
      cloudName: CLOUDINARY_CONFIG.cloudName,
      publicIds: [publicId],
      ...options,
    }).show({
      onSave: (result: any) => {
        const asset = result.assets[0];
        resolve({
          url: asset.secure_url,
          publicId: asset.public_id,
          width: asset.width,
          height: asset.height,
          format: asset.format,
          resourceType: asset.resource_type,
        });
      },
      onCancel: () => {
        reject(new Error('Media editor cancelled'));
      },
    });
  });
};

// Generate thumbnail URL
export const getThumbnailUrl = (publicId: string, width = 300, height = 300): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/c_fill,w_${width},h_${height}/${publicId}`;
};

// Generate optimized URL
export const getOptimizedUrl = (publicId: string, transformations = ''): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformations}/${publicId}`;
};

// Declare global types for Cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}
