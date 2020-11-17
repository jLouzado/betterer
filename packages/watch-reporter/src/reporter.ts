import { BettererFilePaths, BettererReporter, BettererRun, BettererRuns } from '@betterer/betterer';
import { infoΔ } from '@betterer/logger';
import {
  quoteΔ,
  testBetterΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ
} from '@betterer/reporter';
import logUpdate from 'log-update';

import { filesChecked, filesChecking, watchEnd, watchStart } from './messages';

export const watchReporter: BettererReporter = {
  contextStart(): void {
    infoΔ(watchStart());
  },
  contextEnd(): void {
    infoΔ(watchEnd());
  },
  runsStart(_: BettererRuns, files: BettererFilePaths): void {
    overwriteΔ(filesChecking(files.length));
  },
  runsEnd(runs: BettererRuns, files: BettererFilePaths): void {
    let report = `  ${filesChecked(files.length)}:\n`;
    files.forEach((filePath) => {
      report += `\n    ${filePath}`;
    });
    report += '\n';
    runs.forEach((run) => {
      const status = statusMessage(run);
      report += `\n  ${status}`;
      return;
    });
    overwriteΔ(report);
  }
};

function statusMessage(run: BettererRun): string {
  const name = quoteΔ(run.name);
  if (run.isBetter) {
    return testBetterΔ(name);
  }
  if (run.isComplete) {
    return testCompleteΔ(name);
  }
  if (run.isExpired) {
    return testExpiredΔ(name);
  }
  if (run.isFailed) {
    return testFailedΔ(name);
  }
  if (run.isNew) {
    return testNewΔ(name);
  }
  if (run.isSame) {
    return testSameΔ(name);
  }
  if (run.isSkipped) {
    return testSkippedΔ(name);
  }
  if (run.isUpdated) {
    return testUpdatedΔ(name);
  }
  if (run.isWorse) {
    return testWorseΔ(name);
  }
  throw new Error();
}

const LOGO = `
   \\ | /     _         _   _                     
 '-.ooo.-'  | |__  ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\/ _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_)|  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/\\___|\\__|\\__\\___|_|  \\___|_|   
 `;

function overwriteΔ(content: string): typeof logUpdate['done'] {
  logUpdate(`${LOGO}${'\n'}${content}`);
  return logUpdate.done.bind(logUpdate);
}
