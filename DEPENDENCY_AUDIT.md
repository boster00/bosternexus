# Dependency Audit Guide

This document outlines the process for auditing dependencies for security vulnerabilities.

## Quick Audit Commands

### Using npm audit
```bash
# Root workspace
npm audit

# Specific workspace
npm audit --workspace=apps/web
npm audit --workspace=apps/api
npm audit --workspace=packages/foundation
npm audit --workspace=packages/shared
```

### Using pnpm audit (if using pnpm)
```bash
pnpm audit
```

### List all dependencies
```bash
# Root
npm ls --depth=0

# All workspaces
npm ls --workspaces --depth=0
```

## Automated Auditing

### GitHub Dependabot (Recommended)

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-team"
    labels:
      - "dependencies"
      - "security"
```

### CI/CD Integration

Add to your CI pipeline:

```bash
# Fail build on high/critical vulnerabilities
npm audit --audit-level=high
```

## Manual Review Checklist

1. **Regular Updates**: Review and update dependencies monthly
2. **Security Advisories**: Subscribe to:
   - [npm Security Advisories](https://github.com/advisories)
   - [Snyk Vulnerability DB](https://snyk.io/vuln)
   - Framework-specific security pages (Next.js, NestJS)
3. **Lock Files**: Always commit `package-lock.json` or `pnpm-lock.yaml`
4. **Version Pinning**: Consider pinning exact versions for critical dependencies

## Critical Dependencies to Monitor

- `next` - Next.js framework
- `@nestjs/*` - NestJS framework packages
- `react`, `react-dom` - React core
- `zod` - Validation library (security-critical)
- `express` (via NestJS) - HTTP server

## Remediation

When vulnerabilities are found:

1. **Update**: `npm update <package>` or `npm install <package>@latest`
2. **Test**: Run full test suite
3. **Review**: Check changelog for breaking changes
4. **Commit**: Commit lock file changes

## Container Security

For Docker images:

```bash
# Scan images for vulnerabilities
docker scan <image-name>
```

Consider using minimal base images (Alpine) and multi-stage builds.

