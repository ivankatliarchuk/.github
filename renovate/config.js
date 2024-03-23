"use strict";
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
// https://docs.renovatebot.com/configuration-options/

const fs = require('fs');
const dry_run = process.env.RENOVATE_DRY_RUN
console.log(`DRY_RUN mode: ${dry_run}`);

// console.log(process.env)

module.exports = {
  "extends": [":disableRateLimiting", ":semanticCommits"],
  "assigneesFromCodeOwners": true,
  "assignees": ["ivankatliarchuk"],
  "dependencyDashboardTitle": "Dependency Dashboard self-hosted",
  "gitAuthor": "IK Renovate Bot <ikbot@renovateapp.com>",
  "onboarding": true,
  "platform": "github",
  // "dryRun": dry_run,
  // "repositories": JSON.parse(fs.readFileSync('/ren/repositories.json', 'utf8')),
  "printConfig": true,
  "prConcurrentLimit": 0,
  "prHourlyLimit": 0,
  "stabilityDays": 3,
  "pruneStaleBranches": true,
  "recreateClosed": true,
  "dependencyDashboard": false,
  "requireConfig": false,
  "rebaseWhen": "behind-base-branch",
  "baseBranches": ["master", "main"],
  "username": "ivankatliarchuk",
  "semanticCommits": "enabled",
  "onboardingConfig": { "extends": ["github>ivankatliarchuk/.github"] },
  "hostRules": [
    {
      "hostType": "docker",
      "username": "cloudkats",
      "password": process.env.RENOVATE_DOCKER_HUB_PASSWORD,
    },
  ],
  "includeForks": true,
  "git-submodules": {
    "enabled": true
  },
  "pre-commit": {
    "enabled": true
  },
  "labels": ["renovate", "deps", "{{depType}}", "datasource::{{datasource}}", "type::{{updateType}}", "manager:{{manager}}"],
  "ignorePaths": [
    "examples/**",
    "k8s/sandbox/**",
    "**/tests/**",
  ],
  "vulnerabilityAlerts": {
    "enabled": true,
    "addLabels": ["vulnerability"]
  },
  "additionalBranchPrefix": "{{packageFileDir}}-",
  "packageRules": [
    // labels section --> start
    {
      "matchUpdateTypes": ["major", "minor", "patch", "pin", "digest"],
      "addLabels": ["rule::1"],
      "commitMessageSuffix": '({{packageFile}})'
    },
    { "addLabels": ["php"], "matchLanguages": ["php"] },
    { "addLabels": ["js"], "matchLanguages": ["js"] },
    { "addLabels": ["python", "rule::2"], "matchLanguages": ["python"] },
    // labels section --> end
    {
      "description": "Disables the creation of branches/PRs for any minor/patch updates etc. of python version",
      "matchFiles": [".*python-version"],
      "matchUpdateTypes": ["minor", "major"],
      "addLabels": ["rule::3"],
      "enabled": false
    },
    {
      "automerge": false,
      "major": { "enabled": true },
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchDatasources": ["docker"],
      "separateMultipleMajor": true,
      "groupName": "{{datasource}}",
      "addLabels": ["rule::4"],
      "addLabels": ["rule::4", "{{datasource}}", "{{updateType}}"]
    },
    {
      "automerge": false,
      "matchManagers": ["github-actions"],
      "additionalBranchPrefix": "{{packageFileDir}}-",
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "separateMultipleMajor": true,
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "addLabels": ["rule::4.2", "github-action", "skip-release"]
    },
    {
      "automerge": false,
      "separateMajorMinor": true,
      "separateMinorPatch": true,
      "matchManagers": ["terraform", "terraform-version"],
      "matchPackagePatterns": [".*"],
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "addLabels": ["rule::6"]
    },
    {
      "commitMessageTopic": "Helm chart {{depName}}",
      "separateMajorMinor": true,
      "separateMinorPatch": false,
      "matchDatasources": ["helm"],
      "groupName": "{{datasource}} {{depType}} {{packageFile}}",
      "addLabels": ["rule::7"]
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
      "addLabels": ["rule::8"]
    },
    {
      "automerge": true,
      "groupName": "pre-commit",
      "matchManagers": ["pre-commit"],
      "commitMessageSuffix": "[skip ci]",
      "addLabels": ["rule::10", "pre-commit", "skip-release", "skip-ci"]
    },
    // legacy
    {
      "versioning": "regex:^v(?<major>\\d+)(\\.(?<minor>\\d+))?(\\.(?<patch>\\d+))?",
      "groupName": "actions",
      "matchPackageNames": ["actions/*"],
      "addLabels": ["rule::4.2", "github-action"]
    },
    {
      "versioning": "semver",
      "matchDatasources": "go",
      "matchManagers": ["gomod"],
      "addLabels": ["rule::9", "go"]
    },
    {
      "matchPackageNames": ["kubernetes/kubernetes"],
      "allowedVersions": "< 2"
    }
  ],
  "customManagers": [
    {
      "customType": "regex",
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
      "customType": "regex",
      "fileMatch": [".*"],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\sARG .*?_VERSION=(?<currentValue>.*)\\s"
      ],
      "datasourceTemplate": "github-releases",
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}",
      "extractVersionTemplate": "^v?(?<version>.*)$"
    },
    {
      "customType": "regex",
      "fileMatch": [".*"],
      "matchStrings": [
        "ARG IMAGE=(?<depName>.*?):(?<currentValue>.*?)@(?<currentDigest>sha256:[a-f0-9]+)s"
      ],
      "datasourceTemplate": "docker"
    },
    {
      "customType": "regex",
      "fileMatch": [".*"],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\sARG .*?_VERSION=(?<currentValue>.*)\\s"
      ],
      "datasourceTemplate": "github-releases",
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}",
      "extractVersionTemplate": "^v?(?<version>.*)$"
    },
    {
      "customType": "regex",
      "fileMatch": [".*"],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>kubernetes\\/kubectl)( versioning=(?<versioning>.*?))?\\sARG .*?_VERSION=(?<currentValue>.*)\\s"
      ],
      "datasourceTemplate": "github-tags",
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}",
      "depNameTemplate": "kubernetes/kubernetes"
    },
    {
      "customType": "regex",
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
      "customType": "regex",
      "fileMatch": ["\\.yaml$"],
      "matchStrings": [
        "registryUrl=(?<registryUrl>.*?)\n *chart: (?<depName>.*?)\n *version: (?<currentValue>.*)\n"
      ],
      "datasourceTemplate": "helm"
    },
    {
      "customType": "regex",
      "fileMatch": ["sample.yml"],
      "matchStrings": ["version: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": "github-tags"
    },
    {
      "customType": "regex",
      "fileMatch": ["versions.yml"],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\n.*?_version: (?<currentValue>.*)\n"
      ],
      "versioningTemplate": "{{#if versioning}}{{versioning}}{{else}}semver{{/if}}"
    },
    {
      "customType": "regex",
      "fileMatch": [
        ".github/workflows/blank.yml",
        ".github/workflows/takeover-output.yml"
      ],
      "matchStrings": ["uses: (?<depName>.*?)@(?<currentValue>.*?)\n"],
      "datasourceTemplate": "github-releases"
    },
    {
      "customType": "regex",
      "fileMatch": [
        "^Dockerfile$",
        "Dockerfile$",
      ],
      "matchStrings": [
        "#\\s*renovate:\\s*datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\s(ARG|ENV) .*?_VERSION(=|\\s)(?<currentValue>.*)\\s"
      ],
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}"
    },
    {
      "customType": "regex",
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
      "customType": "regex",
      "fileMatch": [".*"],
      "matchStrings": [
        "datasource=(?<datasource>.*?) depName=(?<depName>.*?)( versioning=(?<versioning>.*?))?\\sENV .*?_VERSION=(?<currentValue>.*)\\s"
      ],
      "versioningTemplate": "{{#if versioning}}{{{versioning}}}{{else}}semver{{/if}}",
      "datasourceTemplate": "github-releases"
    },
    {
      "customType": "regex",
      "fileMatch": [".*"],
      "matchStrings": [
        "ARG IMAGE=(?<depName>.*?):(?<currentValue>.*?)@(?<currentDigest>sha256:[a-f0-9]+)s"
      ],
      "datasourceTemplate": "docker"
    },
    {
      "customType": "regex",
      "description": "Update docker references in Makefile",
      "fileMatch": [
        "Makefile$"
      ],
      "matchStrings": [
        "CI_(RENOVATE_IMAGE|IMAGE)\\s*:=\\s*(?<depName>renovate\\/renovate):(?<currentValue>[a-z0-9.-]+)(?:@(?<currentDigest>sha256:[a-f0-9]+))?"
      ],
      "datasourceTemplate": "docker",
      "versioningTemplate": "docker"
    },
    {
      "customType": "regex",
      "description": "Update .tflint.hcl dependencies",
      "fileMatch": [
        ".tflint.hcl"
      ],
      "matchStrings": [
        "plugin \"aws\" {\\n\\s*enabled\\s*=\\s*true\\n\\s*version\\s=\\s*\"(?<currentValue>[a-z.]+)\"\\n\\s * source\\s*=\\s*\"github.com\\/(?<depName>.*?)\"\\n}"
      ],
      "datasourceTemplate": "github-tags",
      "versioningTemplate": "semver"
    },
  ]
};
