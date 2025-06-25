const fs = require('fs');
const { encrypt } = require('./security');

module.exports = {
  secureLog: (data) => {
    const logEntry = {
      timestamp: new Date(),
      data: encrypt(JSON.stringify(data))
    };
    fs.appendFileSync('./logs/secure.log', logEntry + '\n');
  }
};
