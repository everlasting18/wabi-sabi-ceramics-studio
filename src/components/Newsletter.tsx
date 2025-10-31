import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
      setEmail("");
    }
  };

  return (
    <section className="py-24 lg:py-40 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary mb-8 shadow-lg animate-scale-up">
            <Mail className="w-10 h-10" strokeWidth={1.5} />
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
              Đừng bỏ lỡ hàng mới
            </h2>
          </div>
          
          <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
              Đăng ký nhận thông báo về sản phẩm mới và ưu đãi đặc biệt
            </p>
          </div>
          
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto animate-fade-up" 
            style={{ animationDelay: "0.4s" }}
          >
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 px-6 text-base border-2 focus:border-primary shadow-sm"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground h-14 px-10 font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Đăng ký ngay
            </Button>
          </form>
          
          <p className="text-sm text-muted-foreground mt-6 animate-fade-up" style={{ animationDelay: "0.5s" }}>
            🔒 Chúng tôi tôn trọng quyền riêng tư của bạn. Không spam.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
