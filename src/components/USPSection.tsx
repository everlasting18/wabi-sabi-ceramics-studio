import { CheckCircle2, Package, RefreshCw } from "lucide-react";

const usps = [
  {
    icon: CheckCircle2,
    title: "100% Authentic",
    description: "Nhập trực tiếp từ Nhật Bản, đảm bảo nguồn gốc rõ ràng",
  },
  {
    icon: Package,
    title: "Đóng gói cẩn thận",
    description: "Bảo vệ tối đa trong quá trình vận chuyển",
  },
  {
    icon: RefreshCw,
    title: "Đổi trả 7 ngày",
    description: "Yên tâm mua sắm, đổi trả dễ dàng nếu không hài lòng",
  },
];

const USPSection = () => {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {usps.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <div
                key={usp.title}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
                  <Icon className="w-8 h-8" />
                </div>
                
                <h3 className="text-xl font-serif font-medium mb-3">
                  {usp.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {usp.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default USPSection;
