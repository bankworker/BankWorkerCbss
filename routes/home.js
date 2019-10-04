let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home', {title: '主页', bodyClass: 'bg-normal'});
});

router.get('/newsList', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.newsPageSize;
  let bankID = sysConfig.bankID;
  let branchID = sysConfig.branchID;

  let parameter = pageNumber + '/' + pageSize + '/' + bankID + '/' + branchID;

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
