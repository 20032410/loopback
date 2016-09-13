var g = require('strong-globalize')();

/**
 * Data model for key-value databases.
 *
 * @class KeyValueModel
 * @inherits {Model}
 */

module.exports = function(KeyValueModel) {
  /**
   * Return the value associated with a given key.
   *
   * @param {String} key Key to use when searching the database.
   * @options {Object} [options] Placeholder for optional settings.
   * @callback {Function} callback Function to execute upon completion.
   * @param {Error} err Error object.
   * @param {*} result Value associated with the given key.
   * @promise
   */
  KeyValueModel.get = function(key, options, callback) {
    throwNotAttached(this.modelName, 'get');
  };

  /**
   * Persist a value and associate it with the given key.
   *
   * @param {String} key Key to associate with the given value.
   * @param {*} value Value to persist.
   * @options {Object} [options]
   * @property {Number} ttl Time to live for the key-value pair in milliseconds.
   * @callback {Function} callback The function to execute upon completion.
   * @param {Error} err Error object.
   * @promise
   */
  KeyValueModel.set = function(key, value, options, callback) {
    throwNotAttached(this.modelName, 'set');
  };

  /**
   * Set the TTL (time to live) in ms (milliseconds) for a given key. TTL is the
   * remaining time before a key-value pair is discarded from the database.
   *
   * @param {String} key Key to use when searching the database.
   * @param {Number} ttl The TTL in ms to set for the key.
   * @options {Number|Object} [options] Optional settings for the key-value
   *   pair. If a Number is provided, it is set as the TTL in ms for the
   *   key-value pair.
   * @property {Number} ttl TTL in ms for the key-value pair.
   * @callback {Function} callback The function to execute upon completion.
   * @param {Error} err Error object.
   * @param {Number} ttl TTL in ms.
   * @promise
   */
  KeyValueModel.expire = function(key, ttl, options, callback) {
    throwNotAttached(this.modelName, 'expire');
  };

  /**
   * Return the TTL (time to live) for a given key. TTL is the remaining time
   * before a key-value pair is discarded from the database.
   *
   * @param {String} key The key to use when searching the database.
   * @options {Object} options Placeholder for optional settings.
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.ttl = function(key, options, callback) {
    throwNotAttached(this.modelName, 'ttl');
  };

  /**
   * Return all keys for the given filter.
   *
   * **WARNING**: This method is not suitable for large data sets as all
   * key-values pairs are loaded into memory at once. For large data sets,
   * use `iterateKeys()` instead.
   *
   * @param {Array.<String>} filter The key(s) to use when searching the
   *   database.
   * @options {Object} [options] Placeholder for optional settings.
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.keys = function(filter, options, callback) {
    throwNotAttached(this.modelName, 'keys');
  };

  /**
   * Return all keys for the given filter. Similar to `.keys()` but instead
   * allows for iteration over a large data set without having to load
   * everything into memory at once.
   *
   * @param {Array.<String>} filter The key to use when searching the database.
   * @options {Object} [options] Placeholder for optional settings.
   * @callback {Function} callback The function to execute upon completion.
   * @promise
   */
  KeyValueModel.iterateKeys = function(filter, options) {
    throwNotAttached(this.modelName, 'iterateKeys');
  };

  /*!
   * Set up remoting metadata for this model.
   *
   * **Notes**:
   *
   * - The method is called automatically by `Model.extend` and/or
   *   `app.registry.createModel`
   * - In general, base models use call this to ensure remote methods are
   *   inherited correctly, see bug at
   *   https://github.com/strongloop/loopback/issues/2350
   */
  KeyValueModel.setup = function() {
    KeyValueModel.base.setup.apply(this, arguments);

    this.remoteMethod('get', {
      accepts: {
        arg: 'key', type: 'string', required: true,
        http: { source: 'path' },
      },
      returns: { arg: 'value', type: 'any', root: true },
      http: { path: '/:key', verb: 'get' },
      rest: { after: convertNullToNotFoundError },
    });

    this.remoteMethod('set', {
      accepts: [
        { arg: 'key', type: 'string', required: true,
          http: { source: 'path' }},
        { arg: 'value', type: 'any', required: true,
          http: { source: 'body' }},
        { arg: 'ttl', type: 'number',
          http: { source: 'query' },
          description: 'time to live in milliseconds' },
      ],
      http: { path: '/:key', verb: 'put' },
    });

    this.remoteMethod('expire', {
      accepts: [
        { arg: 'key', type: 'string', required: true,
          http: { source: 'path' }},
        { arg: 'ttl', type: 'number', required: true,
          http: { source: 'form' }},
      ],
      http: { path: '/:key/expire', verb: 'put' },
    });

    this.remoteMethod('ttl', {
      accepts: {
        arg: 'key', type: 'string', required: true,
        http: { source: 'path' },
      },
      returns: { arg: 'value', type: 'any', root: true },
      http: { path: '/:key/ttl', verb: 'get' },
    });

    this.remoteMethod('keys', {
      accepts: {
        arg: 'filter', type: 'object', required: false,
        http: { source: 'query' },
      },
      returns: { arg: 'keys', type: ['string'], root: true },
      http: { path: '/keys', verb: 'get' },
    });
  };
};

function throwNotAttached(modelName, methodName) {
  throw new Error(g.f(
    'Cannot call %s.%s(). ' +
      'The %s method has not been setup. '  +
      'The {{KeyValueModel}} has not been correctly attached ' +
      'to a {{DataSource}}!',
    modelName, methodName, methodName));
}

function convertNullToNotFoundError(ctx, cb) {
  if (ctx.result !== null) return cb();

  var modelName = ctx.method.sharedClass.name;
  var id = ctx.getArgByName('id');
  var msg = g.f('Unknown "%s" {{key}} "%s".', modelName, id);
  var error = new Error(msg);
  error.statusCode = error.status = 404;
  error.code = 'KEY_NOT_FOUND';
  cb(error);
}
