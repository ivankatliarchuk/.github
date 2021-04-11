'use strict';
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/
// todo: https://github.com/marketplace/actions/envsubst-action
const cfg = {
  "asignees": [
    "ivankatliarchuk"
  ],
  "labels": ["renovate", "dependencies", "automated"],
  "logLevel": "debug",
  "gitAuthor": 'Renovate Bot <bot@renovateapp.com>',
  "dashboardTitle": 'Dependency Dashboard self-hosted',
  "username": "ivankatliarchuk",
  "branchName": 'github-renovate',
  "baseBranches": ['master', 'main'],
  timezone: "Europe/London"
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
    ":disableRateLimiting",
    ':gitSignOff',
    ':docker'
  ],
  assignees: cfg.asignees,
  logLevel: cfg.logLevel,
  labels: cfg.labels,
  dependencyDashboardTitle: cfg.dashboardTitle,
  commitMessagePrefix: "⬆️",
  gitAuthor: cfg.gitAuthor,
  onboarding: true,
  platform: 'github',
  dryRun: false,
  printConfig: true,
  username: cfg.username,
  repositories: repo,
  baseBranches: cfg.baseBranches,
  stabilityDays: 3,
  semanticCommits: "enabled",
  requireConfig: false,
  timezone: ctx.timezone,
  onboardingConfig: {
    extends: ["github>ivankatliarchuk/.github"]
  },
  // Ensure that major is never automerged
  major: { "automerge": false, "labels": ["dependencies", "major"] },
  minor: { "automerge": true, "labels": ["dependencies", "minor"] },
  patch: { "automerge": true },

  packageRules: [
    { "updateTypes": ["major"], "labels": ["major"] },
    { "updateTypes": ["minor"], "labels": ["minor"] },
    { "updateTypes": ["patch", "digest", "bump"], "labels": ["patch"] },
    { "languages": ["php"], "labels": ["Lang PHP"] },
    { "languages": ["js"], "labels": ["Lang JS"] },
    { "languages": ["python"], "labels": ["Lang Python"] },
    { "packagePatterns": ["*"] },
    { "depTypeList": ["dependencies"], "groupName": "dependencies" },
    { "depTypeList": ["devDependencies"], "groupName": "devDependencies" },
    {
      "automerge": false,
      "requiredStatusChecks": null,
      "matchDatasources": ["docker"],
      "matchUpdateTypes": ["patch"]
    },
    {
      "commitMessageTopic": "Helm chart {{depName}}",
      "separateMinorPatch": true,
      "matchDatasources": ["helm"]
    },
    {
      "labels": ["renovate/image-release", "dependency/major"],
      "enabled": true,
      "matchDatasources": ["docker"],
      "matchUpdateTypes": ["major"]
    },
    {
      packageNames: ["node", "@types/node"],
      allowedVersions: "^12.0.0",
    },
    {
      packageNames: ["npm"],
      allowedVersions: "^6.0.0",
    },
    {
      "packagePatterns": ["eslint"],
      "masterIssueApproval": true
    }
  ],
  "regexManagers": [
    {
      "fileMatch": ["\\.yaml$"],
      "matchStrings": [
        "registryUrl=(?<registryUrl>.*?)\n *chart: (?<depName>.*?)\n *version: (?<currentValue>.*)\n"
      ],
      "datasourceTemplate": "helm"
    }
  ]
};
