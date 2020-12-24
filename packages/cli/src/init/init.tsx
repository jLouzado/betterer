import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
import { workerRequire, WorkerModule } from '@phenomnomnominal/worker-require';
import * as path from 'path';
import React, { FC } from 'react';

import { BettererCLIInitConfig } from '../types';

const { runCreateTestFile } = workerRequire<WorkerModule<typeof import('./create-test-file')>>('./create-test-file');
const { runUpdatePackageJSON } = workerRequire<WorkerModule<typeof import('./update-package-json')>>(
  './update-package-json'
);

export type InitProps = BettererCLIInitConfig & {
  cwd: string;
};

export const Init: FC<InitProps> = function Init({ cwd, config }) {
  return (
    <BettererTasks name="Initialising Betterer" statusMessage={statusMessage}>
      <BettererTask
        context={{
          name: 'Create test file',
          run: (logger) => runCreateTestFile(logger, path.resolve(cwd, config))
        }}
      />
      <BettererTask
        context={{
          name: 'Update package.json',
          run: (logger) => runUpdatePackageJSON(logger, cwd)
        }}
      />
    </BettererTasks>
  );
};

function statusMessage(state: BettererTasksState): string {
  const { done, errors, running } = state;
  const runningStatus = running ? `${tasks(running)} running... ` : '';
  const doneStatus = done ? `${tasks(done)} done! ` : '';
  const errorStatus = errors ? `${tasks(errors)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tasks(n: number): string {
  return `${n} ${n === 1 ? 'task' : 'tasks'}`;
}
