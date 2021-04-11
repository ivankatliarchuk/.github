'use strict';
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/
// todo: https://github.com/marketplace/actions/envsubst-action

const dry_run = process.env.DRY_RUN || false
console.log(`DRY_RUN mode: ${dry_run}`);

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
  "baseBranches": ['master', 'main'],
  'timezone': "Europe/London"
}

const repo = [
  'ivankatliarchuk/.github',
  'ivankatliarchuk/ivankatliarchuk.github.io',
  'ivankatliarchuk/knowledge-base',
  'ivankatliarchuk/dotfiles'
]

module.exports = {
  extends: [
    'config:base',
    ":disableRateLimiting"
  ],
  reviewers: ctx.asignees
  reviewersFromCodeOwners: true,
  assignees: cfg.asignees,
  logLevel: cfg.logLevel,
  labels: cfg.labels,
  dependencyDashboardTitle: cfg.dashboardTitle,
  commitMessagePrefix: "⬆️",
  gitAuthor: cfg.gitAuthor,
  onboarding: true,
  platform: 'github',
  dryRun: dry_run,
  printConfig: false,
  pruneStaleBranches: false,
  username: cfg.username,
  repositories: repo,
  prHourlyLimit: 20,
  stabilityDays: 3,
  semanticCommits: "enabled",
  onboardingConfig: {
    extends: ["github>ivankatliarchuk/.github"]
  },
  // Ensure that major is never automerged
  major: { "automerge": false, "labels": ["dependencies", "major"] },
  minor: { "automerge": false, "labels": ["dependencies", "minor"] },
  patch: { "automerge": false },
  packageRules: [
    { "updateTypes": ["major"], "labels": ["major"] },
    { "updateTypes": ["minor"], "labels": ["minor"], "groupName": "devDependencies(non-major)" },
    { "updateTypes": ["patch", "digest", "bump"], "labels": ["patch"], "groupName": "devDependencies(non-major)" },
    { "languages": ["php"], "labels": ["php"] },
    { "languages": ["js"], "labels": ["js"] },
    { "languages": ["python"], "labels": ["python"] },
    { "packagePatterns": ["*"] },
    { "depTypeList": ["dependencies"], "groupName": "dependencies" },
    { "depTypeList": ["devDependencies"], "groupName": "devDependencies" },
    { "depTypeList": ["devDependencies(non-major)"], "groupName": "devDependencies(non-major)" },
    {
      "automerge": false,
      "requiredStatusChecks": null,
      "matchDatasources": ["docker"],
      "matchUpdateTypes": ["patch"],
      "groupName": "devDependencies(non-major)"
    },
    {
      "commitMessageTopic": "Helm chart {{depName}}",
      "separateMinorPatch": true,
      "matchDatasources": ["helm"],
      "groupName": "helm"
    },
    {
      "labels": ["renovate/image-release", "dependency/major"],
      "enabled": true,
      "matchDatasources": ["docker"],
      "matchUpdateTypes": ["major"],
      "groupName": "docker"
    },
    {
      'packageNames': ["node", "@types/node"],
      'allowedVersions': "^12.0.0",
      "groupName": "node"
    },
    {
      'packageNames': ["npm"],
      'allowedVersions': "^6.0.0",
      "groupName": "node"
    },
    {
      "packageNames": ["actions/*"],
      "versioning": "regex:^v(?<major>\\d+)(\\.(?<minor>\\d+))?(\\.(?<patch>\\d+))?",
      "groupName": "actions"
    },
    { 'managers': ["github-actions"], 'enabled': true, "groupName": "actions" },
    {
      'datasources': 'go',
      'managers': ['gomod'],
      'updateTypes': ['pin', 'digest'],
      'versioning': 'semver'
    },
    {
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["patch", "minor"],
      "groupName": "devDependencies (non-major)"
    }
  ],
  "regexManagers": [
    {
      "fileMatch": ["\\.yaml$"],
      "matchStrings": [
        "registryUrl=(?<registryUrl>.*?)\n *chart: (?<depName>.*?)\n *version: (?<currentValue>.*)\n"
      ],
      "datasourceTemplate": "helm"
    },
    {
      "fileMatch": ["sample.yml"],
      "matchStrings": ["version: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": "github-tags"
    },
    {
      "fileMatch": ["versions.yml"],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\n.*?_version: (?<currentValue>.*)\n"
      ],
      "versioningTemplate": "{{#if versioning}}{{versioning}}{{else}}semver{{/if}}"
    },
    {
      "fileMatch": [".github/workflows/blank.yml", ".github/workflows/takeover-output.yml"],
      "matchStrings": ["uses: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": "github-releases"
    }
  ]
};
