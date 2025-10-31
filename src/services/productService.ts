import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type ProductInsert = TablesInsert<"products">;
export type ProductUpdate = TablesUpdate<"products">;
export type Category = Tables<"categories">;

/**
 * Get all active products
 */
export const getAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }

  return data;
};

/**
 * Get product by ID
 */
export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching product:", error);
    throw error;
  }

  return data;
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }

  return data;
};

/**
 * Get products by badge
 */
export const getProductsByBadge = async (badge: "new" | "sale" | "rare") => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("badge", badge)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by badge:", error);
    throw error;
  }

  return data;
};

/**
 * Create a new product
 */
export const createProduct = async (product: ProductInsert) => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be authenticated to create products");
  }

  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        ...product,
        created_by: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating product:", error);
    throw error;
  }

  return data;
};

/**
 * Update an existing product
 */
export const updateProduct = async (id: string, product: ProductUpdate) => {
  const { data, error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating product:", error);
    throw error;
  }

  return data;
};

/**
 * Delete a product (soft delete by setting is_active to false)
 */
export const deleteProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error deleting product:", error);
    throw error;
  }

  return data;
};

/**
 * Permanently delete a product (hard delete)
 */
export const permanentlyDeleteProduct = async (id: string) => {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error permanently deleting product:", error);
    throw error;
  }

  return true;
};

/**
 * Search products by name or brand
 */
export const searchProducts = async (query: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,brand.ilike.%${query}%`)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching products:", error);
    throw error;
  }

  return data;
};

/**
 * Get all categories
 */
export const getAllCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data;
};

/**
 * Get featured products (products with badges)
 */
export const getFeaturedProducts = async (limit: number = 8) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .not("badge", "is", null)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }

  return data;
};

/**
 * Format price from number to Vietnamese currency string
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + "₫";
};

/**
 * Parse price from string to number
 */
export const parsePrice = (priceString: string): number => {
  return parseFloat(priceString.replace(/[^0-9.]/g, ""));
};
