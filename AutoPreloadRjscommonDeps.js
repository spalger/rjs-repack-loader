/* jshint node:true, esnext:true */

'use strict';

let amdRequireRE = /define\(function\s*\(/;
let requireRE = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
let commentRE = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg;

module.exports = function (source) {
  this.cacheable();
  let amd = source.match(amdRequireRE);
  if (!amd) return source;

  let deps = [];
  source
  .replace(commentRE, '')
  .replace(requireRE, function (match, dep) {
    deps.push(dep);
  });

  deps = deps.map(function (dep) {
    return `require('${dep}');`;
  });

  return `

/* amd deps auto preloaded */

${deps.join('\n')}

${source}

/* /amd deps auto preloaded */

`.trim();

};
