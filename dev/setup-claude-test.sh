#!/bin/bash
# Setup script for testing Trails skill locally in Claude Code

set -e

echo "🧪 Trails Skill - Claude Code Local Testing Setup"
echo ""

# Get the absolute path to the skills directory
SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
echo "📦 Skills directory: $SKILLS_DIR"
echo ""

# Prompt for test directory location
read -p "Where should we create the test directory? (default: ~/trails-claude-test): " TEST_DIR
TEST_DIR=${TEST_DIR:-~/trails-claude-test}

# Expand ~ to full path
TEST_DIR="${TEST_DIR/#\~/$HOME}"

echo ""
echo "📁 Creating test directory: $TEST_DIR"
mkdir -p "$TEST_DIR"

cd "$TEST_DIR"

# Create marketplace structure
echo "🔗 Setting up local marketplace..."
mkdir -p .claude-marketplace

# Create symlink
ln -sf "$SKILLS_DIR" .claude-marketplace/trails-skills

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Open this directory in Claude Code:"
echo "   cd $TEST_DIR"
echo "   # Launch Claude Code here"
echo ""
echo "2. In Claude Code, add the local marketplace:"
echo "   /plugin marketplace add ./.claude-marketplace"
echo ""
echo "3. List available plugins:"
echo "   /plugin menu"
echo ""
echo "4. Install the Trails skill:"
echo "   /plugin install trails@./.claude-marketplace"
echo ""
echo "5. Restart Claude Code completely"
echo ""
echo "6. Test with a prompt:"
echo "   \"I want to integrate trails into my app\""
echo ""
echo "📍 Test directory location: $TEST_DIR"
echo ""
echo "To verify the symlink:"
echo "   ls -la $TEST_DIR/.claude-marketplace/"
echo ""
echo "To make changes to the skill:"
echo "   1. Edit files in: $SKILLS_DIR/trails/"
echo "   2. In Claude Code: /plugin reload trails"
echo "   3. Test your changes"
echo ""
echo "Happy testing! 🚀"
