let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('list', { title: '考评点列表', itemID: req.query.itemID,itemName: req.query.itemName });
});

router.get('/item', function(req, res, next) {
  let service = new commonService.commonInvoke('item');
  let bankID = sysConfig.bankID;
  let branchID = sysConfig.branchID;
  let parentItemID = req.query.parentItemID;

  let parameter = bankID + '/' + branchID + '/' + parentItemID;

  service.get(parameter, function (result) {
    if (result.err) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataList: result.content.responseData
      });
    }
  })
});

router.get('/itemByID', function(req, res, next) {
  let service = new commonService.commonInvoke('itemByID');
  let bankID = sysConfig.bankID;
  let branchID = sysConfig.branchID;
  let itemID = req.query.itemID;

  let parameter = bankID + '/' + branchID + '/' + itemID;

  service.get(parameter, function (result) {
    if (result.err) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  })
});

router.get('/file', function(req, res, next) {
  let service = new commonService.commonInvoke('detail4File');
  let bankID = sysConfig.bankID;
  let branchID = sysConfig.branchID;
  let fileName = req.query.fileName;

  let parameter = bankID + '/' + branchID + '/' + fileName;

  service.get(parameter, function (result) {
    if (result.err) {
      res.json({
        err: true,
        msg: result.msg
      });
    } else {
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        dataList: result.content.responseData
      });
    }
  })
});

module.exports = router;
