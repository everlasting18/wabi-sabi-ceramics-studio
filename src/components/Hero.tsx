import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-pottery.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Japanese pottery collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-cream-white/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
          <p className="eyebrow text-primary">Gốm Nhật Authentic</p>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal leading-tight">
            Mang vẻ đẹp Nhật Bản
            <br />
            vào từng bữa cơm
          </h1>
          
          <p className="text-lg md:text-xl text-warm-grey max-w-2xl mx-auto font-light">
            Bộ sưu tập gốm sứ Nhật Bản vintage được tuyển chọn tỉ mỉ
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              Khám phá ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-hero"
            >
              Xem bộ sưu tập
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-primary" />
      </div>
    </section>
  );
};

export default Hero;
