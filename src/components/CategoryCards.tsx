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
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <a
              key={category.title}
              href={category.href}
              className="group relative overflow-hidden rounded-sm aspect-square animate-fade-up hover-lift"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 text-white">
                <h3 className="text-2xl lg:text-3xl font-serif mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-white/80 mb-4">{category.count}</p>
                
                <div className="flex items-center space-x-2 text-sm font-medium group-hover:translate-x-2 transition-transform">
                  <span>Khám phá</span>
                  <ArrowRight className="w-4 h-4" />
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
