// Update with your config settings.
module.exports = {
    database: {
        client: 'postgresql',
        connection: {
            host: "127.0.0.1",
            database: 'postgres',
            user:     'postgres',
            password: ''
        },
        pool: {
            min: 2,
            max: 20
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
};
