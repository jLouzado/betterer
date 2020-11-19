import React, { FC } from 'react';

import { BettererError, isBettererError, isErrorLike } from '@betterer/errors';
import { Box, Text } from 'ink';

export type ErrorProps = {
  error: Error | BettererError;
};

export const Error: FC<ErrorProps> = function Error({ error }) {
  if (!isBettererError(error)) {
    return (
      <>
        <Text>{error.message}</Text>
        <Text>{error.stack}</Text>
      </>
    );
  }
  const errors = error.details.filter((detail) => isErrorLike(detail)) as Array<Error | BettererError>;
  return (
    <>
      <Box>
        <Text color="redBright">Error:</Text>
        <Text> </Text>
        <Text>{error.message}</Text>
      </Box>
      {errors.map((error, index) => (
        <Error key={`${error.message}-${index}`} error={error} />
      ))}
    </>
  );
};
