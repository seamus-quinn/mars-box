module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/marsbox',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/marsbox_test',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    }
  }

};
