import { codeFrameColumns } from '@babel/code-frame';
import chalk from 'chalk';
import LinesAndColumns from 'lines-and-columns';
import * as path from 'path';

import { BettererLogFunction, BettererLogger, BettererLoggerCodeInfo, BettererLoggerMessages } from './types';

const ERROR_BLOCK = chalk.bgRed('  ');
const IS_JS_REGEXP = /.t|jsx?$/;
export const LOGO = `
   \\ | /     _         _   _                     
 '-.ooo.-'  | |__  ___| |_| |_ ___ _ __ ___ _ __ 
---ooooo--- | '_ \\/ _ \\ __| __/ _ \\ '__/ _ \\ '__|
 .-'ooo'-.  | |_)|  __/ |_| ||  __/ | |  __/ |   
   / | \\    |_.__/\\___|\\__|\\__\\___|_|  \\___|_|   
 `;
const NEW_LINE = '\n';

const HEADING = chalk.bgBlack.yellowBright.bold(` ☀️  betterer `);

export class BettererConsoleLogger implements BettererLogger {
  public success: BettererLogFunction;
  public info: BettererLogFunction;
  public warn: BettererLogFunction;
  public error: BettererLogFunction;

  private _muted = false;

  constructor() {
    this.success = this._createLogger(chalk.bgGreenBright.black(' succ '), chalk.bgBlack(' ✅ '));
    this.info = this._createLogger(chalk.bgWhiteBright.black(' info '), chalk.bgBlack(' 💬 '));
    this.warn = this._createLogger(chalk.bgYellowBright.black(' warn '), chalk.bgBlack(' 🚨 '));
    this.error = this._createLogger(chalk.bgRedBright.white(' erro '), chalk.bgBlack(' 🔥 '));
  }

  public code(codeInfo: BettererLoggerCodeInfo): void {
    const { filePath, fileText, message } = codeInfo;
    const isJS = IS_JS_REGEXP.exec(path.extname(filePath));
    const options = {
      highlightCode: !!isJS
    };
    const lc = new LinesAndColumns(fileText);
    const startLocation = codeInfo;
    const startIndex = lc.indexForLocation(startLocation) || 0;
    const endLocation = lc.locationForIndex(startIndex + codeInfo.length) || startLocation;
    const start = {
      line: startLocation.line + 1,
      column: startLocation.column + 1
    };
    const end = {
      line: endLocation.line + 1,
      column: endLocation.column + 1
    };
    const codeFrame = codeFrameColumns(fileText, { start, end }, options);
    const codeMessage = chalk.bgBlack.white(message.trim());
    this._log(`${NEW_LINE}${ERROR_BLOCK} ${codeMessage.split(NEW_LINE).join(`\n${ERROR_BLOCK} `)}\n\n${codeFrame}`);
  }

  public mute(): void {
    this._muted = true;
  }

  public unmute(): void {
    this._muted = false;
  }

  private _log(...args: Array<string>): void {
    if (!this._muted) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  }

  private _createLogger(name: string, icon: string): BettererLogFunction {
    const SPACER = chalk.bgBlack.yellowBright(' - ');
    return (...messages: BettererLoggerMessages): void => {
      this._log(`${HEADING}${name}${icon}${SPACER}`, ...messages.map((m) => chalk.whiteBright(m)));
    };
  }
}
