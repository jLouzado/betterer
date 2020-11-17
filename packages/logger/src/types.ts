export type BettererLoggerMessages = ReadonlyArray<string>;
export type BettererLogFunction = (...messages: BettererLoggerMessages) => void;

export type BettererLoggerCodeInfo = {
  message: string;
  filePath: string;
  fileText: string;
  line: number;
  column: number;
  length: number;
};
export type BettererLogCodeFunction = (codeInfo: BettererLoggerCodeInfo) => void;

export type BettererLogger = {
  code: BettererLogCodeFunction;
  error: BettererLogFunction;
  info: BettererLogFunction;
  success: BettererLogFunction;
  warn: BettererLogFunction;
  unmute(): void;
  mute(): void;
};
