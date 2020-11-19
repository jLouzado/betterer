import { BettererRuns } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererTask, BettererTaskLogger, BettererTasks, BettererTasksState } from '@betterer/logger';
import { Box } from 'ink';
import React, { FC } from 'react';

import {
  testBetterΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testRunningΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ
} from '../messages';
import { quoteΔ } from '../utils';

export type RunsProps = {
  runs: BettererRuns;
};

export const Runs: FC<RunsProps> = function Runs({ runs }) {
  const contexts = runs.map((run) => {
    return {
      name: run.name,
      run: async (logger: BettererTaskLogger) => {
        const name = quoteΔ(run.name);
        if (run.isExpired) {
          logger.warn(testExpiredΔ(name));
        }
        logger.status(testRunningΔ(name));

        await run.lifecycle;

        if (run.isComplete) {
          return testCompleteΔ(name, run.isNew);
        }
        if (run.isBetter) {
          return testBetterΔ(name);
        }
        if (run.isFailed) {
          throw new BettererError(testFailedΔ(name));
        }
        if (run.isNew) {
          return testNewΔ(name);
        }
        if (run.isSkipped) {
          return testSkippedΔ(name);
        }
        if (run.isSame) {
          return testSameΔ(name);
        }
        if (run.isUpdated) {
          run.diff.log(logger);
          return testUpdatedΔ(name);
        }
        if (run.isWorse) {
          run.diff.log(logger);
          throw new BettererError(testWorseΔ(name));
        }
        return;
      }
    };
  });

  return (
    <Box flexDirection="column">
      <BettererTasks name="Betterer" statusMessage={statusMessage}>
        {contexts.map((context) => (
          <BettererTask key={context.name} context={context} />
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
