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
    <section className="py-20 lg:py-32 bg-gradient-to-br from-sage-green/20 to-sand/30">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
            Đừng bỏ lỡ hàng mới
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8">
            Đăng ký nhận thông báo về sản phẩm mới và ưu đãi đặc biệt
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8"
            >
              Đăng ký
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-4">
            Chúng tôi tôn trọng quyền riêng tư của bạn. Không spam.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
