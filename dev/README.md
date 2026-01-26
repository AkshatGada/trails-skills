# Development Files

This directory contains files for development, testing, and documentation that are not part of the published skill.

## Contents

### Testing Scripts
- **`setup-claude-test.sh`** - Automated setup for local Claude Code testing
- **`create-test-project.sh`** - Creates test projects with various frameworks
- **`test-npx.sh`** - Legacy npm testing script (no longer used)

### Documentation
- **`QUICK_START_CLAUDE.md`** - Quick start guide for local development
- **`CLAUDE_CODE_TESTING.md`** - Comprehensive testing and troubleshooting guide
- **`TEST_PROMPTS.md`** - Test prompts to verify skill functionality
- **`FEATURES.md`** - Internal feature documentation and capabilities
- **`ARCHITECTURE_COMPARISON.md`** - Comparison of different skill architectures

## Local Testing

The recommended workflow is:

```bash
# Run the setup script
./dev/setup-claude-test.sh

# This creates a test directory with marketplace symlinks
# Then in Claude Code:
/plugin marketplace add ./.claude-marketplace
/plugin install trails@./.claude-marketplace
```

## Not Published

Files in this directory are **not published** to users. They are:
- Excluded by `.npmignore` (if publishing to npm)
- Not referenced by `marketplace.json`
- For internal development only
