'use strict';
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/
// todo: https://github.com/marketplace/actions/envsubst-action
const cfg = {
  "asignees": [
    "ivankatliarchuk"
  ],
  "labels": ["renovate", "dependencies", "automated"],
  "logLevel": "info",
  "gitAuthor": 'Renovate Bot <bot@renovateapp.com>',
  "dashboardTitle": 'Dependency Dashboard self-hosted',
  "username": "ivankatliarchuk",
  "branchName": 'github-renovate',
  "baseBranches": ['master','main']
}

const repo = [
  "ivankatliarchuk/.github",
  'ivankatliarchuk/ivankatliarchuk.github.io',
  'ivankatliarchuk/knowledge-base',
  'ivankatliarchuk/dotfiles'
]

module.exports = {
  extends: [
    'config:base',
    "github>renovatebot/.github",
    ":disableRateLimiting"
  ],
  assignees: cfg.asignees,
  logLevel: cfg.logLevel,
  labels: cfg.labels,
  dependencyDashboardTitle: cfg.dashboardTitle,
  gitAuthor: cfg.gitAuthor,
  onboarding: true,
  platform: 'github',
  dryRun: false,
  printConfig: true,
  username: cfg.username,
  repositories: repo,
  baseBranches: cfg.baseBranches
};
