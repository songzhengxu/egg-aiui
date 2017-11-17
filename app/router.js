'use strict';

module.exports = app => {
  app.get('/', app.controller.home.index);
  app.resources('aiui', '/api/v2/aiui', 'aiui');
};
