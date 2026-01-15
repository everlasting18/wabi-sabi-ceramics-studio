import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/contexts/CartContext";

export interface OrderItem {
  product_id: number;
  product_name: string;
  product_brand: string;
  product_image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CreateOrderData {
  // Customer information
  customer_name: string;
  customer_email: string;
  customer_phone: string;

  // Shipping address
  shipping_address: string;
  shipping_address2?: string;
  shipping_city: string;
  shipping_district: string;

  // Order details
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;

  // Payment and shipping
  payment_method: string;
  shipping_method?: string;
  coupon_code?: string;

  // Notes
  notes?: string;
}

export interface Order extends CreateOrderData {
  id: number;
  order_number: string;
  user_id: string | null;
  status: "pending" | "confirmed" | "processing" | "shipping" | "delivered" | "cancelled";
  payment_status: "unpaid" | "paid" | "refunded";
  created_at: string;
  updated_at: string;
}

/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-RANDOM
 */
const generateOrderNumber = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `ORD-${dateStr}-${random}`;
};

/**
 * Convert cart items to order items
 */
export const cartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
  return cartItems.map((item) => ({
    product_id: item.product.id,
    product_name: item.product.name,
    product_brand: item.product.brand,
    product_image:
      item.product.images && item.product.images.length > 0
        ? item.product.images[0]
        : item.product.image_url || "",
    price: item.product.price,
    quantity: item.quantity,
    subtotal: item.product.price * item.quantity,
  }));
};

/**
 * Create a new order
 */
export const createOrder = async (
  orderData: CreateOrderData
): Promise<Order> => {
  try {
    // Get current user (if logged in)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Validate user.id if present
    let userId: string | null = null;
    if (user?.id) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(user.id)) {
        userId = user.id;
      } else {
        console.warn("Invalid user ID format, creating order as guest");
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Prepare order data
    const order = {
      order_number: orderNumber,
      user_id: userId,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      shipping_address2: orderData.shipping_address2 || null,
      shipping_city: orderData.shipping_city,
      shipping_district: orderData.shipping_district,
      items: orderData.items,
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shipping_fee: orderData.shipping_fee,
      total: orderData.total,
      payment_method: orderData.payment_method,
      shipping_method: orderData.shipping_method || "standard",
      coupon_code: orderData.coupon_code || null,
      notes: orderData.notes || null,
      status: "pending",
      payment_status: "unpaid",
    };

    // Insert order
    const { data, error } = await supabase
      .from("orders")
      .insert(order)
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      throw new Error(`Failed to create order: ${error.message}`);
    }

    return data as Order;
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error;
  }
};

/**
 * Get order by order number
 */
export const getOrderByNumber = async (
  orderNumber: string
): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data as Order;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};

/**
 * Get order by ID
 */
export const getOrderById = async (id: number): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw error;
    }

    return data as Order;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
};

/**
 * Get all orders for current user
 */
export const getUserOrders = async (): Promise<Order[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.id) {
      throw new Error("User not authenticated");
    }

    // Validate user.id is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(user.id)) {
      throw new Error("Invalid user ID format");
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as Order[]) || [];
  } catch (error) {
    console.error("Error getting user orders:", error);
    throw error;
  }
};

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data as Order[]) || [];
  } catch (error) {
    console.error("Error getting all orders:", error);
    throw error;
  }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (
  orderId: number,
  status: Order["status"]
): Promise<void> => {
  try {
    // Validate orderId is a valid number
    if (!orderId || isNaN(orderId) || orderId <= 0) {
      throw new Error("Invalid order ID");
    }

    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

/**
 * Update payment status
 */
export const updatePaymentStatus = async (
  orderId: number,
  paymentStatus: Order["payment_status"]
): Promise<void> => {
  try {
    // Validate orderId is a valid number
    if (!orderId || isNaN(orderId) || orderId <= 0) {
      throw new Error("Invalid order ID");
    }

    const { error } = await supabase
      .from("orders")
      .update({ payment_status: paymentStatus })
      .eq("id", orderId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

/**
 * Format price
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN").format(price) + "₫";
};
