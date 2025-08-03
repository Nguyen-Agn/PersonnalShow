import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentItem } from "@shared/schema";

interface ContentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ContentItem | null;
}

function formatDate(dateString: string | Date) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function ContentDetailModal({ isOpen, onClose, item }: ContentDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {item.type === 'text' && <FileText className="text-coral" size={24} />}
            {item.type === 'image' && <ImageIcon className="text-turquoise" size={24} />}
            {item.type === 'video' && <Video className="text-sky" size={24} />}
            <DialogTitle className="text-2xl font-poppins font-semibold text-slate">
              {item.title}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {item.type === 'text' ? 'Văn bản' : item.type === 'image' ? 'Hình ảnh' : 'Video'}
            </Badge>
          </div>

          {/* Excerpt */}
          {item.excerpt && (
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-coral">
              <p className="text-gray-700 italic text-lg">{item.excerpt}</p>
            </div>
          )}

          {/* Media */}
          {item.mediaUrl && (
            <div className="rounded-lg overflow-hidden">
              {item.type === 'image' && (
                <img 
                  src={item.mediaUrl} 
                  alt={item.title}
                  className="w-full h-auto max-h-96 object-cover"
                />
              )}
              {item.type === 'video' && (
                <video 
                  src={item.mediaUrl} 
                  controls
                  className="w-full h-auto max-h-96"
                >
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              )}
            </div>
          )}

          {/* Content */}
          {item.content && (
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {item.content}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose} className="bg-coral text-white hover:bg-opacity-90">
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}