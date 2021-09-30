#!/usr/bin/env node

import { executeTests } from '@asdgf/core';
import { globby } from 'globby';
import chokidar from 'chokidar';
import debounce from 'debounce';
import { randomInt } from 'crypto';
import { sep } from 'path';
import { getCliConfig, getUserConfig, mergeGlobsAndExcludes, DEFAULTS } from './utils/index.js';
import { red, green } from 'nanocolors';

// @TODO: can make a default console logger reporter in `@asdgf/ui` and use it as default

(async () => {
  const allResults = [];

  const {...cliConfig} = getCliConfig();
  const userConfig = await getUserConfig();

  const mergedOptions = { ...DEFAULTS, ...userConfig, ...cliConfig };
  const merged = mergeGlobsAndExcludes(DEFAULTS, userConfig, cliConfig);
  const globs = await globby(merged);
  const watchfiles = await globby(mergedOptions.watchfiles);

  async function run() {
    mergedOptions?.reporter?.start?.();

    const testFiles = globs.map(async (g) => {
      const path = `${process.cwd()}${sep}${g}`; 
  
      try {
        await import(`${path}?${randomInt(0, 1000000000)}`);
      } catch(e) {
        console.log(red(`Failed to import test file: ${path}`));
        console.log(e.stack)
      }
  
      const results = await executeTests({renderer: mergedOptions.reporter});
      allResults.push(results);
      globalThis.QUEUE = [];
    });
  
    await Promise.all(testFiles);

    mergedOptions?.reporter?.end?.();
  }

  await run();

  if(mergedOptions.watch) {
    const fileWatcher = chokidar.watch([...globs, ...watchfiles]);

    const onChange = debounce(run, 100);

    fileWatcher.addListener('change', onChange);
    fileWatcher.addListener('unlink', onChange);
  } else {
    allResults.forEach(({passed, errors}) => {
      errors?.forEach(e => {
        console.log(e?.details || e?.message);
      })
      if(!passed) {
        console.log(red('Test run failed.'));
        process.exit(1);
      }
    });
  
    console.log(green('Tests passed.'));
  }
})();