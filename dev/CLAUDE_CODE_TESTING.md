# Testing Trails Skill Locally in Claude Code

This guide shows you how to test the Trails skill in Claude Code using a local marketplace before publishing.

## Quick Start

### Option 1: Direct Installation (Simplest)

From your skills directory:

```bash
cd /Users/jameslawton/Coding/trails-main/skills
node bin/install.js install --claude
```

This copies the skill to `.claude/skills/trails/` in your current directory.

Then:
1. Open this directory in Claude Code
2. Restart Claude Code completely
3. Test with: "I want to integrate trails into my app"

---

### Option 2: Local Marketplace (Recommended for Testing)

This method simulates the real marketplace experience.

#### Step 1: Check if `.claude-plugin` directory exists

```bash
ls -la /Users/jameslawton/Coding/trails-main/skills/.claude-plugin/
```

You should see:
- `plugin.json`
- `marketplace.json`

#### Step 2: Create a test project

```bash
mkdir -p ~/trails-claude-test
cd ~/trails-claude-test
```

#### Step 3: Create local marketplace structure

```bash
# Create marketplace directory
mkdir -p .claude-marketplace

# Symlink your skills directory
ln -s /Users/jameslawton/Coding/trails-main/skills .claude-marketplace/trails-skills
```

Your structure should look like:
```
~/trails-claude-test/
└── .claude-marketplace/
    └── trails-skills -> /Users/jameslawton/Coding/trails-main/skills
```

#### Step 4: Open in Claude Code

```bash
code ~/trails-claude-test  # or however you launch Claude Code
```

#### Step 5: Add Local Marketplace

In Claude Code, run:

```
/plugin marketplace add ./.claude-marketplace
```

You should see confirmation that the marketplace was added.

#### Step 6: List Available Plugins

```
/plugin menu
```

Or:

```
/plugin marketplace list ./.claude-marketplace
```

You should see the Trails skill listed.

#### Step 7: Install the Plugin

```
/plugin install trails@./.claude-marketplace
```

Or if prompted in the menu, select the trails skill to install.

#### Step 8: Restart Claude Code

Completely restart Claude Code (not just reload window).

#### Step 9: Test the Skill

Try these prompts:

```
I want to integrate trails into my Next.js app
```

```
I need to accept payments in any token
```

```
How do I implement chain abstraction?
```

The skill should activate and provide integration guidance.

---

## Troubleshooting

### Skill Doesn't Activate

**Check installation:**
```bash
# If using Option 1
ls -la .claude/skills/trails/

# Should show: SKILL.md, docs/, snippets/
```

**Verify plugin is loaded:**
```
/plugin list
```

You should see "trails" in the list of active plugins.

**Try explicit mention:**
```
Using the trails skill, help me integrate cross-chain payments
```

**Check Claude Code logs:**
Look for any errors related to plugin loading.

### Marketplace Not Found

Make sure the symlink is correct:
```bash
ls -la .claude-marketplace/trails-skills/

# Should show files from your skills directory
```

If broken, recreate the symlink:
```bash
rm .claude-marketplace/trails-skills
ln -s /Users/jameslawton/Coding/trails-main/skills .claude-marketplace/trails-skills
```

### Plugin Shows but Won't Install

Check the `.claude-plugin/plugin.json` file:
```bash
cat /Users/jameslawton/Coding/trails-main/skills/.claude-plugin/plugin.json
```

Make sure it has valid JSON and required fields.

---

## Testing Workflow

### 1. Make Changes to SKILL.md

Edit your skill file:
```bash
code /Users/jameslawton/Coding/trails-main/skills/trails/SKILL.md
```

### 2. Reload the Plugin

In Claude Code:
```
/plugin reload trails
```

Or reinstall:
```
/plugin uninstall trails
/plugin install trails@./.claude-marketplace
```

### 3. Test Changes

Try your test prompts to verify the changes work.

### 4. Iterate

Repeat steps 1-3 until satisfied.

---

## Alternative: Use npx with Local Package

If you want to test the `npx` installer flow:

```bash
# Create a tarball
cd /Users/jameslawton/Coding/trails-main/skills
npm pack

# This creates: 0xtrails-skills-1.0.0.tgz

# In your test directory
cd ~/trails-claude-test
npm install /Users/jameslawton/Coding/trails-main/skills/0xtrails-skills-1.0.0.tgz

# Run the installer
npx @0xtrails/skills install --claude
```

---

## Comparing to Published Version

Once you've published to npm, you can test both versions:

### Local Development Version
```
/plugin install trails@./.claude-marketplace
```

### Published npm Version
```
/plugin marketplace add 0xtrails/skills
/plugin install trails@0xtrails/skills
```

This lets you compare behavior before updating the published version.

---

## Test Cases for Claude Code

After installation, verify these work:

### ✅ Basic Trigger
```
I want to integrate trails into my app
```
**Expected:** Skill activates, asks clarifying questions

