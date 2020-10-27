import {
  BettererConfigPartial,
  BettererContext,
  BettererReporter,
  BettererRun,
  BettererRuns
} from '@betterer/betterer';
import { BettererError, registerError } from '@betterer/errors';
import { BettererTaskContext, BettererTaskLogger } from '@betterer/logger';
import assert from 'assert';
import React from 'react';
import { render, Instance } from 'ink';

import { Reporter, Runs } from './components';

import {
  testBetterΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  // testRunningΔ,
  testSameΔ,
  testUpdatedΔ,
  testWorseΔ
} from './messages';
import { quoteΔ } from './utils';

let app: Instance;

type BettererRunTaskUpdate = {
  done(update: string): void;
  error(error: BettererError): void;
  info(update: string): void;
  status(update: string): void;
  warn(update: string): void;
};

const runTaskUpdates = new Map<BettererRun, BettererRunTaskUpdate>();

export const defaultReporter: BettererReporter = {
  configError(_: BettererConfigPartial, error: BettererError): void {
    app.rerender(<Reporter error={error} />);
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
  async runsStart(runs: BettererRuns): Promise<void> {
    let runContexts: Array<BettererTaskContext> = [];
    const runStartRendered = new Promise((resolve) => {
      runContexts = runs.map((run) => {
        let runResolve: BettererRunTaskUpdate['done'] | null;
        let runReject: BettererRunTaskUpdate['error'] | null;
        let runLogger: BettererTaskLogger | null;

        runTaskUpdates.set(run, {
          done(update: string): void {
            assert(runResolve);
            runResolve(update);
          },
          error(error: BettererError): void {
            assert(runReject);
            runReject(error);
          },
          info(update: string): void {
            assert(runLogger);
            runLogger.info(update);
          },
          status(update: string): void {
            assert(runLogger);
            runLogger.status(update);
          },
          warn(update: string): void {
            assert(runLogger);
            runLogger.warn(update);
          }
        });

        return {
          name: run.name,
          run(logger: BettererTaskLogger) {
            runLogger = logger;
            const running = new Promise<string>((resolve, reject) => {
              runResolve = resolve;
              runReject = reject;
            });
            resolve();
            return running;
          }
        };
      });
    });

    app.rerender(
      <Reporter>
        <Runs runs={runContexts}></Runs>
      </Reporter>
    );

    await runStartRendered;
  },
  runStart(run: BettererRun): void {
    const update = runTaskUpdates.get(run);
    assert(update);
    const { warn } = update;
    const name = quoteΔ(run.name);
    if (run.isExpired) {
      warn(testExpiredΔ(name));
    }
    // status(testRunningΔ(name));
  },
  runEnd(run: BettererRun): void {
    const update = runTaskUpdates.get(run);
    assert(update);
    const { done, error } = update;
    const name = quoteΔ(run.name);
    if (run.isComplete) {
      return done(testCompleteΔ(name, run.isNew));
    }
    if (run.isBetter) {
      return done(testBetterΔ(name));
    }
    if (run.isFailed) {
      return error(registerError(() => testFailedΔ(name))());
    }
    if (run.isNew) {
      return done(testNewΔ(name));
    }
    if (run.isSame) {
      return done(testSameΔ(name));
    }
    if (run.isUpdated) {
      return done(testUpdatedΔ(name));
      // run.diff.log();
    }
    if (run.isWorse) {
      return error(registerError(() => testWorseΔ(name))());
      // run.diff.log();
    }
  },
  runError(run: BettererRun, error: BettererError) {
    const update = runTaskUpdates.get(run);
    assert(update);
    update.error(error);
  }
};
