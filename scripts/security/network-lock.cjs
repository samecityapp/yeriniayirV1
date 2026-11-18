// OS/Socket-level egress blocker loaded into test & child Next processes via NODE_OPTIONS.
// Strictly blocks any TCP/TLS/DNS/UDP/fetch attempt outside 127.0.0.1 / localhost / ::1.
const net = require('node:net');
const dns = require('node:dns');
const dgram = require('node:dgram');

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

function normalizeHost(rawHost) {
  if (!rawHost) return 'localhost';
  return String(rawHost).trim().toLowerCase();
}

function isAllowedHost(host) {
  return LOOPBACK_HOSTS.has(normalizeHost(host));
}

function extractConnectTarget(args) {
  if (Array.isArray(args[0])) {
    return extractConnectTarget(args[0]);
  }
  if (typeof args[0] === 'object' && args[0] !== null) {
    return args[0];
  }
  return {
    port: args[0],
    host: typeof args[1] === 'string' ? args[1] : 'localhost',
  };
}

const originalSocketConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const opts = extractConnectTarget(args);
  // Allow local UNIX IPC pipes used by Next.js / Node internal workers when no remote host is specified.
  if (opts && opts.path && !opts.host) {
    return originalSocketConnect.apply(this, args);
  }
  const host = opts?.host || opts?.hostname || 'localhost';
  if (!isAllowedHost(host)) {
    throw new Error(`TEST_EGRESS_BLOCKED: outbound TCP socket refused (${host})`);
  }
  return originalSocketConnect.apply(this, args);
};

const originalDnsLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  if (!isAllowedHost(hostname)) {
    const err = new Error(`TEST_EGRESS_BLOCKED: outbound DNS lookup refused (${hostname})`);
    if (typeof cb === 'function') return queueMicrotask(() => cb(err));
    throw err;
  }
  return originalDnsLookup.apply(this, arguments);
};

if (dns.promises && typeof dns.promises.lookup === 'function') {
  const origPromisesLookup = dns.promises.lookup.bind(dns.promises);
  dns.promises.lookup = async function (hostname, options) {
    if (!isAllowedHost(hostname)) {
      throw new Error(`TEST_EGRESS_BLOCKED: outbound DNS lookup refused (${hostname})`);
    }
    return origPromisesLookup(hostname, options);
  };
}

dgram.createSocket = function () {
  throw new Error('TEST_EGRESS_BLOCKED: outbound UDP socket refused');
};

if (typeof globalThis.fetch === 'function') {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input, init) => {
    const raw =
      typeof input === 'string' || input instanceof URL ? input.toString() : input?.url || '';
    let parsed;
    try {
      parsed = new URL(raw);
    } catch {
      throw new Error('TEST_EGRESS_BLOCKED: non-absolute fetch refused');
    }
    if (parsed.protocol !== 'http:' || !isAllowedHost(parsed.hostname)) {
      throw new Error(`TEST_EGRESS_BLOCKED: outbound fetch refused (${parsed.origin})`);
    }
    return originalFetch(input, init);
  };
}
