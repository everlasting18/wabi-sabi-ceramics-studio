import { supabase } from "@/integrations/supabase/client";

/**
 * Upload multiple images to Supabase Storage
 */
export const uploadProductImages = async (files: File[]): Promise<string[]> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to upload images");
  }

  const uploadPromises = files.map(async (file) => {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl;
  });

  const urls = await Promise.all(uploadPromises);
  return urls;
};

/**
 * Delete image from Supabase Storage
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/product-images/');

    if (pathParts.length < 2) {
      throw new Error("Invalid image URL");
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from('product-images')
      .remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error parsing image URL:", error);
    throw error;
  }
};

/**
 * Delete multiple images from Supabase Storage
 */
export const deleteProductImages = async (imageUrls: string[]): Promise<void> => {
  const deletePromises = imageUrls.map(url => deleteProductImage(url));
  await Promise.all(deletePromises);
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Chỉ chấp nhận file ảnh (JPEG, PNG, WebP, GIF)'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Kích thước file không được vượt quá 5MB'
    };
  }

  return { valid: true };
};

/**
 * Compress image before upload (client-side)
 */
export const compressImage = async (file: File, maxWidth: number = 1200): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          file.type,
          0.9
        );
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
};
