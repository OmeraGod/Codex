# Ứng dụng thời tiết

Ứng dụng web đơn giản giúp tra cứu thời tiết hiện tại theo tên thành phố, sử dụng API miễn phí của Open-Meteo.

## Tính năng

- Tìm kiếm theo tên thành phố.
- Tự động thử nhiều cách tìm kiếm (tên có dấu, không dấu, tiếng Anh) để hạn chế lỗi `not found`.
- Hiển thị nhiệt độ hiện tại, mô tả thời tiết, tốc độ gió và thời gian cập nhật.
- Giao diện gọn nhẹ, responsive.

## Chạy ứng dụng

Chạy đúng thư mục dự án rồi mở server local:

```bash
cd /workspace/Codex
python3 -m http.server 8000
```

Mở trình duyệt tại: `http://localhost:8000/index.html`

> Nếu bạn mở ở thư mục khác, trình duyệt có thể hiện `Not Found`.
