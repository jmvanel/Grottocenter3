/**
 * Settings.js
 *
 * @description :: Store GC settings
 */
'use strict';

module.exports = {
  tableName: 'api_keys',

  attributes: {
    apiKey: {
      type: 'text',
      primaryKey: true,
      unique: true,
      size: 255,
      columnName: 'ApiKey'
    },

    description: {
      type: 'string',
      size: 255,
      columnName: 'Description'
    },

    rightProfileId: {
      type: 'integer',
      columnName: 'RightProfileId'
    },

    limitProfileId: {
      type: 'integer',
      columnName: 'LimitProfileId'
    },

    active: {
      type: 'string',
      size: 3,
      defaultsTo: 'NO',
      columnName: 'Active'
    }
  }
};
