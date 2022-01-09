"use strict";
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/

const dry_run = process.env.RENOVATE_DRY_RUN
console.log(`DRY_RUN mode: ${dry_run}`);

// console.log(process.env)

module.exports = {
  "extends": [":disableRateLimiting", ":semanticCommits"],
  "assigneesFromCodeOwners": true,
  "assignees": ["ivankatliarchuk"],
  "labels": ["renovate", "dependencies"],
  "dependencyDashboardTitle": "Dependency Dashboard self-hosted",
  "gitAuthor": "Renovate Bot <bot@renovateapp.com>",
  "onboarding": true,
  "platform": "github",
  "dryRun": dry_run,
  // "repositories": ["cloudkats/docker-tools"],
  "printConfig": false,
  "pruneStaleBranches": true,
  "recreateClosed": true,
  "rebaseWhen": "behind-base-branch",
  "baseBranches": ["master", "main"],
  "username": "ivankatliarchuk",
  "prHourlyLimit": 20,
  "stabilityDays": 3,
  "semanticCommits": "enabled",
  "onboardingConfig": { "extends": ["github>ivankatliarchuk/.github"] },
  "hostRules": [
    {
      "hostType": "docker",
      "username": "cloudkats",
      "password": process.env.RENOVATE_DOCKER_HUB_PASSWORD,
    },
  ],
  "git-submodules": {
    "enabled": true
    },
  "packageRules": [
    // labels section --> start
    {
      "addLabels": ["renovate"]
    },
    {
      "matchDatasources": ["git-refs", "github-tags"],
      "addLabels": ["{{updateType}}"]
    },
    {
      "matchUpdateTypes": ["major", "minor", "patch", "pin", "digest"],
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    { "addLabels": ["php"], "matchLanguages": ["php"] },
    { "addLabels": ["js"], "matchLanguages": ["js"] },
    { "addLabels": ["python"], "matchLanguages": ["python"] },
    // labels section --> end
    {
      "description": "Disables the creation of branches/PRs for any minor/patch updates etc. of python version",
      "matchFiles": [".*python-version"],
      "matchUpdateTypes": ["minor", "major"],
      "enabled": false
    },
    {
      "automerge": false,
      "major": { "enabled": true },
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchDatasources": ["docker"],
      "separateMultipleMajor": true,
      "groupName": "{{packageFile}}",
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "matchPackageNames": ["actions/*"],
      "matchManagers": ["github-actions"],
      "additionalBranchPrefix": "{{packageFileDir}}-",
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "separateMultipleMajor": true,
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "automerge": false,
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchManagers": ["terraform", "terraform-version"],
      "matchPackagePatterns": [".*"],
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "commitMessageTopic": "Helm chart {{depName}}",
      "separateMajorMinor": true,
      "separateMinorPatch": false,
      "matchDatasources": ["helm"],
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "separateMajorMinor": false,
      "separateMinorPatch": false,
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "ignorePaths": [".*python-version"],
      "matchManagers": [
        "pip_requirements",
        "pyenv",
        "pip-compile",
        "pip_setup",
        "pipenv",
        "setup-cfg"
      ],
      "matchPackagePatterns": [".*"],
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "matchManagers": ["*"],
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "matchManagers": ["regex"],
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },

    // legacy

    {
      "versioning": "regex:^v(?<major>\\d+)(\\.(?<minor>\\d+))?(\\.(?<patch>\\d+))?",
      "groupName": "actions",
      "matchPackageNames": ["actions/*"]
    },
    {
      "enabled": true,
      "groupName": "actions",
      "matchManagers": ["github-actions"],
      "addLabels": ["{{datasource}}", "{{updateType}}"]
    },
    {
      "versioning": "semver",
      "matchDatasources": "go",
      "matchManagers": ["gomod"],
      "matchUpdateTypes": ["pin", "digest"],
      "addLabels": ["{{datasource}}", "{{updateType}}", "go"]
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
        "(^workflow-templates|.github/workflows)\/[^/]+\.ya?ml$",
        "(^workflow-templates|.github/workflows)\/[^/]+\.ya?ml$(^|\/)action\.ya?ml$"
      ],
      "matchStrings": ["uses: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": "github-tags"
    },
    // legacy
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
        "^Dockerfile$",
        "Dockerfile$",
      ],
      matchStrings: [
        "#\\s*renovate:\\s*datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\s(ARG|ENV) .*?_VERSION(=|\\s)(?<currentValue>.*)\\s"
      ],
      versioningTemplate: "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}"
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
