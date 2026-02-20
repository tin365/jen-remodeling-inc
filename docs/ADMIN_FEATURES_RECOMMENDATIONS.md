# Admin feature recommendations

Current admin already has: **Contacts**, **Reviews**, and **Projects** (add/edit projects, add images by URL, delete).

## Recommended next features (in order of impact)

### 1. **Image upload (Supabase Storage)**
- Let admin upload images instead of only pasting URLs.
- Create a Supabase Storage bucket (e.g. `project-images`), add RLS so only authenticated admins can upload; public read for display.
- In Projects tab: “Upload image” next to “Add image (URL)”; store the returned public URL in `project_images`.

### 2. **Drag-and-drop reorder for project images**
- Allow reordering “Before” and “After” images (e.g. drag handle or up/down buttons).
- Update `sort_order` in `project_images` when order changes.

### 3. **Reorder projects**
- Add `sort_order` (already in DB) to the admin UI so the admin can change the order of projects on the public Projects page (e.g. up/down or drag-and-drop).

### 4. **Optional caption per image**
- Add a `caption` column to `project_images` and show it under each image in the project detail modal (optional label under Before/After).

### 5. **Publish / draft**
- Add `published` (boolean) to `projects`. Only show published projects on the public site; admin can toggle and save.

### 6. **Featured project**
- Add `featured` (boolean) to `projects` and use it on the home page “Featured project” section (e.g. show the first featured project or a random one).

### 7. **Bulk add image URLs**
- In the Projects edit view, allow pasting multiple URLs (e.g. one per line) and assign them all as “Before” or “After” in one action.

### 8. **Delete confirmation for projects**
- You already have “Delete? Yes / No” for projects; consider the same pattern for “Remove” image (optional confirm to avoid accidents).

### 9. **Image validation**
- When adding a URL, optionally check that it loads (e.g. `new Image()` and `onload`/`onerror`) and show a warning if it fails.

### 10. **Analytics or export**
- Export contacts or reviews to CSV from the admin (e.g. “Export contacts” button).

---

**Quick win:** Implement **Image upload (Supabase Storage)** first so admins can upload from their device instead of hosting images elsewhere and pasting URLs.
