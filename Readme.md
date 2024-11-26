# File cấu hình tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",                                Biên dịch mã
    "experimentalDecorators": true,                 Sử dụng decorators
    "module": "commonjs",                           Xử lý việc import/export giữa các tệp
    "baseUrl": "./",                                Thiết lập thư mục gốc, đường dẫn trong dự án
    "sourceMap": true,                              Ánh xạ mã biên dịch Javscipt với mã gốc Typescript
    "outDir": "./dist",                             Tất cả các tệp biên dịch từ TypeScript được lưu vào thư mục ./dist
    "rootDir": "./src",                             Chỉ định thư mục gốc chứa mã TypeScript.
    "strict": true,                                 Bật chế độ kiểm tra nghiêm ngặt trong TypeScript
    "esModuleInterop": true,                        Cho phép sử dụng cú pháp import thay vì require
    "forceConsistentCasingInFileNames": true,       Đảm bảo tên file và đường dẫn file nhất quán chữ hoa/chữ thường
    "skipLibCheck": true                            Bỏ qua kiểm tra kiểu các tệp thư viện (lib)(tệp định nghĩa .d.ts)
  }
}

## thư viện Tạo API gửi File

multer
### update
course thêm đánh giá sao và chia phần tỉ lệ