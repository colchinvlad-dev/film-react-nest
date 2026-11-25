import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  describe('formatMessage', () => {
    it('должен формировать запись с полем level', () => {
      const result = logger.formatMessage('log', 'hello');
      expect(result).toBe('level=log\tmessage=hello\n');
    });

    it('должен разделять поля символом табуляции и завершать переносом строки', () => {
      const result = logger.formatMessage('warn', 'careful', 'Context');
      expect(result).toContain('\t');
      expect(result).toContain('context=Context');
      expect(result.endsWith('\n')).toBe(true);
    });

    it('должен сериализовать объектное сообщение в строку', () => {
      const result = logger.formatMessage('log', { foo: 'bar' });
      expect(result).toBe('level=log\tmessage={"foo":"bar"}\n');
    });

    it('не должен допускать в значениях символы табуляции и перевода строки', () => {
      const result = logger.formatMessage('log', 'line1\nline2\tend');
      expect(result).not.toContain('\nline2');
      expect(result.split('\t').length).toBe(2);
    });
  });

  describe('методы вывода', () => {
    const writeSpy = () =>
      jest.spyOn(process.stdout, 'write').mockImplementation(() => true);

    it('log должен выводить отформатированную строку через process.stdout.write', () => {
      const spy = writeSpy();
      logger.log('hello');
      expect(spy).toHaveBeenCalledWith('level=log\tmessage=hello\n');
      spy.mockRestore();
    });

    it('error должен выводить через process.stdout.write с уровнем error', () => {
      const spy = writeSpy();
      logger.error('boom');
      expect(spy).toHaveBeenCalledWith('level=error\tmessage=boom\n');
      spy.mockRestore();
    });
  });
});
