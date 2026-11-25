import { Injectable, LoggerService } from '@nestjs/common';

const escapeField = (value: string): string =>
  String(value)
    .replace(/[\t\n\r]/g, ' ')
    .trim();

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const fields: string[] = [`level=${escapeField(level)}`];

    if (message === undefined || message === null || message === '') {
      fields.push('message=null');
    } else if (typeof message === 'object') {
      fields.push(`message=${escapeField(JSON.stringify(message))}`);
    } else {
      fields.push(`message=${escapeField(message)}`);
    }

    if (optionalParams.length > 0) {
      fields.push(`context=${escapeField(optionalParams.join(','))}`);
    }

    return `${fields.join('\t')}\n`;
  }

  log(message: any, ...optionalParams: any[]) {
    this.write('log', message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.write('error', message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.write('warn', message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.write('debug', message, optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.write('verbose', message, optionalParams);
  }

  fatal?(message: any, ...optionalParams: any[]) {
    this.write('fatal', message, optionalParams);
  }

  private write(level: string, message: any, optionalParams: any[]) {
    console.log(this.formatMessage(level, message, ...optionalParams));
  }
}
