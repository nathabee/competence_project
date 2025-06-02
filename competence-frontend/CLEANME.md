Great question — cleaning up after accidentally running `npm install` in the wrong directories is **very important in a monorepo setup**, like yours with `npm workspaces`. Here’s exactly how to clean up and get back to a healthy state.

---

## 🧼 STEP-BY-STEP: CLEANUP FOR MONOREPO (REACT AND SHARED)

Your project has the structure:

```
competence-frontend/
├── packages/
│   ├── shared/
│   ├── react-app/
│   ├── competence-wd/
```


Each as a package.json, If dependency are declared in the root package.json, it is not enough when react-app is trying to use them locally. In a monorepo, each package should list its own direct dependencies. Add in react-app/package.json the dependencies that we need
after each modif in any package.json all over repository : think to run in the root repository competence-frontend/npm install 

---

### ✅ 1. Go to **root of your monorepo**:

```bash
cd ~/coding/nathabee-cloud/competence_project/competence-frontend
```

---

### ✅ 2. DELETE All Node-Related Artifacts:

```bash
# At root
rm -rf node_modules package-lock.json

# In each workspace
rm -rf packages/shared/node_modules packages/shared/package-lock.json packages/shared/dist
rm -rf packages/react-app/node_modules packages/react-app/package-lock.json
rm -rf packages/competence-wd/node_modules packages/competence-wd/package-lock.json

```
---

### ✅ 3. REINSTALL everything **from the root**

```bash
npm install
```

> This will install all dependencies for the root, shared, and react-app **correctly**, and keep the symlinks and workspace wiring intact.

---

### ✅ 4.  REBUILD the whole project

```bash
npm run build
```

---

### ✅ 5. To Develop the React App (Next.js)

```bash
cd packages/react-app
npm run dev
```




### 4  CLEANUP F WORDPRESS PLUGIN (`competence-wd`)

 

  🔁 Typical flow for `competence-wd`:

```bash
# From root
npm run build -w @competence/shared
```

---

## 🧠 Summary

---

### ❗ DON’T DO THIS ANYMORE:

| ❌ What Not To Do                               | Why It's Bad                                   |
| ---------------------------------------------- | ---------------------------------------------- |
| `npm install` inside `shared/` or `react-app/` | Breaks workspace dependency linking            |
| Having `node_modules` inside workspace folders except in wordpress| Causes duplication, resolution conflicts       |
| Having multiple `package-lock.json` files      | npm will use wrong tree — must be only in root |

---

## ✅ Final Checklist

* [x] Only one `node_modules/` — at root
* [x] Only one `package-lock.json` — at root
* [x] Workspace packages (`shared`, `react-app`) should **never** have their own `node_modules`
* [x] Only run `npm install` in the root
* [x] Use `npm run build -w <workspace>` for scoped builds

  

* ✅ `shared/`: only has **its own build and peer dependencies**
* ✅ `react-app/`: full app dependencies
* ✅ `competence-wd/`: separate, manual install (not part of workspaces)
* ✅ Root: installs everything correctly for all workspaces
* ❌ Don't install in individual workspace folders

---

## About installing some new packages in our monorepository 

###  we will run :
```bash
npm install -w my-workspace-name package1 package2

```

### What this command does:

#### Adds to my-workspace-name/package.json:

It adds package1 and package2 to the dependencies (or devDependencies if you use --save-dev) of that specific workspace.

#### Installs packages using npm workspaces logic:

##### Tries to deduplicate and hoist shared packages to the root node_modules/ if:

The version constraints are compatible across workspaces.

The packages don’t depend on being isolated.

##### Installs in my-workspace-name/node_modules/ if:

There's a version conflict.

The package must remain local (due to how it uses peer dependencies, file paths, etc.).

You explicitly need local installs (rare).