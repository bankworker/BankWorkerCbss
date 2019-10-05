let express = require('express');
let commonService = require('../service/commonService');
let sysConfig = require('../config/sysConfig');
let router = express.Router();

router.get('/', function(req, res, next) {
  let service = new commonService.commonInvoke('archiveDetail');
  let bankCode = req.cookies.cbssBankCode;
  let branchCode = req.cookies.cbssBranchCode;
  let itemID = req.query.itemID;
  let itemName = req.query.itemName;
  let parameter = '/' + bankCode + '/' + branchCode + '/' + itemID;

  service.get(parameter, function (result) {
    if(result.err || !result.content.result){

    }else{
      let isOnlyFile = true;
      let videoList = [];
      let imageList = [];
      let textList = [];
      let fileList = [];

      if(result.content.responseData === null){
        res.render('detail', {
          title: '考评点明细',
          textList: textList,
          videoList: videoList,
          imageList: imageList,
          fileList:fileList,
          itemID: itemID,
          itemName: itemName
        });
      }else{
        for(let i = 0; i < result.content.responseData.length; i++){
          if(result.content.responseData[i].archiveDetailType !== 'F'){
            isOnlyFile = false;
            break;
          }
        }


        result.content.responseData.forEach(function(data,index){
          if(data.archiveDetailType === 'T'){
            textList.push({
              detailID: data.archiveDetailID,
              content: data.archiveDetailContent
            });
          }
          if(data.archiveDetailType === 'I'){
            imageList.push({
              detailID: data.archiveDetailID,
              imageUrl: data.archiveDetailContent
            });
          }
          if(data.archiveDetailType === 'V'){
            videoList.push({
              detailID: data.archiveDetailID,
              videoUrl: data.archiveDetailContent,
              imageUrl: '/images/icons/video.jpeg'
            });
          }
          if(data.archiveDetailType === 'F'){
            fileList.push({
              fileName: data.archiveDetailContent.substr(data.archiveDetailContent.lastIndexOf('/') + 1),
              fileUrl: data.archiveDetailContent
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
    }
  });
});

module.exports = router;
