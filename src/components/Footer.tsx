import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    products: [
      { label: "Bát & Chén", href: "#" },
      { label: "Đĩa & Dĩa", href: "#" },
      { label: "Ấm & Ly", href: "#" },
      { label: "Sản phẩm mới", href: "#" },
    ],
    support: [
      { label: "Hướng dẫn mua hàng", href: "#" },
      { label: "Chính sách đổi trả", href: "#" },
      { label: "Chính sách bảo mật", href: "#" },
      { label: "Điều khoản sử dụng", href: "#" },
    ],
  };

  return (
    <footer className="bg-charcoal text-cream-white relative overflow-hidden">
      {/* Decorative gradient overlays */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 lg:px-20 py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* About Column */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-serif mb-6 text-cream-white">Gốm Nhật</h3>
            <p className="text-cream-white/70 text-sm leading-relaxed mb-8">
              Mang vẻ đẹp truyền thống Nhật Bản vào không gian sống Việt Nam
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-cream-white/10 hover:bg-cream-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-xl bg-cream-white/10 hover:bg-cream-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-cream-white">
              Sản phẩm
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream-white/70 hover:text-cream-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-cream-white">
              Hỗ trợ
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream-white/70 hover:text-cream-white text-sm transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest mb-6 text-cream-white">
              Liên hệ
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-cream-white/70 group hover:text-cream-white transition-colors">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3 text-cream-white/70 group hover:text-cream-white transition-colors">
                <Phone className="w-5 h-5 flex-shrink-0 text-primary" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-cream-white/70 group hover:text-cream-white transition-colors">
                <Mail className="w-5 h-5 flex-shrink-0 text-primary" />
                <span>hello@gomnhat.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cream-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-white/50">
            <p>© 2025 Gốm Nhật. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Crafted with <span className="text-primary animate-pulse">❤</span> for Japanese ceramics
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
