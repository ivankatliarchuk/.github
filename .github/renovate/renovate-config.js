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
  "labels": ["renovate", "dependencies", ":robot: bot", ':game_die: dependencies'],
  "logLevel": "info",
  "gitAuthor": 'Renovate Bot <bot@renovateapp.com>',
  "dashboardTitle": 'Dependency Dashboard self-hosted',
  "username": "ivankatliarchuk",
  "branchName": 'github-renovate',
  "baseBranches": ['master', 'main'],
  'timezone': "Europe/London"
}

const repo = [
  // 'ivankatliarchuk/.github',
  // 'ivankatliarchuk/ivankatliarchuk.github.io',
  // 'ivankatliarchuk/knowledge-base',
  // 'ivankatliarchuk/dotfiles',
  'cloudkats/docker-tools'
]

module.exports = {
  "extends": [":disableRateLimiting", ":semanticCommits"],
  "assigneesFromCodeOwners": true,
  "assignees": ["ivankatliarchuk"],
  "labels": ["renovate", "dependencies", "automated"],
  "dependencyDashboardTitle": "Dependency Dashboard self-hosted",
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "onboarding": true,
  "platform": "github",
  "dryRun": true,
  "printConfig": false,
  "pruneStaleBranches": false,
  "username": "ivankatliarchuk",
  "repositories": repo,
  "prHourlyLimit": 20,
  "stabilityDays": 3,
  "semanticCommits": "enabled",
  "onboardingConfig": { "extends": ["github>ivankatliarchuk/.github"] },
  "major": { "automerge": false, "labels": ["dependencies", "major"] },
  "minor": { "automerge": false, "labels": ["dependencies", "minor"] },
  "patch": { "automerge": false },
  "packageRules": [
    { "labels": ["major", "dependencies"], "matchUpdateTypes": ["major"] },
    {
      "labels": ["minor", "dependencies"],
      "groupName": "devDependencies(non-major)",
      "matchUpdateTypes": ["minor"]
    },
    {
      "labels": ["patch", "dependencies"],
      "groupName": "devDependencies(non-major)",
      "matchUpdateTypes": ["patch", "digest", "bump"]
    },
    { "labels": ["php"], "matchLanguages": ["php"] },
    { "labels": ["js"], "matchLanguages": ["js"] },
    { "labels": ["python"], "matchLanguages": ["python"] },
    { "matchPackagePatterns": ["*"] },
    { "groupName": "dependencies", "matchDepTypes": ["dependencies"] },
    { "groupName": "devDependencies", "matchDepTypes": ["devDependencies"] },
    {
      "groupName": "devDependencies(non-major)",
      "matchDepTypes": ["devDependencies(non-major)"]
    },
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
      "allowedVersions": "^12.0.0",
      "groupName": "node",
      "matchPackageNames": ["node", "@types/node"]
    },
    {
      "allowedVersions": "^6.0.0",
      "groupName": "node",
      "matchPackageNames": ["npm"]
    },
    {
      "versioning": "regex:^v(?<major>\\d+)(\\.(?<minor>\\d+))?(\\.(?<patch>\\d+))?",
      "groupName": "actions",
      "matchPackageNames": ["actions/*"]
    },
    {
      "enabled": true,
      "groupName": "actions",
      "matchManagers": ["github-actions"]
    },
    {
      "versioning": "semver",
      "matchDatasources": "go",
      "matchManagers": ["gomod"],
      "matchUpdateTypes": ["pin", "digest"]
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
      "fileMatch": [
        ".github/workflows/blank.yml",
        ".github/workflows/takeover-output.yml"
      ],
      "matchStrings": ["uses: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": "github-releases"
    },
    {
      fileMatch: [
        '^Dockerfile$',
        "Dockerfile$",
      ],
      matchStrings: [
        '#\\s*renovate:\\s*datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\s(ARG|ENV) .*?_VERSION(=|\\s)(?<currentValue>.*)\\s'
      ],
      versioningTemplate: '{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}'
    },
    {
      "fileMatch": [
        "^Dockerfile$",
        "Dockerfile$",
        "(^|/|\\.)Dockerfile$",
        "(^|/)Dockerfile\\.[^/]*$"
      ],
      "matchStrings": [
        "#\\s*renovate:\\s*depName=(?<depName>.*?)?\\s.*?:\\s(?<currentValue>.*)\\s"
      ],
      "versioningTemplate": "semver",
      "datasourceTemplate": "github-releases",
      "lookupNameTemplate": "{{{depName}}}"
    },
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
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}",
      "datasourceTemplate": "github-releases"
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
    }
  ]
};
