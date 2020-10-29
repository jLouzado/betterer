import React, { FC } from 'react';

import { BettererError } from '@betterer/errors';
import { BettererLogo } from '@betterer/logger';
import { Box, Text } from 'ink';

export type ReporterProps = {
  error?: BettererError;
};

export const Reporter: FC<ReporterProps> = function Reporter({ error, children }) {
  return (
    <Box flexDirection="column">
      <BettererLogo></BettererLogo>
      {children}
      {error && (
        <Box>
          <Text>{error.message}</Text>
        </Box>
      )}
    </Box>
  );
};
