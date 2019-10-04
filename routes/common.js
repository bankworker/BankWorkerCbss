let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/itemDetail', function(req, res, next) {
  let service = new commonService.commonInvoke('detail4Item');
  let bankID = sysConfig.bankID;
  let branchID = sysConfig.branchID;
  let itemID = req.query.itemID;
  let year = req.query.year;
  let quarter = req.query.quarter;

  let parameter = bankID + '/' + branchID + '/' + itemID + '/' + year + '/' + quarter;

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

module.exports = router;