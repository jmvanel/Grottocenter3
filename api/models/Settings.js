/**
 * Settings.js
 *
 * @description :: Store GC settings
 */
'use strict';

module.exports = {
  tableName: 'settings',

  attributes: {
    id: {
      type: 'integer',
      unique: true,
      primaryKey: true,
      autoIncrement: true,
      columnName: 'Id'
    },

    key: {
      type: 'text',
      size: 255,
      required: true,
      columnName: 'Key'
    },

    value: {
      type: 'string',
      size: 255,
      columnName: 'Value'
    }
  }
};
