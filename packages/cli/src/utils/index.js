import path from 'path';
import { readConfig, ConfigLoaderError } from '@web/config-loader';
import commandLineArgs from 'command-line-args';
import { bold, red, green, dim } from 'nanocolors';

const IGNORE = ['!node_modules/**/*.*'];

export function mergeGlobsAndExcludes(defaults, userConfig, cliConfig) {
  const merged = [
    ...defaults.globs,
    ...(userConfig?.globs || []),
    ...(cliConfig?.globs || []),
    ...(userConfig?.exclude?.map((i) => `!${i}`) || []),
    ...(cliConfig?.exclude?.map((i) => `!${i}`) || []),
    ...IGNORE,
  ];

  return merged;
}

export async function getUserConfig(configPath) {
  let userConfig = {};
  try {
    userConfig = await readConfig('asdgf.config', configPath);
  } catch (error) {
    if (error instanceof ConfigLoaderError) {
      console.error(error.message);
      return;
    }
    console.error(error);
    return;
  }
  return userConfig || {};
}

export function getCliConfig() {
  const optionDefinitions = [
    { name: 'globs', type: String, multiple: true },
    { name: 'exclude', type: String, multiple: true },
  ];
  
  return commandLineArgs(optionDefinitions);
}

export const reporter = {
  /** Runs before all suites run */
  start: () => {

  },
  /** Runs before the suite starts, can be used for set up */
  suiteStart: ({name, only, tests}) => {
    console.log(bold(name));
  },
  /** Runs after every ran test, whether it's skipped, passed, or failed */
  renderTest: ({skipped, passed, name}) => {
    const col = skipped ? dim : passed ? green : red;
    const emoji = skipped ? '⚫️' : passed ? '✅' : '❌';

    console.log(`  ${emoji} ${col(name)}`);
  },
  /** Runs after the entire suite has ran */
  suiteEnd: (testSuiteResult) => {
    console.log('\n')
  },
  /** Runs after all suites have ran */
  end: () => {

  }
};

export const DEFAULTS = {
  globs: [
    path.join(process.cwd(), 'test/**/*.test.js').replace(/\\/g, '/')
    // 'test/**/*.test.js'
  ],
  exclude: [],
  reporter
}
