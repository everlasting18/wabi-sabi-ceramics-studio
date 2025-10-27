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
    <footer className="bg-charcoal text-cream-white">
      <div className="container mx-auto px-6 lg:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Column */}
          <div>
            <h3 className="text-2xl font-serif mb-4">Gốm Nhật</h3>
            <p className="text-cream-white/70 text-sm leading-relaxed mb-6">
              Mang vẻ đẹp truyền thống Nhật Bản vào không gian sống Việt Nam
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream-white/10 hover:bg-cream-white/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-cream-white/10 hover:bg-cream-white/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Sản phẩm
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream-white/70 hover:text-cream-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Hỗ trợ
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-cream-white/70 hover:text-cream-white text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Liên hệ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-cream-white/70">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2 text-cream-white/70">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-2 text-cream-white/70">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@gomnhat.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-cream-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cream-white/50">
            <p>© 2025 Gốm Nhật. All rights reserved.</p>
            <p>Crafted with love for Japanese ceramics</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
