// SETUP
const hexChars = {
  0: "0000", 1: "0001", 2: "0010", 3: "0011", 4: "0100", 5: "0101", 6: "0110", 7: "0111",
  8: "1000", 9: "1001", A: "1010", B: "1011", C: "1100", D: "1101", E: "1110", F: "1111",
};
const operations_codes = {
  0: 'sum', 1: 'product', 2: 'min', 3: 'max', 4: 'value', 5: 'gt', 6: 'lt', 7: 'eq',
};

const hexToBinary = text => text.split('').map(hex_char => hexChars[hex_char]).join('');

const getHeader = binary => ({ // Header, from first 7 bits
  version:     parseInt(binary.slice(0,3), 2),
  type:        parseInt(binary.slice(3,6), 2),
  length_type: parseInt(binary.slice(6,7), 2),
});

const readLiteral = binary => {
  let i = 6;
  let binary_value = '';
  while (binary[i] === '1') {
    binary_value += binary.slice(i+1, i+5);
    i += 5;
  }
  binary_value += binary.slice(i+1, i+5);
  return {
    value: parseInt(binary_value, 2),
    length: i+5,
  };
};

const decodePacket = binary => {
  const { version, type, length_type } = getHeader(binary);
  if (type === 4) {
    const { value, length } = readLiteral(binary);
    return {
      packet: { version, type, value },
      length,
    };
  }
  if (length_type === 0) {
    const subpackets_length = parseInt(binary.slice(7, 22), 2);
    const subpackets = readPackets(binary.slice(22, 22 + subpackets_length)).packets;
    return {
      packet: { version, type, length_type, subpackets },
      length: 22 + subpackets_length,
    };
  }
  if (length_type === 1) {
    const number_subpackets = parseInt(binary.slice(7, 18), 2);
    let subpackets = [];
    let pointer = 18;
    while (subpackets.length < number_subpackets) {
      const { packet, length } = decodePacket(binary.slice(pointer));
      pointer += length;
      subpackets = subpackets.concat(packet);
    }
    return {
      packet: { version, type, length_type, subpackets },
      length: pointer,
    };
  }
  return null;
};
const readPackets = binary => {
  let i = 0;
  let packets = [];
  while (i < binary.length) {
    const decoded_packet = decodePacket(binary.slice(i));
    if (decoded_packet) {
      i += decoded_packet.length;
      packets = packets.concat(decoded_packet.packet);
    } else {
      i = binary.length;
    }
  }
  return { packets, length: i };
};

const input = document.body.innerText.trim();
const clean_packet = decodePacket(hexToBinary(input)).packet;

// A
const getVersionSum = packet => packet.version + (packet.subpackets || []).reduce(
  (subpacket_version_sum, subpacket) => subpacket_version_sum + getVersionSum(subpacket), 0
);
const result_A = getVersionSum(clean_packet);

// B
const processOperations = ({ type, subpackets, value }) => {
  const op_name = operations_codes[type];
  switch (op_name) {
    case 'sum':
      return subpackets.map(processOperations).reduce((sum, value) => sum + value, 0);
    case 'product':
      return subpackets.map(processOperations).reduce((prod, value) => prod * value, 1);
    case 'min':
      return Math.min(...subpackets.map(processOperations));
    case 'max':
      return Math.max(...subpackets.map(processOperations));
    case 'value':
      return value;
    case 'gt':
      return processOperations(subpackets[0]) > processOperations(subpackets[1]) ? 1 : 0;
    case 'lt':
      return processOperations(subpackets[0]) < processOperations(subpackets[1]) ? 1 : 0;
    case 'eq':
      return processOperations(subpackets[0]) === processOperations(subpackets[1]) ? 1 : 0;
  }
};
const result_B= processOperations(clean_packet);
