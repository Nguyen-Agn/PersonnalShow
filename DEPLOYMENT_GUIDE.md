# Hướng dẫn Deploy lên Vercel

## Chuẩn bị Deploy

### 1. Push code lên GitHub
```bash
# Khởi tạo git repository (nếu chưa có)
git init
git add .
git commit -m "Initial commit for Vercel deployment"

# Tạo repository trên GitHub và push
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 2. Tạo tài khoản Vercel
- Truy cập [vercel.com](https://vercel.com)
- Đăng ký bằng GitHub account

## Deploy Process

### 1. Import Project
- Vào Vercel Dashboard
- Click "New Project"
- Chọn repository từ GitHub
- Click "Import"

### 2. Cấu hình Build Settings
Vercel sẽ tự động detect với vercel.json, nhưng để chắc chắn:

- **Framework Preset**: Other
- **Build Command**: `npm run build` (tự động từ vercel.json)
- **Output Directory**: `dist` (tự động từ vercel.json)
- **Install Command**: `npm install`

### 3. Environment Variables (Tùy chọn)
Trong Vercel Dashboard > Settings > Environment Variables, thêm:

```
NODE_ENV=production
ADMIN_PASSWORD=admin2025
```

### 4. Deploy
- Click "Deploy"
- Chờ vài phút để build hoàn thành

## Tính năng sau khi Deploy

### ✅ Hoạt động bình thường:
- Website hiển thị đầy đủ
- Admin panel (password: admin2025)
- Quản lý nội dung cơ bản
- Responsive mobile

### ⚠️ Có giới hạn:
- **File upload**: Chỉ hoạt động ở chế độ offline (lưu tạm thời)
- **Database**: Sử dụng in-memory storage (reset khi redeploy)
- **Sessions**: Không persistent giữa các lần deploy

## Nâng cấp tính năng (Optional)

### 1. Thêm Database persistent
```bash
# Cài đặt Vercel Postgres
vercel storage create postgres

# Hoặc dùng external database
# DATABASE_URL=postgresql://user:pass@host:port/db
```

### 2. Thêm File Storage
```bash
# Cài đặt Vercel Blob Storage
vercel storage create blob

# Hoặc integrate với Cloudinary, AWS S3
```

## Troubleshooting

### Build failed?
- Kiểm tra `build.js` có lỗi syntax không
- Đảm bảo tất cả dependencies trong package.json

### Runtime errors?
- Check Vercel Function Logs
- Verify environment variables
- Ensure all imports are correct

### 404 errors?
- Check vercel.json routes configuration
- Verify API endpoints start with `/api/`

## Custom Domain (Optional)
1. Vào Project Settings > Domains
2. Add your domain
3. Configure DNS records theo hướng dẫn

## Monitoring
- Vercel Analytics: theo dõi traffic
- Function Logs: debug API issues
- Real-time monitoring: performance metrics

Sau khi deploy thành công, bạn sẽ có link dạng: `https://your-project.vercel.app`