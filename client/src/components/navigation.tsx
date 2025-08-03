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
                  // Tìm section content đầu tiên (không phải intro section)
                  const contentSection = document.querySelector('section[id^="section-"]') || 
                                        document.querySelector('#section-default');
                  if (contentSection) {
                    contentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
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
          <div className="flex items-center space-x-4">
            <Button
              onClick={onToggleAdmin}
              className="bg-gradient-to-r from-coral to-turquoise text-white hover:from-turquoise hover:to-sky transition-all duration-300"
            >
              <Settings className="mr-2" size={16} />
              Admin
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
