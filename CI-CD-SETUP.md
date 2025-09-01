# CI/CD Pipeline Setup Guide

This document explains how to set up and configure the CI/CD pipeline for the Community Goals application.

## Overview

The CI/CD pipeline includes:
- **Testing**: Runs on Node.js 18.x and 20.x
- **Security**: Vulnerability scanning with npm audit
- **Build**: Creates production builds
- **Deploy**: Automatic deployment to Vercel on main branch
- **Performance**: Lighthouse CI for performance monitoring

## Required GitHub Secrets

To enable the full CI/CD pipeline, configure these secrets in your GitHub repository:

### Supabase Configuration
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Vercel Deployment
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Lighthouse CI (Optional)
```
LHCI_GITHUB_APP_TOKEN=your_lighthouse_ci_token
```

## Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

### Getting Vercel Credentials

1. **Vercel Token**:
   - Go to [Vercel Account Settings](https://vercel.com/account/tokens)
   - Create a new token with appropriate permissions

2. **Vercel Org ID & Project ID**:
   - Run `vercel link` in your project directory
   - Check the `.vercel/project.json` file for the IDs

## Workflow Triggers

- **Push to main/develop**: Runs full pipeline including tests and deployment
- **Pull Requests to main**: Runs tests and security checks only
- **Manual trigger**: Available through GitHub Actions UI

## Pipeline Jobs

### 1. Test Job
- Installs dependencies
- Runs linting (when configured)
- Runs tests (when configured)
- Builds the application
- Uploads build artifacts

### 2. Deploy Job
- Only runs on main branch pushes
- Deploys to Vercel production
- Depends on successful test job

### 3. Security Job
- Runs npm audit for vulnerabilities
- Uses audit-ci for threshold management
- Runs independently of other jobs

### 4. Lighthouse Job
- Runs performance tests after deployment
- Generates accessibility and SEO reports
- Only runs on main branch deployments

## Configuration Files

- **`.github/workflows/ci-cd.yml`**: Main workflow configuration
- **`lighthouserc.json`**: Lighthouse CI settings
- **`audit-ci.json`**: Security audit thresholds

## Adding Tests and Linting

To enable proper testing and linting:

1. **Add ESLint**:
   ```bash
   npm install --save-dev eslint @eslint/js eslint-plugin-react
   ```

2. **Add Vitest for testing**:
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
   ```

3. **Update package.json scripts**:
   ```json
   {
     "scripts": {
       "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
       "test": "vitest",
       "test:ci": "vitest run"
     }
   }
   ```

## Monitoring and Notifications

- GitHub Actions will show build status on pull requests
- Failed builds will prevent merging (if branch protection is enabled)
- Lighthouse reports are available in the Actions artifacts
- Security vulnerabilities are reported in the workflow logs

## Troubleshooting

### Common Issues

1. **Build fails due to missing environment variables**:
   - Ensure all required secrets are configured
   - Check secret names match exactly

2. **Vercel deployment fails**:
   - Verify Vercel token has correct permissions
   - Ensure project is linked to the correct Vercel account

3. **Lighthouse CI fails**:
   - Check if the preview server starts correctly
   - Verify the URLs in `lighthouserc.json` are accessible

### Getting Help

- Check the Actions tab in your GitHub repository for detailed logs
- Review the workflow file for any configuration issues
- Ensure all dependencies are properly installed

## Next Steps

1. Configure all required secrets
2. Set up proper testing framework
3. Add ESLint configuration
4. Enable branch protection rules
5. Configure Slack/Discord notifications (optional)

The pipeline is designed to be extensible - you can add more jobs or modify existing ones based on your specific needs.