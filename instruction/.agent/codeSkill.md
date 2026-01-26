# Admin & Data Management Protocol

## 1. Nguyên Tắc Cốt Lõi (Core Principles)
> **BẮT BUỘC**: Tuân thủ tuyệt đối [AI-CODING-RULES](../AI-CODING-RULES.txt).

Khi thực hiện các tác vụ liên quan đến **Admin Module** hoặc **Thay đổi Dữ liệu**, AI Agent phải tuân theo quy trình sau:

## 2. Quy Trình Xử Lý Dữ Liệu (Data Handling Workflow)

### Bước 1: Kiểm Tra Dữ Liệu & Cấu Trúc (Verification First)
**Trước khi** viết bất kỳ code nào thay đổi logic dữ liệu hoặc schema:
1.  **QUÉT (SCAN)** thư mục `Data/`:
    *   Xem các file `.sql` hiện có để hiểu cấu trúc bảng (`units`, `lessons`, `categories`, v.v.).
    *   **LƯU Ý ĐẶC BIỆT**: Project này dùng **Mixed ID Types**.
        - `auth`, `categories`, `vocabulary` dùng **UUID**.
        - `units`, `lessons`, `checkpoints` dùng **VARCHAR** (slug).
        - **BẮT BUỘC CHECK DATA TYPE** từng cột trước khi Insert.
    *   Kiểm tra các mối quan hệ (Foreign Keys) để tránh lỗi integrity.
2.  **KIỂM TRA** dữ liệu thực tế (nếu cần):
    *   Dùng `supabase` client hoặc script để query mẫu nếu logic phụ thuộc vào dữ liệu cụ thể (ví dụ: hardcoded IDs).

### Bước 2: Tạo Script Dữ Liệu (Data Scripting)
Mọi thay đổi về dữ liệu (Seed, Migration, Cleanup) **KHÔNG ĐƯỢC** hardcode chạy ngầm hoặc chạy tay một lần rồi quên.
1.  **TẠO FILE** mới trong thư mục `Data/`.
2.  **ĐỊNH DẠNG**: `.sql` (ưu tiên) hoặc `.txt` (nếu chỉ là hướng dẫn).
3.  **NAMING CONVENTION**: `[action]_[subject]_[context].sql`
    *   Ví dụ: `seed_vocabulary_daily_routine.sql`
    *   Ví dụ: `migrate_video_categories_to_main.sql`
    *   Ví dụ: `update_lesson_sort_order.sql`
4.  **SYNC SCHEMA**: Bất kỳ thay đổi nào về cấu trúc bảng (CREATE, ALTER, DROP) đều phải được cập nhật vào file `Data/db_schema.sql` để file này luôn là **Latest Snapshot** của database.

## 3. Quy Trình Admin Feature (Admin Dev Workflow)

### Context Admin
Khi làm việc với Admin Panel (ví dụ: `Watch & Learn Manager`):
1.  **UI/UX**: Sử dụng `EnhancedModal`, `AnimatedIcon` chuẩn (xem `AI-CODING-RULES.txt`).
2.  **State Management**:
    *   Ưu tiên **Optimistic Updates** (cập nhật state local ngay lập tức) để UI mượt mà.
    *   Tránh reload toàn bộ trang (`window.location.reload()`) hoặc fetch lại toàn bộ dữ liệu (`loadData()`) cho các thao tác CRUD nhỏ.
3.  **Dependency Checks**:
    *   **CHECK FIRST**: Trước khi import thư viện mới (ví dụ: `moment`), hãy kiểm tra `package.json` xem nó có tồn tại không.
    *   **AVOID BLOAT**: Với các hàm xử lý đơn giản (format time, string), ưu tiên viết helper function thuần (Vanilla JS) thay vì cài thêm thư viện nặng.

### Checklist Khi Thay Đổi Logic Admin
- [ ] Đã kiểm tra cấu trúc bảng trong `Data/` chưa?
- [ ] Nếu cần field mới, đã tạo script `alter_table_...sql` trong `Data/` chưa?
- [ ] Code có tuân thủ 3-Layer Architecture (UI -> Hook -> Service/Supabase) không?
- [ ] Đã test cập nhật UI không cần F5 chưa?
- [ ] Đã kiểm tra dependency trong `package.json` trước khi import chưa?

## 4. UI/Code Reliability Lessons (Bài Học Thực Chiến)

> **MỚI CẬP NHẬT**: Các bài học rút ra từ các lỗi UI cứng đầu.

1.  **Force Overwrite (Dứt Khoát)**:
    *   Khi sửa đổi một Component phức tạp hoặc thay đổi cấu trúc JSX lớn (ví dụ: thay đổi toàn bộ Sidebar, Layout), **KHÔNG DÙNG** `replace_file_content` lắt nhắt từng dòng.
    *   **ACTION**: Dùng `write_to_file` với `Overwrite: true` để ghi đè toàn bộ nội dung file sau khi đã chắc chắn logic. Điều này tránh việc tool tìm sai dòng (partial match) dẫn đến code không được update dù báo thành công.

2.  **Verify Component Usage (Truy Xuất Nguồn Gốc)**:
    *   Khi User báo lỗi hiển thị (ví dụ: Text không đổi, Header thừa), **ĐỪNG TIN** ngay vào trí nhớ.
    *   **ACTION**: Kiểm tra kỹ component cha (`Parent Component`) xem nó đang gọi cái gì.
        *   *Ví dụ*: `AdminVideoManager` gọi `LessonEditor`, `LessonEditor` gọi `LessonMetadataSidebar`. Header thừa nằm ở `AdminVideoManager`, còn Sidebar title nằm ở `LessonMetadataSidebar`. Sửa nhầm chỗ sẽ không fix được lỗi.

