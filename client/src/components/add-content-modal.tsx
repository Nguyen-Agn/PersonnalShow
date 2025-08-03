import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Upload, X, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContentItem, InsertContentItem } from "@shared/schema";

const contentFormSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  type: z.enum(["text", "image", "video"]),
  content: z.string().optional(),
  mediaUrl: z.string().optional(),
  excerpt: z.string().optional(),
  sectionId: z.string().default("default"),
});

type ContentFormData = z.infer<typeof contentFormSchema>;

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem?: ContentItem;
}

export function AddContentModal({ isOpen, onClose, editingItem }: AddContentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentFormSchema),
    defaultValues: editingItem ? {
      title: editingItem.title,
      type: editingItem.type as "text" | "image" | "video",
      content: editingItem.content || "",
      mediaUrl: editingItem.mediaUrl || "",
      excerpt: editingItem.excerpt || "",
      sectionId: editingItem.sectionId || "default",
    } : {
      type: "text",
      sectionId: "default",
    }
  });

  const contentType = watch("type");

  const createMutation = useMutation({
    mutationFn: async (data: InsertContentItem) => {
      const response = await apiRequest("POST", "/api/content", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Thành công",
        description: "Nội dung đã được thêm thành công",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể thêm nội dung",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertContentItem) => {
      const response = await apiRequest("PUT", `/api/content/${editingItem?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Thành công",
        description: "Nội dung đã được cập nhật thành công",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật nội dung",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // In a real app, you would upload the file and get a URL
      // For now, we'll use a placeholder URL
      const mockUrl = URL.createObjectURL(file);
      setValue("mediaUrl", mockUrl);
    }
  };

  const onSubmit = (data: ContentFormData) => {
    const submitData: InsertContentItem = {
      title: data.title,
      type: data.type,
      content: data.content || null,
      mediaUrl: data.mediaUrl || null,
      excerpt: data.excerpt || null,
    };

    if (editingItem) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-poppins font-semibold text-slate">
            {editingItem ? "Chỉnh sửa nội dung" : "Thêm nội dung mới"}
          </DialogTitle>
          <DialogDescription>
            {editingItem 
              ? "Cập nhật thông tin nội dung của bạn."
              : "Tạo nội dung mới cho portfolio."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="type">Loại nội dung</Label>
            <Select 
              value={contentType} 
              onValueChange={(value) => setValue("type", value as "text" | "image" | "video")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại nội dung" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Văn bản</SelectItem>
                <SelectItem value="image">Hình ảnh</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Nhập tiêu đề..."
              className="focus:ring-2 focus:ring-coral focus:border-transparent"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {contentType === "text" && (
            <div>
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                {...register("content")}
                rows={6}
                placeholder="Nhập nội dung..."
                className="focus:ring-2 focus:ring-coral focus:border-transparent"
              />
            </div>
          )}

          {contentType === "image" && (
            <>
              <div>
                <Label>Tải ảnh lên</Label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-coral transition-colors duration-300 overflow-hidden">
                  <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                  <p className="text-gray-500 mb-2">Thêm ảnh</p>
                  <p className="text-sm text-gray-400">PNG, JPG lên đến 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Đã chọn: {selectedFile.name}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="content">Mô tả ảnh</Label>
                <Textarea
                  id="content"
                  {...register("content")}
                  rows={3}
                  placeholder="Mô tả ngắn về hình ảnh..."
                  className="focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>
            </>
          )}

          {contentType === "video" && (
            <>
              <div>
                <Label htmlFor="mediaUrl">Link video</Label>
                <Input
                  id="mediaUrl"
                  {...register("mediaUrl")}
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  className="focus:ring-2 focus:ring-coral focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hoặc tải video lên bằng cách chọn file bên dưới
                </p>
              </div>
              
              <div>
                <Label>Tải video lên</Label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-coral transition-colors duration-300 overflow-hidden">
                  <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                  <p className="text-gray-500 mb-2">Tải video lên</p>
                  <p className="text-sm text-gray-400">MP4, AVI lên đến 100MB</p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="content">Mô tả video</Label>
                <Textarea
                  id="content"
                  {...register("content")}
                  rows={3}
                  placeholder="Mô tả nội dung video..."
                  className="focus:ring-2 focus:ring-coral focus:border-transparent"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="excerpt">Tóm tắt ngắn</Label>
            <Textarea
              id="excerpt"
              {...register("excerpt")}
              rows={2}
              placeholder="Tóm tắt ngắn gọn..."
              className="focus:ring-2 focus:ring-coral focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-coral text-white hover:bg-opacity-90 transition-all duration-300"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="mr-2" size={16} />
              {editingItem ? "Cập nhật" : "Lưu nội dung"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
