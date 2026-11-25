import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  describe('formatMessage', () => {
    it('должен возвращать корректную JSON-строку с полем level', () => {
      const result = logger.formatMessage('log', 'message', []);
      expect(result).toBe(
        JSON.stringify({
          level: 'LOG',
          message: 'message',
          optionalParams: [],
        }),
      );
    });

    it('должен приводить уровень к верхнему регистру', () => {
      const result = logger.formatMessage('error', 'boom', []);
      expect(JSON.parse(result).level).toBe('ERROR');
    });

    it('должен корректно сериализовывать объектное сообщение', () => {
      const result = logger.formatMessage('log', { foo: 'bar' }, [1, 2]);
      const parsed = JSON.parse(result);
      expect(parsed.message).toEqual({ foo: 'bar' });
      expect(parsed.optionalParams).toEqual([1, 2]);
    });
  });

  describe('методы вывода', () => {
    it('log должен выводить в console.log отформатированный JSON', () => {
      const spy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);
      logger.log('hello');
      expect(spy).toHaveBeenCalledWith(
        JSON.stringify({ level: 'LOG', message: 'hello', optionalParams: [] }),
      );
      spy.mockRestore();
    });

    it('error должен выводить в console.error', () => {
      const spy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);
      logger.error('fail');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('warn должен выводить в console.warn', () => {
      const spy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      logger.warn('careful');
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it.each([
      {
        method: 'debug' as const,
        level: 'DEBUG',
        consoleMethod: 'debug' as const,
      },
      {
        method: 'verbose' as const,
        level: 'VERBOSE',
        consoleMethod: 'log' as const,
      },
      {
        method: 'fatal' as const,
        level: 'FATAL',
        consoleMethod: 'error' as const,
      },
    ])(
      '$method должен выводить в console.$consoleMethod сообщение уровня $level',
      ({ method, level, consoleMethod }) => {
        const spy = jest
          .spyOn(console, consoleMethod)
          .mockImplementation(() => undefined);
        logger[method]?.('msg');
        expect(spy).toHaveBeenCalledWith(
          JSON.stringify({ level, message: 'msg', optionalParams: [] }),
        );
        spy.mockRestore();
      },
    );
  });
});
