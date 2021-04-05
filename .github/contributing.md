# Contributing

The project operates an open contributor model where anyone is welcome to contribute towards development in
the form of peer review, testing and patches. This document explains the practical process and guidelines for
contributing.

Firstly in terms of structure, there is no particular concept of "Core developers" in the sense of privileged people.
Open source often naturally revolves around meritocracy where longer term contributors gain more trust from the
developer community. However, some hierarchy is necessary for practical purposes. As such there are repository "
maintainers" who are responsible for merging pull requests as well as a "lead maintainer" who is responsible for the
release cycle, overall merging, moderation and appointment of maintainers.

## Features

When adding a new feature, thought must be given to the long term technical debt and maintenance that feature may
require after inclusion. Before proposing a new feature that will require maintenance, please consider if you are
willing to maintain it (including bug fixing). If features get orphaned with no maintainer in the future, they may be
removed by the Repository Maintainer.

## Refactoring

Refactoring is a necessary part of any software project's evolution. The following guidelines cover refactoring pull
requests for the project.

There are three categories of refactoring, code only moves, code style fixes, code refactoring. In general refactoring
pull requests should not mix these three kinds of activity in order to make refactoring pull requests easy to review and
uncontroversial. In all cases, refactoring PRs must not change the behaviour of code within the pull request (bugs must
be preserved as is).

Project maintainers aim for a quick turnaround on refactoring pull requests, so where possible keep them short,
uncomplex and easy to verify.

Pull requests that refactor the code should not be made by new contributors. It requires a certain level of experience
to know where the code belongs to and to understand the full ramification (including rebase effort of open pull
requests).

Trivial pull requests or pull requests that refactor the code with no clear benefits may be immediately closed by the
maintainers to reduce unnecessary workload on reviewing.

## Peer Review

Anyone may participate in peer review which is expressed by comments in the pull request. Typically reviewers will
review the code for obvious errors, as well as test out the patch set and opine on the technical merits of the patch.
Project maintainers take into account the peer review when determining if there is consensus to merge a pull request (
remember that discussions may have been spread out over GitHub, mailing list and GitHub discussions).

## Finding Reviewers

As most reviewers are themselves developers with their own projects, the review process can be quite lengthy, and some
amount of patience is required. If you find that you've been waiting for a pull request to be given attention for
several months, there may be a number of reasons for this, some of which you can do something about:

- It may be because of a feature freeze due to an upcoming release. During this time, only bug fixes are taken into
  consideration. If your pull request is a new feature, it will not be prioritized until the release is over. Wait for
  release.
- It may be because the changes you are suggesting do not appeal to people. Rather than nits and critique, which require
  effort and means they care enough to spend time on your contribution, thundering silence is a good sign of
  widespread (mild) dislike of a given change
  (because people don't assume *others* won't actually like the proposal). Don't take that personally, though! Instead,
  take another critical look at what you are suggesting and see if it: changes too much, is too broad, doesn't adhere to
  the developer notes, is dangerous or insecure, is messily written, etc. Identify and address any of the issues you
  find.
- It may be because your code is too complex for all but a few people. And those people may not have realized your pull
  request even exists. A great way to find people who are qualified and care about the code you are touching is the
  [Git Blame feature](https://help.github.com/articles/tracing-changes-in-a-file/). Simply find the person touching the
  code you are touching before you and see if you can find them and give them a nudge. Don't be incessant about the
  nudging though.
- Finally, if all else fails, ask on GitHub discussions or elsewhere for someone to give your pull request a look. If
  you think you've been waiting an unreasonably long amount of time (month+) for no particular reason (few lines
  changed, etc), this is totally fine. Try to return the favor when someone else is asking for feedback on their code,
  and universe balances out.

## Copyright

By contributing to this repository, you agree to license your work under the MIT license unless specified otherwise. Any
work contributed where you are not the original author must contain its license header with the original author(s) and
source.
