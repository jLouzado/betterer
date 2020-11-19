import React, { FC, useContext, useEffect, useState } from 'react';
import chalk from 'chalk';
import { Box, Text } from 'ink';

import { BettererTasksContext } from './state';
import { BettererTaskStatus } from './status';
import { BettererTaskContext, BettererTaskError, BettererTaskLog, BettererTaskLogs } from './types';
import { BettererLoggerCodeInfo } from '../../types';
import { code } from '../../code';

export type BettererTaskProps = {
  context: BettererTaskContext;
};

export const BettererTask: FC<BettererTaskProps> = function BettererTask({ context }) {
  const dispatch = useContext(BettererTasksContext);
  const { name, run } = context;
  const [running, setRunning] = useState(true);
  const [status, setStatus] = useState<BettererTaskLog | null>(null);
  const [logMessages, setLogMessages] = useState<BettererTaskLogs>([]);

  useEffect(() => {
    void (async () => {
      let statusMessages: BettererTaskLogs = [];
      dispatch({ type: 'start' });
      try {
        const result = await run({
          status(status: string) {
            setStatus(['🤔', 'whiteBright', status]);
          },
          code(codeInfo: BettererLoggerCodeInfo): void {
            const { message } = codeInfo;
            const codeFrame = code(codeInfo);
            this.info(message.trim());
            statusMessages = [...statusMessages, ['💻', 'magentaBright', codeFrame]];
            setLogMessages(statusMessages);
          },
          debug(status: string) {
            statusMessages = [...statusMessages, ['🤯', 'blueBright', status]];
            setLogMessages(statusMessages);
          },
          error(status: string) {
            statusMessages = [...statusMessages, ['🔥', 'redBright', status]];
            setLogMessages(statusMessages);
          },
          info(status: string) {
            statusMessages = [...statusMessages, ['💭', 'gray', status]];
            setLogMessages(statusMessages);
          },
          success(status: string) {
            statusMessages = [...statusMessages, ['✅', 'greenBright', status]];
            setLogMessages(statusMessages);
          },
          warn(status: string) {
            statusMessages = [...statusMessages, ['🚨', 'yellowBright', status]];
            setLogMessages(statusMessages);
          }
        });

        if (typeof result === 'string') {
          setStatus(['✅', 'greenBright', result]);
        } else if (!result) {
          setStatus(['✅', 'greenBright', 'done!']);
        } else {
          setStatus(result);
        }
        dispatch({ type: 'stop' });
      } catch (error) {
        const [status, ...logs] = errorMessages(error);
        setStatus(status);
        statusMessages = [...statusMessages, ...logs];
        setLogMessages(statusMessages);
        dispatch({ type: 'error' });
        process.exitCode = 1;
      }
      setRunning(false);
    })();
  }, []);

  return (
    <Box flexDirection="column">
      {!running && status && <BettererTaskStatus name={name} status={status} />}
      {logMessages.length ? (
        <Box flexDirection="column">
          {logMessages.map((log, index) => (
            <Text key={`${name}-log-${index}`}>{prependLogBlock(log)}</Text>
          ))}
        </Box>
      ) : null}
      {running && status && <BettererTaskStatus name={name} status={status} />}
    </Box>
  );
};

function errorMessages(error: BettererTaskError): BettererTaskLogs {
  const messages = [error.message, error.details, error.stack].filter(Boolean) as Array<string>;
  return messages.map((message) => ['🔥', 'redBright', message]);
}

function prependLogBlock(log: BettererTaskLog): string {
  const [, colour, message] = log;
  return prependBlock(message, chalk[colour]('   ▸'));
}

function prependBlock(message: string, block: string): string {
  return message
    .toString()
    .split('\n')
    .map((line) => `${block} ${line}`)
    .join('\n');
}
