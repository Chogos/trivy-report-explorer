# Static Analysis Setup

This project includes comprehensive static analysis tools to ensure code quality and consistency.

## Tools Included

### ESLint

- **Version**: 8.57.1 (via react-scripts)
- **Configuration**: Custom configuration extending react-app with additional rules
- **Plugins**: TypeScript, React, React Hooks, JSX A11y, Import
- **Features**:
  - TypeScript support
  - React best practices
  - Accessibility checks
  - Import/export validation

### Prettier

- **Version**: 3.5.3
- **Configuration**: Standard formatting with custom rules
- **Features**:
  - Automatic code formatting
  - Consistent style across the codebase
  - Integration with ESLint

### Stylelint

- **Version**: 16.20.0
- **Configuration**: Standard CSS rules with Tailwind CSS support
- **Features**:
  - CSS/SCSS linting
  - Tailwind CSS class validation
  - Consistent styling rules

### TypeScript

- **Version**: 4.9.5
- **Configuration**: Strict mode with additional checks
- **Features**:
  - Strict type checking
  - No implicit any
  - Unused variables detection
  - Path mapping support

### Husky + lint-staged

- **Pre-commit hooks**: Automatic linting and formatting before commits
- **Features**:
  - Prevents committing code with linting errors
  - Automatic formatting on commit
  - Fast execution on only staged files

## Available Scripts

### Linting

```bash
npm run lint              # Run ESLint on src directory
npm run lint:fix          # Run ESLint with auto-fix
```

### Formatting

```bash
npm run format            # Format code with Prettier
npm run format:check      # Check if code is formatted
```

### Styling

```bash
npm run style             # Run Stylelint on CSS files
npm run style:fix         # Run Stylelint with auto-fix
```

### Type Checking

```bash
npm run type-check        # Run TypeScript compiler checks
```

### Combined Analysis

```bash
npm run analyze           # Run all static analysis tools
npm run fix-all           # Auto-fix all fixable issues
```

## IDE Integration

### VS Code

The project includes VS Code settings for:

- Format on save
- Auto-fix on save
- ESLint integration
- Stylelint integration
- Prettier as default formatter

### Recommended Extensions

- ESLint
- Prettier - Code formatter
- Stylelint
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Code Spell Checker

## Git Hooks

Pre-commit hooks are automatically set up to:

1. Run ESLint with auto-fix on staged JS/TS files
2. Run Stylelint with auto-fix on staged CSS files
3. Format all staged files with Prettier
4. Prevent commits if there are unfixable linting errors

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `.stylelintrc.json` - Stylelint configuration
- `tsconfig.json` - TypeScript configuration (enhanced with strict settings)
- `.lintstagedrc.json` - Lint-staged configuration
- `.vscode/settings.json` - VS Code workspace settings
- `.vscode/extensions.json` - Recommended VS Code extensions

## Best Practices

1. **Run analysis before committing**: Use `npm run analyze` to check all tools
2. **Fix issues automatically**: Use `npm run fix-all` to auto-fix most issues
3. **Enable format on save**: Configure your IDE to format code automatically
4. **Review linting errors**: Don't ignore ESLint errors, they often catch real issues
5. **Use TypeScript strictly**: Take advantage of the strict TypeScript configuration
6. **Consistent imports**: Use the configured path mapping for cleaner imports

## Troubleshooting

### ESLint Errors

- Run `npm run lint:fix` to auto-fix many issues
- Check the `.eslintrc.js` file for rule configuration
- Disable specific rules with `// eslint-disable-next-line rule-name` if necessary

### Prettier Conflicts

- Prettier and ESLint are configured to work together
- If conflicts arise, Prettier formatting takes precedence
- Run `npm run format` to apply Prettier formatting

### TypeScript Errors

- Use `npm run type-check` to see all TypeScript errors
- The configuration is strict, which helps catch errors early
- Consider the error messages carefully before using `any` types

### Pre-commit Hook Issues

- If hooks fail, fix the issues and commit again
- Use `git commit --no-verify` to bypass hooks (not recommended)
- Check `.lintstagedrc.json` for hook configuration
