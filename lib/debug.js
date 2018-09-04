var chalk = require('chalk');
var Packet = require('vs-stun/lib/Packet');

//var leftArrow = '\u2190';
//var rightArrow = '\u2192';

function Logger(options) {
  this.level = options.level;
  this.levels = {
    error: 0,
    warn: 1,
    debug: 2,
  }
}
Logger.prototype.debug = function(msg) {
  if (this.levels[this.level] < this.levels['debug']) { return };
  console.log(msg);
}
Logger.prototype.warn = function(msg) {
  if (this.levels[this.level] < this.levels['warn']) { return; }
  console.warn(msg);
}
const logger = new Logger({level:'error'});

function printDebugPacket (p, rinfo) {
  var type = Packet.getType(p);
  var str = '';
  if (type === Packet.BINDING_SUCCESS) {
    str += chalk.green('[STUN] BINDING SUCCESS ');
  } else if (type === Packet.BINDING_REQUEST) {
    //logger.debug();
    str += chalk.yellow('[STUN] BINDING REQUEST ');
    //p.doc.attributes.forEach(function (attr) {
      //logger.debug(attr.name, attr.value.obj);
    //});
  } else {
    logger.debug();
    logger.debug(Packet.typeToString(p));
    p.doc.attributes.forEach(function (attr) {
      logger.debug(attr.name, attr.value.obj);
    });
  }
  str += chalk.blue(rinfo.address) + ':' + chalk.magenta(rinfo.port);
  logger.debug(str);
};

function printMatches (a, b) {
  logger.debug(chalk[a === b ? 'green' : 'red'](a + ' === ' + b));
  //logger.debug(typeof a, typeof b)
};

function printPeerReflexive (source, dest, candidatePair) {
  logger.debug('---');
  logger.warn('Found a peer reflexive candidate')
  printMatches(source.address, candidatePair.remote.ip);
  printMatches(source.port, candidatePair.remote.port);
  printMatches(dest.host, candidatePair.local.ip);
  printMatches(dest.port, candidatePair.local.port);
  logger.debug('---');
};

function formatAddrPort (obj) {
  return chalk.blue(obj.ip) + ':' + chalk.magenta(obj.port);
};

function printPairs (pairList) {
  logger.warn('valid list:')
  logger.warn('local -> remote');
  pairList.forEach(function (pair) {
    logger.warn(formatAddrPort(pair.local) + ' -> ' + formatAddrPort(pair.remote));
  });
  logger.warn('---');
};

function warnNonStunPacket (info, rinfo) {
  logger.warn('not a stun packet');
  logger.warn(info.address + ':' + info.port + ' -> ' + rinfo.address + ':' +
    rinfo.port);
};

function iceLocalHostCandidate (candidate) {
  logger.warn(chalk.cyan('[ICE] LOCAL HOST CANDIDATE ') +
    formatAddrPort(candidate));
};

function iceLocalSrflxCandidate (candidate) {
  logger.warn(chalk.cyan('[ICE] LOCAL SRFLX CANDIDATE ') +
    formatAddrPort(candidate));
};

function iceRemoteCandidate (candidate) {
  logger.warn(chalk.cyan('[ICE] REMOTE ' + candidate.type.toUpperCase() +
    ' CANDIDATE ') + formatAddrPort(candidate));
};

module.exports = {
  iceLocalHostCandidate: iceLocalHostCandidate,
  iceLocalSrflxCandidate: iceLocalSrflxCandidate,
  iceRemoteCandidate: iceRemoteCandidate,
  printDebugPacket: printDebugPacket,
  printPeerReflexive: printPeerReflexive,
  printPairs: printPairs,
  warnNonStunPacket: warnNonStunPacket,
};

