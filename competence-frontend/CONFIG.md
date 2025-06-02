There are three main parts in your monorepo setup:

---

## 🔁 **Monorepo Structure**

```bash
competence-frontend/
├── packages/
│   ├── shared/       # Shared React/TS logic
│   └── react-app/    # Next.js frontend
│   └── competence-wp/    # WordPress plugin
```


---

## 📦 `shared/` (Your shared library)

This is a reusable TypeScript + React component library for both `react-app` and `competence-wp`.

### structure
3. ✅ index.ts should only re-export safe components
Be sure that everything exported from index.ts:

is usable in both environments (React and WordPress),

doesn't require Next.js features like useRouter().

If needed, split between:

index.ts → safe for both React and WordPress,

index.react.ts → for React-only use,

index.wp.ts → for WordPress-only use.

### build
. Run the build:
From the root of packages/shared (competence-frontend/packages/shared
) ), run:

 
npm run build:wp
If all works, you should get:

wp_build/index.js (compiled)

wp_build/index.d.ts (types)

and copied assets/, styles/, etc. as defined

---

## ⚛️ `react-app/` (Your Next.js frontend)

This is your client-facing app using the shared package.

### ✅ `package.json`

* Uses `next`, `react`, `@competence/shared`
* Scripts: `next dev`, `next build`, etc.

### ✅ `tsconfig.json`

* TypeScript config specific to Next.js
* Important paths:

  ```json
  "paths": {
    "@shared/*": ["../../shared/dist/*"]
  }
  ```

  So you can do: `import x from "@shared/utils/helper"`

### ✅ `next.config.ts`

* Optional, for customizing Next.js (e.g., enabling SWC, setting aliases)

### ✅ `eslint.config.mjs`

* Lints TypeScript + React using Next.js standards

### ✅ `postcss.config.mjs`

* TailwindCSS and post-CSS setup

---

## 🧩 `competence-wd/` (Your WordPress plugin)

This is your custom WordPress block plugin using code from `@competence/shared`.

### ✅ `package.json`

* Contains `scripts` to:

  * Copy `shared/dist` into `vendor/`
  * Run Webpack
  * Build ZIP for deployment

### ✅ `webpack.config.js`

* Builds JS/TS/React into `build/` (for use in WordPress)
* Processes shared code, CSS, images

### ✅ `vendor/`

* You manually copy `shared/dist` here
* Used by Webpack to bundle shared logic into plugin

### ✅ `zipme`, `plugin-zip`

* Create `competence-wd.zip` for deployment

---

## 🔄 Summary

| Directory        | Purpose                      | Key Tooling                    |
| ---------------- | ---------------------------- | ------------------------------ |
| `shared/`        | Shared logic + components    | TypeScript + Rollup + Babel    |
| `react-app/`     | Main web frontend (Next.js)  | Next.js + Tailwind + ESLint    |
| `competence-wd/` | WordPress plugin (Gutenberg) | Webpack + shared code bundling |

---

Let me know if you want a visual of how import/exports flow or how `dist/` should be structured.
