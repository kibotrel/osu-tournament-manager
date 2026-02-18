---
name: github-cli-operations
description: Essential patterns for GitHub CLI operations including PR and issue management with best practices for interactive workflows
---

# What I Do

- Provide standardized patterns for GitHub CLI (`gh`) command usage and error handling
- Guide interactive workflows for fetching, reading, and updating PR/issue content
- Ensure consistent behavior when working with GitHub resources
- Help with preview/approval patterns before making changes to GitHub resources

# When to Use Me

Use this skill whenever you're building agents that:

- Fetch PR or issue details using `gh pr view` or `gh issue view`
- Generate diffs using `gh pr diff`
- Update PR or issue descriptions using `gh pr edit` or `gh issue edit`
- Need interactive question flows that gather user input before GitHub operations
- Must show previews and request user approval before posting changes to GitHub
- Handle errors from GitHub CLI operations gracefully

# GitHub CLI Patterns

## Core Command Usage

### PR Operations

- **View PR Details:** `gh pr view <number>`
  - Returns PR title, description, state, commits, and metadata
  - Use this to fetch initial PR context
  - Example: `gh pr view 123` fetches PR #123 details

- **View PR Diff:** `gh pr diff <number>`
  - Returns complete diff of all changes in the PR
  - Parse output to identify changed files and areas of modification
  - Example: `gh pr diff 123` shows all code changes in PR #123

- **Edit PR Description:** `gh pr edit <number> --body "..."`
  - Updates the PR description body
  - Always show complete preview before executing
  - Wrap long descriptions properly to avoid formatting issues
  - Example: `gh pr edit 123 --body "New description here"`

### Issue Operations

- **View Issue Details:** `gh issue view <number>`
  - Returns issue title, description, state, labels, and metadata
  - Use this to fetch issue content for analysis
  - Extract sections like Description, Specification, Design from body content
  - Example: `gh issue view 456` fetches issue #456 details

- **Edit Issue Description:** `gh issue edit <number> --body "..."`
  - Updates the issue body
  - Always validate template compliance before updating
  - Ensure all required sections are present
  - Example: `gh issue edit 456 --body "Updated issue body"`

## Interactive Workflow Pattern

When working with GitHub resources that require user input before modification:

1. **Fetch Initial Content**
   - Use `gh pr view <number>` or `gh issue view <number>`
   - Store the retrieved content for analysis

2. **Question Flow (One at a Time)**
   - Ask clarifying questions one at a time
   - Wait for user response before asking next question
   - Never ask multiple questions in a single message
   - This allows for natural conversation and better user input quality

3. **Analyze & Process**
   - Parse the user's responses
   - Combine with fetched GitHub content
   - Generate or structure the output based on requirements

4. **Preview Before Posting**
   - Show the complete formatted output as it will appear on GitHub
   - Include all sections, formatting, and markdown
   - Make it visually clear what will be posted
   - Ask explicit user approval: "Should I post this to the PR/issue?"

5. **Update on GitHub**
   - Execute the gh CLI edit command only after explicit approval
   - Include the `--body "..."` parameter with the complete formatted content
   - Confirm successful update with user

## Error Handling

### gh CLI Errors

- **Command Failures:** Report the error clearly to user
- **Not Stopping Automatically:** When an error occurs, stop and ask user for guidance
- **Never Silently Fail:** Always inform user if an operation didn't complete as expected
- **Provide Guidance:** If the error is due to missing PR/issue number or format issues, guide user on how to fix it

Example error response:

```
Failed to view PR #999: The PR doesn't exist or you don't have access.
Please verify:
- The PR number is correct
- You're in the right repository
- Your GitHub token has necessary permissions
```

### Input Validation

- **PR/Issue References:** Accept both `#123` and `https://github.com/owner/repo/pull/123` formats
- **Extract Numbers:** Parse the numeric ID from either format
- **Validate Before Use:** Confirm the reference is valid before executing commands

## GitHub Content Parsing

### Extracting Sections from Issue/PR Bodies

When reading issue or PR bodies:

- Issues often have structured sections like:
  - `:book: Description`
  - `📝 Specification`
  - `:framed_picture: Design`
  - `:books: Additional information`

- Identify these sections by their markdown headers
- Extract content between section headers
- Detect placeholder content (e.g., default callouts indicating unfilled sections)

### Detecting Empty or Placeholder Sections

GitHub Flavored Markdown callouts are used as placeholders:

```markdown
> [!NOTE]
> This section requires user input
```

- If a section contains only this callout, it's empty/unfilled
- If a section has user content after removing the callout, it's filled
- Use this to determine which sections need work

## Preview Formatting Best Practices

When showing previews of content to be posted:

- Use markdown formatting that matches what will appear on GitHub
- Show section headers clearly
- Include all formatting (backticks, bold, lists, etc.)
- Make checkbox items visible with `- [ ]` or `- [x]` syntax
- Include callouts using proper GitHub Flavored Markdown syntax:
  ```markdown
  > [!NOTE]
  > Your note content here
  ```

## Command Syntax Reference

| Operation    | Command                               | Use Case                      |
| ------------ | ------------------------------------- | ----------------------------- |
| View PR      | `gh pr view <number>`                 | Fetch PR details and metadata |
| View PR Diff | `gh pr diff <number>`                 | Get all code changes in PR    |
| Edit PR      | `gh pr edit <number> --body "..."`    | Update PR description         |
| View Issue   | `gh issue view <number>`              | Fetch issue details           |
| Edit Issue   | `gh issue edit <number> --body "..."` | Update issue body             |

## Important Constraints

- **No Other Bash Commands:** When using `gh` CLI as the only bash tool, no other bash commands are permitted
- **Stdin Handling:** Some `gh` commands support stdin for piping; prefer explicit `--body` parameters for clarity
- **Authentication:** `gh` CLI must be authenticated; assume user has valid GitHub credentials
- **Repository Context:** Commands assume you're in the correct repository context
