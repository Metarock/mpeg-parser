import { PACKETSIZE, SYNCBYTE } from './constants';

export const hasPid = (pids: number[], pid: number) => pids.includes(pid);

// handles the packet and extract PID
export const handleExtractPid = (packetBuffer: Buffer) =>
  ((packetBuffer[1] & 0x1f) << 8) | packetBuffer[2];

// handles the chunk of data and updates the array
export const handleChunk = (chunk: Buffer, pids: number[], packetIndex: number) => {
  const numPackets = Math.floor(chunk.length / PACKETSIZE);

  for (let index = 0; index < numPackets; index++) {
    const currentIndex = packetIndex + index;
    const byteOffset = currentIndex * PACKETSIZE;

    const packetBuffer = chunk.subarray(index * PACKETSIZE, (index + 1) * PACKETSIZE);
    if (packetBuffer[0] !== SYNCBYTE) {
      console.error(`Error: No sync byte present in packet ${currentIndex}, offset ${byteOffset}`);
      process.exit(1);
    }
    const pid = handleExtractPid(packetBuffer);
    if (!hasPid(pids, pid)) {
      pids.push(pid);
    }
  }
};
