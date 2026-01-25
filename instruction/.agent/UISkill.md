---
name: UI Redesign & Replication Skill
description: A systematic workflow for cloning, redesigning, and implementing UI from reference (HTML/Images) into a React/Tailwind project.
---

# UI Redesign & Replication Protocol

This skill outlines the process for taking a reference design (HTML/CSS/Screenshot) and implementing it accurately into the codebase.

## 1. Analysis Phase (The "Read" Step)
Before writing any code, analyze the **GAP** between Reference and Current Project.

### 1.1 Analyze Reference
- **Structure**: Look at the HTML hierarchy (Grid vs Flex, Sidebar vs Main Content).
- **Styling Engine**: Does the reference use Tailwind? Bootstrap? Custom CSS?
    - *Example*: If reference uses `bg-emerald-50`, it's likely Tailwind.
- **Assets**: Are images remote (URL) or local?
    - *Action*: Always plan to download remote assets to `public/assets/...` for stability.

### 1.2 Analyze Target Project
- **Configuration**: Does `tailwind.config.js` exist? Is `@tailwind` injected in `index.css`?
    - *Fix*: If missing, create minimal config and inject directives immediately.
- **Data Model**: Does the DB support the UI's needs?
    - *Example*: UI shows a "Theme Image" but DB only has "Icon".
    - *Action*: Plan a SQL migration `ALTER TABLE` to add the missing column.

## 2. Preparation Phase (Scripting & Migrations)

### 2.1 Asset Migration Script
Don't download files manually one by one. Write a Node.js script.
```javascript
// download_assets.cjs
const fs = require('fs');
const https = require('https');
// ... loop through URLs and save to public/assets/target_folder
```

### 2.2 Database Migration
If the UI implies new data fields:
1.  Create a `.sql` file for the migration.
2.  Run it (or instruct User to run it).
3.  **Update Repository**: Update the Data Access Layer (Repository pattern) to map the new column to the frontend model.
4.  **Update Admin UI**: IMMEDIATELY update the Admin Dashboard to allow inputting this new data. *A UI with no way to manage data is useless.*

## 3. Implementation Phase (The "Write" Step)

### 3.1 Styling Foundation
- If using **Tailwind**:
    - Ensure `tailwind.config.js` extends `theme.colors` to match the reference's unique palette.
    - Use `index.css` for global defaults or custom utility classes (e.g., `.scrollbar-hide`).

### 3.2 Component Translation (HTML -> JSX)
- **Copy & Paste Strategy**:
    - Copy the raw reference HTML.
    - Convert `class` -> `className`.
    - Close self-closing tags (`<img />`, `<input />`).
    - Remove inline `style` unless dynamic.
    - Replace static text with `{topic.name}` variables.
- **State Management**:
    - Identify dynamic lists (e.g., `categories.map()`).
    - Identify interactive states (Hover, Active).

### 3.3 Dynamic logic
- **Color Mapping**: If the reference uses color variants (e.g., `bg-pink-50`, `bg-blue-50`), create a helper function:
    ```javascript
    const getThemeColors = (colorName) => {
        // Returns object with specific Tailwind classes
        return { bg: `bg-${color}-50`, text: `text-${color}-500`, ... }
    }
    ```

## 4. Verification & Polish
- **Visual Check**: Compare Side-by-Side.
- **Responsiveness**: Always check Mobile (<768px) layout.
- **Integration**: Ensure links (`<Link to="...">`) route correctly.
- **Error Handling**: Add `onError` to `<img>` tags to fallback if local assets are missing.

## Checklist for AI Agent
- [ ] Have I downloaded the assets?
- [ ] Have I updated the DB schema and Admin UI?
- [ ] Is Tailwind configured correctly?
- [ ] Is the component Responsive?
