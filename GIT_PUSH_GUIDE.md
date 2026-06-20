# Git Push Guide - Push to GitHub

## ✅ Code is Ready to Push!

Your code has been committed locally. Now you need to push it to GitHub.

---

## 🔐 Authentication Required

The push requires authentication with GitHub. Choose one of the methods below:

---

## Method 1: Using Personal Access Token (Recommended)

### Step 1: Create a Personal Access Token

1. Go to GitHub: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "Playwright POM Framework")
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't see it again!)

### Step 2: Push with Token

Open your terminal in the project directory and run:

```bash
cd /Users/pradeepmarri/Playwright_POM

# Push using token (replace YOUR_TOKEN with your actual token)
git push https://YOUR_TOKEN@github.com/pradeepseleniumhyd/Playwright_POM_TS.git main
```

**Example**:
```bash
git push https://ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/pradeepseleniumhyd/Playwright_POM_TS.git main
```

---

## Method 2: Using GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
cd /Users/pradeepmarri/Playwright_POM

# Login to GitHub
gh auth login

# Push the code
git push -u origin main
```

---

## Method 3: Using SSH (If SSH Key is Set Up)

### Step 1: Change Remote to SSH

```bash
cd /Users/pradeepmarri/Playwright_POM

# Change remote URL to SSH
git remote set-url origin git@github.com:pradeepseleniumhyd/Playwright_POM_TS.git

# Push
git push -u origin main
```

---

## Method 4: Using Git Credential Manager

### Step 1: Configure Credential Manager

```bash
cd /Users/pradeepmarri/Playwright_POM

# Push (will prompt for credentials)
git push -u origin main
```

When prompted:
- **Username**: pradeepseleniumhyd
- **Password**: Use your Personal Access Token (NOT your GitHub password)

---

## Quick Commands (Copy & Paste)

### Option A: Push with Token
```bash
cd /Users/pradeepmarri/Playwright_POM
git push https://YOUR_TOKEN@github.com/pradeepseleniumhyd/Playwright_POM_TS.git main
```

### Option B: Configure and Push
```bash
cd /Users/pradeepmarri/Playwright_POM
git remote set-url origin https://github.com/pradeepseleniumhyd/Playwright_POM_TS.git
git push -u origin main
# Enter credentials when prompted
```

---

## What's Been Committed?

Your commit includes:

### 📂 Code Files (34 files)
- ✅ **Page Objects**: BasePage, LoginPage, InventoryPage, ProductDetailPage, CartPage
- ✅ **Tests**: 26+ test cases in 4 test files
- ✅ **Fixtures**: Custom page object fixtures
- ✅ **Utilities**: Test data and helpers
- ✅ **Configuration**: playwright.config.ts, tsconfig.json, package.json

### 📚 Documentation (10+ files)
- ✅ README.md - Complete framework documentation
- ✅ QUICKSTART.md - Quick start guide
- ✅ ALLURE_NEW_FORMAT_GUIDE.md - Allure reporting guide
- ✅ PRODUCT_SELECTION_GUIDE.md - Product testing guide
- ✅ HTML_REPORTING_GUIDE.md - HTML reporting guide
- ✅ FRAMEWORK_OVERVIEW.md - Architecture overview
- ✅ And more...

### 🎯 Features Committed
- ✅ Page Object Model pattern
- ✅ Allure reporting (new format)
- ✅ Playwright HTML reporting
- ✅ 26+ comprehensive test cases
- ✅ TypeScript support
- ✅ Multi-browser support
- ✅ CI/CD configuration

---

## Verify Your Push

After successfully pushing, verify at:
```
https://github.com/pradeepseleniumhyd/Playwright_POM_TS
```

You should see:
- ✅ 34 files
- ✅ Multiple folders (pages, tests, fixtures, utils)
- ✅ Documentation files
- ✅ Your commit message

---

## Common Issues

### Issue: 403 Permission Denied
**Cause**: Authentication failed
**Solution**: Use Personal Access Token instead of password

### Issue: Repository doesn't exist
**Cause**: Remote repository URL is incorrect
**Solution**: Verify repository exists at GitHub

### Issue: Branch protection
**Cause**: Main branch has protection rules
**Solution**: Push to a different branch first:
```bash
git checkout -b initial-setup
git push -u origin initial-setup
```

---

## Alternative: GitHub Desktop

If you prefer a GUI:

1. Download GitHub Desktop: https://desktop.github.com/
2. Open GitHub Desktop
3. File → Add Local Repository
4. Select: `/Users/pradeepmarri/Playwright_POM`
5. Publish repository to GitHub
6. Select repository: `pradeepseleniumhyd/Playwright_POM_TS`
7. Click "Publish repository"

---

## Next Steps After Push

1. ✅ **Verify on GitHub**: Check all files are uploaded
2. ✅ **Update README**: Add repository link if needed
3. ✅ **Set up GitHub Actions**: Enable CI/CD workflows
4. ✅ **Share**: Share repository link with team

---

## Summary

Your code is committed locally and ready to push. Choose your authentication method and run the push command.

**Recommended command**:
```bash
cd /Users/pradeepmarri/Playwright_POM
git push https://YOUR_TOKEN@github.com/pradeepseleniumhyd/Playwright_POM_TS.git main
```

Replace `YOUR_TOKEN` with your GitHub Personal Access Token.

---

## Need Help?

1. **Create Personal Access Token**: https://github.com/settings/tokens
2. **GitHub Docs**: https://docs.github.com/en/authentication
3. **SSH Setup**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

Happy Coding! 🚀
