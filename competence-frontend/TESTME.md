# TESTING 

---

## 🧪 PART 0: compile the shared

```bash
cd packages/shared

# call tsc 
From the root of the monorepo
npm run build

# This will run:
# - npm run build -w @competence/shared
# -  npm run build -w react-app

```

## 🧪 PART 1: **WordPress Plugin Testing**


 
#  Copy built shared package to the WordPress plugin (competence-wd)
# This is only necessary if your WordPress plugin can't resolve from monorepo structure.
# Use a script like this:
cp -r packages/shared/dist packages/competence-wd/vendor/shared

# Or symlink instead of copy to avoid duplication:
ln -s ../../../shared/dist packages/competence-wd/vendor/shared

# (Adjust paths based on your actual directory structure)

# Step 3: Inside `packages/competence-wd`, build your WordPress blocks
cd packages/competence-wd
npm run build

# Ensure your import paths in `competence-wd` are either:
# A) aliased correctly via Webpack or Babel config
# B) relative to the vendor copy (e.g., '../../../vendor/shared')


### ✅ Step 1: Zip your plugin
# Create ZIP (includes only necessary files)
zip -r competence-wd.zip \
  competence-wd.php \
  readme.txt \
  block-*/ \
  build/ \
  src/ \
  index.js \
  package.json
```

> 💡 Make sure you **exclude** `node_modules/` from the zip! WordPress doesn't need it.

---

### ✅ Step 2: Install ZIP in WordPress

1. Go to **WP Admin → Plugins → Add New → Upload Plugin**
2. Upload `competence-wd.zip`
3. Activate it

---

### ✅ Step 3: Test Blocks in WP

1. Create a new Page
2. Add your custom blocks:

   * "Block Login"
   * "Block Eleve"
3. Save and view the page
4. Confirm your shared React component renders on the **frontend**, not just editor

---

## 🧪 PART 2: **React App Testing**

From your monorepo root:

```bash
cd packages/react-app

# Optional clean build
npm run build

# Start the production server
npm start
```

> Or for development:

```bash
npm run dev
```

Then visit:

```bash
http://localhost:3000
```

Make sure:

* `/login` renders your shared `<Login />` component
* `/eleve` renders your `<EleveDisplay />` component
* AuthContext is working (token + role redirect if configured)

---

 
