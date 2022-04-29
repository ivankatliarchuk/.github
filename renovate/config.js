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
  "dryRun": dry_run,
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
  "labels": ["renovate", "deps"],
  "vulnerabilityAlerts": {
    "enabled": true,
    "addLabels": ["vulnerability"]
  },
  "additionalBranchPrefix": "{{packageFileDir}}-",
  "packageRules": [
    // labels section --> start
    {
      "matchUpdateTypes": ["major", "minor", "patch", "pin", "digest"],
      "addLabels": ["{{depType}}", "{{datasource}}", "{{updateType}}"],
      "commitMessageSuffix": '({{packageFile}})'
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
      "addLabels": ["{{datasource}}", "{{updateType}}", "go"]
    },
    {
      "matchPackageNames": ["kubernetes/kubernetes"],
      "allowedVersions": "< 2"
    }
  ],
  // "regexManagers":
};
