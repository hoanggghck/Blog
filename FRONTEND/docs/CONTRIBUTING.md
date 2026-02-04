# 🤝 CONTRIBUTING - Quy trình Contribute

## 📌 Table of Contents
- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Branch Naming](#branch-naming)
- [Commit Message Convention](#commit-message-convention)
- [Pull Request Process](#pull-request-process)
- [Code Review Checklist](#code-review-checklist)
- [Definition of Done](#definition-of-done)

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork repository trên GitHub
# Clone về máy
git clone https://github.com/YOUR_USERNAME/blog-web-app.git
cd blog-web-app

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/blog-web-app.git
```

---

### 2. Setup Environment

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local với credentials của bạn
```

---

### 3. Run Development Server

```bash
npm run dev
```

Verify project runs at: `http://localhost:3000`

---

## 🌿 Git Workflow

### Workflow Overview

```
main (production)
  ↓
develop (staging)
  ↓
feature/your-feature (your work)
```

### Standard Flow

```bash
# 1. Update develop branch
git checkout develop
git pull upstream develop

# 2. Create feature branch
git checkout -b feature/add-comment-section

# 3. Make changes
# ... code code code ...

# 4. Commit changes
git add .
git commit -m "feat: add comment section"

# 5. Push to your fork
git push origin feature/add-comment-section

# 6. Create Pull Request on GitHub
# From: your-fork/feature/add-comment-section
# To: upstream/develop
```

---

### Keep Branch Updated

```bash
# Fetch latest from upstream
git fetch upstream

# Rebase your branch
git checkout feature/your-feature
git rebase upstream/develop

# If conflicts, resolve them, then:
git add .
git rebase --continue

# Force push (since history changed)
git push origin feature/your-feature --force
```

---

## 🏷️ Branch Naming

### Convention

```
<type>/<short-description>
```

### Types

| Type | Usage | Example |
|------|-------|---------|
| `feature/` | New feature | `feature/add-comment-section` |
| `bugfix/` | Bug fix | `bugfix/fix-login-error` |
| `hotfix/` | Urgent production fix | `hotfix/fix-payment-crash` |
| `refactor/` | Code refactoring | `refactor/improve-blog-api` |
| `docs/` | Documentation | `docs/update-readme` |
| `test/` | Add/update tests | `test/add-blog-tests` |
| `chore/` | Maintenance | `chore/update-dependencies` |

---

### Examples

```bash
# ✅ GOOD
feature/comment-crud
feature/user-authentication
bugfix/fix-image-upload
refactor/optimize-query-hooks
docs/add-api-documentation

# ❌ BAD
my-feature
fix-bug
update
new-stuff
```

---

## 📝 Commit Message Convention

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

---

### Type

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat: add comment section` |
| `fix` | Bug fix | `fix: resolve login redirect issue` |
| `docs` | Documentation | `docs: update API integration guide` |
| `style` | Formatting, missing semicolons | `style: format code with prettier` |
| `refactor` | Code refactoring | `refactor: simplify blog query logic` |
| `test` | Add/update tests | `test: add comment API tests` |
| `chore` | Maintenance tasks | `chore: update dependencies` |
| `perf` | Performance improvement | `perf: optimize image loading` |

---

### Scope (Optional)

Specify which part of codebase is affected:

```bash
feat(blog): add like functionality
fix(auth): resolve token refresh bug
docs(readme): update setup instructions
refactor(api): improve error handling
```

**Common scopes:**
- `blog`, `comment`, `user`, `auth`
- `api`, `hooks`, `components`
- `ui`, `types`, `utils`

---

### Subject

- Imperative mood: "add" not "added" or "adds"
- Lowercase
- No period at the end
- Max 50 characters

```bash
# ✅ GOOD
feat: add comment section
fix: resolve image upload bug
docs: update contributing guide

# ❌ BAD
feat: Added comment section.
fix: fixed the bug
docs: Updated some docs
```

---

### Body (Optional)

Explain WHAT and WHY, not HOW.

```bash
feat: add comment section

Implement full CRUD operations for blog comments.
Users can now create, edit, and delete their comments.

- Add Comment model and API endpoints
- Create comment UI components
- Integrate with React Query for caching
```

---

### Footer (Optional)

Reference issues, breaking changes.

```bash
feat: add comment section

BREAKING CHANGE: Comment API endpoint changed from /api/comments to /api/v2/comments

Closes #123
Refs #456
```

---

### Complete Examples

#### Example 1: Simple Feature

```bash
feat: add like button to blog card

Allow users to like blogs directly from the blog card.
```

#### Example 2: Bug Fix

```bash
fix(auth): resolve token refresh infinite loop

The refresh token logic was causing infinite loops when token expired.
Now properly handles token expiration and redirects to login.

Fixes #234
```

#### Example 3: Refactoring

```bash
refactor(hooks): optimize React Query cache invalidation

Improve cache invalidation strategy to reduce unnecessary API calls.
Use more granular queryKey patterns.

Performance improvement: ~30% reduction in API requests.
```

#### Example 4: Breaking Change

```bash
feat(api): migrate to new API v2

BREAKING CHANGE: All API endpoints now use /api/v2 prefix.

Migration guide:
- Update API_URL in .env
- Replace /api/blogs with /api/v2/blogs
- Update all API modules

Closes #567
```

---

## 🔄 Pull Request Process

### 1. Create Pull Request

**Title:** Same as commit message
```
feat: add comment section
```

**Description Template:**
```markdown
## Description
Briefly describe what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Added Comment API module
- Created comment UI components
- Integrated React Query hooks
- Added tests

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Manual testing completed
- [ ] Unit tests added
- [ ] All tests passing

## Checklist
- [ ] Code follows project coding standards
- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] Self-review completed
- [ ] Documentation updated
```

---

### 2. Link Issues

```markdown
Closes #123
Fixes #456
Refs #789
```

---

### 3. Request Review

Tag reviewers:
```
@senior-dev @team-lead
```

---

### 4. Address Review Comments

```bash
# Make requested changes
git add .
git commit -m "refactor: address review comments"
git push origin feature/your-feature
```

---

### 5. Merge

After approval:
- **Squash and merge** (for feature branches)
- **Merge commit** (for hotfixes)
- **Rebase and merge** (for clean history)

---

## ✅ Code Review Checklist

### For Reviewer

#### Architecture & Design
- [ ] Follows project architecture (layers, separation of concerns)
- [ ] Types defined in correct location (`/types`)
- [ ] Components are pure (no business logic)
- [ ] Business logic in features
- [ ] API calls in API modules
- [ ] No circular dependencies

#### Code Quality
- [ ] Code is readable and self-explanatory
- [ ] Functions are small (< 20 lines)
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Edge cases handled

#### TypeScript
- [ ] No `any` types (use `unknown` if needed)
- [ ] Proper type definitions
- [ ] No type assertions unless necessary
- [ ] Generics used appropriately

#### Imports
- [ ] No `../` imports (use `@/` or `./`)
- [ ] Import order is correct
- [ ] No unused imports

#### Performance
- [ ] No unnecessary re-renders
- [ ] Proper memoization (`useMemo`, `useCallback`)
- [ ] Lazy loading for heavy components
- [ ] Images optimized

#### Testing
- [ ] Manual testing completed
- [ ] Critical paths tested
- [ ] Error cases tested
- [ ] Edge cases covered

#### Documentation
- [ ] README updated (if needed)
- [ ] API documented (if new endpoints)
- [ ] Complex logic has comments
- [ ] JSDoc for public APIs

#### Security
- [ ] No sensitive data in code
- [ ] User input sanitized
- [ ] Authentication checked
- [ ] Authorization verified

---

### Review Comments Template

#### Request Changes
```markdown
**Issue:** Using relative imports

**Location:** `src/features/blog/blog-list.tsx:5`

**Current:**
\`\`\`typescript
import { Button } from '../../components/ui/button'
\`\`\`

**Expected:**
\`\`\`typescript
import { Button } from '@/components/ui/button'
\`\`\`

**Reason:** Relative imports make refactoring difficult. Please use absolute imports with `@/`.
```

#### Suggest Improvement
```markdown
**Suggestion:** Extract complex logic to custom hook

**Location:** `src/features/blog/blog-create.tsx:45-80`

**Current:** Business logic mixed in component

**Suggestion:**
\`\`\`typescript
// hooks/use-blog-form.ts
export function useBlogForm() {
  // Extract logic here
}
\`\`\`

**Benefit:** Reusable logic, easier to test, cleaner component
```

#### Approve with Comment
```markdown
✅ Looks good! 

Minor suggestion: Consider adding loading state to button while submitting.
```

---

## 📋 Definition of Done

### Feature is DONE when:

#### Code
- [ ] All acceptance criteria met
- [ ] Code follows coding standards
- [ ] ESLint passes (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] No console.log statements
- [ ] No commented-out code

#### Testing
- [ ] Manual testing completed
- [ ] Happy path works
- [ ] Error cases handled
- [ ] Edge cases tested
- [ ] Tested on different screen sizes (responsive)
- [ ] Tested with/without authentication

#### Documentation
- [ ] Code comments added (where needed)
- [ ] README updated (if needed)
- [ ] API documentation updated (if new endpoints)

#### Review
- [ ] Self-review completed
- [ ] Peer review completed
- [ ] All review comments addressed
- [ ] PR approved

#### Integration
- [ ] Branch updated with latest develop
- [ ] No merge conflicts
- [ ] CI/CD passes (if applicable)

---

## 🎯 Best Practices

### 1. Small, Focused PRs

```
❌ BAD: PR with 50 files, 2000 lines changed
✅ GOOD: PR with 5 files, 200 lines changed
```

**Why?**
- Easier to review
- Faster feedback
- Less risk

**How?**
- Break large features into smaller PRs
- One concern per PR

---

### 2. Descriptive Commits

```bash
# ❌ BAD
git commit -m "fix bug"
git commit -m "update"
git commit -m "changes"

# ✅ GOOD
git commit -m "fix(auth): resolve token refresh infinite loop"
git commit -m "feat(blog): add pagination to blog list"
git commit -m "docs: add API integration guide"
```

---

### 3. Review Your Own Code First

Before requesting review:
```bash
# Check changes
git diff develop...feature/your-feature

# Self-review checklist:
# - Does code follow standards?
# - Any debug code left?
# - Any TODOs to address?
# - Documentation updated?
```

---

### 4. Respond to Reviews Promptly

```markdown
# Acknowledge feedback
Thanks for the review! I'll address these points.

# If you disagree, explain why
I kept the logic here because [reason]. What do you think?

# Mark comments as resolved when done
✅ Fixed in commit abc123
```

---

### 5. Keep Commit History Clean

```bash
# Squash WIP commits before merging
git rebase -i HEAD~5

# Change commit messages if needed
git commit --amend

# Force push (be careful!)
git push --force-with-lease
```

---

## 🚨 Common Mistakes

### Mistake 1: Pushing to Main/Develop

```bash
# ❌ NEVER DO THIS
git checkout main
git commit -m "fix"
git push origin main
```

**Always** work in feature branches.

---

### Mistake 2: Not Updating Branch

```bash
# ❌ Your branch is 50 commits behind
# Merge conflicts guaranteed
```

**Solution:**
```bash
# Update frequently
git fetch upstream
git rebase upstream/develop
```

---

### Mistake 3: Large, Unfocused PRs

```
❌ PR: "Add comments, fix login, update docs, refactor API"
```

**Split into:**
```
✅ PR 1: feat(comment): add comment section
✅ PR 2: fix(auth): resolve login bug
✅ PR 3: docs: update API documentation
✅ PR 4: refactor(api): improve error handling
```

---

## 📞 Getting Help

### Stuck?

1. **Check Documentation**
   - Read related docs
   - Check examples in codebase

2. **Ask in Team Chat**
   - Describe problem clearly
   - Share code snippet
   - What you've tried

3. **Create Discussion**
   - GitHub Discussions
   - Ask for design review

4. **Tag Maintainers**
   - For urgent issues
   - For architecture decisions

---

## 🏆 Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Team meetings

---

## 🔗 Related Documents

- [FEATURE_DEVELOPMENT.md](./FEATURE_DEVELOPMENT.md) - How to build features
- [CODING_STANDARDS.md](./CODING_STANDARDS.md) - Coding conventions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture guidelines

---

**Thank you for contributing! 🎉**

*"Good code is written for humans, not computers."*
