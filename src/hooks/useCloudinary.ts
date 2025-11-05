import { useEffect, useState, useCallback } from 'react';
import {
  loadCloudinaryUploadWidget,
  loadCloudinaryMediaEditor,
  createUploadWidget,
  openMediaEditor,
  type CloudinaryImage,
  type CloudinaryUploadResult,
} from '@/lib/cloudinary';

// Hook for Upload Widget
export const useCloudinaryUpload = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadCloudinaryUploadWidget()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Cloudinary Upload Widget:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openUploadWidget = useCallback(
    (options: any = {}): Promise<CloudinaryImage[]> => {
      return new Promise((resolve, reject) => {
        if (!isLoaded) {
          reject(new Error('Cloudinary Upload Widget not loaded'));
          return;
        }

        const uploadedImages: CloudinaryImage[] = [];

        const widget = createUploadWidget(
          {
            multiple: true,
            maxFiles: 20,
            folder: 'galleries',
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
            maxFileSize: 10000000, // 10MB
            ...options,
          },
          (error: any, result: CloudinaryUploadResult) => {
            if (error) {
              reject(error);
              widget.close();
              return;
            }

            if (result.event === 'success') {
              uploadedImages.push({
                url: result.info.secure_url,
                publicId: result.info.public_id,
                width: result.info.width,
                height: result.info.height,
                format: result.info.format,
                resourceType: result.info.resource_type,
                thumbnailUrl: result.info.thumbnail_url,
              });
            }

            if (result.event === 'close') {
              resolve(uploadedImages);
            }
          }
        );

        widget.open();
      });
    },
    [isLoaded]
  );

  return {
    isLoaded,
    isLoading,
    openUploadWidget,
  };
};

// Hook for Media Editor
export const useCloudinaryEditor = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    loadCloudinaryMediaEditor()
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Cloudinary Media Editor:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const editImage = useCallback(
    (publicId: string, options: any = {}): Promise<CloudinaryImage> => {
      if (!isLoaded) {
        return Promise.reject(new Error('Cloudinary Media Editor not loaded'));
      }

      return openMediaEditor(publicId, options);
    },
    [isLoaded]
  );

  return {
    isLoaded,
    isLoading,
    editImage,
  };
};
