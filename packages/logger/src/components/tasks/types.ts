import { ForegroundColor } from 'chalk';

import { BettererLogger } from '../../types';

export type BettererTaskColour = typeof ForegroundColor;

export type BettererTaskLog = [indicator: string, colour: BettererTaskColour, message: string];
export type BettererTaskLogs = ReadonlyArray<BettererTaskLog>;

export type BettererTaskError = Error & {
  details: string;
  message: string;
};

export type BettererTaskUpdate = (status: string) => void;

export type BettererTaskContext = {
  name: string;
  run: (logger: BettererTaskLogger) => Promise<BettererTaskLog | string | void>;
};

export type BettererTaskLogger = BettererLogger & {
  status: BettererTaskUpdate;
};
