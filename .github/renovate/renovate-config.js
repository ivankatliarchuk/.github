'use strict';
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/
// todo: https://github.com/marketplace/actions/envsubst-action

const dry_run = process.env.DRY_RUN || false
console.log(`DRY_RUN mode: ${dry_run}`);

if (!process.env.DOCKER_HUB_PASSWORD) {
  throw new Error('DOCKER_HUB_PASSWORD must be set');
}

const cfg = {
  "asignees": [
    "ivankatliarchuk"
  ],
  "labels": ["renovate", "dependencies", ":robot: bot", ':game_die: dependencies'],
  "logLevel": "info",
  "gitAuthor": 'Renovate Bot <bot@renovateapp.com>',
  "dashboardTitle": 'Dependency Dashboard self-hosted',
  "username": "ivankatliarchuk",
  "branchName": 'github-renovate',
  "baseBranches": ['master', 'main'],
  'timezone': "Europe/London"
}

const repo1 = [
  'ivankatliarchuk/.github',
  'ivankatliarchuk/ivankatliarchuk.github.io',
  'ivankatliarchuk/knowledge-base',
  'ivankatliarchuk/dotfiles',
  'cloudkats/docker-tools'
]

const repo = [
  'cloudkats/docker-tools'
]

module.exports = {
  "extends": [
    "config:base",
    ":disableRateLimiting",
    ":semanticCommits",
    ":ignoreUnstable",
    ":rebaseStalePrs"
  ],
  "assigneesFromCodeOwners": true,
  "assignees": ["ivankatliarchuk"],
  "labels": ["renovate", "dependencies", "automated"],
  "dependencyDashboardTitle": "Dependency Dashboard self-hosted",
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "onboarding": true,
  "platform": "github",
  "dryRun": false,
  "printConfig": false,
  "pruneStaleBranches": false,
  "username": "ivankatliarchuk",
  "repositories": repo,
  "prHourlyLimit": 50,
  "stabilityDays": 3,
  "semanticCommits": "enabled",
  "onboardingConfig": { "extends": ["github>ivankatliarchuk/.github"] },
  "major": { "automerge": false, "labels": ["dependencies", "major"] },
  "minor": { "automerge": false, "labels": ["dependencies", "minor"] },
  "patch": { "automerge": false },
  "hostRules": [
    {
      "hostType": 'docker',
      "username": 'cloudkats',
      "password": process.env.DOCKER_HUB_PASSWORD,
    },
  ],
  "packageRules": [
    { "labels": ["js"], "matchLanguages": ["js"] },
    { "labels": ["python"], "matchLanguages": ["python"] },
    {
      "description": "Disables the creation of branches/PRs for any minor/patch updates etc. of python version",
      "matchPaths": [".+\.python-version"],
      "matchUpdateTypes": ["minor", "major"],
      "enabled": false
    },
    {
      matchPackageNames: ['node'],
      major: {
        enabled: true
      },
      separateMultipleMajor: true,
    },
    // {
    //   "automerge": false,
    //   "ignoreTests": true,
    //   "matchDatasources": ["docker"],
    //   "matchUpdateTypes": ["patch", "minor"],
    //   "groupName": "docker (non-major)"
    // },
    {
      "automerge": false,
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchDatasources": ["docker"],
      "separateMultipleMajor": true,
    },
    // {
    //   "separateMinorPatch": true,
    //   "matchDatasources": ["terraform"],
    //   "matchUpdateTypes": ["patch", "minor"],
    //   "groupName": "terraform (non-major)"
    // },
    // {
    //   "matchDatasources": ["terraform"],
    //   "matchUpdateTypes": ["major"],
    //   "separateMultipleMajor": true,
    //   "groupName": "terraform (major)"
    // },
    // {
    //   "commitMessageTopic": "Helm chart {{depName}}",
    //   "separateMinorPatch": true,
    //   "matchDatasources": ["helm"],
    //   "groupName": "helm"
    // }
  ],
  "regexManagers": [
  ]
};
