import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { InsertCustomSection } from "@shared/schema";

const createSectionSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
  type: z.enum(["grid", "list", "cards"], { required_error: "Vui lòng chọn loại hiển thị" }),
  order: z.string().min(1, "Thứ tự không được để trống"),
  backgroundColor: z.string().default("bg-white"),
});

interface CreateSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertCustomSection) => void;
}

export function CreateSectionModal({ isOpen, onClose, onSubmit }: CreateSectionModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof createSectionSchema>>({
    resolver: zodResolver(createSectionSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "grid",
      order: "1",
      backgroundColor: "bg-white"
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: z.infer<typeof createSectionSchema>) => {
    onSubmit({
      ...data,
      items: []
    });
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Section Mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="VD: Dự án của tôi"
              className="focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Mô tả (tùy chọn)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Mô tả ngắn về section này"
              className="focus:ring-2 focus:ring-coral focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Loại hiển thị</Label>
            <Select onValueChange={(value) => setValue("type", value as "grid" | "list" | "cards")}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Lưới (Grid)</SelectItem>
                <SelectItem value="list">Danh sách (List)</SelectItem>
                <SelectItem value="cards">Thẻ (Cards)</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="order">Thứ tự hiển thị</Label>
            <Input
              id="order"
              {...register("order")}
              placeholder="1"
              type="number"
              className="focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            {errors.order && (
              <p className="text-red-500 text-sm mt-1">{errors.order.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="backgroundColor">Màu nền</Label>
            <Select onValueChange={(value) => setValue("backgroundColor", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn màu nền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bg-white">Trắng</SelectItem>
                <SelectItem value="bg-gray-50">Xám nhạt</SelectItem>
                <SelectItem value="bg-blue-50">Xanh dương nhạt</SelectItem>
                <SelectItem value="bg-green-50">Xanh lá nhạt</SelectItem>
                <SelectItem value="bg-purple-50">Tím nhạt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-coral text-white hover:bg-opacity-90"
            >
              Tạo Section
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}