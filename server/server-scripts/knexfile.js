// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      user : 'carmenlong',
      password : '',
      database : 'push_notifications'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      user : 'carmenlong',
      password : '',
      database : 'push_notifications'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      user : 'carmenlong',
      password : '',
      database : 'push_notifications'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
