'use strict';

module.exports = {
  getKeyPrm: function(key) {
    return new Promise((resolve, reject) => {
      ApiKeys.findOne({apiKey: key}).exec((err, found) => {
        if (err) {
          reject(err);
        } else {
          resolve(found);
        }
      });
    });
  }
};
