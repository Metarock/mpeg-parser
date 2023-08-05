import { PACKETSIZE } from './utils/constants';
import { handleChunk } from './utils/helpers';

const main = async () => {
  // Array to store pids
  const pids: number[] = [];

  // native standard input stream
  const stdin = process.stdin;

  let packetIndex = 0;

  stdin.on('readable', () => {
    let chunk: Buffer; //array of bytes

    // this is basically while its true; almost infiite loop. Refactor later on
    while ((chunk = stdin.read(PACKETSIZE)) !== null) {
      handleChunk(chunk, pids, packetIndex);

      // number of packets that can fit in a chunk
      const numPackets = Math.floor(chunk.length / PACKETSIZE);
      packetIndex += numPackets;
    }
  });

  stdin.on('end', () => {
    if (pids.length > 0) {
      const sortedPids = pids.sort((a, b) => a - b);

      sortedPids.map((pid) => {
        console.log(`0x${pid.toString(16).toUpperCase()}`);
      });
    }
  });
};

main().catch((error) => {
  console.log({ error });
});
