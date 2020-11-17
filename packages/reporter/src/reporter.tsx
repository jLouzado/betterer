import { BettererConfigPartial, BettererContext, BettererReporter, BettererRuns } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { BettererTaskLogger } from '@betterer/logger';
import React from 'react';
import { render, Instance } from 'ink';

import { Reporter, Runs } from './components';

import {
  testBetterΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testRunningΔ,
  testSameΔ,
  testUpdatedΔ,
  testWorseΔ
} from './messages';
import { quoteΔ } from './utils';

let app: Instance;

export const defaultReporter: BettererReporter = {
  configError(_: BettererConfigPartial, error: BettererError): void {
    app = render(<Reporter error={error} />);
  },
  contextStart(): void {
    app = render(<Reporter />);
  },
  // contextEnd(_: BettererContext, summary: BettererSummary): void {
  //   app.rerender(
  //     <Reporter>
  //       <Summary summary={summary}></Summary>
  //     </Reporter>
  //   );
  // },
  contextError(_: BettererContext, error: BettererError): void {
    app.rerender(<Reporter error={error} />);
  },
  runsStart(runs: BettererRuns): void {
    const runContexts = runs.map((run) => {
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
          if (run.isSame) {
            return testSameΔ(name);
          }
          if (run.isUpdated) {
            // run.diff.log();
            return testUpdatedΔ(name);
          }
          if (run.isWorse) {
            // run.diff.log();
            throw new BettererError(testWorseΔ(name));
          }
          throw new BettererError('IMPOSSIBLE');
        }
      };
    });

    app.rerender(
      <Reporter>
        <Runs runs={runContexts}></Runs>
      </Reporter>
    );
  }
};
