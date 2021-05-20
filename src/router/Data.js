var express = require('express');
var router = express.Router();

const {
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
} = require('../controller/DataController.js')

router.get('/get_all_assets', async(request, response) => {
    getAllAssets(request, response);
});

router.get('/get_all_farms', async(request, response) => {
    getAllFarms(request, response);
});

router.get('/get_tvl_by_farm/:id', async(request, response) => {
    getTvlByFarmId(request, response);
});

router.get('/get_token_by_farm/:id', async(request, response) => {
    getTokenByFarmId(request, response);
});

router.get('/get_assets_by_farm/:id', async(request, response) => {
    getAssetsByFarm(request, response);
});

router.get('/get_asset_by_id/:id', async(request, response) => {
    getAssetsById(request, response);
});

router.get('/get_tvl_by_asset/:id', async(request, response) => {
    getTvlByAssetId(request, response);
});

router.get('/get_apr_by_asset/:id', async(request, response) => {
    getAprByAssetId(request, response);
});

router.post('/get_asset_by_filter', async(request, response) => {
    getAssetsByFilter(request, response);
});

router.post('/save', async(request, response) => {
    saveData(request, response);
});

router.post('/update_asset_by_id/', async(request, response) => {
    updateAssetById(request, response);
});
module.exports = router;