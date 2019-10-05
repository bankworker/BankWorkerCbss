$(function() {
  let treeData = {
    files: [
      {
        "id": 11,
        "pid": -1,
        "title": "全部文件",
        "type": 'R'
      }
    ]
  };

  $(".select p").click(function(e) {
    $(this).parent().toggleClass('open');
    e.stopPropagation();
  });

  $(".select ul li").click(function(e) {
    var _this = $(this);
    _this.parent().siblings('p').text(_this.attr('data-value'));
    _this.addClass("Selected").siblings().removeClass("Selected");
    _this.parent().parent().removeClass("open");
    e.stopPropagation();
  });

  $(document).on('click', function() {
    $(".select").removeClass("open");
    $('.sey-list').empty();
  });

  function resetTreeView(rootID, rootTitle){
    treeData = {
      files: [
        {
          "id": parseInt(rootID),
          "pid": -1,
          "title": rootTitle,
          "type": 'R'
        }
      ]
    };
    $('#treeView').empty();
  }

  function getChildrenItems(parentID) {
    $.ajax({
      url: '/list/item?parentItemID=' + parentID,
      type: 'get',
      async: false,
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        if(res.dataList == null || res.dataList.length === 0){
          return false;
        }
        $.each(res.dataList, function (index, data) {
          treeData.files.push({
            "id": data.archiveID,
            "pid": data.archiveParentID,
            "title": data.archiveName,
            "type": data.archiveType
          })
        });
        $.each(res.dataList, function (index, data) {
          getChildrenItems(data.archiveID);
        });

      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function buildTreeView() {
    let jtree = new Jtree(treeData);
    jtree.build();
    $('#treeView div.treeNode[data-node-type="R"]').find('i.icon-control').removeClass('icon-minus').addClass('icon-add');
  }

  /**
   * 加载当前模块的考评项目
   */
  function loadBlocks() {
    $.ajax({
      url: '/list/item?parentItemID=' + $('#hidden-itemID').val(),
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        $.each(res.dataList, function (index, data) {
          if(index === 0){
            $('ul.tabs-ul').append(
                '<li>\n' +
                ' <a class="tab-active" data-index="' + index + '" href="#" data-item-id="' + data.archiveID + '">' + data.archiveName + '</a>\n' +
                '</li>');
          }else{
            $('ul.tabs-ul').append(
                '<li>\n' +
                ' <a data-index="' + index + '" href="#" data-item-id="' + data.archiveID + '">' + data.archiveName + '</a>\n' +
                '</li>');
          }
        });
        let widget = $('.tabs-vertical');
        let content = widget.find('.tabs-content-placeholder > div.tabblock');
        let tabs = widget.find('ul a');
        let obj = $('.menuTree')[0];
        tabs.on('click', function(e) {
          e.preventDefault();
          let currentBlockID = $('a.tab-active').attr('data-item-id');
          let blockID = $(this).attr('data-item-id');
          let blockName = $(this).text();
          // Get the data-index attribute, and show the matching content div
          let index = $(this).data('index');
          if(currentBlockID === blockID){
            return false;
          }
          resetTreeView(blockID, blockName);
          getChildrenItems($(this).attr('data-item-id'));
          buildTreeView();
          setFileNodeIcon();
          setDetailNodeEvent();
          tabs.removeClass('tab-active');
          content.removeClass('tab-content-active');
          $(this).addClass('tab-active');
          content.eq(index).addClass('tab-content-active');
        });
        loadDefaultTreeView();
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  function loadDefaultTreeView(){
    let blockID = $('a.tab-active').attr('data-item-id');
    let blockName = $('a.tab-active').text();
    if(blockID === undefined){
      layer.msg('没有维护考评项目。');
      return false;
    }
    resetTreeView(blockID, blockName);
    getChildrenItems(blockID);
    buildTreeView();
    setFileNodeIcon();
    setDetailNodeEvent();
  }

  function setFileNodeIcon() {
    let detailNode = $('div.treeNode[data-node-type="D"]');
    $(detailNode).find('i.icon-file').remove();
    $(detailNode).find('i.icon-control').after('<i class="icon-file-text" style="color: #90d900; font-size: 16px; margin-right: 8px; position: relative; top: 6px"></i>');
  }

  function setDetailNodeEvent(){
    $('div.treeNode[data-node-type="D"]').click(function () {
      let itemID = $(this).attr('data-file-id');
      let itemName = $(this).find('span.title').text()
      // let year = $(this).find('span.title').text().substr(0, 4);
      // let quarter = $(this).find('span.title').text().substr(6, 1);
      window.open('/detail?itemID=' + itemID + '&itemName=' + itemName);

    });
  }
  
  loadBlocks();
});

