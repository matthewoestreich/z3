module.exports.redText =  function redText(...str) {
  return `\x1b[31m${str.join(" ")}\x1b[0m`;
}

module.exports.yellowText =  function yellowText(...str) {
  return `\x1b[33m${str.join(" ")}\x1b[0m`;
}

module.exports.blueText = function blueText(...str) {
  return `\x1b[34m${str.join(" ")}\x1b[0m`;
}

 module.exports.greenText = function greenText(...str) {
  return `\x1b[32m${str.join(" ")}\x1b[0m`;
}