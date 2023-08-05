const PACKETSIZE = 188; // size of bytes for each MPEG TS packet
const SYNCBYTE = 0x47; //expected beginning val of sync byte
const PIDMASK = 0x1fff; //Bitmask to extract the PID

const hasPid = (pids: number[], pid: number) => pids.includes(pid);

// handles the packet and extract PID
const handlePacket = (packetBuffer: Buffer) => ((packetBuffer[1] & 0x1f) << 8) | packetBuffer[2];

// handles the chunk of data and updates the array
const handleChunk = (chunk: Buffer, pids: number[], packetIndex: number) => {
  const numPackets = Math.floor(chunk.length / PACKETSIZE);

  for (let index = 0; index < numPackets; index++) {
    const currentIndex = packetIndex + index;
    const byteOffset = currentIndex * PACKETSIZE;

    const packetBuffer = chunk.subarray(index * PACKETSIZE, (index + 1) * PACKETSIZE);
    if (packetBuffer[0] !== SYNCBYTE) {
      console.error(`Error: No sync byte present in packet ${currentIndex}, offset ${byteOffset}`);
      process.exit(1);
    }
    const pid = handlePacket(packetBuffer);
    if (!hasPid(pids, pid)) {
      pids.push(pid);
    }
  }
};
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
