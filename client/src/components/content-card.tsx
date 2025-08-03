import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, Video, Eye, Edit2, Trash2 } from "lucide-react";
import type { ContentItem } from "@shared/schema";
import { useState } from "react";
import { ContentDetailModal } from "./content-detail-modal";

interface ContentCardProps {
  item: ContentItem;
  isAdmin?: boolean;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (id: string) => void;
}

export function ContentCard({ item, isAdmin = false, onEdit, onDelete }: ContentCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const getIcon = () => {
    switch (item.type) {
      case "text":
        return <FileText className="text-coral" size={20} />;
      case "image":
        return <Image className="text-turquoise" size={20} />;
      case "video":
        return <Video className="text-sky" size={20} />;
      default:
        return <FileText className="text-coral" size={20} />;
    }
  };

  const getBadgeColor = () => {
    switch (item.type) {
      case "text":
        return "bg-coral text-white";
      case "image":
        return "bg-turquoise text-white";
      case "video":
        return "bg-sky text-white";
      default:
        return "bg-coral text-white";
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  if (isAdmin) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h4 className="font-medium text-slate">{item.title}</h4>
            <Badge className={getBadgeColor()}>
              {item.type === "text" ? "Text" : item.type === "image" ? "Hình ảnh" : "Video"}
            </Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit?.(item)}
              className="text-turquoise hover:text-sky hover:bg-turquoise/10"
            >
              <Edit2 size={16} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete?.(item.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-3">
          {item.content || item.excerpt || "Không có mô tả"}
        </p>
        <div className="text-xs text-gray-500">
          Cập nhật: {formatDate(item.updatedAt)}
        </div>
      </div>
    );
  }

  return (
    <>
      <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-hover">
        {item.type === "image" && item.mediaUrl && (
          <img 
            src={item.mediaUrl} 
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        )}
        {item.type === "video" && item.mediaUrl && (
          <div className="relative">
            {item.mediaUrl.includes('youtube.com') || item.mediaUrl.includes('youtu.be') ? (
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={item.mediaUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-48"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                src={item.mediaUrl}
                poster={item.mediaUrl}
                controls
                className="w-full h-48 object-cover"
              />
            )}
          </div>
        )}
        
        <CardContent className="p-6">
          {item.type === "text" && (
            <div className="w-12 h-12 bg-gradient-to-br from-coral to-turquoise rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-white" size={20} />
            </div>
          )}
          
          <h3 className="text-xl font-poppins font-semibold text-slate mb-3">
            {item.title}
          </h3>
          
          <p className="text-gray-600 mb-4">
            {item.excerpt || item.content?.substring(0, 100) + "..." || ""}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {formatDate(item.createdAt)}
            </span>
            
            <Button 
              size="sm"
              onClick={() => setShowDetailModal(true)}
              className="bg-coral text-white hover:bg-turquoise transition-all duration-300 btn-hover-scale border-0"
            >
              <Eye className="mr-1" size={16} />
              {item.type === "text" ? "Đọc thêm" : "Xem"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ContentDetailModal 
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        item={item}
      />
    </>
  );
}

export function EmptyContentCard() {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl p-12 text-center min-h-[300px] flex flex-col items-center justify-center card-hover shadow-lg">
      <div className="w-20 h-20 bg-gradient-to-br from-coral/20 to-turquoise/20 rounded-full flex items-center justify-center mb-6 animate-pulse-custom">
        <FileText className="text-gray-400" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-3">Chưa có nội dung</h3>
      <p className="text-gray-500">Nội dung sẽ được thêm vào sau</p>
    </div>
  );
}
