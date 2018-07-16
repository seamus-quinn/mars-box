// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/marsbox',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  },

};
