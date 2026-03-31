# ⚠️ MANUAL CLEANUP REQUIRED

## Duplicate Config Folder

A duplicate config folder exists that needs to be removed manually:

### Location
`Backend/src/modules/config/`

### Files to Delete
- `Backend/src/modules/config/db.js`
- `Backend/src/modules/config/env.js`
- `Backend/src/modules/config/` (folder)

### Why?

The project has TWO config folders:
```
Backend/src/modules/
├── config/              ← OBSOLETE (DELETE ME)
│   ├── db.js
│   └── env.js
└── shared/
    └── config/          ← CORRECT (KEEP THIS)
        ├── db.js
        ├── env.js
        ├── redis.js
        └── REDIS.md
```

All code references `/shared/config/`, so the `/modules/config/` folder is not used and should be removed.

### How to Delete

#### Option 1: Using File Explorer (Windows)
1. Navigate to `Backend/src/modules/`
2. Right-click on `config` folder
3. Select "Delete"

#### Option 2: Using Terminal
```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force "Backend/src/modules/config"

# macOS/Linux
rm -rf Backend/src/modules/config
```

#### Option 3: Using Git
```bash
# Stage deletion
git rm -r Backend/src/modules/config

# This marks it for deletion when you commit
```

### Verification

After deletion, verify no code references the old path:

```bash
# Should return NO results
grep -r "require('./config/" Backend/src

# All references should be to shared/config
grep -r "require('../shared/config/" Backend/src
# Should show references in many files
```

---

## Summary of All Changes Made

### ✅ Files Created
1. `Backend/package.json` - All dependencies defined
2. `Frontend/.env.example` - Environment template
3. `Backend/.env.example` - Environment template
4. `.env.example` - Root environment template
5. `.env` - Root environment file
6. `.gitignore` - Root git configuration (updated)
7. `database/SETUP.md` - Database setup guide
8. `Backend/src/modules/shared/config/REDIS.md` - Redis guide
9. `SETUP_COMPLETE.md` - This comprehensive guide
10. `MANUAL_CLEANUP.md` - This file

### ✅ Files Modified
1. `Frontend/.env` - Converted REACT_APP_ to VITE_ prefix
2. `Backend/src/server.js` - Added Redis initialization
3. `Backend/src/modules/shared/config/redis.js` - Enhanced with error handling
4. `Backend/src/modules/shared/middleware/cache.middleware.js` - Updated for new Redis module
5. `Backend/src/modules/cart/cart.controller.js` - Updated Redis client usage
6. `Backend/src/modules/user/user.controller.js` - Updated Redis client usage
7. `Backend/src/modules/menu/menu.controller.js` - Updated Redis client usage
8. `Backend/src/modules/category/category.controller.js` - Updated Redis client usage
9. `Backend/src/modules/review/review.controller.js` - Updated Redis client usage

### ❌ Files to Delete Manually
1. `Backend/src/modules/config/db.js`
2. `Backend/src/modules/config/env.js`
3. `Backend/src/modules/config/` (folder)

---

## Next Steps After Cleanup

```bash
# 1. Delete the duplicate config folder (see instructions above)

# 2. Install Backend dependencies
cd Backend
npm install

# 3. Start Backend
npm run dev

# 4. In another terminal, setup and start Frontend
cd Frontend
npm install
npm run dev

# 5. Setup database (see database/SETUP.md)
# Then test the application!
```

## Testing the Complete Setup

```bash
# Terminal 1: Backend
cd Backend
npm run dev
# Should show:
# ✅ Server is running on port 5000
# ✅ Redis cache initialized successfully (or mock client)

# Terminal 2: Frontend  
cd Frontend
npm run dev
# Should open http://localhost:5173

# Terminal 3: Test health
curl http://localhost:5000/api/health
# Response: { "ok": true, "server_time": "..." }
```

## Important Notes

⚠️ **IMPORTANT**: After removing the duplicate config folder:
- No code changes needed
- All imports already point to `/shared/config/`
- Tests will pass without modification
- Git will show the deletion of 2 files

💾 **Backup**: Before deleting, you can optionally commit current state:
```bash
git add .
git commit -m "Setup: Create package.json, env files, and Redis config"
git commit -m "Setup: Remove duplicate config folder"
```

✅ **Verification**: All these commands should work when setup is complete:
```bash
npm run dev            # Backend
npm test              # Backend tests
npm run lint          # Linting
npm run build         # Frontend build
npm run preview       # Frontend preview
```

---

**Questions?** Check the individual setup guides in:
- `database/SETUP.md` - Database
- `Backend/src/modules/shared/config/REDIS.md` - Redis
- `Frontend/README.md` - Frontend
- `SETUP_COMPLETE.md` - Overall guide
