import React, { FC } from 'react';

import { BettererSummary } from '@betterer/betterer';
import { diffΔ } from '@betterer/logger';
import { Box, Text } from 'ink';

import {
  testBetterΔ,
  testCheckedΔ,
  testCompleteΔ,
  testExpiredΔ,
  testFailedΔ,
  testNewΔ,
  testObsoleteΔ,
  testSameΔ,
  testSkippedΔ,
  testUpdatedΔ,
  testWorseΔ,
  unexpectedDiffΔ,
  updateInstructionsΔ
} from '../messages';
import { quoteΔ } from '../utils';

export type SummaryProps = {
  summary: BettererSummary;
};

export const Summary: FC<SummaryProps> = function Summary({ summary }) {
  const better = summary.better.length;
  const failed = summary.failed.length;
  const neww = summary.new.length;
  const ran = summary.ran.length;
  const same = summary.same.length;
  const skipped = summary.skipped.length;
  const updated = summary.updated.length;
  const worse = summary.worse.length;
  const { completed, expired, obsolete } = summary;

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text color="gray">{testCheckedΔ(tests(ran))}</Text>
      {expired.map((run) => {
        <Text key={`${run.name}-expired`} color="brightRed">
          {testExpiredΔ(quoteΔ(run.name))})
        </Text>;
      })}
      {failed ? <Text color="brightRed">{testFailedΔ(tests(failed))}</Text> : null}
      {neww ? <Text color="gray">{testNewΔ(tests(neww))}</Text> : null}
      {obsolete.map((runName) => {
        <Text key={`${runName}-obsolete`} color="brightRed">
          {testObsoleteΔ(quoteΔ(runName))})
        </Text>;
      })}
      {better ? <Text color="greenBright">{testBetterΔ(tests(better))}</Text> : null}
      {completed.map((run) => {
        <Text key={`${run.name}-completed`} color="greenBright">
          {testCompleteΔ(quoteΔ(run.name))})
        </Text>;
      })}
      {same ? <Text color="yellowBright">{testSameΔ(tests(same))}</Text> : null}
      {skipped ? <Text color="yellowBright">{testSkippedΔ(tests(skipped))}</Text> : null}
      {updated ? <Text color="gray">{testUpdatedΔ(tests(updated))}</Text> : null}
      {worse ? (
        <>
          <Text color="red">{testWorseΔ(tests(worse))}</Text>
          <Text>{updateInstructionsΔ()}</Text>
        </>
      ) : null}
      {summary.hasDiff ? (
        <>
          <Text color="red">{unexpectedDiffΔ()}</Text>
          <Text>{diffΔ(summary.expected, summary.result)}</Text>{' '}
        </>
      ) : null}
    </Box>
  );
};

function tests(n: number): string {
  return n === 1 ? `${n} test` : `${n} tests`;
}
