import { Injectable, LoggerService } from '@nestjs/common';

const escapeField = (value: string): string =>
  String(value)
    .replace(/[\t\n\r]/g, ' ')
    .trim();

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: unknown, ...optionalParams: unknown[]) {
    const fields: string[] = [`level=${escapeField(level)}`];

    if (message === undefined || message === null || message === '') {
      fields.push('message=null');
    } else if (typeof message === 'object') {
      fields.push(`message=${escapeField(JSON.stringify(message))}`);
    } else {
      fields.push(`message=${escapeField(String(message))}`);
    }

    if (optionalParams.length > 0) {
      fields.push(
        `context=${escapeField(optionalParams.map(String).join(','))}`,
      );
    }

    return `${fields.join('\t')}\n`;
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.write('log', message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.write('error', message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.write('warn', message, optionalParams);
  }

  debug?(message: unknown, ...optionalParams: unknown[]) {
    this.write('debug', message, optionalParams);
  }

  verbose?(message: unknown, ...optionalParams: unknown[]) {
    this.write('verbose', message, optionalParams);
  }

  fatal?(message: unknown, ...optionalParams: unknown[]) {
    this.write('fatal', message, optionalParams);
  }

  private write(level: string, message: unknown, optionalParams: unknown[]) {
    process.stdout.write(this.formatMessage(level, message, ...optionalParams));
  }
}
