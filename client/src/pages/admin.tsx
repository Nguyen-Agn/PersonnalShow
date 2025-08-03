import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Image, Video, Clock, Upload, Save } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { AddContentModal } from "@/components/add-content-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import type { IntroSection, ContentItem, OtherSection, InsertIntroSection, InsertOtherSection } from "@shared/schema";

export function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | undefined>();

  const { data: intro } = useQuery<IntroSection>({
    queryKey: ["/api/intro"],
  });

  const { data: contentItems = [] } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"],
  });

  const { data: other } = useQuery<OtherSection>({
    queryKey: ["/api/other"],
  });

  // Introduction form
  const {
    register: registerIntro,
    handleSubmit: handleSubmitIntro,
    formState: { errors: introErrors }
  } = useForm<InsertIntroSection>({
    defaultValues: {
      title: intro?.title || "",
      name: intro?.name || "",
      description: intro?.description || "",
      profileImage: intro?.profileImage || "",
    },
    values: {
      title: intro?.title || "",
      name: intro?.name || "",
      description: intro?.description || "",
      profileImage: intro?.profileImage || "",
    }
  });

  // Other section form
  const {
    register: registerOther,
    handleSubmit: handleSubmitOther,
    setValue: setOtherValue,
    formState: { errors: otherErrors }
  } = useForm<InsertOtherSection>({
    defaultValues: {
      contactInfo: other?.contactInfo || {
        email: "",
        phone: "",
        location: ""
      },
      socialLinks: other?.socialLinks || {
        linkedin: "",
        github: "",
        dribbble: ""
      }
    },
    values: {
      contactInfo: other?.contactInfo || {
        email: "",
        phone: "",
        location: ""
      },
      socialLinks: other?.socialLinks || {
        linkedin: "",
        github: "",
        dribbble: ""
      }
    }
  });

  // Mutations
  const saveIntroMutation = useMutation({
    mutationFn: async (data: InsertIntroSection) => {
      const response = await apiRequest("POST", "/api/intro", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/intro"] });
      toast({
        title: "Thành công",
        description: "Thông tin giới thiệu đã được lưu",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin giới thiệu",
        variant: "destructive",
      });
    }
  });

  const saveOtherMutation = useMutation({
    mutationFn: async (data: InsertOtherSection) => {
      const response = await apiRequest("POST", "/api/other", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/other"] });
      toast({
        title: "Thành công",
        description: "Thông tin khác đã được lưu",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin",
        variant: "destructive",
      });
    }
  });

  const deleteContentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Thành công",
        description: "Nội dung đã được xóa",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa nội dung",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa nội dung này?")) {
      deleteContentMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingItem(undefined);
  };

  const onSubmitIntro = (data: InsertIntroSection) => {
    saveIntroMutation.mutate(data);
  };

  const onSubmitOther = (data: InsertOtherSection) => {
    saveOtherMutation.mutate(data);
  };

  const totalImages = contentItems.filter(item => item.type === "image").length;
  const totalVideos = contentItems.filter(item => item.type === "video").length;

  return (
    <div className="pt-16 min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-poppins font-bold text-slate">
            Quản trị nội dung
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-coral">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng nội dung</p>
                  <p className="text-2xl font-bold text-slate">{contentItems.length}</p>
                </div>
                <FileText className="text-coral" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-turquoise">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hình ảnh</p>
                  <p className="text-2xl font-bold text-slate">{totalImages}</p>
                </div>
                <Image className="text-turquoise" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-sky">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Video</p>
                  <p className="text-2xl font-bold text-slate">{totalVideos}</p>
                </div>
                <Video className="text-sky" size={24} />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-sunny">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Lần cập nhật cuối</p>
                  <p className="text-sm font-medium text-slate">Hôm nay</p>
                </div>
                <Clock className="text-sunny" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="intro" className="space-y-8">
          <TabsList className="bg-white p-1 h-auto rounded-xl shadow-sm">
            <TabsTrigger value="intro" className="px-6 py-3 data-[state=active]:bg-coral data-[state=active]:text-white">
              Giới thiệu
            </TabsTrigger>
            <TabsTrigger value="content" className="px-6 py-3 data-[state=active]:bg-coral data-[state=active]:text-white">
              Nội dung
            </TabsTrigger>
            <TabsTrigger value="other" className="px-6 py-3 data-[state=active]:bg-coral data-[state=active]:text-white">
              Khác
            </TabsTrigger>
          </TabsList>

          {/* Introduction Tab */}
          <TabsContent value="intro">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitIntro(onSubmitIntro)}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                          id="title"
                          {...registerIntro("title")}
                          className="focus:ring-2 focus:ring-coral focus:border-transparent"
                        />
                        {introErrors.title && (
                          <p className="text-red-500 text-sm mt-1">{introErrors.title.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="name">Tên</Label>
                        <Input
                          id="name"
                          {...registerIntro("name")}
                          className="focus:ring-2 focus:ring-coral focus:border-transparent"
                        />
                        {introErrors.name && (
                          <p className="text-red-500 text-sm mt-1">{introErrors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                          id="description"
                          {...registerIntro("description")}
                          rows={4}
                          className="focus:ring-2 focus:ring-coral focus:border-transparent"
                        />
                        {introErrors.description && (
                          <p className="text-red-500 text-sm mt-1">{introErrors.description.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Ảnh đại diện</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-coral transition-colors duration-300 cursor-pointer">
                        <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                        <p className="text-gray-500 mb-2">Thêm ảnh</p>
                        <p className="text-sm text-gray-400">PNG, JPG lên đến 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <Button
                      type="submit"
                      className="bg-coral text-white hover:bg-opacity-90 transition-all duration-300"
                      disabled={saveIntroMutation.isPending}
                    >
                      <Save className="mr-2" size={16} />
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate">Quản lý nội dung</h3>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-turquoise text-white hover:bg-sky transition-colors duration-300"
                  >
                    <Plus className="mr-2" size={16} />
                    Thêm nội dung
                  </Button>
                </div>

                <div className="space-y-4">
                  {contentItems.length > 0 ? (
                    contentItems.map((item) => (
                      <ContentCard
                        key={item.id}
                        item={item}
                        isAdmin={true}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có nội dung</h3>
                      <p className="text-gray-400">Thêm nội dung đầu tiên của bạn</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab */}
          <TabsContent value="other">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmitOther(onSubmitOther)}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-slate mb-6">Thông tin liên hệ</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            {...registerOther("contactInfo.email")}
                            className="focus:ring-2 focus:ring-coral focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input
                            id="phone"
                            type="tel"
                            {...registerOther("contactInfo.phone")}
                            className="focus:ring-2 focus:ring-coral focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="location">Địa chỉ</Label>
                          <Input
                            id="location"
                            {...registerOther("contactInfo.location")}
                            className="focus:ring-2 focus:ring-coral focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-slate mb-6">Mạng xã hội</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            {...registerOther("socialLinks.linkedin")}
                            className="focus:ring-2 focus:ring-coral focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            type="url"
                            placeholder="https://github.com/username"
                            {...registerOther("socialLinks.github")}
                            className="focus:ring-2 focus:ring-coral focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="dribbble">Dribbble</Label>
                          <Input
                            id="dribbble"
                            type="url"
                            placeholder="https://dribbble.com/username"
                            {...registerOther("socialLinks.dribbble")}
                            className="focus:ring-2 focus:ring-coral focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <Button
                      type="submit"
                      className="bg-coral text-white hover:bg-opacity-90 transition-all duration-300"
                      disabled={saveOtherMutation.isPending}
                    >
                      <Save className="mr-2" size={16} />
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddContentModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        editingItem={editingItem}
      />
    </div>
  );
}
