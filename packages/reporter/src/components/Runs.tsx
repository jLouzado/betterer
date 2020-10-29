import React, { FC } from 'react';

import { BettererTask, BettererTaskContext, BettererTasks, BettererTasksState } from '@betterer/logger';
import { Box } from 'ink';

export type RunsProps = {
  runs: Array<BettererTaskContext>;
};

export const Runs: FC<RunsProps> = function Runs({ runs }) {
  return (
    <Box>
      <BettererTasks name="Betterer" statusMessage={statusMessage}>
        {runs.map((run) => (
          <BettererTask key={run.name} context={run} />
        ))}
      </BettererTasks>
    </Box>
  );
};

function statusMessage(state: BettererTasksState): string {
  const { done, error, running } = state;
  const runningStatus = running ? `${tests(running)} running... ` : '';
  const doneStatus = done ? `${tests(done)} done! ` : '';
  const errorStatus = error ? `${tests(error)} errored! ` : '';
  return `${runningStatus}${doneStatus}${errorStatus}`;
}

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
