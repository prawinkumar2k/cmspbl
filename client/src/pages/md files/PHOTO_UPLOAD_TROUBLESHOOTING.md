# Photo Upload Troubleshooting Guide

## Quick Diagnostics

### Step 1: Verify Upload Directory
```bash
cd server
node verify-upload-folder.js
```

**Expected Output:**
```
✅ Directory EXISTS
✅ Directory is readable
✅ Directory is writable
📂 Found X file(s):
✅ Test write successful
```

### Step 2: Check Server Logs During Upload
When a student is added/edited with a photo, look for these messages in server console:

#### For NEW Student (POST /add):
```
========== ADD STUDENT REQUEST ==========
📝 Incoming student data: { Application_No: '10000006', ... }
📸 Incoming file: { fieldname: 'photo', originalname: 'photo.jpg', ... }
📁 Upload directory path: D:\ERP Website\GRT_ERP\client\public\assets\student\
📤 Uploading file to: D:\ERP Website\GRT_ERP\client\public\assets\student\
📝 Saving file as: 10000006.jpg
✅ Photo saved as: assets/student/10000006.jpg
📷 File details: {
  filename: '10000006.jpg',
  originalname: 'photo.jpg',
  size: 134256,
  path: 'D:\\ERP Website\\GRT_ERP\\client\\public\\assets\\student\\10000006.jpg',
  mimetype: 'image/jpeg'
}
```

#### For EDITING Student (PUT /edit/:id):
```
========== EDIT STUDENT REQUEST ==========
📝 Student ID: 1
📝 Incoming data: { Application_No: '10000001', ... }
📸 Incoming file: { fieldname: 'photo', originalname: 'newphoto.png', ... }
📷 Photo updated as: assets/student/10000001.png
📷 File details: { ... }
```

### Step 3: Verify File Exists
After upload, manually check the folder:
```
Folder: d:\ERP Website\GRT_ERP\client\public\assets\student\
Expected file: {Application_No}.{extension}
Example: 10000006.jpg
```

### Step 4: Check Database
```sql
SELECT Application_No, Photo_Path FROM student_master 
WHERE Application_No = '10000006';
```

**Expected Result:**
```
Application_No | Photo_Path
10000006       | assets/student/10000006.jpg
```

### Step 5: Test In Browser
Open your browser and navigate to:
```
http://localhost:YOUR_PORT/assets/student/10000006.jpg
```

Should display the uploaded photo image.

---

## Troubleshooting Common Issues

### Issue: Photo not saved, "Incoming file: undefined"
**Cause:** File not sent from frontend
**Solution:** 
1. Check form has `enctype="multipart/form-data"`
2. Verify file selected in form
3. Check FormData.append('photo', file) in JavaScript

### Issue: "Error in destination callback: Cannot find path"
**Cause:** Upload directory doesn't exist or can't be created
**Solution:**
```bash
node verify-upload-folder.js
# If fails, manually create:
# d:\ERP Website\GRT_ERP\client\public\assets\student\
```

### Issue: File saved but size is 0KB
**Cause:** Multer canceled upload mid-way
**Solution:**
1. Check file size < 5MB (frontend) and < 10MB (backend)
2. Check disk space available
3. Check file format is valid image

### Issue: Photo preview shows broken image
**Cause:** Path incorrect or file doesn't exist
**Solution:**
1. Check database: `SELECT Photo_Path FROM student_master`
2. Check file exists in folder
3. Check path format: `assets/student/{filename}`
4. Verify file is accessible: `/{Photo_Path}` in browser

### Issue: "File type not allowed"
**Cause:** Wrong file format uploaded
**Solution:**
Only upload: JPG, PNG, WebP, GIF
No BMP, SVG, or other formats

---

## Log Messages Reference

### Success Messages
```
✅ Photo saved as: assets/student/{filename}
✅ Upload directory created successfully
✅ Upload directory already exists
✅ Image file accepted
✅ Directory created successfully
✅ Test file created successfully
✅ Test file cleaned up
```

### Warning Messages
```
⚠️ Upload directory does not exist, creating it...
⚠️ No photo provided for new student
⚠️ No new photo uploaded, keeping existing: {path}
```

### Error Messages
```
❌ Failed to ensure upload directory exists: {path}
❌ Error in destination callback: {error}
❌ Error in filename callback: {error}
❌ Invalid file type: {mimetype}
❌ File size exceeds limit
❌ Failed to read directory: {error}
❌ Failed to write test file: {error}
```

---

## Configuration Details

### File Upload Settings:
- **Destination:** `client/public/assets/student/`
- **Filename Format:** `{Application_No}.{extension}`
- **Frontend Size Limit:** 5 MB
- **Backend Size Limit:** 10 MB
- **Allowed Types:** image/jpeg, image/png, image/webp, image/gif

### Database Storage:
- **Table:** `student_master`
- **Column:** `Photo_Path` (VARCHAR)
- **Example:** `assets/student/10000001.jpg`
- **Accessed At:** `/{Photo_Path}` in web

---

## Testing Command

```bash
# Run in server directory to test everything:
node verify-upload-folder.js

# Should output:
# 1️⃣ Checking if directory exists... ✅
# 2️⃣ Checking read permissions... ✅
# 3️⃣ Checking write permissions... ✅
# 4️⃣ Directory contents: 📂 Found X file(s)
# 5️⃣ Testing write capability... ✅
```

---

## Quick Checklist

Before reporting an issue:
- [ ] Ran `node verify-upload-folder.js` and all checks passed
- [ ] Checked server console logs for upload messages
- [ ] Verified file exists in `client/public/assets/student/`
- [ ] Checked database `Photo_Path` value
- [ ] Verified browser can access `/{Photo_Path}`
- [ ] Tried with a different image file
- [ ] Checked file size is < 5MB
- [ ] Verified image format is JPG/PNG/WebP

---

## Files Involved

**Upload Flow:**
1. Frontend: `StudentDetails.jsx` → form submission
2. Network: FormData POST/PUT to `/api/studentMaster/add` or `/edit/:id`
3. Middleware: `multer` in `studentMaster.js` → saves file to disk
4. Controller: `studentMasterController.js` → saves path to database
5. Storage: `client/public/assets/student/` → actual file
6. Display: Frontend loads from `/{Photo_Path}`

**Configuration Files:**
- `server/routes/studentMaster.js` - Multer config (lines 1-70)
- `server/controller/studentMasterController.js` - Save logic
- `client/src/pages/.../StudentDetails.jsx` - Form UI & preview

---

## Support

If issues persist:
1. Share server console logs with photo upload messages
2. Verify folder permissions: `client/public/assets/student/`
3. Check database value: `SELECT Photo_Path FROM student_master`
4. Test with different browser (clear cache)
5. Ensure file size < 5MB and correct format
