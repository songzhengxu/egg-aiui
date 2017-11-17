'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1510561140529_7113';
  config.security = {
    ignore: '/api/',
    methodnoallow: { enable: false },
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
  };
  config.cors = {
    allowMethods: 'GET,HEAD,PUT,OPTIONS,POST,DELETE,PATCH',
    credentials: true,
  };
  config.middleware = [ 'errorHandler', 'apiWrapper' ];
  config.errorHandler = {
    match: '/api',
  };
  return config;
};
