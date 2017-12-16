'use strict';

module.exports = {
  getSettingPrm: function(key) {
    return new Promise((resolve, reject) => {
      Settings.findOneByKey(key).exec((err, found) => {
        if (err) {
          reject(err);
        } else {
          resolve(found);
        }
      });
    });
  },
  
  getSetting: function(key) {
    return new Promise((resolve, reject) => {
      // TODO replace by an access to table settings
      // For now, just implement a switchcase
      switch (key) {
        case 'map.partition.row':
          resolve(8);
          break;
        case 'map.partition.column':
          resolve(10);
          break;
        case 'map.partition.group.minsize':
          resolve(50);
          break;
        default:
          reject('Key not found');
      }
    });
  }
};
