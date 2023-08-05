const PACKETSIZE = 188; // size of bytes for each MPEG TS packet
const SYNCBYTE = 0x47; //expected beginning val of sync byte
const PIDMASK = 0x1fff; //Bitmask to extract the PID

const hasPid = (pids: number[], pid: number) => pids.includes(pid);

// handles the packet and extract PID
const handlePacket = (packetBuffer: Buffer) => ((packetBuffer[1] & 0x1f) << 8) | packetBuffer[2];

// handles the chunk of data and updates the array
const handleChunk = (chunk: Buffer, pids: number[]) => {
  const packetBuffer = Math.floor(chunk.length / PACKETSIZE);

  for (let curerntPacketIndex = 0; curerntPacketIndex < packetBuffer; curerntPacketIndex++) {
    const packetBuffer = chunk.subarray(
      curerntPacketIndex * PACKETSIZE,
      (curerntPacketIndex + 1) * PACKETSIZE,
    );
    if (packetBuffer[0] !== SYNCBYTE) {
      console.error(
        `Error: No sync byte present in packet ${curerntPacketIndex}, offset ${
          curerntPacketIndex * PACKETSIZE
        }`,
      );
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

  stdin.on('readable', () => {
    let chunk: Buffer; //array of bytes

    //read data

    // this is basically while its true; almost infiite loop. Refactor later on
    while ((chunk = stdin.read(PACKETSIZE)) !== null) {
      handleChunk(chunk, pids);
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
