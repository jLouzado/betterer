import React, { FC } from 'react';
import { Box, Text } from 'ink';

import { LOGO } from '@betterer/logger/dist/console-logger';

export const BettererLogo: FC = function BettererLogo() {
  return (
    <Box flexDirection="column">
      <Text color="yellowBright">{LOGO}</Text>
    </Box>
  );
};
