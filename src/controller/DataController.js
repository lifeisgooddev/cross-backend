var express = require('express');
var HttpStatusCodes = require('http-status-codes');
const { database } = require('../../secrets.js');
const secrets= require('../../secrets.js')
const knex = require('knex')(secrets.database)

const calculateDate = (date) => {
  var d =new Date() - new Date(date);
  return parseInt(d / (1000 * 3600 * 24));
}

const getAllAssets = async (request, response) => {
  try{
    const datas = await knex('farms').join('assets', 'farms.id', 'assets.farm_id').select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error Get Data, ${err}`);
  }
}

const getAssetsByFarm = async (request, response) => {
  const id = parseInt(request.params.id)
  try{
    const datas = await knex('farms').join('assets', 'farms.id', 'assets.farm_id').where('farms.id', id).select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error Get Data, ${err}`);
  }
}

const getAssetsById = async (request, response) => {
  const id = parseInt(request.params.id)
  try{
    const datas = await knex('farms').join('assets', 'farms.id', 'assets.farm_id').where('assets.id', id).select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error Get Data, ${err}`);
  }
}

const getAllFarms = async (request, response) => {
  try{
    const datas = await knex('farms').select("*")
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error get data, ${err}`);
  }
}

const getTvlByFarmId = async (request, response) => {
  const id = parseInt(request.params.id)

  try{
    const datas = await knex('tvl_farm').where('farm_id', id).orderBy('updated_at', 'desc').limit(30).select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error get data, ${err}`);
  }
}

const getTokenByFarmId = async (request, response) => {
  const id = parseInt(request.params.id)

  try{
    const datas = await knex('token_farm').where('farm_id', id).orderBy('updated_at', 'desc').limit(30).select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error get data, ${err}`);
  }
}

const getTvlByAssetId = async (request, response) => {
  const id = parseInt(request.params.id)

  try{
    const datas = await knex('tvl_asset').where('asset_id', id).orderBy('updated_at', 'desc').limit(30).select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error get data, ${err}`);
  }
}

const getAprByAssetId = async (request, response) => {
  const id = parseInt(request.params.id)

  try{
    const datas = await knex('apr_asset').where('asset_id', id).orderBy('updated_at', 'desc').limit(30).select('*')
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error get data, ${err}`);
  }
}

