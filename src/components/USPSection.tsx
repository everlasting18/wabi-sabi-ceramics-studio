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
    <section className="py-24 lg:py-40 bg-gradient-to-b from-muted/30 via-muted/50 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {usps.map((usp, index) => {
            const Icon = usp.icon;
            return (
              <div
                key={usp.title}
                className="text-center animate-fade-up group"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mb-8 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500">
                  <Icon className="w-10 h-10" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                  {usp.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-base">
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
