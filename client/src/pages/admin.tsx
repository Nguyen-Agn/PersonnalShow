import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Image, Video, Clock, Upload, Save, Trash2, Layers, Edit, MoreVertical } from "lucide-react";
import { ContentCard } from "@/components/content-card";
import { AddContentModal } from "@/components/add-content-modal";
import { CreateSectionModal } from "@/components/create-section-modal";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { IntroSection, ContentItem, OtherSection, InsertIntroSection, InsertOtherSection, CustomSection, InsertCustomSection } from "@shared/schema";

const skillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string().min(1, "Tên kỹ năng không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    icon: z.string().min(1, "Icon không được để trống")
  }))
});

export function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | undefined>();
  const [isCreateSectionModalOpen, setIsCreateSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<CustomSection | undefined>();
  const [selectedSectionId, setSelectedSectionId] = useState<string>("default");

  const { data: intro } = useQuery<IntroSection>({
    queryKey: ["/api/intro"],
  });

  const { data: contentItems = [] } = useQuery<ContentItem[]>({
    queryKey: ["/api/content"],
  });

  const { data: other } = useQuery<OtherSection>({
    queryKey: ["/api/other"],
  });

  const { data: customSections = [] } = useQuery<CustomSection[]>({
    queryKey: ["/api/sections"],
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
        facebook: "",
        github: "",
        zalo: ""
      }
    },
    values: {
      contactInfo: other?.contactInfo || {
        email: "",
        phone: "",
        location: ""
      },
      socialLinks: other?.socialLinks || {
        facebook: "",
        github: "",
        zalo: ""
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

  // Skills form
  const {
    control: skillsControl,
    handleSubmit: handleSubmitSkills,
    formState: { errors: skillsErrors }
  } = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: other?.skills || [
        { name: "UI/UX Design", description: "Thiết kế giao diện người dùng sáng tạo", icon: "PaintbrushVertical" },
        { name: "Frontend", description: "Phát triển giao diện web hiện đại", icon: "Code" },
        { name: "Mobile Design", description: "Thiết kế ứng dụng di động", icon: "Smartphone" },
        { name: "Content", description: "Tạo nội dung sáng tạo và hấp dẫn", icon: "FileImage" }
      ]
    },
    values: {
      skills: other?.skills || [
        { name: "UI/UX Design", description: "Thiết kế giao diện người dùng sáng tạo", icon: "PaintbrushVertical" },
        { name: "Frontend", description: "Phát triển giao diện web hiện đại", icon: "Code" },
        { name: "Mobile Design", description: "Thiết kế ứng dụng di động", icon: "Smartphone" },
        { name: "Content", description: "Tạo nội dung sáng tạo và hấp dẫn", icon: "FileImage" }
      ]
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: skillsControl,
    name: "skills"
  });

  const saveSkillsMutation = useMutation({
    mutationFn: async (data: { skills: Array<{ name: string; description: string; icon: string }> }) => {
      const response = await apiRequest("PUT", "/api/skills", data.skills);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/other"] });
      toast({
        title: "Thành công",
        description: "Kỹ năng đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể lưu kỹ năng",
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
    setSelectedSectionId("default");
  };

  const onSubmitIntro = (data: InsertIntroSection) => {
    saveIntroMutation.mutate(data);
  };

  const onSubmitOther = (data: InsertOtherSection) => {
    saveOtherMutation.mutate(data);
  };

  const createSectionMutation = useMutation({
    mutationFn: async (data: InsertCustomSection) => {
      const response = await apiRequest("POST", "/api/sections", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã tạo section mới",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      setIsCreateSectionModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể tạo section",
        variant: "destructive",
      });
    },
  });

  const handleCreateSection = (data: InsertCustomSection) => {
    if (editingSection) {
      updateSectionMutation.mutate({ id: editingSection.id, data });
    } else {
      createSectionMutation.mutate(data);
    }
  };

  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertCustomSection> }) => {
      const response = await apiRequest("PUT", `/api/sections/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã cập nhật section",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
      setIsCreateSectionModalOpen(false);
      setEditingSection(undefined);
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật section",
        variant: "destructive",
      });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/sections/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã xóa section",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/sections"] });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: "Không thể xóa section",
        variant: "destructive",
      });
    },
  });

  const handleDeleteSection = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa section này?")) {
      deleteSectionMutation.mutate(id);
    }
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
            <TabsTrigger value="sections" className="px-6 py-3 data-[state=active]:bg-coral data-[state=active]:text-white">
              <Layers className="mr-2" size={16} />
              Sections
            </TabsTrigger>
            <TabsTrigger value="skills" className="px-6 py-3 data-[state=active]:bg-coral data-[state=active]:text-white">
              Kỹ năng
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
                      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-coral transition-colors duration-300 overflow-hidden">
                        <Upload className="mx-auto text-gray-400 mb-4" size={32} />
                        <p className="text-gray-500 mb-2">Thêm ảnh</p>
                        <p className="text-sm text-gray-400">PNG, JPG lên đến 10MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // In a real app, you would upload the file and get a URL
                              const mockUrl = URL.createObjectURL(file);
                              console.log("Selected file:", file.name, "URL:", mockUrl);
                            }
                          }}
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



          {/* Sections Tab */}
          <TabsContent value="sections">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate">Quản lý Sections</h3>
                  <Button
                    onClick={() => setIsCreateSectionModalOpen(true)}
                    className="bg-turquoise text-white hover:bg-sky transition-colors duration-300"
                  >
                    <Plus className="mr-2" size={16} />
                    Tạo Section
                  </Button>
                </div>

                <div className="space-y-4">
                  {customSections.length > 0 ? (
                    customSections.map((section) => (
                      <Card key={section.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-slate">{section.title}</h4>
                              {section.description && (
                                <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                              )}
                              <div className="flex items-center gap-4 mt-2">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                  Thứ tự: {section.order}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                  {section.type}
                                </span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                  {section.items?.length || 0} items
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingSection(section);
                                  setIsCreateSectionModalOpen(true);
                                }}
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSection(section.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                          
                          {section.items && section.items.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                              {section.items.map((item, index) => (
                                <div
                                  key={item.id}
                                  className="p-3 border rounded-lg bg-gray-50"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    {item.type === 'text' && <FileText size={14} />}
                                    {item.type === 'image' && <Image size={14} />}
                                    {item.type === 'video' && <Video size={14} />}
                                    <h5 className="font-medium text-sm">{item.title}</h5>
                                  </div>
                                  {item.description && (
                                    <p className="text-xs text-gray-600">{item.description}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSectionId(section.id);
                                setIsAddModalOpen(true);
                              }}
                            >
                              <Plus className="mr-2" size={14} />
                              Thêm Item
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Layers className="mx-auto text-gray-400 mb-4" size={48} />
                      <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có section nào</h3>
                      <p className="text-gray-400">Tạo section đầu tiên để hiển thị nội dung theo chủ đề</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardContent className="p-6">
                <div className="mb-6 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate">Quản lý kỹ năng</h3>
                  <Button
                    type="button"
                    onClick={() => appendSkill({ name: "", description: "", icon: "Code" })}
                    className="bg-turquoise text-white hover:bg-sky transition-colors duration-300"
                  >
                    <Plus className="mr-2" size={16} />
                    Thêm kỹ năng
                  </Button>
                </div>

                <form onSubmit={handleSubmitSkills((data) => saveSkillsMutation.mutate(data))}>
                  <div className="space-y-6">
                    {skillFields.map((field, index) => (
                      <Card key={field.id} className="border border-gray-200">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                              <Label htmlFor={`skills.${index}.name`}>Tên kỹ năng</Label>
                              <Input
                                {...skillsControl.register(`skills.${index}.name`)}
                                placeholder="VD: UI/UX Design"
                                className="focus:ring-2 focus:ring-coral focus:border-transparent"
                              />
                              {skillsErrors.skills?.[index]?.name && (
                                <p className="text-red-500 text-sm mt-1">
                                  {skillsErrors.skills[index].name?.message}
                                </p>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor={`skills.${index}.description`}>Mô tả</Label>
                              <Input
                                {...skillsControl.register(`skills.${index}.description`)}
                                placeholder="Mô tả ngắn về kỹ năng"
                                className="focus:ring-2 focus:ring-coral focus:border-transparent"
                              />
                              {skillsErrors.skills?.[index]?.description && (
                                <p className="text-red-500 text-sm mt-1">
                                  {skillsErrors.skills[index].description?.message}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <Label htmlFor={`skills.${index}.icon`}>Icon</Label>
                                <Input
                                  {...skillsControl.register(`skills.${index}.icon`)}
                                  placeholder="Code"
                                  className="focus:ring-2 focus:ring-coral focus:border-transparent"
                                />
                                {skillsErrors.skills?.[index]?.icon && (
                                  <p className="text-red-500 text-sm mt-1">
                                    {skillsErrors.skills[index].icon?.message}
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeSkill(index)}
                                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {skillFields.length === 0 && (
                      <div className="text-center py-12">
                        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                        <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa có kỹ năng</h3>
                        <p className="text-gray-400">Thêm kỹ năng đầu tiên của bạn</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-8">
                    <Button
                      type="submit"
                      className="bg-coral text-white hover:bg-opacity-90 transition-all duration-300"
                      disabled={saveSkillsMutation.isPending}
                    >
                      <Save className="mr-2" size={16} />
                      Lưu kỹ năng
                    </Button>
                  </div>
                </form>
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
                          <Label htmlFor="facebook">Facebook</Label>
                          <Input
                            id="facebook"
                            type="url"
                            placeholder="https://facebook.com/yourprofile"
                            {...registerOther("socialLinks.facebook")}
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
                          <Label htmlFor="zalo">Zalo</Label>
                          <Input
                            id="zalo"
                            type="url"
                            placeholder="https://zalo.me/yourusername hoặc số điện thoại"
                            {...registerOther("socialLinks.zalo")}
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
        selectedSectionId={selectedSectionId}
      />

      <CreateSectionModal
        isOpen={isCreateSectionModalOpen}
        onClose={() => {
          setIsCreateSectionModalOpen(false);
          setEditingSection(undefined);
        }}
        onSubmit={handleCreateSection}
        editingSection={editingSection}
      />
    </div>
  );
}
