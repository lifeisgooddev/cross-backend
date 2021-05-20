exports.up = async function(knex, Promise) {
    return knex.schema
        .createTable('apr_asset', function(t) {
            t.increments('id').primary().notNullable()
            t.integer('asset_id').notNullable()
            t.string('apr').notNullable()
            t.timestamp('created_at').defaultTo(knex.fn.now())
            t.timestamp('updated_at').defaultTo(knex.fn.now())
            t.foreign('asset_id').references('id').inTable('assets')
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('apr_asset')
};
