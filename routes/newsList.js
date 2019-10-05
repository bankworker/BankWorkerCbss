let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('newsList', { title: '新闻列表', newsID: req.query.newsID});
});

router.get('/data', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let pageNumber = req.query.pageNumber;
  let pageSize = sysConfig.pageSize;
  let bankCode = req.cookies.cbssBankCode;
  let branchCode = req.cookies.cbssBranchCode;
  if(bankCode === undefined || branchCode === undefined){
    res.json({
      err: true,
      expired: true,
      msg: '您的登陆已过期，请重新登陆。',
      branchInfo: null
    });
    return false;
  }

  let parameter = pageNumber + '/' + pageSize + '/' + bankCode + '/' + branchCode;

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