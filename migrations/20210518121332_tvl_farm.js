exports.up = async function(knex, Promise) {
    return knex.schema
        .createTable('tvl_farm', function(t) {
            t.increments('id').primary().notNullable()
            t.integer('farm_id').notNullable()
            t.string('tvl').notNullable()
            t.timestamp('created_at').defaultTo(knex.fn.now())
            t.timestamp('updated_at').defaultTo(knex.fn.now())
            t.foreign('farm_id').references('id').inTable('farms')
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('tvl_farm')
};
