# Admin Interface Specification

## 1. Overview
Management portal for Teachers/Admins to control content (Vocab, Topics, Games) and view user progress.

## 2. Dashboard (`/admin/dashboard`)
- **Stats**: Total active students, Time spent learning today, Popular games.
- **Quick Actions**: Add New Student, Create Class.

## 3. Content Management

### 3.1 Topics & Categories (`/admin/categories`)
- **List View**: Table of topics (Name, Icon, Color, Image).
- **Edit/Create Modal**:
    - Name (Text)
    - Icon (Material Symbol Picker)
    - Color (Color Picker)
    - **Theme Image URL**: Path to local asset or remote URL (Critical for Student Game UI).

### 3.2 Vocabulary Manager (`/admin/vocabulary`)
- **List View**: Searchable list of words.
- **Record**:
    - English word
    - Vietnamese meaning
    - Audio URL (Upload/TTS)
    - Image URL
    - Tagged Topic (Relation).

### 3.3 Game Manager (`/admin/games`)
- **Function**: Configure which games appear for which topic.
- **Config**:
    - Select Topic.
    - Enable/Disable specific Game Types (A-F).
    - Specific configurations (e.g., "Hide & Seek" -> upload Scene Image and define hotspots).

## 4. User Management

### 4.1 Students (`/admin/students`)
- CRUD for Student accounts.
- View individual progress (Games played, average score).

### 4.2 Classes (`/admin/classes`)
- Group students into classes for easier reporting.
