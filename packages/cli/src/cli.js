#!/usr/bin/env node

import { executeTests } from '@asdgf/core';
import { globby } from 'globby';
import { pathToFileURL } from 'url';
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

  if(globs.length === 0) {
    console.log(red('Could not find any testfiles to run.'));
    process.exit(1);
  }

  mergedOptions?.reporter?.start?.();

  const testFiles = globs.map(async (g) => {
    const path = pathToFileURL(g).href;

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