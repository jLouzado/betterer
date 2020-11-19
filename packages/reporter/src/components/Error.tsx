import React, { FC } from 'react';

import { BettererError, isBettererError } from '@betterer/errors';
import { Box, Text } from 'ink';

export type ErrorProps = {
  error: Error | BettererError;
};

let errorCount = 0;

export const Error: FC<ErrorProps> = function Error({ error }) {
  if (!isBettererError(error)) {
    return (
      <>
        <Text>{error.message}</Text>
        <Text>{error.stack}</Text>
      </>
    );
  }
  const errors = error.details.filter((detail) => isError(detail)) as Array<Error | BettererError>;
  return (
    <>
      <Box>
        <Text color="redBright">Error:</Text>
        <Text> </Text>
        <Text>{error.message}</Text>
      </Box>
      {errors.map((error) => (
        <Error key={errorCount++} error={error} />
      ))}
    </>
  );
};

function isError(value: unknown): value is Error | BettererError {
  return (value as Error).message != null && (value as Error).stack !== null;
}
