import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Download, Mail, Star, Code, PaintbrushVertical, Smartphone, FileImage, MapPin, Phone, MessageCircle } from "lucide-react";
import { FaFacebook, FaGithub } from "react-icons/fa";
import { ContentCard, EmptyContentCard } from "@/components/content-card";
import type { IntroSection, ContentItem, OtherSection, CustomSection } from "@shared/schema";

export function HomePage() {
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

  return (
    <div className="pt-16">
      {/* Introduction Section */}
      <section id="intro" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="gradient-bg absolute inset-0 opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-poppins font-bold text-slate mb-6 leading-tight animate-slide-in-left">
                <span>{intro?.title || "Xin chào, tôi là"}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-turquoise block animate-slide-in-right" style={{animationDelay: '0.3s'}}>
                  {intro?.name || "Creative Designer"}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                {intro?.description || "Tôi tạo ra những trải nghiệm số đẹp và có ý nghĩa thông qua thiết kế sáng tạo và công nghệ hiện đại."}
              </p>
              <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
                <Button className="bg-coral text-white hover:bg-turquoise btn-hover-lift shadow-lg hover:shadow-xl border-0">
                  <Download className="mr-2" size={16} />
                  Tải CV
                </Button>
                <Button variant="outline" className="border-2 border-turquoise text-turquoise hover:bg-turquoise hover:text-white btn-hover-lift border-0">
                  <Mail className="mr-2" size={16} />
                  Liên hệ
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-coral via-turquoise to-sky p-1 animate-pulse-custom card-hover">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    {intro?.profileImage ? (
                      <img 
                        src={intro.profileImage} 
                        alt="Profile" 
                        className="w-72 h-72 rounded-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-72 h-72 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors duration-300">
                        <User size={80} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-sunny rounded-full flex items-center justify-center animate-bounce-custom btn-hover-scale" style={{animationDelay: '1.2s'}}>
                  <Star className="text-white" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* All Sections */}
      {customSections.map((section, sectionIndex) => {
        // Get items for this section
        const sectionItems = contentItems.filter(item => item.sectionId === section.id || (!item.sectionId && section.id === "default"));
        
        return (
          <section 
            key={section.id} 
            className={`py-20 relative overflow-hidden ${
              sectionIndex % 2 === 0 
                ? 'bg-gradient-to-br from-gray-50 to-white' 
                : 'bg-gradient-to-br from-slate-100 via-gray-50 to-white'
            }`}
          >
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className={`absolute top-10 ${sectionIndex % 2 === 0 ? 'left-10' : 'right-10'} w-32 h-32 bg-coral/20 rounded-full blur-2xl animate-pulse-custom`}></div>
              <div className={`absolute bottom-10 ${sectionIndex % 2 === 0 ? 'right-10' : 'left-10'} w-40 h-40 bg-turquoise/20 rounded-full blur-2xl`} style={{animationDelay: '2s'}}></div>
            </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-poppins font-bold text-slate mb-6 relative">
                {section.title}
                <div className="w-24 h-1 bg-gradient-to-r from-coral to-turquoise mx-auto mt-4 rounded-full"></div>
              </h2>
              {section.description && (
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {section.description}
                </p>
              )}
            </div>

            {section.type === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sectionItems.length > 0 ? (
                  sectionItems.map((item, itemIndex) => (
                    <div key={item.id} className="animate-fade-in-up" style={{animationDelay: `${itemIndex * 0.1}s`}}>
                      <ContentCard item={item} />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                      <EmptyContentCard />
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                      <EmptyContentCard />
                    </div>
                    <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                      <EmptyContentCard />
                    </div>
                  </>
                )}
              </div>
            )}

            {section.type === 'list' && (
              <div className="space-y-6">
                {sectionItems.length > 0 ? (
                  sectionItems.map((item, itemIndex) => (
                    <div key={item.id} className="animate-slide-in-left" style={{animationDelay: `${itemIndex * 0.1}s`}}>
                      <Card className="bg-white rounded-2xl shadow-lg card-hover">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            {item.type === 'text' && <FileImage className="text-coral mt-1" size={24} />}
                            {item.type === 'image' && <FileImage className="text-turquoise mt-1" size={24} />}
                            {item.type === 'video' && <FileImage className="text-sky mt-1" size={24} />}
                            <div className="flex-1">
                              <h3 className="text-xl font-poppins font-semibold text-slate mb-2">{item.title}</h3>
                              {item.excerpt && (
                                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                              )}
                              {item.type === "image" && item.mediaUrl && (
                                <div className="mb-4">
                                  <img
                                    src={item.mediaUrl}
                                    alt={item.title}
                                    className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                  />
                                </div>
                              )}
                              {item.type === "video" && item.mediaUrl && (
                                <div className="mb-4">
                                  {item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be') ? (
                                    <div className="aspect-w-16 aspect-h-9">
                                      <iframe
                                        src={item.mediaUrl.replace('watch?v=', 'embed/')}
                                        className="w-full h-48 rounded-lg"
                                        allowFullScreen
                                      />
                                    </div>
                                  ) : (
                                    <video
                                      src={item.mediaUrl}
                                      controls
                                      className="w-full h-48 object-cover rounded-lg shadow-md"
                                    />
                                  )}
                                </div>
                              )}
                              {item.content && (
                                <p className="text-gray-700">{item.content}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 animate-fade-in-up">
                    <FileImage className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa khả dụng</h3>
                    <p className="text-gray-400">Nội dung sẽ được thêm vào sau</p>
                  </div>
                )}
              </div>
            )}

            {section.type === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {sectionItems.length > 0 ? (
                  sectionItems.map((item, itemIndex) => (
                    <div key={item.id} className="animate-scale-in" style={{animationDelay: `${itemIndex * 0.2}s`}}>
                      <Card className="bg-white rounded-2xl shadow-lg card-hover">
                        <CardContent className="p-8">
                          <div className="text-center">
                            {item.type === 'text' && <FileImage className="mx-auto text-coral mb-4 animate-pulse-custom" size={32} />}
                            {item.type === 'image' && <FileImage className="mx-auto text-turquoise mb-4 animate-pulse-custom" size={32} />}
                            {item.type === 'video' && <FileImage className="mx-auto text-sky mb-4 animate-pulse-custom" size={32} />}
                            <h3 className="text-xl font-poppins font-semibold text-slate mb-4">{item.title}</h3>
                            {item.excerpt && (
                              <p className="text-gray-600 mb-4">{item.excerpt}</p>
                            )}
                            {item.type === "image" && item.mediaUrl && (
                              <div className="mb-4">
                                <img
                                  src={item.mediaUrl}
                                  alt={item.title}
                                  className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                />
                              </div>
                            )}
                            {item.type === "video" && item.mediaUrl && (
                              <div className="mb-4">
                                {item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be') ? (
                                  <div className="aspect-w-16 aspect-h-9">
                                    <iframe
                                      src={item.mediaUrl.replace('watch?v=', 'embed/')}
                                      className="w-full h-48 rounded-lg"
                                      allowFullScreen
                                    />
                                  </div>
                                ) : (
                                  <video
                                    src={item.mediaUrl}
                                    controls
                                    className="w-full h-48 object-cover rounded-lg shadow-md"
                                  />
                                )}
                              </div>
                            )}
                            {item.content && (
                              <p className="text-gray-700">{item.content}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="animate-scale-in" style={{animationDelay: '0.1s'}}>
                      <Card className="bg-white rounded-2xl shadow-lg card-hover">
                        <CardContent className="p-8 text-center">
                          <FileImage className="mx-auto text-gray-400 mb-4" size={48} />
                          <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa khả dụng</h3>
                          <p className="text-gray-400">Nội dung sẽ được thêm vào sau</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="animate-scale-in" style={{animationDelay: '0.3s'}}>
                      <Card className="bg-white rounded-2xl shadow-lg card-hover">
                        <CardContent className="p-8 text-center">
                          <FileImage className="mx-auto text-gray-400 mb-4" size={48} />
                          <h3 className="text-lg font-medium text-gray-500 mb-2">Chưa khả dụng</h3>
                          <p className="text-gray-400">Nội dung sẽ được thêm vào sau</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        );
      })}

      {/* Skills & Contact Section */}
      <section id="other" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-coral/20 rounded-full blur-3xl animate-pulse-custom"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-turquoise/20 rounded-full blur-3xl animate-bounce-custom"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-poppins font-bold text-slate mb-6 relative">
              Kỹ năng & Liên hệ
              <div className="w-24 h-1 bg-gradient-to-r from-coral to-turquoise mx-auto mt-4 rounded-full"></div>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những kỹ năng của tôi và cách thức liên hệ
            </p>
          </div>

          {/* Skills Section */}
          <div className="mb-20 animate-slide-in-left">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-poppins font-bold text-slate mb-4 flex items-center justify-center">
                <Code className="text-coral mr-3 animate-pulse-custom" size={32} />
                Kỹ năng chuyên môn
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-coral to-turquoise mx-auto rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {other?.skills && other.skills.length > 0 ? (
                other.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`group relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center btn-hover-scale animate-fade-in-up transition-all duration-500 hover:bg-white hover:scale-105 shadow-lg`}
                    style={{animationDelay: `${index * 0.15}s`}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-turquoise/10 to-sky/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-coral rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        {skill.icon === 'PaintbrushVertical' && <PaintbrushVertical className="text-white" size={28} />}
                        {skill.icon === 'Code' && <Code className="text-white" size={28} />}
                        {skill.icon === 'Smartphone' && <Smartphone className="text-white" size={28} />}
                        {skill.icon === 'FileImage' && <FileImage className="text-white" size={28} />}
                      </div>
                      <h4 className="text-lg font-semibold text-slate mb-2 group-hover:text-coral transition-colors duration-300">
                        {skill.name}
                      </h4>
                      {skill.description && (
                        <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                          {skill.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center btn-hover-scale animate-fade-in-up transition-all duration-500 hover:bg-white/20" style={{animationDelay: '0.1s'}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-coral/20 to-turquoise/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-coral rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <PaintbrushVertical className="text-white" size={28} />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">UI/UX Design</h4>
                      <p className="text-sm text-gray-300">Thiết kế giao diện</p>
                    </div>
                  </div>
                  <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center btn-hover-scale animate-fade-in-up transition-all duration-500 hover:bg-white/20" style={{animationDelay: '0.2s'}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-turquoise/20 to-sky/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-turquoise rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <Code className="text-white" size={28} />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Frontend</h4>
                      <p className="text-sm text-gray-300">Phát triển web</p>
                    </div>
                  </div>
                  <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center btn-hover-scale animate-fade-in-up transition-all duration-500 hover:bg-white/20" style={{animationDelay: '0.3s'}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky/20 to-sunny/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-sky rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <Smartphone className="text-white" size={28} />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Mobile Design</h4>
                      <p className="text-sm text-gray-300">Ứng dụng di động</p>
                    </div>
                  </div>
                  <div className="group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center btn-hover-scale animate-fade-in-up transition-all duration-500 hover:bg-white/20" style={{animationDelay: '0.4s'}}>
                    <div className="absolute inset-0 bg-gradient-to-br from-sunny/20 to-coral/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 bg-sunny rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <FileImage className="text-white" size={28} />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">Content</h4>
                      <p className="text-sm text-gray-300">Sáng tạo nội dung</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div className="animate-slide-in-right">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-poppins font-bold text-slate mb-4 flex items-center justify-center">
                <Mail className="text-turquoise mr-3 animate-pulse-custom" size={32} />
                Thông tin liên hệ
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-turquoise to-sky mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center btn-hover-lift animate-fade-in-up transition-all duration-500 hover:bg-white shadow-lg" style={{animationDelay: '0.1s'}}>
                <div className="w-16 h-16 mx-auto mb-4 bg-coral rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Mail className="text-white" size={28} />
                </div>
                <h4 className="text-lg font-semibold text-slate mb-2">Email</h4>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {other?.contactInfo?.email || "hello@portfolio.com"}
                </p>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center btn-hover-lift animate-fade-in-up transition-all duration-500 hover:bg-white shadow-lg" style={{animationDelay: '0.2s'}}>
                <div className="w-16 h-16 mx-auto mb-4 bg-turquoise rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Phone className="text-white" size={28} />
                </div>
                <h4 className="text-lg font-semibold text-slate mb-2">Điện thoại</h4>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {other?.contactInfo?.phone || "+84 123 456 789"}
                </p>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 text-center btn-hover-lift animate-fade-in-up transition-all duration-500 hover:bg-white shadow-lg" style={{animationDelay: '0.3s'}}>
                <div className="w-16 h-16 mx-auto mb-4 bg-sky rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <MapPin className="text-white" size={28} />
                </div>
                <h4 className="text-lg font-semibold text-slate mb-2">Địa chỉ</h4>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {other?.contactInfo?.location || "Hà Nội, Việt Nam"}
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="text-center">
              <h4 className="text-xl font-semibold text-slate mb-6">Kết nối với tôi</h4>
              <div className="flex justify-center space-x-6">
                {other?.socialLinks?.facebook && (
                  <a 
                    href={other.socialLinks.facebook}
                    className="group w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center btn-hover-scale animate-bounce-custom shadow-2xl hover:bg-blue-700 transition-all duration-500"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{animationDelay: '0.5s'}}
                  >
                    <FaFacebook size={24} className="group-hover:scale-125 transition-transform duration-300" />
                  </a>
                )}
                {other?.socialLinks?.github && (
                  <a 
                    href={other.socialLinks.github}
                    className="group w-16 h-16 bg-gray-800 text-white rounded-2xl flex items-center justify-center btn-hover-scale animate-bounce-custom shadow-2xl hover:bg-gray-900 transition-all duration-500"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{animationDelay: '0.6s'}}
                  >
                    <FaGithub size={24} className="group-hover:scale-125 transition-transform duration-300" />
                  </a>
                )}
                {other?.socialLinks?.zalo && (
                  <a 
                    href={other.socialLinks.zalo}
                    className="group w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center btn-hover-scale animate-bounce-custom shadow-2xl hover:bg-blue-600 transition-all duration-500"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{animationDelay: '0.7s'}}
                  >
                    <MessageCircle size={24} className="group-hover:scale-125 transition-transform duration-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
