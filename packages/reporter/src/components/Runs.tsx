import React, { FC } from 'react';

import { BettererTask, BettererTaskContext, BettererTasks } from '@betterer/logger';
import { Box } from 'ink';

export type RunsProps = {
  runs: Array<BettererTaskContext>;
};

export const Runs: FC<RunsProps> = function Runs({ runs }) {
  return (
    <Box>
      <BettererTasks name="Betterer">
        {runs.map((run) => (
          <BettererTask key={run.name} context={run} />
        ))}
      </BettererTasks>
    </Box>
  );
};
