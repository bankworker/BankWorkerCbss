$(function(){

  function initPage() {
    setPageTitle();
  }

  function setPageTitle() {
    let itemID = $('#hidden-itemID').val();
    let itemName = $('#hidden-itemName').val();
    $('.page-title').text(itemName);
  }

  $('.detail-switch ul li').click(function () {
    let target = $(this).attr('data-target');
    $('.detail-switch ul li').removeClass('detail-switch-select');
    $('#'+$(this).attr('id')).addClass('detail-switch-select');

    $('.imgContainer .banner').addClass('hidden');
    $('.' + target).removeClass('hidden')
  });

  $(".banner-video").thumbnailImg({
    large_elem: ".banner-video .large_box",
    small_elem: ".banner-video .small_list",
    left_btn: ".banner-video .left_btn",
    right_btn: ".banner-video .right_btn"
  });

  $(".banner-image").thumbnailImg({
    large_elem: ".banner-image .large_box",
    small_elem: ".banner-image .small_list",
    left_btn: ".banner-image .left_btn",
    right_btn: ".banner-image .right_btn"
  });


  initPage();
});