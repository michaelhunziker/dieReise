'use strict';

module.exports = function (app) {

  if (app.get('env') === 'development') {
    app.use(developmentErrorHandler);
  } else {
    app.use(productionErrorHandler);
  }

  function developmentErrorHandler(err, req, res, next) {
    res.status(err.status || 500).send({
      message: err.message,
      error: err
    });
  }

  function productionErrorHandler(err, req, res, next) {
    res.status(err.status || 500).send({
      message: err.message,
      // no stacktrace leaked to user
      error: {}
    });
  }
  
};
