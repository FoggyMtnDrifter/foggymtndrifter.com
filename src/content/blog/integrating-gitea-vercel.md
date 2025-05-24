---
title: "Integrating Gitea & Vercel"
description: "I share my experience integrating the open source tool Gitea and the hosting platform Vercel for streamlined code management and deployment."
pubDate: 2024-03-18
---

I'm a strong supporter of open source software and find that the tools I choose strongly influence my development workflow. For managing my code, I use [Gitea](https://gitea.com/?ref=foggymtndrifter.com). It's a fantastic, open source version control platform that's lightweight and offers the features and security I need. One of the aspects I love is [Gitea Actions](https://docs.gitea.com/usage/actions/overview?ref=foggymtndrifter.com), which makes it easy to streamline my deployment process to [Vercel](https://vercel.com/?ref=foggymtndrifter.com).

## Why Gitea?

Gitea excels as a self-hosted, open source version control platform. If you like having flexibility and control over your development setup, it's a compelling alternative to larger, corporate-owned code hosting solutions. With Gitea Actions (which are compatible with GitHub Actions), I can tap into the rich ecosystem of Actions from the broader development community without sacrificing the benefits of an independent, open source platform.

## Streamlining Deployment with Vercel

Let's talk about how I use Gitea Actions for deployment. Here's my `preview.yaml` workflow that enables streamlined feedback cycles. Whenever I open a pull request to the main branch, this workflow triggers a preview deployment on Vercel. This lets me test and gather feedback before merging changes:

```yaml
name: Vercel Preview Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

on:
  pull_request:
    branches:
      - main

jobs:
  Deploy-Preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v4
        with:
          node-version: ">=18.14.1"
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        id: deploy
        run: |
          echo "::group::Deploying"
          DEPLOY_OUTPUT=$(vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }} 2>&1)
          echo "$DEPLOY_OUTPUT"
          echo "::endgroup::"
          PREVIEW_URL=$(echo "$DEPLOY_OUTPUT" | grep -o 'Preview: https://[1]*' | awk '{print $2}')
          echo "PREVIEW_URL=$PREVIEW_URL" >> $GITHUB_ENV
          echo "::set-output name=preview_url::$PREVIEW_URL"
          if [[ -z "$PREVIEW_URL" ]]; then exit 1; fi
        continue-on-error: false
      - name: Comment on PR on Success
        if: ${{ success() && env.PREVIEW_URL }}
        uses: actions/github-script@v5
        with:
          script: |
            const previewUrl = '${{ env.PREVIEW_URL }}';
            github.rest.issues.createComment({
              issue_number: context.payload.pull_request.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `Preview deployment successful.\n\nView Preview: ${previewUrl}`
            });
      - name: Comment on PR on Error
        if: ${{ failure() }}
        uses: actions/github-script@v5
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.payload.pull_request.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: 'Deployment encountered an issue. Please refer to the workflow logs for more information.'
            });
```

## Production Deployments

Once the preview is approved, my `production.yaml` workflow deploys changes to my live site. It's very similar to the preview workflow, but tailored for the production environment:

```yaml
name: Vercel Production Deployment
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  push:
    branches:
      - main
jobs:
  Deploy-Production:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v4
        with:
          node-version: ">=18.14.1"
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Build Project Artifacts
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Open Source in Practice

These workflows show how I use open source tools to maintain a flexible and efficient approach to development. Gitea's adaptability and the seamless integration wtih GitHub Actions demonstrates the power of open source in creating custom workflows without sacrificing efficiency.

## My Thoughts on This Approach

Using Gitea Actions has beena great experience for streamlining my deployment process. It highlights how open source development enables customization and the ability to tap into community resources. If you're seeking a flexible development environment that emphasizes open source principles, Gitea and Vercel make a powerful combination.
