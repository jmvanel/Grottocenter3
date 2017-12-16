/**
 * authenticated policy
 *
 * @module      :: Policy
 * @description :: GC authentication
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  const authentication = req.headers.authorization
    || req.headers['x-api-key']
    || req.query.token
    || req.headers['x-access-token'];

  // We delete the token from param to not mess with blueprints
  delete req.query.token;

  if (authentication && authentication.toUpperCase().indexOf('JWT') > -1) {
    TokenAuthService.verify(authentication.replace('Jwt ', ''), function(err, token) {
      if (err) {
        return res.json('403', 'Invalid Token');
      }
      req.token = token; // This is the decrypted token or the payload you provided
      next();
    });
  } else if (authentication && authentication.toUpperCase().indexOf('API-KEY') > -1) {
    ApiKeysService.getKeyPrm(authentication.replace('Api-Key ', '')).then((foundApiKey) => {
      if (!foundApiKey || foundApiKey.active !== 1) {
        return res.json('403', 'Invalid API key');
      }
      next();
    });
  } else {
    return res.json('403', 'Authentication required');
  }
};
