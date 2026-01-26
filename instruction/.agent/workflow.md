# STANDARD AGENT WORKFLOW

> **CRITICAL**: You must follow this 5-step process for EVERY task. Do not skip steps.

## Phase 1: UNDERSTAND (Hiểu vấn đề)
**Before proposing any solution:**
1.  **Read Context**: Review `instruction/ARCHITECTURE.txt` and relevant file structures.
2.  **Identify Problem**: Clearly state what is missing or broken.
3.  **Scope**: Identify which components/files are affected.

## Phase 2: ANALYZE (Phân tích & Giải pháp)
1.  **Deep Dive**: Use `view_file` to read existing code logic.
2.  **Design Solution**: Determine the logic/UI changes needed.
3.  **Check Constraints**: Ensure alignment with `rule/AI-CODING-RULES.md`.

## Phase 3: PLAN (Lập kế hoạch)
**Action**: Create or Update `F:/code duan/GameCoPhuong/instruction/.agent/Plan/plan.md`.
**Format Required**:
```markdown
# Task: [Name]
## Analysis
- Root Cause: ...
- Impact: ...

## Execution Plan
1. [ ] [Component] Step description...
2. [ ] [Component] Step description...
```

## Phase 4: EXECUTE (Thực thi)
**Action**: Choose the correct Skillset before coding.
- **IF UI/Frontend**:
  - Must read: `instruction/.agent/UISkill.md`
  - Focus: Visuals, Tailwind, Component Structure.
- **IF Logic/Backend/Data**:
  - Must read: `instruction/.agent/codeSkill.md`
  - Focus: Data Schema, 3-Layer Arch, strict Types.

## Phase 5: UPDATE (Cập nhật)
1.  **Mark Progress**: Update `plan.md` (Check `[x]`).
2.  **Verify**: Confirm the fix works (Terminal/Browser).
3.  **Report**: Notify user of completion.
