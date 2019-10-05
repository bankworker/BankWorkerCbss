let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', {title: '主页', bodyClass: 'bg-normal'});
});

router.get('/moduleList', function(req, res, next) {
  let service = new commonService.commonInvoke('archiveList');
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

  let parameter = bankCode + '/' + branchCode + '/0';

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

router.get('/newsList', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let pageNumber = 1;
  let pageSize = sysConfig.newsPageSize;
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

router.get('/fuzzyList', function(req, res, next) {
  let service = new commonService.commonInvoke('fuzzyArchiveList');
  let bankCode = req.cookies.cbssBankCode;
  let branchCode = req.cookies.cbssBranchCode;
  let fuzzyContent = req.query.fuzzyContent;
  if(bankCode === undefined || branchCode === undefined){
    res.json({
      err: true,
      expired: true,
      msg: '您的登陆已过期，请重新登陆。',
      branchInfo: null
    });
    return false;
  }

  let parameter = bankCode + '/' + branchCode + '/' + fuzzyContent;

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
