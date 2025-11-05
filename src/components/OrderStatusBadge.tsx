import { Badge } from "@/components/ui/badge";
import type { Order } from "@/services/orderService";

interface OrderStatusBadgeProps {
  status: Order["status"];
  className?: string;
}

const OrderStatusBadge = ({ status, className }: OrderStatusBadgeProps) => {
  const statusConfig = {
    pending: {
      label: "Chờ xác nhận",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    confirmed: {
      label: "Đã xác nhận",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    processing: {
      label: "Đang xử lý",
      className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    shipping: {
      label: "Đang giao",
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    },
    delivered: {
      label: "Đã giao",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={`${config.className} ${className || ""}`}>
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
