# GitHub Pages Deployment for Competence Project

## Description

This setup enables deploying the `competence_project` as a static site on GitHub Pages using a dedicated `gh-pages` branch.

- **Source Directory**: The main project resides in `competence_project`.
- **Index HTML**: The GitHub Pages index file is located in `competence-app/github-pages/index.html`.
- **Static Export**: The Next.js app is compiled into a static website and exported to `competence-app/out`.
- **Deployment Directory**: The compiled output (`index.html` + `out` directory) is moved to `competence_project/gh-pages`, from which it is pushed to the `gh-pages` branch for deployment on GitHub Pages.

The `npm run demo-deploy` command builds and deploys the static site.
 

## Branch Initialization

Creating a separate clone of your repository dedicated to the `gh-pages` branch helps keep your development (`main`) and deployment (`gh-pages`) workspaces clean and isolated. Here’s how to set up `~/coding/nathabee-cloud/competence_project_ghpage` to track only the `gh-pages` branch.

### Step-by-Step Setup

### 1. **Clone the Repository for `gh-pages` Branch**  
First, create a new directory `competence_project_ghpage` and clone the repository into it:
```bash
cd ~/coding/nathabee-cloud/
git clone https://github.com/nathabee/competence_project.git competence_project_ghpage

```

### 2 . Switch to the gh-pages Branch in the New Directory
If the gh-pages branch does not exist yet, you can create it in this clone:

```bash 
cd competence_project_ghpage
git checkout --orphan gh-pages
git rm -rf .
echo "gh-pages branch initialized" > README.md
git add README.md
git commit -m "Initialize gh-pages branch"
git push -u origin gh-pages

```

## Updating the gh-pages Branch with New Code
When you want to update the gh-pages branch with new static content:

### Modify and test the code
Ensure the following files are updated in competence_project/gh-pages/:
```bash 
index.html (is making a small presentation of the static website)
.nojekyll (so that github page is serving sub directories)
out  => ( directory containing the static export from competence-app)
README.md (for branch-specific instructions, manually updated as needed)
```


Command for test in local :

```bash 
cd competence_project/competence_app 
npm run demo-local-build
npm run demo-local-start
```

  

### Deploying on GitHub Pages
Switch to the Main Branch for Development
Go back to the main branch to make changes:



```bash 
cd competence_project/competence_app
git checkout  main
npm run demo-deploy


```
Now, the updated static files are deployed on GitHub Pages using the gh-pages branch.
 
 