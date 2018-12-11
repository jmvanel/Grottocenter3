'use strict';
/**
 * Mapper for API V1 models
 *
 * BE CAREFULL Any change here must be reported on file apiV1.yaml!
 */

/* Models */

const EntryModel = {
  id: undefined,
  name: undefined,
  country: undefined,
  county: undefined,
  region: undefined,
  city: undefined,
  postalCode : undefined,
  latitude: undefined,
  longitude: undefined,
  altitude: undefined
};

const CountResult = {
  count: undefined
};

const MassifModel = {
  id: undefined,
  author: {},
  idReviewer: undefined,
  name: undefined,
  dateInscription: undefined,
  dateReviewed: undefined,
  caves: []
};

const GrottoModel = {
  id: undefined,
  name: undefined,
  country: undefined,
  region: undefined,
  city: undefined,
  postalCode: undefined,
  address: undefined,
  contact: undefined,
  yearBirth: undefined,
  latitude: undefined,
  longitude: undefined,
  customMessage: undefined,
  pictureFileName: undefined,
  isOfficialPartner: undefined,
  village: undefined,
  county: undefined,
  documentary: undefined,
  URL: undefined,
  Facebook: undefined,
  cavers: [],
  entries: [],
};

const CaveModel = {
  id: undefined,
  idAuthor: undefined,
  idReviewer: undefined,
  name: undefined,
  minDepth: undefined,
  maxDepth: undefined,
  depth : undefined,
  length: undefined,
  isDiving: undefined,
  temperature: undefined,
  dateInscription: undefined,
  dateReviewed: undefined,
};

/* Mappers */

module.exports = {
  convertToEntryModel: function(source) {
    let result = Object.assign({}, EntryModel);
    //console.log('Source : ' + JSON.stringify(source));
    result.id = source.id;
    result.name = source.name;
    result.country = source.country;
    result.county = source.county;
    result.region = source.region;
    result.city = source.city;
    result.postalCode = source.postalCode;
    result.latitude = source.latitude;
    result.longitude = source.longitude;
    result.altitude = source.altitude;
    return result;
  },

  convertToEntryList: function(source) {
    let entries = [];
    source.forEach((item) => {
      let entry = this.convertToEntryModel(item);
      entries.push(entry);
    });
    return entries;
  },

  convertToCountResult: function(source) {
    let result = Object.assign({}, CountResult);
    result.count = source.count;
    return result;
  },

  //Depecated for v1
  convertToOldSearchResult: function(source) {
    let results = {};
    let entries = [];
    source.forEach((item) => {
      let entry = this.convertToEntryModel(item);
      entries.push(entry);
    });
    results.entries = entries;
    return results;
  },

  /**
   * Function that return all data for the search
   * @param {*} source : the elasticsearch result
   */
  convertToCompleteSearchResult: function(source) {
    let res = {};
    let values = [];
    // For each result of the research, convert the item and add it to the json to send
    source.hits.hits.forEach((item) => {
      let data = '';
      // Convert the data according to its type
      switch(item._source.type){
        case 'entry':
          data = this.convertToEntryModel(item._source);
          break;
        case 'cave':
          data = this.convertToCaveModel(item._source);
          break;
        case 'grotto':
          data = this.convertToGrottoModel(item._source);
          break;
      }
      // Add the type of the data
      data.type = item._source.type;

      values.push(data);
    });
    res.results = values;
    return res;
  },

  /**
   * Function that return all data for the search but incomplete, that means only the id and the name
   * @param {*} source : the elasticsearch result
   */
  convertToSearchResult: function(source) {
    let res = {};
    let values = [];
    // For each result of the research, only keep the id and the name then add it to the json to send
    source.hits.hits.forEach((item) => {
      let data = {
        id: item._source.id,
        name: item._source.name,
        type: item._source.type,
      };
      values.push(data);
    });

    res.results = values;
    return res;
  },

  // ---------------- Cave Function ------------------------------

  convertToCaveModel: function(source) {
    let result = Object.assign({}, CaveModel);

    result.id = source.id;
    result.idAuthor = source.idAuthor;
    result.idReviewer = source.idReviewer;
    result.name = source.name;
    result.minDepth = source.minDepth;
    result.maxDepth = source.maxDepth;
    result.depth = source.depth;
    result.length = source.length;
    result.isDiving = source.isDiving;
    result.temperature = source.temperature;
    result.dateInscription = source.dateInscription;
    result.dateReviewed = source.dateReviewed;

    return result;
  },

  // ---------------- Massif Function ------------------------------

  //TODO: Choose which attributes to keep in author
  convertToMassifModel: function(source) {
    let result = Object.assign({}, MassifModel);

    // Store in author every attributes of the author
    let author = {
      id: source.author.id,
      nickname: source.author.nickname
    };

    // line to put every attributes of author inside another object author
    //Object.keys(source.author).forEach(f => author[f] = source.author[f]);
    
    // Save in result the object to return
    result.id = source.id;
    result.author = author;
    result.idReviewer = source.idReviewer;
    result.name = source.name;
    result.dateInscription = source.dateInscription;
    result.dateReviewed = source.dateReviewed;
    result.caves = source.caves;

    return result;
  },

  // ---------------- Grotto Function ---------------------------

  // TODO: Filter Entries information
  convertToGrottoModel: function(source) {
    let result = Object.assign({}, GrottoModel);

    // Select only attributes needed for cavers
    const cavers = source.cavers.map(caver => {
      return {
        id: caver.id,
        nickname: caver.nickname,
      };
    });
    
    // Build the result
    result.id = source.id;
    result.name = source.name;
    result.country = source.country;
    result.county = source.county;
    result.region = source.region;
    result.city = source.city;
    result.postalCode = source.postalCode;
    result.latitude = source.latitude;
    result.longitude = source.longitude;
    result.address = source.address;
    result.contact = source.contact;
    result.yearBirth = source.yearBirth;
    result.customMessage = source.customMessage;
    result.pictureFileName = source.pictureFileName;
    result.isOfficialPartner = source.isOfficialPartner;
    result.village = source.village;
    result.documentary = source.documentary;
    result.URL = source.URL;
    result.Facebook = source.Facebook;
    result.cavers = cavers;
    result.entries = source.entries;

    return result;
  },
};
