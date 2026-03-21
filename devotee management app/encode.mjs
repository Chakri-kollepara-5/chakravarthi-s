import { Buffer } from 'node:buffer';
function encodeVarint(value) {
  const bytes = [];
  while (value > 127) {
    bytes.push((value & 127) | 128);
    value >>>= 7;
  }
  bytes.push(value);
  return Buffer.from(bytes);
}
function encodeString(fieldNum, str) {
  const tag = encodeVarint((fieldNum << 3) | 2);
  const buf = Buffer.from(str, 'utf8');
  const len = encodeVarint(buf.length);
  return Buffer.concat([tag, len, buf]);
}
function encodeInt(fieldNum, val) {
  const tag = encodeVarint((fieldNum << 3) | 0);
  const v = encodeVarint(val);
  return Buffer.concat([tag, v]);
}
function encodeMessage(fieldNum, messageBuffer) {
  const tag = encodeVarint((fieldNum << 3) | 2);
  const len = encodeVarint(messageBuffer.length);
  return Buffer.concat([tag, len, messageBuffer]);
}

const name = "projects/folkvizag-b6830/databases/(default)/collectionGroups/events/indexes/_";
const field1 = encodeString(1, name);
const field2 = encodeInt(2, 1); // QueryScope: COLLECTION

const idxField1 = Buffer.concat([
  encodeString(1, "groupId"),
  encodeInt(2, 1) // ASCENDING
]);

const idxField2 = Buffer.concat([
  encodeString(1, "createdAt"),
  encodeInt(2, 2) // DESCENDING
]);

const msg1 = encodeMessage(3, idxField1);
const msg2 = encodeMessage(3, idxField2);

const finalBuf = Buffer.concat([field1, field2, msg1, msg2]);
const base64 = finalBuf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
const link = `https://console.firebase.google.com/v1/r/project/folkvizag-b6830/firestore/indexes?create_composite=${base64}`;
import fs from 'fs';
fs.writeFileSync('url.txt', link);
console.log("Wrote URL to url.txt");
