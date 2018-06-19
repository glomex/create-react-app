#!/usr/bin/env node
var {exec} = require('child_process');
var semver = /^v?(?:\d+)(\.(?:[x*]|\d+)(\.(?:[x*]|\d+)(?:-[\da-z\-]+(?:\.[\da-z\-]+)*)?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i;
var patch = /-([0-9A-Za-z-.]+)/;

function split(v) {
  var temp = v.replace(/^v/, '').split('.');
  var arr = temp.splice(0, 2);
  arr.push(temp.join('.'));
  return arr;
}

function tryParse(v) {
  return isNaN(Number(v)) ? v : Number(v);
}

function validate(version) {
  if (typeof version !== 'string') {
    throw new TypeError('Invalid argument expected string');
  }
  if (!semver.test(version)) {
    throw new Error('Invalid argument not valid semver');
  }
}

function compareVersions(v1, v2) {
  [v1, v2].forEach(validate);

  var s1 = split(v1);
  var s2 = split(v2);

  for (var i = 0; i < 3; i++) {
    var n1 = parseInt(s1[i] || 0, 10);
    var n2 = parseInt(s2[i] || 0, 10);

    if (n1 > n2) return 1;
    if (n2 > n1) return -1;
  }

  if ([s1[2], s2[2]].every(patch.test.bind(patch))) {
    var p1 = patch.exec(s1[2])[1].split('.').map(tryParse);
    var p2 = patch.exec(s2[2])[1].split('.').map(tryParse);

    for (i = 0; i < Math.max(p1.length, p2.length); i++) {
      if (p1[i] === undefined || typeof p2[i] === 'string' && typeof p1[i] === 'number') return -1;
      if (p2[i] === undefined || typeof p1[i] === 'string' && typeof p2[i] === 'number') return 1;

      if (p1[i] > p2[i]) return 1;
      if (p2[i] > p1[i]) return -1;
    }
  } else if ([s1[2], s2[2]].some(patch.test.bind(patch))) {
    return patch.test(s1[2]) ? -1 : 1;
  }

  return 0;
};

var cwd = process.cwd();
var packageJson = require(`${cwd}/package.json`);
var version = {local: packageJson.version};

exec(`npm view ${packageJson.name} version`, (err, stdout) => {
  var versionInNpm = (stdout || '0.0.0');
  version.npm = versionInNpm.trim();

  console.log(`local version: ${version.local}\nnpm registry version: ${version.npm}`);

  if (compareVersions(version.local, version.npm) > 0) {
    return process.exit(0);
  }

  console.error('Your version is outdated.');

  return process.exit(1);
});