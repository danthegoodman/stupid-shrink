#!/usr/bin/env node
"use strict";
var fs = require('fs');
var path = require('path');

var allPackages = findPackages(process.cwd());
var rootName = Object.keys(allPackages)[0];
if (!rootName) throw "Unable to find package.json";

var output = Object.assign({name: rootName}, allPackages[rootName]);
fs.writeFileSync('npm-shrinkwrap.json', JSON.stringify(output, null, 2)+"\n");

function findPackages(dir){
  if (path.basename(dir).startsWith('@')) {
    return findDependencies(dir);
  }

  var pkg = readPackage(dir);
  if (!pkg) return {};

  var pkgDetails = {
    version: pkg.version,
    from: pkg._from,
    resolved: pkg._resolved,
  };

  var subdeps = findDependencies(dir + '/node_modules');
  if (isNotEmpty(subdeps)) {
    pkgDetails.dependencies = subdeps;
  }

  return {
    [pkg.name]: pkgDetails
  };
}

function findDependencies(dir){
  try {
    var nodeModules = fs.readdirSync(dir);
    nodeModules.sort((a, b)=> a.toLowerCase().localeCompare(b.toLowerCase()));

    var subdeps = {};
    for (var f of nodeModules) {
      Object.assign(subdeps, findPackages(dir + '/' + f));
    }
    return subdeps;
  } catch (err) {
    if (err.code === "ENOENT") return {};
    throw err;
  }
}

function readPackage(dir){
  try {
    let pkgFile = fs.readFileSync(dir + '/package.json', 'utf8');
    return JSON.parse(pkgFile);
  } catch (err) {
    if (err.code === 'ENOENT') return undefined;
    throw err;
  }
}

function isNotEmpty(obj){
  for (var k in obj) return true;
  return false;
}