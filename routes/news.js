let express = require('express');
let commonService = require('../service/commonService');
let router = express.Router();

router.get('/', function(req, res, next) {
  let newsID = req.query.newsID;
  res.render('news', { title: '近期新闻', newsID: newsID });
});

router.get('/detail', function(req, res, next) {
  let service = new commonService.commonInvoke('news');
  let newsID = req.query.newsID;

  service.get(newsID, function (result) {
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
