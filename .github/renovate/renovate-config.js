'use strict';
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/
// todo: https://github.com/marketplace/actions/envsubst-action

const dry_run = process.env.DRY_RUN || false
console.log(`DRY_RUN mode: ${dry_run}`);

if (!process.env.DOCKER_HUB_PASSWORD) {
  throw new Error('DOCKER_HUB_PASSWORD must be set');
}

const repo1 = [
  'ivankatliarchuk/ivankatliarchuk.github.io',
  'ivankatliarchuk/knowledge-base',
  'ivankatliarchuk/dotfiles',
]

const repo = [
  'ivankatliarchuk/.github',
  'cloudkats/docker-tools'
]

module.exports = {
  "platform": "github",
  "extends": [
    "config:base",
    ":disableRateLimiting",
    ":semanticCommits",
    ":ignoreUnstable",
    ":rebaseStalePrs"
  ],
  "logLevel": "debug",
  "assigneesFromCodeOwners": true,
  "assignees": ["ivankatliarchuk"],
  "labels": ["renovate", "dependencies", "automated"],
  "dependencyDashboardTitle": "Dependency Dashboard self-hosted",
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "onboarding": true,
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
    },
    {
      "groupName": "actions",
      "matchPackageNames": ["actions/*"],
      "matchManagers": ["github-actions"],
      "additionalBranchPrefix": "{{packageFileDir}}-",
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "separateMultipleMajor": true
    }
  ],
  "regexManagers": [
    {
      "fileMatch": [
        "Dockerfile$",
        "^Dockerfile$",
        "(^|/|\\.)Dockerfile$",
        "(^|/)Dockerfile\\.[^/]*$"
      ],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\sENV .*?_VERSION=(?<currentValue>.*)\\s"
      ],
      "datasourceTemplate": "github-releases",
      "extractVersionTemplate": "^v?(?<version>.*)$"
    },
    {
      "fileMatch": [
        "Dockerfile$",
        "^Dockerfile$",
        "(^|/|\\.)Dockerfile$",
        "(^|/)Dockerfile\\.[^/]*$"
      ],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\sARG .*?_VERSION=(?<currentValue>.*)\\s"
      ],
      "datasourceTemplate": "github-releases",
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}",
      "extractVersionTemplate": "^v?(?<version>.*)$"
    },
    {
      "fileMatch": [
        "Dockerfile$",
        "(^|/|\\.)Dockerfile$",
        "(^|/)Dockerfile\\.[^/]*$"
      ],
      "matchStrings": [
        "ARG IMAGE=(?<depName>.*?):(?<currentValue>.*?)@(?<currentDigest>sha256:[a-f0-9]+)s"
      ],
      "datasourceTemplate": "docker"
    },
    {
      // TODO: validate why is not working correctly
      "fileMatch": [
        "(^workflow-templates|\.github\/workflows)\/[^/]+\.ya?ml$",
        "(^workflow-templates|\.github\/workflows)\/[^/]+\.ya?ml$(^|\/)action\.ya?ml$"
      ],
      "matchStrings": ["uses: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": 'github-tags'
    },
  ]
};
