-- LIỆT KÊ CÁC TRIGGER TRÊN BẢNG AUTH.USERS
-- Chạy script này để xem danh sách trigger

SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    event_manipulation as event,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';