const getAssetsByFilter = async (request, response) => {
  let { 
    rewardProvider,
    blockchain, 
    category,
    yieldType,
    exchange
  } = request.body

  rewardProvider = rewardProvider == "" ? ('%' + rewardProvider + '%') : rewardProvider
  blockchain = blockchain == "" ? ('%' + blockchain + '%') : blockchain
  category = category == "" ? ('%' + category + '%') : category
  yieldType = yieldType == "" ? ('%' + yieldType + '%') : yieldType
  exchange = exchange == "" ? ('%' + exchange + '%') : exchange

  try{
    const datas = await knex('farms').join('assets', 'farms.id', 'assets.farm_id')
      .where('farms.reward_provider', 'like', rewardProvider)
      .andWhere('farms.blockchain', 'like', blockchain)
      .andWhere('assets.category', 'like', category)
      .andWhere('assets.yield_type', 'like', yieldType)
      .andWhere('assets.exchange', 'like', exchange)
      .select('*');
    response.status(HttpStatusCodes.ACCEPTED).send(datas);
  }
  catch(err) {
    return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error get data, ${err}`);
  }
}

const saveData = async (request, response) => {
  const {data} = request.body;
  await Promise.all(data.map(row => {
    _saveData(row, response);
  }));

  response.status(HttpStatusCodes.CREATED).send(`Data Saved Successfuly`);
}

const updateAssetById = async (requestData, response) => {
  let { 
    id,
    exchange, 
    asset, 
    assetPrice,
    assetAddress,
    investmentLink,
    stakeLink,
    multiplier,
    tvlStaked,
    tvlExchange,
    underlyingFarm,
    weight,
    category,
    rewardToken,
    rewardTokenPrice,
    rewardTokenA,
    rewardTokenAPrice,
    rewardTokenB,
    rewardTokenBPrice,
    weeklyRewardAmount,
    yearlyRewardPrice,
    apr,
    depositFee,
    otherFees,
    info,
    yieldType,
    impermanentLoss,
    vesting,
    active,
    dateStarted,
    dateEnding,
    daysRemaining,
    stakingAddress,
    vaultAddress,
    tokenA,
    tokenB,
    tokenC,
    tokenD,
    tokenAPrice,
    tokenBPrice,
    tokenCPrice,
    tokenDPrice,
    tokenAAddress,
    tokenBAddress,
    tokenCAddress,
    tokenDAddress,
  } = requestData.body;

  if ( !id ) {
      return response.status(HttpStatusCodes.BAD_REQUEST).send("Missing Data");
  }

  
  try{

    let apy, dailyApr, weeklyApr, monthlyApr, yearlyApr;
    if(apr){
      apy = Math.pow((1 + apr/365), 365) - 1;
      dailyApr = apr / 365;
      weeklyApr = dailyApr * 7;
      monthlyApr = dailyApr * 30;
      yearlyApr = apr;
    }

    


    const _assetResult = await knex('assets').where('id', id).returning('*');

    const asset_data = {
      'exchange': exchange == null ? _assetResult[0].exchange : exchange,
      'asset': asset == null ? _assetResult[0].asset : asset,
      'invest_link': investmentLink == null ? _assetResult[0].invest_link : investmentLink,
      'stake_link': stakeLink == null ? _assetResult[0].stake_link: stakeLink,
      'multiplier': multiplier == null ? _assetResult[0].multiplier: multiplier,
      'asset_price': assetPrice == null ? _assetResult[0].asset_price: assetPrice,
      'asset_address': assetAddress == null ? _assetResult[0].asset_address: assetAddress,
      'token_a': tokenA == null ? _assetResult[0].token_a: tokenA,
      'token_a_price': tokenAPrice == null ? _assetResult[0].token_a_price: tokenAPrice,
      'token_a_address': tokenAAddress == null ? _assetResult[0].token_a_address: tokenAAddress,
      'token_b': tokenB == null ? _assetResult[0].token_b: tokenB,
      'token_b_price': tokenBPrice == null ? _assetResult[0].token_b_price: tokenBPrice,
      'token_b_address': tokenBAddress == null ? _assetResult[0].token_b_address: tokenBAddress,
      'token_c': tokenC == null ? _assetResult[0].token_c: tokenC,
      'token_c_price': tokenCPrice == null ? _assetResult[0].token_c_price: tokenCPrice,
      'token_c_address': tokenCAddress == null ? _assetResult[0].token_c_address: tokenCAddress,
      'token_d': tokenD == null ? _assetResult[0].token_d: tokenD,
      'token_d_price': tokenDPrice == null ? _assetResult[0].token_d_price: tokenDPrice,
      'token_d_address': tokenDAddress == null ? _assetResult[0].token_d_address: tokenDAddress,
      'tvl_exchange': tvlExchange == null ? _assetResult[0].tvl_exchange: tvlExchange,
      'underlying_farm': underlyingFarm == null ? _assetResult[0].underlying_farm: underlyingFarm,
      'weight': weight == null ? _assetResult[0].weight: weight,
      'category': category == null ? _assetResult[0].category: category,
      'reward_token': rewardToken == null ? _assetResult[0].reward_token: rewardToken,
      'reward_token_price': rewardTokenPrice == null ? _assetResult[0].reward_token_price: rewardTokenPrice,
      'reward_token_a': rewardTokenA == null ? _assetResult[0].reward_token_a: rewardTokenA,
      'reward_token_a_price': rewardTokenAPrice == null ? _assetResult[0].reward_token_a_price: rewardTokenAPrice,
      'reward_token_b': rewardTokenB == null ? _assetResult[0].reward_token_b: rewardTokenB,
      'reward_token_b_price': rewardTokenBPrice == null ? _assetResult[0].reward_token_b_price: rewardTokenBPrice,
      'weekly_reward_amount': weeklyRewardAmount == null ? _assetResult[0].weekly_reward_amount: weeklyRewardAmount,
      'yearly_reward_price': yearlyRewardPrice == null ? _assetResult[0].yearly_reward_price: yearlyRewardPrice,
      'tvl_staked': tvlStaked == null ? _assetResult[0].tvl_staked: tvlStaked,
      'apr': apr == null ? _assetResult[0].apr: apr,
      'apy': apy == null ? _assetResult[0].apy: apy,
      'daily_apr': dailyApr == null ? _assetResult[0].daily_apr : dailyApr,
      'weekly_apr': weeklyApr == null ? _assetResult[0].weekly_apr : weeklyApr,
      'monthly_apr': monthlyApr == null ? _assetResult[0].monthly_apr : monthlyApr,
      'yearly_apr': yearlyApr == null ? _assetResult[0].yearly_apr : yearlyApr,
      'deposit_fee': depositFee == null ? _assetResult[0].deposit_fee: depositFee,
      'other_fees': otherFees == null ? _assetResult[0].other_fees: otherFees,
      'info': info == null ? _assetResult[0].info: info,
      'yield_type': yieldType == null ? _assetResult[0].yield_type: yieldType,
      'impermanent_loss': impermanentLoss == null ? _assetResult[0].impermanent_loss: impermanentLoss,
      'vesting': vesting == null ? _assetResult[0].vesting: vesting,
      'active': active == null ? _assetResult[0].active: active,
      'date_started': dateStarted == null ? _assetResult[0].date_started:  new Date(dateStarted),
      'date_ending': dateEnding == null ? _assetResult[0].date_ending:  new Date(dateEnding),
      'days_remaining': daysRemaining == null ? _assetResult[0].days_remaining:  parseInt(daysRemaining),
      'staking_address':stakingAddress == null ? _assetResult[0].staking_address: stakingAddress,
      'vault_address':vaultAddress == null ? _assetResult[0].vault_address: vaultAddress,
    };

    assetId = await knex('assets').where('id', _assetResult[0].id).update(asset_data).returning('id');

    const tvlAssetResult = await knex('tvl_asset').where('asset_id', assetId[0]).orderBy('updated_at', 'desc').limit(1).select('*')

    if(tvlAssetResult.length == 0 || (tvlAssetResult[0] && calculateDate(tvlAssetResult[0]['updated_at']) >=1) ) {
      await knex('tvl_asset').insert({'asset_id': assetId[0], 'tvl': asset_data['tvl_staked']});
      if(tvlAssetResult[0]){
        const tvlIncreased = (asset_data['tvl_staked'] - tvlAssetResult[0].tvl) / tvlAssetResult[0].tvl * 100;
        await knex('assets').where('id', assetId[0]).update({'liquidity_increase': tvlIncreased});
      }
    }

    const aprAssetResult = await knex('apr_asset').where('asset_id', assetId[0]).orderBy('updated_at', 'desc').limit(1).select('*')
    if(aprAssetResult.length == 0 || (aprAssetResult[0] && calculateDate(aprAssetResult[0]['updated_at']) >=1) )
      await knex('apr_asset').insert({'asset_id': assetId[0], 'apr': asset_data['apr']});
    
    response.status(HttpStatusCodes.ACCEPTED).send("success");
    
  }
  catch(err) {
      return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error insert Data, ${err}`);
  };
}

