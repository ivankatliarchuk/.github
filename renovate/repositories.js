#!/usr/bin/env node

"use strict";

const fs = require('fs');

let transposeRepositories = (fromFile) => {
  const repos = JSON.parse(fs.readFileSync(fromFile, 'utf8'))
  return repos.join(",")
}

console.log(transposeRepositories(process.env.RENOVATE_REPOSITORIES_FILE))
