type Callback = () => void | Promise<void>
type Hook = (cb: Callback) => void | Promise<void>

export type SkipFn = () => ({skipped: boolean} | Promise<{skipped: boolean}>)
export type TestFn = () => void | Promise<void>

export interface Setup {
  suite: Suite,
  it: It,
  before: Hook,
  beforeEach: Hook,
  after: Hook,
  afterEach: Hook,
}

export interface It {
  (name: string, handler: TestFn): void | Promise<void>,
  only: (name: string, handler: TestFn) => void | Promise<void>,
  skip: (name: string, handler: TestFn) => void | Promise<void>,
}

export interface Tools {
  it: It,
  describe: Describe,
  before: Hook,
  beforeEach: Hook,
  after: Hook,
  afterEach: Hook,
}

export type Handler = (tools: Tools) => void

export interface Describe {
  (name: string, handler: Handler): void | Promise<void>,
  only: (name: string, handler: Handler) => void | Promise<void>
}

export interface TestObject {
  name: string,
  handler: SkipFn | TestFn
}

export interface Suite {
  name?: string,
  tests: TestObject[],
  suiteOnly: boolean,
  only?: TestObject[],
  before?: Callback,
  beforeEach?: Callback,
  after?: Callback,
  afterEach?: Callback,
}

export interface TestSuiteResult {
  name: string,
  total: number,
  skipped: number,
  failed: number,
  tests: TestResult[],
}

export interface TestResult {
  name: string,
  passed: boolean,
  skipped: boolean,
  duration: string,
  error: false | Error
}

export interface ExecutionOptions {
  renderer?: Renderer
}

export interface Renderer {
  /** Runs before the suite starts, can be used for set up */
  suiteStart?: (args: {name: string, only: TestObject[], tests: TestObject[]}) => void,
  /** Runs after every ran test, whether it's skipped, passed, or failed */
  renderTest?: (TestResult) => void,
  /** Runs after the entire suite has ran */
  suiteEnd?: (TestSuiteResult) => void
}

export interface Report {
  status: 'FINISHED',
  total: number,
  skipped: number,
  failed: number,
  passed: boolean,
  duration: string,
  results: TestSuiteResult[],
  errors: Error[]
}

export interface Error {}