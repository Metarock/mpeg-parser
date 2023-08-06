import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleChunk, handleExtractPid, hasPid } from './helpers';
import { PACKETSIZE } from './constants';

describe('hasPid Function', async () => {
  it('should return true if pid exists in the array', () => {
    const pids = [100, 200, 300];
    const pid = 200;
    const result = hasPid(pids, pid);
    expect(result).toBe(true);
  });

  it('should return false if pid does not exist in the array', () => {
    const pids = [100, 200, 300];
    const pid = 400;
    const result = hasPid(pids, pid);
    expect(result).toBe(false);
  });
});

describe('handleExtractPid Function', async () => {
  it('should extract and calculate PID correctly', () => {
    const packetBuffer = Buffer.from([0x47, 0x11, 0x22, 0x33]);
    const pid = handleExtractPid(packetBuffer);

    expect(pid).toBe(4386);
  });
});

describe('Testing handleChunk function', async () => {
  // Mock valid and invalid mock data

  const invalidMockInputData = Buffer.from([
    0x46, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x47,
  ]);

  // Mock process.exit to capture exit calls
  const originalProcessExit = process.exit;

  let mockExitCode: number;
  const mockExit = vi.fn((code?: number) => {
    console.log(code);
    mockExitCode = code || 0;
  });
  beforeEach(() => {
    //@ts-ignore
    process.exit = mockExit;
  });

  afterEach(() => {
    process.exit = originalProcessExit;
  });

  // Mock console.log and console.error to capture log calls
  const mockConsoleLog = vi.spyOn(console, 'log');
  const mockConsoleError = vi.spyOn(console, 'error');

  beforeEach(() => {
    mockConsoleLog.mockReset();
    mockConsoleError.mockReset();
  });

  it('should handle an invalid sync byte and errors', () => {
    const packetIndex = 0;
    const pids = [0x1122];

    handleChunk(invalidMockInputData, pids, packetIndex);

    // mock process exit and error

    expect(mockConsoleError).toBeCalledWith('Error: No sync byte present in packet 0, offset 0');
    expect(pids).toEqual([0x1122]); //remain unchanged
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
