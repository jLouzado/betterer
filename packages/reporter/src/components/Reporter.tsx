import React, { FC } from 'react';

import { BettererError } from '@betterer/errors';
import { BettererLogo } from '@betterer/logger';
import { Box } from 'ink';

import { Error } from './Error';

export type ReporterProps = {
  error?: BettererError;
};

export const Reporter: FC<ReporterProps> = function Reporter({ error, children }) {
  return (
    <Box flexDirection="column" paddingBottom={1}>
      <BettererLogo></BettererLogo>
      {children}
      {error && <Error error={error} />}
    </Box>
  );
};
