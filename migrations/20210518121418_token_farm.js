exports.up = async function(knex, Promise) {
    return knex.schema
        .createTable('token_farm', function(t) {
            t.increments('id').primary().notNullable()
            t.integer('farm_id').notNullable()
            t.string('native_token').notNullable()
            t.string('native_token_price').notNullable()
            t.timestamp('created_at').defaultTo(knex.fn.now())
            t.timestamp('updated_at').defaultTo(knex.fn.now())
            t.foreign('farm_id').references('id').inTable('farms')
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('token_farm')
};
