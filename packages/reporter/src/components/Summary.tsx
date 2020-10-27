import React, { FC } from 'react';

import { BettererSummary } from '@betterer/betterer';
import { BettererError } from '@betterer/errors';
import { Box } from 'ink';

export type SummaryProps = {
  error?: BettererError;
  summary?: BettererSummary;
};

export const Summary: FC<SummaryProps> = function Summary({ error, children }) {
  //   const better = summary.better.length;
  //   const failed = summary.failed.length;
  //   const ran = summary.ran.length;
  //   const same = summary.same.length;
  //   const skipped = summary.skipped.length;
  //   const updated = summary.updated.length;
  //   const worse = summary.worse.length;

  //   const { completed, expired, obsolete } = summary;

  //   infoΔ(testCheckedΔ(getTestsΔ(ran)));
  //   if (expired) {
  //     expired.forEach((run) => {
  //       errorΔ(testExpiredΔ(quoteΔ(run.name)));
  //     });
  //   }
  //   if (failed) {
  //     errorΔ(testFailedΔ(getTestsΔ(failed)));
  //   }
  //   if (summary.new.length) {
  //     infoΔ(testNewΔ(getTestsΔ(summary.new.length)));
  //   }
  //   if (obsolete) {
  //     obsolete.forEach((runName) => {
  //       errorΔ(testObsoleteΔ(quoteΔ(runName)));
  //     });
  //   }
  //   if (better) {
  //     successΔ(testBetterΔ(getTestsΔ(better)));
  //   }
  //   if (completed) {
  //     completed.forEach((run) => {
  //       successΔ(testCompleteΔ(quoteΔ(run.name)));
  //     });
  //   }
  //   if (same) {
  //     warnΔ(testSameΔ(getTestsΔ(same)));
  //   }
  //   if (skipped) {
  //     warnΔ(testSkippedΔ(getTestsΔ(skipped)));
  //   }
  //   if (updated) {
  //     infoΔ(testUpdatedΔ(getTestsΔ(updated)));
  //   }
  //   if (worse) {
  //     errorΔ(testWorseΔ(getTestsΔ(worse)));
  //     errorΔ(updateInstructionsΔ());
  //   }

  //   if (summary.hasDiff) {
  //     errorΔ(unexpectedDiffΔ());
  //     brΔ();
  //     diffΔ(summary.expected, summary.result);
  //     brΔ();
  //   }

  return (
    <Box>
      {children}
      {error && <Box>{error.message}</Box>}
    </Box>
  );
};
