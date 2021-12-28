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
  "pruneStaleBranches": true,
  "username": "ivankatliarchuk",
  "repositories": repo,
  "prHourlyLimit": 50,
  "stabilityDays": 3,
  "semanticCommits": "enabled",
  "onboardingConfig": { "extends": ["github>ivankatliarchuk/.github"] },
  "major": { "automerge": false, "labels": ["dependencies", "major"] },
  "minor": { "automerge": false, "labels": ["dependencies", "minor"] },
  "patch": { "automerge": false },
  // cache +
  "cacheDir": process.env.RENOVATE_CACHE_DIR,
  "repositoryCache": (process.env.RENOVATE_CACHE_DIR ? true : false),
  // cache -
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
      "matchPackageNames": ["node"],
      "major": { "enabled": true },
      "separateMultipleMajor": true
    },
    {
      "labels": ["docker"],
      "automerge": false,
      "major": { "enabled": true },
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchDatasources": ["docker"],
      "separateMultipleMajor": true,
      "additionalBranchPrefix": "{{packageFileDir}}-"
    },
    {
      "automerge": false,
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "separateMultipleMajor": true,
      "matchDatasources": ["terraform"],
      "additionalBranchPrefix": "{{packageFileDir}}-",
      "matchManagers": ["terraform"],
      "matchPackagePatterns": [".*"]
    },
    {
      "commitMessageTopic": "Helm chart {{depName}}",
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchDatasources": ["helm"],
      "groupName": "helm"
    }
  ],
  "regexManagers": [
  ]
};

// cache
// https://docs.renovatebot.com/self-hosted-configuration/#cachedir
// "cacheDir": "/my-own-different-cache-folder"
