'use strict';
// https://github.com/renovatebot/github-action/blob/main/.github/renovate.json
const branchName = 'github-renovate';

const fs = require('fs');

const config_folder = '.github/renovate'

console.log(process.env);

fetch('https://github.com/ivankatliarchuk/.github/blob/main/.github/renovate/repositories.json')
  .then(response => response.text())
  .then(data => {
    // Do something with your data
    console.log(data);
  });

if (!fs.existsSync(`${config_folder}/repositories.json`)) {
  const err = `missing "${config_folder}/repositories.json" file`
  console.log(`error: ${err}. exit...`)
  throw Error(err)
}

if (!fs.existsSync(`${config_folder}/config.json`)) {
  const err = `missing "${config_folder}/config.json" file`
  console.log(`error: ${err}. exit...`)
  throw Error(err)
}

const cfg = JSON.parse(fs.readFileSync(`${config_folder}/config.json`), 'utf8');
console.log(cfg);

module.exports = {
  extends: [
    'config:base',
    "github>renovatebot/.github",
    ":disableRateLimiting"
  ],
  assignees: process.env.LOG_LEVEL,
  logLevel: process.env.LOG_LEVEL,
  labels: ['renovate', 'dependencies', 'automated'],
  branchPrefix: `${branchName}/`,
  dependencyDashboardTitle: 'Dependency Dashboard self-hosted',
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  onboarding: true,
  onboardingBranch: `${branchName}/configure`,
  platform: 'github',
  dryRun: false,
  printConfig: true,
  username: process.env.USER_NAME,
  repositories: JSON.parse(fs.readFileSync(`${config_folder}/repositories.json`), 'utf8'),
};
