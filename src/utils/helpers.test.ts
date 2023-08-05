import { describe, expect, it, vi } from 'vitest';
import { handleChunk, handleExtractPid, hasPid } from './helpers';

describe('hasPid Function', () => {
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

describe('handleExtractPid Function', () => {
  it('should extract and calculate PID correctly', () => {
    const packetBuffer = Buffer.from([0x47, 0x11, 0x22, 0x33]);
    const pid = handleExtractPid(packetBuffer);

    expect(pid).toBe(4386);
  });
});

describe('Testing handleChunk function', async () => {
  // Mock valid and invalid mock data
  const validMockInputData = Buffer.from([
    0x47, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x47,
    0x10, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);

  const invalidMockInputData = Buffer.from([
    0x46, 0x10, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x47,
    0x10, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  ]);

  it('should handle errors', () => {
    const packetIndex = 0;
    const pids = [0x1122];

    const mockExit = vi.spyOn(process, 'exit').mockImplementation((number) => {
      throw new Error('process.exit: ' + number);
    });
    handleChunk(invalidMockInputData, pids, packetIndex);

    expect(pids).toEqual([0x1122]); //remain unchanged
    console.log(mockExit.mock.calls);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});