const _saveData = async (requestData, response) => {
  let { 
    rewardProvider,
    blockchain, 
    source,
    url,
    dateAdded,
    exchange, 
    asset, 
    assetPrice,
    assetAddress,
    investmentLink,
    stakeLink,
    multiplier,
    tvlStaked,
    tvlExchange,
    underlyingFarm,
    weight,
    category,
    rewardToken,
    rewardTokenPrice,
    rewardTokenA,
    rewardTokenAPrice,
    rewardTokenB,
    rewardTokenBPrice,
    weeklyRewardAmount,
    yearlyRewardPrice,
    apr,
    depositFee,
    otherFees,
    info,
    yieldType,
    impermanentLoss,
    vesting,
    active,
    dateStarted,
    dateEnding,
    daysRemaining,
    stakingAddress,
    vaultAddress,
    liquidityIncrease,
    tokenA,
    tokenB,
    tokenC,
    tokenD,
    tokenAPrice,
    tokenBPrice,
    tokenCPrice,
    tokenDPrice,
    tokenAAddress,
    tokenBAddress,
    tokenCAddress,
    tokenDAddress,
    nativeToken,
    nativeTokenPrice,
    nativeTokenInvestLink
  } = requestData;

  if (!rewardToken|| !dateAdded || !exchange || !asset || !blockchain || !source || !url || !investmentLink || !rewardProvider || !rewardToken || 
    !tvlStaked) {
      return response.status(HttpStatusCodes.BAD_REQUEST).send("Missing Data");
  }

  let farm_data = {
    'reward_provider': rewardProvider,
    'date_added': new Date(dateAdded),
    'source': source,
    'blockchain': blockchain,
    'url': url,
    'native_token': nativeToken,
    'native_token_price': nativeTokenPrice,
    'native_token_invest_link': nativeTokenInvestLink
  }

  
  try{
    let farmResult = await knex('farms').where('reward_provider', rewardProvider).andWhere('blockchain', blockchain).select('*');
    if(farmResult.length == 0){
      farm_data['tvl'] = tvlStaked;
      // farm_data['liquidity_increase'] = 100;
    }
    else{
      const assetResult = await knex('assets').where('farm_id', farmResult[0].id).andWhere('exchange', exchange).andWhere('asset', asset).select('*');
      if(assetResult.length == 0){
        farm_data['tvl'] = farmResult[0].tvl + tvlStaked;
        // farm_data['liquidity_increase'] = tvlStaked / farmResult[0].tvl * 100;
      }
      else{
        farm_data['tvl'] = farmResult[0].tvl - assetResult[0].tvl_staked + tvlStaked;
        // farm_data['liquidity_increase'] = (tvlStaked- assetResult[0].tvl_staked) / farmResult[0].tvl * 100;
      }
    }

    const _farmResult = await knex('farms').where('reward_provider', rewardProvider).andWhere('blockchain', blockchain).returning('id');
    let farmId;
    if(_farmResult.length == 0)
      farmId = await knex('farms').insert(farm_data).returning('id');
    else
      farmId = await knex('farms').where('id', _farmResult[0].id).update(farm_data).returning('id');

    const tvlFarmResult = await knex('tvl_farm').where('farm_id', farmId[0]).orderBy('updated_at', 'desc').limit(1).select('*')
    if(tvlFarmResult.length == 0 || (tvlFarmResult[0] && calculateDate(tvlFarmResult[0]['updated_at']) >=1) ) {
      await knex('tvl_farm').insert({'farm_id': farmId[0], 'tvl': farm_data['tvl']});
      if(tvlFarmResult[0]){
        const tvlIncreased = (farm_data['tvl'] - tvlFarmResult[0].tvl) / tvlFarmResult[0].tvl * 100;
        await knex('farms').where('id', farmId[0]).update({'liquidity_increase': tvlIncreased});
      }
    }
  
    const tokenFarmResult = await knex('token_farm').where('farm_id', farmId[0]).orderBy('updated_at', 'desc').limit(1).select('*')
    if(tokenFarmResult.length == 0 || (tokenFarmResult[0] && calculateDate(tokenFarmResult[0]['updated_at']) >=1) )
      await knex('token_farm').insert({'farm_id': farmId[0], 'native_token': farm_data['native_token'], 'native_token_price': farm_data['native_token_price']});

    let apy, dailyApr, weeklyApr, monthlyApr, yearlyApr;
    if(apr){
      apy = Math.pow((1 + apr/365), 365) - 1;
      dailyApr = apr / 365;
      weeklyApr = dailyApr * 7;
      monthlyApr = dailyApr * 30;
      yearlyApr = apr;
    }
    else{
      apr = rewardTokenPrice * weeklyRewardAmount * 52 / tvlStaked;
      apy = Math.pow((1 + apr/365 ),365)-1;
      dailyApr = apr / 365;
      weeklyApr = dailyApr * 7;
      monthlyApr = dailyApr * 30;
      yearlyApr = apr;
    }

    const asset_data = {
      'farm_id': farmId[0],
      'exchange': exchange,
      'asset': asset,
      'invest_link': investmentLink,
      'stake_link': stakeLink,
      'multiplier': multiplier,
      'asset_price': assetPrice,
      'asset_address': assetAddress,
      'token_a': tokenA,
      'token_a_price': tokenAPrice,
      'token_a_address': tokenAAddress,
      'token_b': tokenB,
      'token_b_price': tokenBPrice,
      'token_b_address': tokenBAddress,
      'token_c': tokenC,
      'token_c_price': tokenCPrice,
      'token_c_address': tokenCAddress,
      'token_d': tokenD,
      'token_d_price': tokenDPrice,
      'token_d_address': tokenDAddress,
      'tvl_exchange': tvlExchange,
      'underlying_farm': underlyingFarm,
      'weight': weight,
      'category': category,
      'reward_token': rewardToken,
      'reward_token_price': rewardTokenPrice,
      'reward_token_a': rewardTokenA,
      'reward_token_a_price': rewardTokenAPrice,
      'reward_token_b': rewardTokenB,
      'reward_token_b_price': rewardTokenBPrice,
      'weekly_reward_amount': weeklyRewardAmount,
      'yearly_reward_price': yearlyRewardPrice,
      'tvl_staked': tvlStaked,
      'apr': apr,
      'apy': apy,
      'daily_apr': dailyApr,
      'weekly_apr': weeklyApr,
      'monthly_apr': monthlyApr,
      'yearly_apr': yearlyApr,
      'deposit_fee': depositFee,
      'other_fees': otherFees,
      'info': info,
      'yield_type': yieldType,
      'impermanent_loss': impermanentLoss,
      'vesting': vesting,
      'active': active,
      'date_started': new Date(dateStarted),
      'date_ending': new Date(dateEnding),
      'days_remaining': parseInt(daysRemaining),
      'staking_address': stakingAddress,
      'vault_address': vaultAddress,
      'liquidity_increase': liquidityIncrease
    };


    const _assetResult = await knex('assets').where('farm_id', farmId[0]).andWhere('exchange', exchange).andWhere('asset', asset).returning('id');
    let assetId;
    if(_assetResult.length == 0)
      assetId = await knex('assets').insert(asset_data).returning('id');
    else
      assetId = await knex('assets').where('id', _assetResult[0].id).update(asset_data).returning('id');

    const tvlAssetResult = await knex('tvl_asset').where('asset_id', assetId[0]).orderBy('updated_at', 'desc').limit(1).select('*')

    if(tvlAssetResult.length == 0 || (tvlAssetResult[0] && calculateDate(tvlAssetResult[0]['updated_at']) >=1) ) {
      await knex('tvl_asset').insert({'asset_id': assetId[0], 'tvl': asset_data['tvl_staked']});
      if(tvlAssetResult[0]){
        const tvlIncreased = (asset_data['tvl_staked'] - tvlAssetResult[0].tvl) / tvlAssetResult[0].tvl * 100;
        await knex('assets').where('id', assetId[0]).update({'liquidity_increase': tvlIncreased});
      }
    }

    const aprAssetResult = await knex('apr_asset').where('asset_id', assetId[0]).orderBy('updated_at', 'desc').limit(1).select('*')
    if(aprAssetResult.length == 0 || (aprAssetResult[0] && calculateDate(aprAssetResult[0]['updated_at']) >=1) )
      await knex('apr_asset').insert({'asset_id': assetId[0], 'apr': asset_data['apr']});
    
    return true;
    
  }
  catch(err) {
      return response.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send(`Error insert Data, ${err}`);
  };
}

module.exports = {
  getAllAssets,
  getAssetsByFarm,
  getAssetsById,
  getAprByAssetId,
  getTvlByAssetId,
  getAllFarms,
  getTvlByFarmId,
  getTokenByFarmId,
  getAssetsByFilter,
  saveData,
  updateAssetById
}