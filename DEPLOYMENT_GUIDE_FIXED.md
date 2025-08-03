# Hướng dẫn Deploy lên Vercel (Đã sửa lỗi)

## Vấn đề đã gặp và cách sửa

### 1. Lỗi build và functions cùng lúc
- **Nguyên nhân**: Vercel không thể xử lý builds và functions trong cùng một config
- **Giải pháp**: Tách riêng frontend build và serverless functions

### 2. Lỗi import path trong index.html
- **Nguyên nhân**: Vite tìm `/src/main.tsx` thay vì `./src/main.tsx`
- **Giải pháp**: Đổi từ `/src/main.tsx` thành `./src/main.tsx`

## Cấu hình mới

### vercel.json (đã sửa)
```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "functions": {
    "api/index.js": {
      "runtime": "nodejs20.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ]
}
```

### api/index.js (entry point cho functions)
```javascript
import handler from '../server/vercel-handler.js';
export default handler;
```

## Cách deploy

### 1. Push code mới lên GitHub
```bash
git add .
git commit -m "Fix Vercel deployment config"
git push
```

### 2. Deploy trên Vercel
- Vercel sẽ tự động detect config mới
- Build command: `cd client && npm install && npm run build`
- Output directory: `client/dist`
- Functions: `api/index.js`

### 3. Kiểm tra sau deploy
- ✅ Frontend: Trang chủ hiển thị đúng
- ✅ API: `/api/intro`, `/api/content`, `/api/other` hoạt động
- ✅ Admin: Đăng nhập và quản lý nội dung
- ✅ Upload files: Object storage hoạt động

## Tính năng hoạt động sau deploy

### ✅ Đã sửa:
- Build không conflict với functions
- Import paths đúng
- Serverless functions hoạt động
- Frontend build thành công

### ✅ Hoạt động bình thường:
- Portfolio website đầy đủ
- Admin panel (password: admin2025)
- Quản lý nội dung, sections
- Upload và hiển thị images/videos
- Responsive design
- Navigation mượt mà
- Tải CV động từ dữ liệu thực

Hệ thống giờ đã sẵn sàng deploy thành công trên Vercel!