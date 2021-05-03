
# Configuration Repository

[![syncronize-repository-content][sync-badge]][sync-action]
[![governance][governance-badge]][governance-action]
[![governance.link-checker][governance.link-checker.badge]][governance.link-checker.status]
[![toc generator][toc-badge]][toc-action]

![Repository Size](https://img.shields.io/github/repo-size/ivankatliarchuk/.github)
![Lines of Codes](https://img.shields.io/tokei/lines/github/ivankatliarchuk/.github)
[![](https://img.shields.io/github/license/ivankatliarchuk/.github)](https://github.com/ivankatliarchuk/.github/LICENCE)

[![GitHub forks][forks.badge]][forks.url]

> Default community health files, such as CONTRIBUTING and CODE_OF_CONDUCT. Default files will be used for any public repository owned by the account that does not contain its own file of that type.

For more information, please see the article on [creating a default community health file for your organization](https://help.github.com/en/articles/creating-a-default-community-health-file-for-your-organization).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Resources](#resources)
  - [Helpers](#helpers)
- [Blogs](#blogs)
- [Renovate](#renovate)
- [Issues](#issues)
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Resources

- [Probot: configuration](https://github.com/probot/probot-config)
- [Probot: todo](https://github.com/settings/installations/15936645)
- [Probot: pull requried to be set](https://wei.github.io/pull/)
- [Renovate](https://renovate.whitesourcesoftware.com)
- [Dependabot](https://dependabot.com/)
- [Github: configuration][1]

- [Check Installations](https://github.com/settings/installations)

- [Streamlink: great issue setup](https://github.com/streamlink/streamlink/issues/new/choose)
- [Cron: crontab examples](https://crontab.guru)

- [Org sync](https://github.com/marketplace/actions/github-organization-sync-er)
- [How to setup: org workflow templates][how-to-org-template]
- [Actions workflow](https://github.com/actions/starter-workflows)

- [Awesome: github templates](https://github.com/devspace/awesome-github-templates)
- [Awesome: github](https://github.com/phillipadsmith/awesome-github)

- [Dependabot: validator](https://dependabot.com/docs/config-file/validator)
- [Dependabot: docs][dependabot.docs]

### Helpers

- [Cheat sheet: emoji](https://github.com/ikatyang/emoji-cheat-sheet)
- [Cheat sheet: emoji](https://gist.github.com/rxaviers/7360908)
- [Color picker](https://imagecolorpicker.com/color-code/9ca49e)

## Blogs

- [Workflows: tooling](https://github.com/anna-money/workflow-tools)

## Renovate

Add the following to your renovate.json config

```json
{
  "extends": ["github>@ivankatliarchuk/.github"]
}
```

[Configuration examples](https://github.com/ng-easy/renovate-config)

## Issues

> Renovate actions does not support extra files

```js
const fs = require('fs');
const config_folder = '.github/renovate'

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

repositories: JSON.parse(fs.readFileSync(`${config_folder}/repositories.json`), 'utf8'),
```

[GitHub Labels](https://github.com/ivankatliarchuk/.github/labels)

## TODO

- [X] Setup workflow templates
- [X] Add [auto approve][auto-approve]
- [X] Add [self merge][self-merge] to self repo
- [ ] Add [self merge][self-merge] to org template
- [X] Add renovate action to self repo
- [ ] Use [GitDown](https://github.com/gajus/gitdown) for markdown pre-process
- [ ] Renovate to work with mutliple repositories
- [ ] Setup [Licensed](https://github.com/github/licensed) for all repos
- [ ] Setup [file sync action][file-sync-aciton]:
- [ ] Sync files with other repositories(dependabot,renovate etc)
- [ ] Syhc [workflow files](https://github.com/varunsridharan/action-github-workflow-sync)

<!-- resources -->
[1]: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file
[governance-badge]: https://github.com/ivankatliarchuk/.github/actions/workflows/governance-bot.yml/badge.svg
[governance-action]: https://github.com/ivankatliarchuk/.github/actions/workflows/governance-bot.yml
[toc-badge]: https://github.com/ivankatliarchuk/.github/actions/workflows/toc.yml/badge.svg
[toc-action]: https://github.com/ivankatliarchuk/.github/actions/workflows/toc.yml
[sync-badge]: https://github.com/ivankatliarchuk/.github/actions/workflows/fork-sync.yml/badge.svg
[sync-action]: https://github.com/ivankatliarchuk/.github/actions/workflows/fork-sync.yml
[auto-approve]: https://github.com/search?o=desc&q=hmarr%2Fauto-approve-action+path%3A.github%2Fworkflows+language%3AYAML&s=&type=Code
[self-merge]: https://github.com/search?o=desc&q=orta%2Fcode-owner-self-merge+path%3A.github%2Fworkflows+language%3AYAML&s=&type=Code
[how-to-org-template]: https://docs.github.com/en/actions/learn-github-actions/sharing-workflows-with-your-organization
[file-sync-aciton]: https://github.com/marketplace/actions/file-sync
[governance.link-checker.badge]: https://github.com/ivankatliarchuk/.github/actions/workflows/governance.links-checker.yml/badge.svg
[governance.link-checker.status]: https://github.com/ivankatliarchuk/.github/actions/workflows/governance.links-checker.yml
[forks.badge]: https://img.shields.io/github/forks/ivankatliarchuk/.github.svg?style=social&label=Fork
[forks.url]: https://github.com/ivankatliarchuk/.github/network/members
[dependabot.docs]: https://docs.github.com/en/code-security/supply-chain-security/configuration-options-for-dependency-updates#about-the-dependabotyml-file
