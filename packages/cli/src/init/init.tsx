import { BettererTask, BettererTasks, BettererTasksState } from '@betterer/logger';
import * as path from 'path';
import React, { FC } from 'react';

import { BettererCLIInitConfig } from '../types';
import { createTestFile } from './create-test-file';
import { updatePackageJSON } from './update-package-json';

export type InitProps = BettererCLIInitConfig & {
  cwd: string;
};

export const Init: FC<InitProps> = function Init({ cwd, config }) {
  return (
    <BettererTasks name="Initialising Betterer" statusMessage={statusMessage}>
      <BettererTask context={createTestFile(path.resolve(cwd, config))} />
      <BettererTask context={updatePackageJSON(cwd)} />
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
