function ipToInt(ip: string): number {
  return (
    ip
      .split(".")
      .map(Number)
      .reduce((acc, octet) => (acc << 8) + octet) >>> 0
  );
}

export function isInCidr(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split("/");
  const maskBits = parseInt(bits, 10);
  const mask = maskBits === 0 ? 0 : ~((1 << (32 - maskBits)) - 1) >>> 0;

  const ipInt = ipToInt(ip);
  const rangeInt = ipToInt(range);

  return (ipInt & mask) === (rangeInt & mask);
}
