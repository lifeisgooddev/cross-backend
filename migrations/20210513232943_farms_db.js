exports.up = async function(knex, Promise) {
    return knex.schema
        .createTable('farms', function(t) {
            t.increments('id').primary().notNullable()
            t.string('reward_provider').notNullable()
            t.date('date_added').notNullable()
            t.string('source').notNullable()
            t.string('blockchain').notNullable()
            t.string('url').notNullable()
            t.string('tvl').notNullable()
            t.string('native_token').notNullable()
            t.string('native_token_price').notNullable()
            t.string('native_token_invest_link')
            t.string('liquidity_increase')
            t.timestamp('created_at').defaultTo(knex.fn.now())
            t.timestamp('updated_at').defaultTo(knex.fn.now())
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('farms')
};
