let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let newsID = req.query.newsID;
  res.render('news', { title: '近期新闻', newsID: newsID });
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let bankCode = req.cookies.cbssBankCode;
  let branchCode = req.cookies.cbssBranchCode;
  let newsID = req.query.newsID;

  if(bankCode === undefined || branchCode === undefined){
    res.json({
      err: true,
      expired: true,
      msg: '您的登陆已过期，请重新登陆。',
      branchInfo: null
    });
    return false;
  }

  let parameter = bankCode + '/' + branchCode + '/' + newsID;

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
        news: result.content.responseData
      });
    }
  })
});

module.exports = router;
