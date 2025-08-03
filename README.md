# Portfolio CMS - Hệ thống quản lý nội dung cá nhân

Ứng dụng portfolio hiện đại với hệ thống quản lý nội dung tích hợp, hỗ trợ upload file và làm việc offline.

## Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- PostgreSQL database (tùy chọn)

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Thiết lập environment variables
Tạo file `.env` và thêm các biến môi trường cần thiết:

```bash
# Database (nếu sử dụng PostgreSQL)
DATABASE_URL=your_database_url

# Object Storage (nếu sử dụng)
DEFAULT_OBJECT_STORAGE_BUCKET_ID=your_bucket_id
PRIVATE_OBJECT_DIR=your_private_dir
PUBLIC_OBJECT_SEARCH_PATHS=your_public_paths

# Session Secret
SESSION_SECRET=your_session_secret
```

### 3. Chạy ứng dụng

#### Development mode:
```bash
npm run dev
```

#### Production mode:
```bash
# Build trước
npm run build

# Chạy production
npm start
```

### 4. Truy cập ứng dụng
- Website: http://localhost:5000
- Admin panel: http://localhost:5000 (bấm nút "Admin" và nhập mật khẩu: admin2025)

## Tính năng chính

### ✓ Quản lý nội dung động
- Tạo và chỉnh sửa sections tùy chỉnh
- Thêm nội dung text, hình ảnh, video
- Giao diện admin thân thiện

### ✓ Upload file hiện đại
- Drag & drop upload
- Hỗ trợ nhiều định dạng file
- Progress tracking

### ✓ Khả năng offline
- Lưu trữ tạm thời khi mất mạng
- Tự động đồng bộ khi có kết nối
- Thông báo trạng thái rõ ràng

### ✓ Responsive design
- Hoạt động trên mọi thiết bị
- Giao diện hiện đại với Tailwind CSS
- Animation mượt mà

## Khắc phục sự cố

### Lỗi không khởi động được:

1. **Kiểm tra Node.js version:**
   ```bash
   node --version
   # Cần >= 18.0.0
   ```

2. **Xóa node_modules và cài đặt lại:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Kiểm tra port có bị chiếm:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Linux/Mac
   lsof -i :5000
   ```

4. **Chạy với port khác:**
   ```bash
   PORT=3000 npm run dev
   ```

### Lỗi database:
- Ứng dụng mặc định dùng in-memory storage, không cần database
- Nếu muốn dùng PostgreSQL, thiết lập DATABASE_URL trong .env

### Lỗi object storage:
- Tính năng upload file chỉ hoạt động đầy đủ trên Replit
- Chạy local sẽ fallback về offline mode

## Cấu trúc dự án

```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # App pages
│   │   ├── hooks/       # Custom hooks
│   │   └── lib/         # Utilities
├── server/           # Express backend
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage
│   └── index.ts         # Server entry
├── shared/           # Shared types
└── package.json
```

## Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console logs có lỗi gì
2. Đảm bảo tất cả dependencies đã được cài đặt
3. Thử chạy `npm run check` để kiểm tra TypeScript errors
4. Khởi động lại terminal và thử lại

## License

MIT License