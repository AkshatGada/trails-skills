# 🚀 Quick Start: Testing in Claude Code

## Three Methods to Test Locally

### ⚡ Method 1: Automated Setup (Recommended)

```bash
cd /Users/jameslawton/Coding/trails-main/skills
./setup-claude-test.sh
```

**Then in Claude Code:**
```
/plugin marketplace add ./.claude-marketplace
/plugin install trails@./.claude-marketplace
```

**Restart Claude Code and test!**

---

### 🔧 Method 2: Direct Install (Simplest)

```bash
cd /Users/jameslawton/Coding/trails-main/skills
node bin/install.js install --claude
```

**Open the directory in Claude Code, restart, and test!**

---

### 🎯 Method 3: Manual Marketplace Setup

```bash
# 1. Create test directory
mkdir ~/trails-claude-test
cd ~/trails-claude-test

# 2. Create marketplace symlink
mkdir -p .claude-marketplace
ln -s /Users/jameslawton/Coding/trails-main/skills .claude-marketplace/trails-skills

# 3. Open in Claude Code
# Launch Claude Code in this directory

# 4. In Claude Code, run:
/plugin marketplace add ./.claude-marketplace
/plugin install trails@./.claude-marketplace

# 5. Restart Claude Code
```

---

## Test Prompts

Once installed and restarted, try:

```
I want to integrate trails into my app
```

```
I need to accept payments in any token
```

```
How do I implement chain abstraction?
```

```
I need to handle cross-chain intents
```

```
Add x402 payment support
```

---

## Visual Flow

```
┌─────────────────────────────────────────┐
│  Your Skills Directory                  │
│  /Users/.../trails-main/skills/         │
│  ├── trails/SKILL.md                    │
│  ├── .claude-plugin/                    │
│  └── bin/install.js                     │
└─────────────────────────────────────────┘
                    │
                    │ setup-claude-test.sh
                    │ creates symlink
                    ▼
┌─────────────────────────────────────────┐
│  Test Directory                         │
│  ~/trails-claude-test/                  │
│  └── .claude-marketplace/               │
│      └── trails-skills → (symlink)      │
└─────────────────────────────────────────┘
                    │
                    │ Open in Claude Code
                    ▼
┌─────────────────────────────────────────┐
│  Claude Code                            │
│                                         │
│  > /plugin marketplace add ./...        │
│  > /plugin install trails@...           │
│                                         │
│  ✅ Skill Active!                       │
└─────────────────────────────────────────┘
```

---

## Verification

After installation, verify:

```bash
# Check skill is installed
ls -la .claude/skills/trails/
```

In Claude Code:
```
/plugin list
```

Should show "trails" in the list.

---

## Making Changes

### To update the skill:

1. Edit files in `/Users/jameslawton/Coding/trails-main/skills/trails/`
2. In Claude Code: `/plugin reload trails`
3. Test your changes

### Common files to edit:
- `trails/SKILL.md` - Main skill instructions
- `trails/docs/*.md` - Documentation
- `trails/snippets/*.tsx` - Code examples

---

## Troubleshooting

### Skill doesn't activate

**Solution 1: Check installation**
```bash
ls -la .claude/skills/trails/
# Should show: SKILL.md, docs/, snippets/
```

**Solution 2: Verify plugin is loaded**
```
/plugin list
```

**Solution 3: Restart Claude Code completely**
Quit and reopen (don't just reload window)

**Solution 4: Try explicit mention**
```
Using the trails skill, help me integrate cross-chain payments
```

### Marketplace not found

**Check symlink:**
```bash
ls -la .claude-marketplace/trails-skills/
# Should show files from your skills directory
```

**Recreate if needed:**
```bash
rm .claude-marketplace/trails-skills
ln -s /Users/jameslawton/Coding/trails-main/skills .claude-marketplace/trails-skills
```

---

## Comparison of Methods

| Method | Setup Time | Best For | Reload Speed |
|--------|-----------|----------|--------------|
| Automated Setup | 30s | First-time testing | Fast |
| Direct Install | 10s | Quick iterations | Instant |
| Manual Marketplace | 2min | Understanding process | Fast |

**Recommendation:** 
- Use **Direct Install** for rapid development
- Use **Automated Setup** for marketplace testing
- Use **Manual** to understand the process

---

## Full Documentation

For complete details, see:
- **[CLAUDE_CODE_TESTING.md](./CLAUDE_CODE_TESTING.md)** - Comprehensive guide
- **[TESTING.md](./TESTING.md)** - Test cases and expected behaviors
- **[TEST_PROMPTS.md](./TEST_PROMPTS.md)** - Copy-paste test prompts

---

## Ready to Publish?

Once testing is complete:

```bash
npm version patch  # or minor, major
npm publish --access public
```

Users can then install with:
```
/plugin marketplace add 0xtrails/skills
/plugin install trails@0xtrails/skills
```

---

## Quick Command Reference

```bash
# Setup
./setup-claude-test.sh                    # Automated marketplace setup
node bin/install.js install --claude      # Direct installation

# In Claude Code
/plugin marketplace add ./.claude-marketplace   # Add local marketplace
/plugin menu                                     # Browse plugins
/plugin install trails@./.claude-marketplace    # Install skill
/plugin list                                     # List installed plugins
/plugin reload trails                            # Reload after changes
/plugin uninstall trails                         # Uninstall
```

---

## Test Checklist

- [ ] Run setup script
- [ ] Open in Claude Code
- [ ] Add marketplace
- [ ] Install plugin
- [ ] Restart Claude Code
- [ ] Test basic trigger: "integrate trails"
- [ ] Test payment trigger: "accept payments"
- [ ] Test chain abstraction trigger
- [ ] Test intent trigger
- [ ] Verify code examples work
- [ ] Check all triggers activate

---

## Need Help?

See **[CLAUDE_CODE_TESTING.md](./CLAUDE_CODE_TESTING.md)** for:
- Detailed troubleshooting
- Alternative installation methods
- Plugin management commands
- Testing workflow
- Publishing process

Happy testing! 🎉
