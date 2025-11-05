import { Badge } from "@/components/ui/badge";
import type { Order } from "@/services/orderService";

interface PaymentStatusBadgeProps {
  status: Order["payment_status"];
  className?: string;
}

const PaymentStatusBadge = ({ status, className }: PaymentStatusBadgeProps) => {
  const statusConfig = {
    unpaid: {
      label: "Chưa thanh toán",
      className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    },
    paid: {
      label: "Đã thanh toán",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    refunded: {
      label: "Đã hoàn tiền",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    },
  };

  const config = statusConfig[status] || statusConfig.unpaid;

  return (
    <Badge className={`${config.className} ${className || ""}`}>
      {config.label}
    </Badge>
  );
};

export default PaymentStatusBadge;
