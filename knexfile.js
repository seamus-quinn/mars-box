module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/marsbox',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true,
  }

};
