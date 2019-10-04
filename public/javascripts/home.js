$(document).ready(function () {

  function loadNewsList(){
    $.ajax({
      url: '/home/newsList?pageNumber=1',
      type: 'get',
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        if(res.dataList.length === 0){
          layer.msg('没有数据啦！');
          return false;
        }
        let count = 0;
        $.each(res.dataList, function (index, news) {
          count++;
          $('.content-news-item ul').append(
              '<li>\n' +
              '  <a href="/news?newsID=' + news.newsID + '">\n' +
              '    <img src="' + news.thumbnailUrl + '" alt="">\n' +
              '  </a>\n' +
              '  <div class="des">\n' +
              '    <p>' + news.newsTitle + '</p>\n' +
              '    <p>' + news.newsDate + '</p>\n' +
              '  </div>\n' +
              '</li>');
          if(count % 4 !== 0){
            $('.content-news-item ul').append('<li class="interval"></li>');
          }
        });
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  }

  $("#fileName").keydown(function (e) {
    switch (e.keyCode){
      // 回车
      case 13:
        enter(e);
        break;
      case 38:
        //上键
        up(e);
        break;
      case 40:
        //下键
        down(e);
        break;
    }
  });

  function up(e){
    $('.sey-list').focus();
    let resultCount = $('.sey-list').find('li').length;
    if(resultCount === 0){
      return false;
    }

    let currentIndex = $('.sey-list').find('li.sey-selected').index();
    if(currentIndex === -1){
      currentIndex = resultCount - 1;
    }else if(currentIndex <= 0){
      currentIndex = resultCount - 1;
    }else{
      currentIndex--;
    }
    $('.sey-list').find('li').removeClass('sey-selected');
    $('.sey-list').find('li').eq(currentIndex).addClass('sey-selected');
    e.stopPropagation();
  }

  function down(e){
    $('.sey-list').focus();
    let resultCount = $('.sey-list').find('li').length;
    if(resultCount === 0){
      return false;
    }

    let currentIndex = $('.sey-list').find('li.sey-selected').index();
    if(currentIndex === -1){
      currentIndex = 0;
    }else if(currentIndex >= resultCount - 1){
      currentIndex = 0;
    }else{
      currentIndex++;
    }
    $('.sey-list').find('li').removeClass('sey-selected');
    $('.sey-list').find('li').eq(currentIndex).addClass('sey-selected');
    e.stopPropagation();
  }

  function enter(e){
    let resultCount = $('.sey-list').find('li').length;
    let currentIndex = $('.sey-list').find('li.sey-selected').index();
    if(resultCount === 0 || currentIndex === -1){
      return false;
    }
    let fileUrl = $('.sey-list').find('li.sey-selected').find('a').attr('href');
    window.open(fileUrl);
    $('.sey-list').hide();
    e.stopPropagation();
  }

  $("#fileName").bind("input propertychange", function () {
    let fileName = $.trim($("#fileName").val());
    if(fileName.length === 0){
      return false;
    }
    $.ajax({
      url: '/list/file?fileName=' + fileName,
      type: 'get',
      async: false,
      success: function(res){
        if(res.err){
          layer.msg(res.msg);
          return false;
        }
        $('.sey-list').empty();
        $.each(res.dataList, function (index, data) {
          let file = data.content.substr(data.content.lastIndexOf('/') + 1);
          $('.sey-list').append('<li class="sey-item"><a href="' + data.content + '" target="_blank">' + file + '</a></li>');
        });
        $('.sey-list li').click(function () {
          let fileUrl = $(this).find('a').attr('href');
          window.open(fileUrl);
          $('.sey-list').hide();
        });

        $('.sey-list').show();
      },
      error: function(XMLHttpRequest){
        layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
      }
    });
  });

  $('.btn-more-news').click(function () {
    window.open('/newsList');
  });


  loadNewsList();
});