### ✅ Payment Trigger
```
I need to accept payments in any token
```
**Expected:** Skill activates, recommends Pay mode widget

### ✅ Chain Abstraction Trigger
```
How do I implement chain abstraction?
```
**Expected:** Skill activates, explains Trails chain abstraction

### ✅ Intent Trigger
```
I need to handle cross-chain intents
```
**Expected:** Skill activates, explains intent-based architecture

### ✅ x402 Trigger
```
Add x402 payment support
```
**Expected:** Skill activates, shows payment integration

### ✅ DeFi Trigger
```
I want users to deposit into my vault from any chain
```
**Expected:** Skill activates, recommends Fund mode with calldata

### ✅ Onramp Trigger
```
I need to add an onramp for crypto payments
```
**Expected:** Skill activates, explains payment options

---

## Quick Reference Commands

### Plugin Management
```bash
/plugin list                              # List installed plugins
/plugin menu                              # Browse marketplace
/plugin marketplace list <path>           # List plugins in marketplace
/plugin marketplace add <path>            # Add marketplace
/plugin marketplace remove <name>         # Remove marketplace
/plugin install <name>@<marketplace>      # Install plugin
/plugin uninstall <name>                  # Uninstall plugin
/plugin reload <name>                     # Reload plugin
```

### Testing Commands
```bash
# Install skill directly (no marketplace)
node bin/install.js install --claude

# Check installation
ls -la .claude/skills/trails/

# Create local marketplace
ln -s /Users/jameslawton/Coding/trails-main/skills .claude-marketplace/trails-skills

# Add marketplace in Claude Code
/plugin marketplace add ./.claude-marketplace

# Install from local marketplace
/plugin install trails@./.claude-marketplace
```

---

## File Structure for Claude Code

### Required Files
```
skills/
├── .claude-plugin/
│   ├── plugin.json          # Plugin metadata (required)
│   └── marketplace.json     # Marketplace definition (for publishing)
├── trails/
│   ├── SKILL.md            # Main skill file (Claude reads this)
│   ├── docs/               # Documentation
│   └── snippets/           # Code examples
└── bin/
    └── install.js          # Installation script
```

### plugin.json Format
```json
{
  "name": "trails",
  "version": "1.0.0",
  "description": "Integrate Trails cross-chain infrastructure",
  "author": "0xtrails",
  "repository": "https://github.com/0xtrails/skills",
  "skill_path": "trails/SKILL.md"
}
```

---

## Benefits of Local Marketplace Testing

### Pros
✅ Simulates real marketplace experience
✅ Can test plugin installation flow
✅ Easy to update and reload
✅ Test multiple versions side-by-side
✅ No need to publish to test

### Cons
❌ Requires symlink setup
❌ More complex than direct installation
❌ Need to restart Claude Code for changes

### When to Use Each Method

**Direct Installation** (`node bin/install.js install --claude`)
- Quick testing
- Rapid iteration
- Development workflow

**Local Marketplace**
- Testing installation flow
- Verifying plugin.json
- Pre-publish validation
- Testing marketplace behavior

---

## Publishing After Testing

Once you're satisfied with local testing:

### 1. Update version
```bash
cd /Users/jameslawton/Coding/trails-main/skills
npm version patch  # or minor, major
```

### 2. Publish to npm
```bash
npm publish --access public
```

### 3. Test published version
```bash
# In a new directory
mkdir ~/test-published
cd ~/test-published

# Install from npm
npx @0xtrails/skills install --claude
```

### 4. Add to Claude Plugin Marketplace (GitHub)

Push to GitHub:
```bash
git add .
git commit -m "Release v1.0.0"
git push origin main
git tag v1.0.0
git push --tags
```

Users can then:
```
/plugin marketplace add 0xtrails/skills
/plugin install trails@0xtrails/skills
```

---

## Testing Checklist

Before publishing, verify:

- [ ] Skill activates on all trigger keywords
- [ ] Recommends correct integration mode
- [ ] Code examples are syntactically correct
- [ ] Package names are correct
- [ ] Environment variables are properly named
- [ ] Provider hierarchy is explained correctly
- [ ] Calldata encoding examples work
- [ ] Trade types are explained correctly
- [ ] References documentation appropriately
- [ ] Handles unclear context gracefully
- [ ] Works in both Cursor and Claude Code

---

## Need Help?

If you encounter issues:

1. **Check plugin.json** - Ensure valid JSON and required fields
2. **Verify symlink** - Make sure it points to correct directory
3. **Restart Claude Code** - Completely quit and reopen
4. **Check logs** - Look for plugin loading errors
5. **Test in Cursor first** - Easier to debug there

---

## Summary

**Quickest Method:**
```bash
node bin/install.js install --claude
```

**Best for Testing:**
```bash
ln -s /Users/jameslawton/Coding/trails-main/skills .claude-marketplace/trails-skills
# Then in Claude Code: /plugin marketplace add ./.claude-marketplace
```

**Ready to Publish:**
```bash
npm publish --access public
```

Happy testing! 🚀
