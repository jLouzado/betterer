import React, { FC } from 'react';

import { BettererError } from '@betterer/errors';
import { BettererLogo, BettererErrors } from '@betterer/logger';
import { Box } from 'ink';

export type ReporterProps = {
  error?: BettererError;
};

export const Reporter: FC<ReporterProps> = function Reporter({ error, children }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererLogo></BettererLogo>
      {children}
      {error && <BettererErrors error={error} />}
    </Box>
  );
};
