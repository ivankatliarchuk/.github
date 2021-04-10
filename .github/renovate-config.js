const branchName = 'github-renovate';

module.exports = {
  branchPrefix: `${branchName}/`,
  dependencyDashboardTitle: 'Dependency Dashboard self-hosted',
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  onboarding: true,
  onboardingBranch: `${branchName}/configure`,
  platform: 'github',
  dryRun: false,
  username: 'ivankatliarchuk',
  repositories: [
    'ivankatliarchuk/.github',
  ],
};
