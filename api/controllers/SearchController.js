/**
 */

const ElasticSearch = require('../services/ElasticsearchService');

const advancedSearchTypes = ['massifs', 'entrances', 'grottos', 'documents'];

module.exports = {
  /**
   * Perform a quick search using multiple URL parameters :
   * - resourceType:  string, entity type to search for (@see advancedSearchTypes) (FACULTATIVE).
   *                  By default, search on all entities
   **/
  search: (req, res) => {
    if (!req.param('query')) {
      return res.badRequest();
    }

    // By default, the query asked will send every information.
    // We can limit these information just by adding a "complete" parameter to false in the query.
    let complete = true;
    if (req.param('complete') === 'false' || req.param('complete') === false) {
      complete = false;
    }

    const params = {
      searchedItem: `Search entity with the following query ${req.param(
        'query',
      )}`,
    };

    // Extract search parameters
    const searchParams = {
      from: req.param('from'),
      size: req.param('size'),
      query: req.param('query'),
      resourceType: req.param('resourceType'),
      resourceTypes: req.param('resourceTypes'),
    };

    // Use the Elasticsearch Service to do the search according to the parameters of the URL
    return ElasticSearch.searchQuery(searchParams)
      .then((results) => {
        if (complete) {
          return ControllerService.treatAndConvert(
            req,
            undefined,
            results,
            params,
            res,
            MappingV1Service.convertToCompleteSearchResult,
          );
        }
        return ControllerService.treatAndConvert(
          req,
          undefined,
          results,
          params,
          res,
          MappingV1Service.convertEsToSearchResult,
        );
      })
      .catch((err) => {
        return ControllerService.treatAndConvert(
          req,
          err,
          undefined,
          params,
          res,
          MappingV1Service.convertEsToSearchResult,
        );
      });
  },

  /**
   * Perform an advanced search using multiple URL parameters :
   * - resourceType: string, entity type to search for (@see advancedSearchTypes) (NEEDED)
   * - complete: bool, determine if the results must be returned in their entirely or just their id and name (default = false) (FACULTATIVE)
   * - matchAllFields: bool, determine if the results need to match all the fields (logic AND) or at least one of them (logic OR) (default = true) (FACULTATIVE)
   */
  advancedSearch: (req, res) => {
    // Store every params in the url and check if there is the type parameter
    const paramsURL = req.query;

    if (!advancedSearchTypes.includes(paramsURL.resourceType)) {
      return res.badRequest();
    }

    // By default, the query asked will send every information.
    let complete = true;
    if (paramsURL.complete && paramsURL.complete === 'false') {
      complete = false;
    }

    // Cast matchAllFields to bool
    if (paramsURL.matchAllFields && paramsURL.matchAllFields === 'false') {
      paramsURL.matchAllFields = false;
    } else if (
      paramsURL.matchAllFields &&
      paramsURL.matchAllFields === 'true'
    ) {
      paramsURL.matchAllFields = true;
    }

    const params = {};

    // Use the Elasticsearch Service to do the search according to the parameters of the URL
    return ElasticSearch.advancedSearchQuery(paramsURL)
      .then((results) => {
        if (complete) {
          return ControllerService.treatAndConvert(
            req,
            undefined,
            results,
            params,
            res,
            MappingV1Service.convertToCompleteSearchResult,
          );
        }
        return ControllerService.treatAndConvert(
          req,
          undefined,
          results,
          params,
          res,
          MappingV1Service.convertEsToSearchResult,
        );
      })
      .catch((err) => {
        return ControllerService.treatAndConvert(
          req,
          err,
          undefined,
          params,
          res,
          MappingV1Service.convertEsToSearchResult,
        );
      });
  },
};
