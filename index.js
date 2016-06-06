'use strict';

const Tail = require('tail').Tail;
const net = require('net');
const os = require('os');
const server_host = process.env['LOGIO_HOST'] || '127.0.0.1';
const server_port = process.env['LOGIO_PORT'] || 28777;
const files = process.argv.slice(2)

var socket;
var connected = false;
var hostname = os.hostname();
files.forEach((file) => {
  new Tail(file).on('line', (line) => {
    if (!connected) return;
    socket.write(`+log|${file}|${hostname}|info|${line}\r\n`);
  });
});
socket = net.connect(server_port, server_host, () => {
  connected = true;
  socket.write(`+node|${hostname}|${files.join(',')}\r\n`);
});
