import {
  BettererConfigPartial,
  BettererContext,
  BettererReporter,
  BettererRuns,
  BettererSummary
} from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import React from 'react';
import { render, Instance } from 'ink';

import { Reporter, Runs, Summary } from './components';

let app: Instance;

export const defaultReporter: BettererReporter = {
  configError(_: BettererConfigPartial, error: BettererError): void {
    render(<Reporter error={error} />);
  },
  contextStart(): void {
    app = render(<Reporter />);
  },
  contextEnd(_: BettererContext, summary: BettererSummary): void {
    render(<Summary summary={summary}></Summary>);
  },
  contextError(_: BettererContext, error: BettererError): void {
    app.rerender(<Reporter error={error} />);
  },
  runsStart(runs: BettererRuns): void {
    app.rerender(
      <Reporter>
        <Runs runs={runs}></Runs>
      </Reporter>
    );
  }
};
