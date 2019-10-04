let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('detail4Item');
  let itemID = req.query.itemID;
  let itemName = req.query.itemName;
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + itemID;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){

    }else{
      let isOnlyFile = true;
      for(let i = 0; i < result.content.responseData.length; i++){
        if(result.content.responseData[i].contentType !== 'F'){
          isOnlyFile = false;
          break;
        }
      }

      let videoList = [];
      let imageList = [];
      let textList = [];
      let fileList = [];
      if(result.content.responseData.length > 0){
        itemName = result.content.responseData[0].itemVO.itemName;
      }
      result.content.responseData.forEach(function(data,index){
        if(data.contentType === 'T'){
          textList.push({
            detailID: data.detailID,
            content: data.content
          });
        }
        if(data.contentType === 'I'){
          imageList.push({
            detailID: data.detailID,
            imageUrl: data.content
          });
        }
        if(data.contentType === 'V'){
          videoList.push({
            detailID: data.detailID,
            videoUrl: data.content,
            imageUrl: '/images/icons/video.jpeg'
          });
        }
        if(data.contentType === 'F'){
          fileList.push({
            fileName: data.content.substr(data.content.lastIndexOf('/') + 1),
            fileUrl: data.content
          });
        }
      });

      if(isOnlyFile){
        res.render('detailOnlyFile', {
          title: '考评点明细',
          fileList:fileList,
          itemID: itemID,
          itemName: itemName
        });
      }else{
        res.render('detail', {
          title: '考评点明细',
          textList: textList,
          videoList: videoList,
          imageList: imageList,
          fileList:fileList,
          itemID: itemID,
          itemName: itemName
        });
      }
    }
  });
});

router.get('/imageMemo', function (req, res, next) {
  let service = new commonService.commonInvoke('detail4ImageMemo');
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + req.query.itemID + '/' + req.query.textMapDetail;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  });
});

router.get('/imageMemo', function (req, res, next) {
  let service = new commonService.commonInvoke('detail4ImageMemo');
  let parameter = '/' + sysConfig.bankID + '/' + sysConfig.branchID + '/' + req.query.itemID + '/' + req.query.textMapDetail;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){
      res.json({
        err: true,
        msg: result.msg
      });
    }else{
      res.json({
        err: !result.content.result,
        msg: result.content.responseMessage,
        data: result.content.responseData
      });
    }
  });
});

module.exports = router;
