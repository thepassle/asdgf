#!/usr/bin/env node

import { executeTests } from '@asdgf/core';
import { globby } from 'globby';
import { sep } from 'path';
import { getCliConfig, getUserConfig, mergeGlobsAndExcludes, DEFAULTS } from './utils/index.js';
import { red, green } from 'nanocolors';

(async () => {

  const cliConfig = getCliConfig();
  const userConfig = await getUserConfig();

  const mergedOptions = { ...DEFAULTS, ...userConfig, ...cliConfig };
  const merged = mergeGlobsAndExcludes(DEFAULTS, userConfig, cliConfig);
  const globs = await globby(merged);

  const allResults = [];
  let failedImports = 0;

  mergedOptions?.reporter?.start?.();

  const testFiles = globs.map(async (g) => {
    const path = `${process.cwd()}${sep}${g}`; 

    try {
      await import(path);
    } catch(e) {
      failedImports++;
      console.log(red(`Failed to import test file: ${path}`));
      console.log(e.stack)
    }

    const results = await executeTests({renderer: mergedOptions.reporter});
    allResults.push(results);
    globalThis.QUEUE = [];
  });

  await Promise.all(testFiles);

  mergedOptions?.reporter?.end?.();

  const failed = allResults.some(({passed}) => !passed) || failedImports > 0;

  allResults.forEach(({errors}) => {
    errors?.forEach(e => {
      console.log(e?.details || e?.message);
    });
  });

  if(failed) {
    console.log(red('Test run failed.'));
    process.exit(1);
  } else {
    console.log(green('All tests passed.'));
    process.exit(0);
  }
})();