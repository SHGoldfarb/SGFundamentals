const url = require('url');

const dbUrl = process.env.DATABASE_URL ? url.parse(process.env.DATABASE_URL) : false;

const config = {
  default: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT || 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
  },
  development: {
    extend: 'default',
    database: 'iic2513template_dev',
  },
  test: {
    extend: 'default',
    database: 'iic2513template_test',
  },
  production: {
    extend: 'default',
    // database: 'iic2513template_production',
    database: dbUrl ? dbUrl.path.substr(1, dbUrl.auth.length) : null,
    username: dbUrl ? dbUrl.auth.substr(0, dbUrl.auth.indexOf(':')) : null,
    password: dbUrl ? dbUrl.auth.substr(dbUrl.auth.indexOf(':') + 1, dbUrl.auth.length) : null,
    dialect: dbUrl ? dbUrl.protocol.substr(0, dbUrl.protocol.length - 1) : null,
    host: dbUrl ? dbUrl.host.substr(0, dbUrl.host.length - 5) : null,
    port: dbUrl ? dbUrl.host.substr(dbUrl.host.length - 4, dbUrl.host.length) : null,
  },
};

Object.keys(config).forEach((configKey) => {
  const configValue = config[configKey];
  if (configValue.extend) {
    config[configKey] = Object.assign({}, config[configValue.extend], configValue);
  }
});

module.exports = dbUrl ? config.production : config.development;
