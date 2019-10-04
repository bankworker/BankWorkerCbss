let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('newsList', { title: '新闻列表'});
});

router.get('/date', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let pageNumber = req.query.pageNumber;
  let pageSize = 10;
  let bankID = sysConfig.bankID;
  let branchID = sysConfig.branchID;

  if(pageNumber === null){
    pageNumber = 1;
  }
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