3.  **Visual Confirmation (Nhìn Bằng Code)**:
    *   Trước khi báo "Done", hãy `view_file` lại file vừa sửa để nhìn tận mắt code mới đã vào chưa. Đừng chỉ tin vào output "Success" của tool edit.

4.  **Layout Parent Override (Negative Margins)**:
    *   **Vấn đề**: Layout cha (`AdminLayout`) thường có padding cố định (ví dụ `p-8`) khiến các Child Component cần full-screen (như Editor) bị hở viền trắng.
    *   **Sai lầm**: Dùng `fixed inset-0` đè lên tất cả -> Mất luôn Sidebar Navigation chính.
    *   **Giải pháp (The Trick)**: Dùng **Negative Margins** + **Calc Width** trong Child Component.
        *   *Code*: `className="-m-8 w-[calc(100%+4rem)] h-screen"` (Giả sử padding cha là `2rem` = `32px`).
        *   *Tác dụng*: Kéo content con tràn ngược ra ngoài padding của cha, lấp đầy khoảng trắng mà vẫn giữ layout flow (không che Sidebar).
    *   **Rule**: Luôn check `padding` của Parent Layout trước khi override.

5.  **Layout Orientation Check**:
    *   Khi revert các thay đổi layout (ví dụ: từ Fullscreen về Inline), CẨN THẬN với `flex-direction`.
    *   **Lỗi thường gặp**: Xóa `fixed` nhưng lỡ tay để lại `flex-col` cho container chính -> Sidebar và Content đè lên nhau hoặc xếp dọc thay vì ngang.
    *   **Check**: Nếu có Sidebar bên trái + Content bên phải -> Luôn là `flex-row`.

## 5. Data Persistence & Schema Lessons (Mới Thêm)

> **MỚI CẬP NHẬT**: Rút kinh nghiệm từ lỗi save dữ liệu Admin Vocab.

1.  **Schema is The Law (Tôn Trọng DB)**:
    *   **LỖI**: Front-end dùng `vocabId` (camelCase) nhưng Database trả về field `vocab_id` (snake_case). AI không thêm mapping -> Dữ liệu vào UI bị null -> Tưởng mất data.
    *   **Action**: Khi viết `loadData()`, phải **Mapping rõ ràng** từng field. Không được tin vào `...cp` spread operator nếu convention khác nhau.
2.  **Persistence Blind Spot (Điểm Mù Khi Lưu)**:
    *   **LỖI**: Chỉ check `error === null` khi Update -> Báo "Save Success". Nhưng nếu cột trong DB là `text[]` mà gửi lên object phức tạp không casting được, DB có thể silent ignore hoặc không commit như ý.
    *   **Action**: Luôn dùng `.select()` ngay sau lệnh `.update()` để lấy về dữ liệu **THỰC TẾ** Database đang lưu. Log ra console để verify ngay.
    *   *Ví dụ*: `const { data } = await supabase.from('table').update(payload).select();`
3.  **Read Schema File**:
    *   File `Data/db_schema.sql` là nguồn sự thật. Đừng đoán type. `text[]` khác `jsonb`.

## 6. Media Handling & RLS (Supabase Lessons)

> **MỚI CẬP NHẬT**: Rút kinh nghiệm từ Module Media Library & Video Playback (26/01/2026).

1.  **Hybrid Video Player Strategy (Chiến Thuật Player Lai)**:
    *   **Vấn đề**: `ReactPlayer` rất tốt với YouTube nhưng thường lỗi (black screen/error) với direct URL từ Supabase (MP4) hoặc Blob, đặc biệt khi user cấu hình config cho YouTube.
    *   **Sai lầm**: Cố gắng ép `ReactPlayer` play tất cả mọi thứ -> Lỗi không đồng nhất giữa Preview và Editor.
    *   **Giải pháp (The Fix)**: Dùng **Condition Check** để render component khác nhau:
        ```javascript
        const isDirectFile = url.startsWith('blob:') || url.includes('supabase.co') || url.endsWith('.mp4');
        if (isDirectFile) {
            // Dùng Native HTML5 Video cho file thuần -> Ổn định tuyệt đối
            return <video src={url} ref={nativeRef} controls />;
        }
        // Dùng ReactPlayer cho YouTube/Vimeo -> Hỗ trợ tốt embed
        return <ReactPlayer url={url} ref={reactPlayerRef} ... />;
        ```
    *   **Lưu ý**: Cần map lại API của Native Ref (`currentTime`, `duration`) để khớp với hook logic đang dùng cho `ReactPlayer`.

2.  **The "Silent Delete" Trap (Bẫy RLS Policies)**:
    *   **Triệu chứng**: Chức năng DELETE gọi API báo `200 OK` (hoặc không báo lỗi) nhưng refresh lại **file vẫn còn nguyên**.
    *   **Nguyên nhân**: Supabase RLS mặc định chặn DELETE. Nếu chỉ thêm policy SELECT và INSERT, lệnh DELETE sẽ bị "Silent Ignore" (thất bại âm thầm).
    *   **Action**: Luôn nhớ check **DELETE Policy** cho Storage Bucket.
        ```sql
        CREATE POLICY "Auth Delete Videos" ON storage.objects FOR DELETE USING ( bucket_id = 'videos' );
        ```

3.  **UseConfirmDialog Trap**:
    *   **Lỗi**: Hook `useConfirmDialog` trả về `{ showConfirm: confirm }` nhưng component gọi `{ confirm }` -> Lỗi `confirm is not a function`.
    *   **Action**: Luôn log hook ra xem nó return cái gì nếu gặp lỗi function undefined. Destructuring phải chính xác tên export.

---
**GHI CHÚ**: File này là live document. Cập nhật ngay khi có quy trình mới.
