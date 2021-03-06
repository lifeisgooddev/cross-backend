exports.up = async function(knex, Promise) {
    return knex.schema
        .createTable('assets', function(t) {
            t.increments('id').primary().notNullable()
            t.string('exchange').notNullable()
            t.string('asset').notNullable()
            t.string('invest_link').notNullable()
            t.string('stake_link')
            t.string('multiplier')
            t.string('asset_price')
            t.string('asset_address')
            t.string('token_a')
            t.string('token_a_price')
            t.string('token_a_address')
            t.string('token_b')
            t.string('token_b_price')
            t.string('token_b_address')
            t.string('token_c')
            t.string('token_c_price')
            t.string('token_c_address')
            t.string('token_d')
            t.string('token_d_price')
            t.string('token_d_address')
            t.string('tvl_exchange')
            t.string('underlying_farm')
            t.string('weight')
            t.string('category')
            t.integer('farm_id').notNullable()
            t.string('reward_token').notNullable()
            t.string('reward_token_price')
            t.string('reward_token_a')
            t.string('reward_token_a_price')
            t.string('reward_token_b')
            t.string('reward_token_b_price')
            t.string('weekly_reward_amount')
            t.string('yearly_reward_price')
            t.string('tvl_staked')
            t.float('apr').notNullable()
            t.float('apy').notNullable()
            t.float('daily_apr').notNullable()
            t.float('weekly_apr').notNullable()
            t.float('monthly_apr').notNullable()
            t.float('yearly_apr').notNullable()
            t.string('deposit_fee')
            t.string('other_fees')
            t.string('info')
            t.string('yield_type')
            t.string('impermanent_loss')
            t.string('vesting')
            t.bool('active')
            t.date('date_started')
            t.date('date_ending')
            t.integer('days_remaining')
            t.string('staking_address')
            t.string('vault_address')
            t.string('liquidity_increase')
            t.timestamp('created_at').defaultTo(knex.fn.now())
            t.timestamp('updated_at').defaultTo(knex.fn.now())
            t.foreign('farm_id').references('id').inTable('farms')
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('assets')
};
