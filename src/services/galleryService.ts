import { supabase } from "@/integrations/supabase/client";
import type { CloudinaryImage } from "@/lib/cloudinary";

export interface Gallery {
  id: string;
  title: string;
  description: string | null;
  images: CloudinaryImage[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface CreateGalleryData {
  title: string;
  description?: string;
  images: CloudinaryImage[];
  is_published?: boolean;
}

export interface UpdateGalleryData {
  title?: string;
  description?: string;
  images?: CloudinaryImage[];
  is_published?: boolean;
}

/**
 * Get all galleries (admin view - includes unpublished)
 */
export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as Gallery[]) || [];
  } catch (error) {
    console.error("Error fetching all galleries:", error);
    throw error;
  }
};

/**
 * Get published galleries (public view)
 */
export const getPublishedGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as Gallery[]) || [];
  } catch (error) {
    console.error("Error fetching published galleries:", error);
    throw error;
  }
};

/**
 * Get gallery by ID
 */
export const getGalleryById = async (id: string): Promise<Gallery | null> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new Error("Invalid gallery ID");
    }

    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data as Gallery;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    throw error;
  }
};

/**
 * Create a new gallery
 */
export const createGallery = async (
  galleryData: CreateGalleryData
): Promise<Gallery> => {
  try {
    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be authenticated to create galleries");
    }

    const { data, error } = await supabase
      .from("galleries")
      .insert([
        {
          title: galleryData.title,
          description: galleryData.description || null,
          images: galleryData.images || [],
          is_published: galleryData.is_published || false,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Gallery;
  } catch (error) {
    console.error("Error creating gallery:", error);
    throw error;
  }
};

/**
 * Update a gallery
 */
export const updateGallery = async (
  id: string,
  updates: UpdateGalleryData
): Promise<Gallery> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new Error("Invalid gallery ID");
    }

    const { data, error } = await supabase
      .from("galleries")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Gallery;
  } catch (error) {
    console.error("Error updating gallery:", error);
    throw error;
  }
};

/**
 * Delete a gallery
 */
export const deleteGallery = async (id: string): Promise<void> => {
  try {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      throw new Error("Invalid gallery ID");
    }

    const { error } = await supabase.from("galleries").delete().eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error deleting gallery:", error);
    throw error;
  }
};

/**
 * Toggle gallery publish status
 */
export const togglePublishGallery = async (
  id: string,
  isPublished: boolean
): Promise<Gallery> => {
  try {
    return await updateGallery(id, { is_published: isPublished });
  } catch (error) {
    console.error("Error toggling gallery publish status:", error);
    throw error;
  }
};
