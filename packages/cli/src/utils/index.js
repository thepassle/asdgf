import { readConfig, ConfigLoaderError } from '@web/config-loader';
import commandLineArgs from 'command-line-args';

const IGNORE = ['!node_modules/**/*.*'];

const has = arr => Array.isArray(arr) && arr.length > 0;

export function mergeGlobsAndExcludes(defaults, userConfig, cliConfig) {
  const hasProvidedCliGlobs = has(cliConfig?.globs) || has(userConfig?.globs);

  if(hasProvidedCliGlobs) {
    defaults.globs = defaults.globs.filter(glob => glob !== '**/*.{js,ts,tsx}');
  }

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
    { name: 'watch', type: Boolean },
    { name: 'watchfiles', type: String, multiple: true },
  ];
  
  return commandLineArgs(optionDefinitions);
}

export const reporter = {
  /** Runs before all suites run */
  start: () => {
    console.log('start\n');
  },
  /** Runs before the suite starts, can be used for set up */
  suiteStart: ({name, only, tests}) => {
    console.log(`Starting suite: "${name}"`);
  },
  /** Runs after every ran test, whether it's skipped, passed, or failed */
  renderTest: ({skipped, passed, name}) => {
    console.log(`  ${skipped ? '⚫️' : passed ? '✅' : '❌'} "${name}"`);
  },
  /** Runs after the entire suite has ran */
  suiteEnd: (testSuiteResult) => {
    console.log('\n')
  },
  /** Runs after all suites have ran */
  end: () => {
    console.log('end');
  }
};

export const DEFAULTS = {
  watchfiles: [],
  globs: ['test/**/*.test.js'],
  exclude: [],
  watch: false,
  reporter
}
