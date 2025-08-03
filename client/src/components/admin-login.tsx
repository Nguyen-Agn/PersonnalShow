import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = "admin2025"; // Mật khẩu admin đơn giản

export function AdminLogin({ isOpen, onClose, onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mô phỏng thời gian xác thực
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Lưu trạng thái đăng nhập vào localStorage
        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminLoginTime", Date.now().toString());
        
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại, Admin!",
        });
        
        setPassword("");
        onSuccess();
        onClose();
      } else {
        toast({
          title: "Sai mật khẩu",
          description: "Vui lòng kiểm tra lại mật khẩu.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins font-semibold text-slate flex items-center justify-center">
            <Lock className="text-coral mr-3" size={24} />
            Đăng nhập Admin
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Cần xác thực để truy cập vào trang quản trị nội dung
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-coral to-turquoise rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-white" size={32} />
            </div>
            <p className="text-gray-600">
              Nhập mật khẩu để truy cập trang quản trị
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="focus:ring-2 focus:ring-coral focus:border-transparent pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="text-gray-400" size={16} />
                ) : (
                  <Eye className="text-gray-400" size={16} />
                )}
              </Button>
            </div>
          </div>



          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-coral text-white hover:bg-opacity-90 transition-all duration-300"
              disabled={isLoading || !password}
            >
              {isLoading ? "Đang xác thực..." : "Đăng nhập"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}