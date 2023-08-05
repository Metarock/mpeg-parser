const PACKETSIZE = 188; // size of bytes for each MPEG TS packet
const SYNCBYTE = 0x47; //expected beginning val of sync byte
const PIDMASK = 0x1fff; //Bitmask to extract the PID

const main = async () => {
  // Array to store pids
  const pids: number[] = [];

  //current byte offest in the stream
  let currentbyteOffSet = 0;
  //index of packet being read
  let curerntPacketIndex = 0;
  // native standard input stream
  const stdin = process.stdin;

  stdin.on('readable', () => {
    let chunk: Buffer; //array of bytes

    //read data
    console.log((chunk = stdin.read(PACKETSIZE)) !== null);

    // this is basically while its true; almost infiite loop. Refactor later on
    while ((chunk = stdin.read(PACKETSIZE)) !== null) {
      // current number of bytes in current chunk
      const numberOfBytes = chunk.length;

      // loop through it
      for (let offset = 0; offset + PACKETSIZE <= numberOfBytes; offset += PACKETSIZE) {
        const packetBuffer = chunk.subarray(offset, offset + PACKETSIZE);

        console.log(packetBuffer);

        if (packetBuffer[0] !== SYNCBYTE) {
          console.error(
            `Error: No sync byte present in packet ${curerntPacketIndex}, offset ${currentbyteOffSet}`,
          );
          process.exit(1);
        }

        // Extract and calculate the PID from the packet header
        const pid = ((packetBuffer[1] & 0x1f) << 8) | packetBuffer[2];

        if (!pids.includes(pid)) {
          pids.push(pid);
        }

        currentbyteOffSet += PACKETSIZE;
        curerntPacketIndex++;
      }
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
