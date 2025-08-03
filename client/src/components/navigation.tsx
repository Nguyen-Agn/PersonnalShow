import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Palette, Settings, ArrowLeft, LogOut, Download, Mail } from "lucide-react";

interface NavigationProps {
  isAdminMode: boolean;
  onToggleAdmin: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function Navigation({ isAdminMode, onToggleAdmin, onLogout, isAuthenticated }: NavigationProps) {
  const [location] = useLocation();

  if (isAdminMode) {
    return (
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-poppins font-bold text-slate flex items-center">
              <Settings className="text-coral mr-2" size={20} />
              Quản trị nội dung
            </h1>
            <div className="flex space-x-2">
              <Button
                onClick={onLogout}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="mr-2" size={16} />
                Đăng xuất
              </Button>
              <Button
                onClick={onToggleAdmin}
                variant="outline"
                className="bg-gray-500 text-white border-gray-500 hover:bg-gray-600"
              >
                <ArrowLeft className="mr-2" size={16} />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-poppins font-bold text-slate flex items-center">
              <Palette className="text-coral mr-2" size={20} />
              Portfolio
            </h1>
            <div className="hidden md:flex space-x-6">
              <a 
                href="#intro" 
                className="text-slate hover:text-coral transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('intro')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Giới thiệu
              </a>
              <a 
                href="#content" 
                className="text-slate hover:text-coral transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Nội dung
              </a>
              <a 
                href="#other" 
                className="text-slate hover:text-coral transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('other')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Khác
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              onClick={async () => {
                try {
                  // Fetch thông tin từ API để tạo CV động
                  const [introRes, otherRes] = await Promise.all([
                    fetch('/api/intro'),
                    fetch('/api/other')
                  ]);
                  
                  const intro = await introRes.json();
                  const other = await otherRes.json();
                  
                  // Tạo CV PDF từ data thực
                  const { generateCV } = await import('@/utils/pdfGenerator');
                  const pdfContent = await generateCV(intro, other);
                  
                  // Tạo blob PDF
                  const blob = new Blob([pdfContent], { type: 'application/pdf' });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `CV-${intro?.name?.replace(/\s+/g, '-') || 'Portfolio'}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                } catch (error) {
                  console.error('Error downloading PDF CV:', error);
                  // Fallback: tạo text file
                  const cvTextContent = `
CURRICULUM VITAE

Họ và tên: ${intro?.name || 'Creative Designer'}
Email: ${other?.contactInfo?.email || 'hello@portfolio.com'}  
Điện thoại: ${other?.contactInfo?.phone || '+84 123 456 789'}
Địa chỉ: ${other?.contactInfo?.location || 'Hà Nội, Việt Nam'}

=== GIỚI THIỆU ===

${intro?.description || 'Tôi tạo ra những trải nghiệm số đẹp và có ý nghĩa thông qua thiết kế sáng tạo và công nghệ hiện đại.'}

=== KỸ NĂNG CHUYÊN MÔN ===

${other?.skills?.map(skill => `• ${skill.name}: ${skill.description}`).join('\n') || 
'• UI/UX Design: Thiết kế giao diện người dùng sáng tạo\n• Frontend: Phát triển giao diện web hiện đại\n• Mobile Design: Thiết kế ứng dụng di động'}

=== THÔNG TIN LIÊN HỆ ===

${other?.socialLinks?.github ? `GitHub: ${other.socialLinks.github}` : ''}
${other?.socialLinks?.facebook ? `Facebook: ${other.socialLinks.facebook}` : ''}
${other?.socialLinks?.zalo ? `Zalo: ${other.socialLinks.zalo}` : ''}

=== DỰ ÁN PORTFOLIO ===

Truy cập portfolio đầy đủ tại: ${window.location.origin}

Cập nhật: ${new Date().toLocaleDateString('vi-VN')}
                  `.trim();

                  const blob = new Blob([cvTextContent], { type: 'text/plain;charset=utf-8' });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `CV-${intro?.name?.replace(/\s+/g, '-') || 'Portfolio'}.txt`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }
              }}
              variant="outline"
              className="border-coral text-coral hover:bg-coral hover:text-white transition-all duration-300 text-sm md:text-base"
            >
              <Download className="mr-1 md:mr-2" size={14} />
              <span className="hidden sm:inline">Tải CV</span>
              <span className="sm:hidden">CV</span>
            </Button>
            <Button
              onClick={() => {
                // Scroll đến phần liên hệ hoặc mở email
                const contactSection = document.getElementById('other');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback: mở email client
                  window.location.href = 'mailto:hello@portfolio.com?subject=Liên hệ từ Portfolio&body=Xin chào, tôi muốn liên hệ với bạn...';
                }
              }}
              variant="outline"
              className="border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-all duration-300 text-sm md:text-base"
            >
              <Mail className="mr-1 md:mr-2" size={14} />
              <span className="hidden sm:inline">Liên hệ</span>
              <span className="sm:hidden">LH</span>
            </Button>
            <Button
              onClick={onToggleAdmin}
              className="bg-gradient-to-r from-coral to-turquoise text-white hover:from-turquoise hover:to-sky transition-all duration-300 text-sm md:text-base"
            >
              <Settings className="mr-1 md:mr-2" size={14} />
              <span className="hidden sm:inline">Admin</span>
              <span className="sm:hidden">⚙️</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
