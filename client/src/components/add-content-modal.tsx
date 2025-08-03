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
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

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
  selectedSectionId?: string;
}

export function AddContentModal({ isOpen, onClose, editingItem, selectedSectionId = "default" }: AddContentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
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
      sectionId: editingItem.sectionId || selectedSectionId,
    } : {
      title: "",
      type: "text",
      content: "",
      mediaUrl: "",
      excerpt: "",
      sectionId: selectedSectionId,
    },
    values: editingItem ? {
      title: editingItem.title,
      type: editingItem.type as "text" | "image" | "video",
      content: editingItem.content || "",
      mediaUrl: editingItem.mediaUrl || "",
      excerpt: editingItem.excerpt || "",
      sectionId: editingItem.sectionId || selectedSectionId,
    } : {
      title: "",
      type: "text",
      content: "",
      mediaUrl: "",
      excerpt: "",
      sectionId: selectedSectionId,
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
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Thành công",
        description: "Item đã được thêm thành công",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể thêm item",
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
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      toast({
        title: "Thành công",
        description: "Item đã được cập nhật thành công",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật item",
        variant: "destructive",
      });
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };



  const onSubmit = (data: ContentFormData) => {
    console.log("Form data:", data);
    console.log("Selected section ID:", selectedSectionId);
    
    const submitData: InsertContentItem = {
      title: data.title,
      type: data.type,
      content: data.content || null,
      mediaUrl: data.mediaUrl || null,
      excerpt: data.excerpt || null,
      sectionId: selectedSectionId, // Force use selectedSectionId
    };

    console.log("Submit data:", submitData);

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
              : `Tạo nội dung mới cho section. Selected: ${selectedSectionId}`
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
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={10485760} // 10MB
                  onGetUploadParameters={async () => {
                    const response = await fetch('/api/objects/upload', {
                      method: 'POST'
                    });
                    const data = await response.json();
                    return {
                      method: 'PUT' as const,
                      url: data.uploadURL
                    };
                  }}
                  onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                    if (result.successful.length > 0) {
                      const uploadURL = result.successful[0].uploadURL;
                      setValue("mediaUrl", uploadURL);
                      
                      // Set ACL policy for the uploaded file
                      fetch('/api/uploaded-content', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ fileURL: uploadURL })
                      }).then(res => res.json()).then(data => {
                        setValue("mediaUrl", data.objectPath);
                        toast({
                          title: "Thành công",
                          description: "Ảnh đã được tải lên thành công!"
                        });
                      }).catch(error => {
                        console.error('Error setting file ACL:', error);
                      });
                    }
                  }}
                  buttonClassName="w-full border-2 border-dashed border-gray-300 hover:border-coral transition-colors duration-300 p-8 text-center bg-transparent text-gray-500 hover:text-coral hover:bg-coral/5"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} />
                    <span>Thêm ảnh</span>
                    <p className="text-sm text-gray-400">PNG, JPG lên đến 10MB</p>
                  </div>
                </ObjectUploader>
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
                <ObjectUploader
                  maxNumberOfFiles={1}
                  maxFileSize={104857600} // 100MB
                  onGetUploadParameters={async () => {
                    const response = await fetch('/api/objects/upload', {
                      method: 'POST'
                    });
                    const data = await response.json();
                    return {
                      method: 'PUT' as const,
                      url: data.uploadURL
                    };
                  }}
                  onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                    if (result.successful.length > 0) {
                      const uploadURL = result.successful[0].uploadURL;
                      setValue("mediaUrl", uploadURL);
                      
                      // Set ACL policy for the uploaded file
                      fetch('/api/uploaded-content', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ fileURL: uploadURL })
                      }).then(res => res.json()).then(data => {
                        setValue("mediaUrl", data.objectPath);
                        toast({
                          title: "Thành công",
                          description: "Video đã được tải lên thành công!"
                        });
                      }).catch(error => {
                        console.error('Error setting file ACL:', error);
                      });
                    }
                  }}
                  buttonClassName="w-full border-2 border-dashed border-gray-300 hover:border-coral transition-colors duration-300 p-8 text-center bg-transparent text-gray-500 hover:text-coral hover:bg-coral/5"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} />
                    <span>Tải video lên</span>
                    <p className="text-sm text-gray-400">MP4, AVI lên đến 100MB</p>
                  </div>
                </ObjectUploader>
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
              className="bg-coral text-white hover:bg-turquoise transition-all duration-300 border-0"
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
