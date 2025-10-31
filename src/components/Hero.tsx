import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroVideo from "@/assets/hero-pottery.mp4";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/70" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-fade-in" style={{ animationDelay: "0.5s" }} />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-fade-in" style={{ animationDelay: "0.7s" }} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <p className="eyebrow text-background/90 mb-6">Gốm Nhật Authentic</p>
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-background leading-[1.1] mb-6 tracking-tight">
              Mang vẻ đẹp Nhật Bản
              <br />
              <span className="text-background/90">vào từng bữa cơm</span>
            </h1>
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: "0.6s" }}>
            <p className="text-xl md:text-2xl text-background/80 max-w-2xl mx-auto font-light leading-relaxed">
              Bộ sưu tập gốm sứ Nhật Bản vintage được tuyển chọn tỉ mỉ
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-6 animate-fade-up" style={{ animationDelay: "0.8s" }}>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-6 text-lg shadow-2xl hover:shadow-glow transition-all duration-500 hover:scale-105"
            >
              Khám phá ngay
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-hero px-10 py-6 text-lg"
            >
              Xem bộ sưu tập
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-background/70">
          <span className="text-xs uppercase tracking-wider">Cuộn xuống</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
