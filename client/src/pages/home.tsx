import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Download, Mail, Star, Code, PaintbrushVertical, Smartphone, FileImage, MapPin, Phone } from "lucide-react";
import { ContentCard, EmptyContentCard } from "@/components/content-card";
import type { IntroSection, ContentItem, OtherSection } from "@shared/schema";

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

  return (
    <div className="pt-16">
      {/* Introduction Section */}
      <section id="intro" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="gradient-bg absolute inset-0 opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-5xl md:text-6xl font-poppins font-bold text-slate mb-6 leading-tight">
                <span>{intro?.title || "Xin chào, tôi là"}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-turquoise block">
                  {intro?.name || "Creative Designer"}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {intro?.description || "Tôi tạo ra những trải nghiệm số đẹp và có ý nghĩa thông qua thiết kế sáng tạo và công nghệ hiện đại."}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-coral text-white hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Download className="mr-2" size={16} />
                  Tải CV
                </Button>
                <Button variant="outline" className="border-2 border-turquoise text-turquoise hover:bg-turquoise hover:text-white transition-all duration-300">
                  <Mail className="mr-2" size={16} />
                  Liên hệ
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-coral via-turquoise to-sky p-1 animate-float">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    {intro?.profileImage ? (
                      <img 
                        src={intro.profileImage} 
                        alt="Profile" 
                        className="w-72 h-72 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-72 h-72 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        <User size={80} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-sunny rounded-full flex items-center justify-center animate-float" style={{animationDelay: '-2s'}}>
                  <Star className="text-white" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section id="content" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-slate mb-4">
              Nội dung của tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá những dự án, bài viết và video mà tôi đã tạo ra
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contentItems.length > 0 ? (
              contentItems.map((item) => (
                <ContentCard key={item.id} item={item} />
              ))
            ) : (
              <>
                <EmptyContentCard />
                <EmptyContentCard />
                <EmptyContentCard />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Other Section */}
      <section id="other" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-slate mb-4">
              Khác
            </h2>
            <p className="text-xl text-gray-600">
              Thông tin bổ sung và liên hệ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Skills Section */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-poppins font-semibold text-slate mb-6 flex items-center">
                  <Code className="text-coral mr-3" size={24} />
                  Kỹ năng
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {other?.skills && other.skills.length > 0 ? (
                    other.skills.map((skill, index) => (
                      <div key={index} className={`text-white p-4 rounded-lg text-center ${
                        index === 0 ? 'bg-gradient-to-r from-coral to-turquoise' :
                        index === 1 ? 'bg-gradient-to-r from-turquoise to-sky' :
                        index === 2 ? 'bg-gradient-to-r from-sky to-sunny' :
                        'bg-gradient-to-r from-sunny to-coral'
                      }`}>
                        {skill.icon === 'PaintbrushVertical' && <PaintbrushVertical className="mx-auto mb-2" size={24} />}
                        {skill.icon === 'Code' && <Code className="mx-auto mb-2" size={24} />}
                        {skill.icon === 'Smartphone' && <Smartphone className="mx-auto mb-2" size={24} />}
                        {skill.icon === 'FileImage' && <FileImage className="mx-auto mb-2" size={24} />}
                        <div className="font-medium">{skill.name}</div>
                        {skill.description && (
                          <div className="text-sm opacity-90 mt-1">{skill.description}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="bg-gradient-to-r from-coral to-turquoise text-white p-4 rounded-lg text-center">
                        <PaintbrushVertical className="mx-auto mb-2" size={24} />
                        <div className="font-medium">UI/UX Design</div>
                      </div>
                      <div className="bg-gradient-to-r from-turquoise to-sky text-white p-4 rounded-lg text-center">
                        <Code className="mx-auto mb-2" size={24} />
                        <div className="font-medium">Frontend</div>
                      </div>
                      <div className="bg-gradient-to-r from-sky to-sunny text-white p-4 rounded-lg text-center">
                        <Smartphone className="mx-auto mb-2" size={24} />
                        <div className="font-medium">Mobile Design</div>
                      </div>
                      <div className="bg-gradient-to-r from-sunny to-coral text-white p-4 rounded-lg text-center">
                        <FileImage className="mx-auto mb-2" size={24} />
                        <div className="font-medium">Content</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-white rounded-2xl shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-poppins font-semibold text-slate mb-6 flex items-center">
                  <Mail className="text-turquoise mr-3" size={24} />
                  Liên hệ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Mail className="text-coral" size={20} />
                    <span>{other?.contactInfo?.email || "hello@portfolio.com"}</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <Phone className="text-turquoise" size={20} />
                    <span>{other?.contactInfo?.phone || "+84 123 456 789"}</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="text-sky" size={20} />
                    <span>{other?.contactInfo?.location || "Hà Nội, Việt Nam"}</span>
                  </div>
                </div>
                <div className="flex space-x-4 mt-6">
                  {other?.socialLinks?.linkedin && (
                    <a 
                      href={other.socialLinks.linkedin}
                      className="w-12 h-12 bg-coral text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-linkedin"></i>
                    </a>
                  )}
                  {other?.socialLinks?.github && (
                    <a 
                      href={other.socialLinks.github}
                      className="w-12 h-12 bg-turquoise text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-github"></i>
                    </a>
                  )}
                  {other?.socialLinks?.dribbble && (
                    <a 
                      href={other.socialLinks.dribbble}
                      className="w-12 h-12 bg-sky text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all duration-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fab fa-dribbble"></i>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
