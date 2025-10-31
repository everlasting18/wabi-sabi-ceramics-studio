import { ArrowRight } from "lucide-react";
import bowlsImage from "@/assets/category-bowls.jpg";
import platesImage from "@/assets/category-plates.jpg";
import teawareImage from "@/assets/category-teaware.jpg";

const categories = [
  {
    title: "Bát & Chén",
    count: "48 sản phẩm",
    image: bowlsImage,
    href: "#bowls",
  },
  {
    title: "Đĩa & Dĩa",
    count: "62 sản phẩm",
    image: platesImage,
    href: "#plates",
  },
  {
    title: "Ấm & Ly",
    count: "35 sản phẩm",
    image: teawareImage,
    href: "#teaware",
  },
];

const CategoryCards = () => {
  return (
    <section className="py-24 lg:py-40 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <p className="eyebrow mb-4">Danh mục sản phẩm</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 leading-tight">
            Khám phá bộ sưu tập
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Từng món đồ đều mang trong mình câu chuyện riêng
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <a
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-lg aspect-square animate-fade-up hover-lift shadow-lg hover:shadow-2xl"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/50 to-transparent transition-all duration-500 group-hover:from-charcoal/100" />
              
              {/* Border effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 transition-all duration-500 rounded-lg" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                <div className="transform transition-all duration-500 group-hover:-translate-y-2">
                  <h3 className="text-3xl lg:text-4xl font-serif mb-3 text-background">
                    {category.title}
                  </h3>
                  <p className="text-sm text-background/70 mb-6 uppercase tracking-wider">{category.count}</p>
                  
                  <div className="flex items-center space-x-3 text-base font-medium text-background group-hover:text-primary transition-colors duration-300">
                    <span>Khám phá ngay</span>
                    <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
