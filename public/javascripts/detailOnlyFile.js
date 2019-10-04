$(function(){
  function initPage() {
    setPageTitle();
  }

  function setPageTitle() {
    let itemID = $('#hidden-itemID').val();
    let itemName = $('#hidden-itemName').val();
    $('.page-title').text(itemName);
  }

  initPage();
});