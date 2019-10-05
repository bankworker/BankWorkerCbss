let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    branchTitle: '',
    newsTitle: '',
    newsDate: '',
    newsContent: ''
  };

  $scope.initPage = function(){
    $scope.loadBranchInfo();
    $scope.loadNewsInfo();
  };

  $scope.loadBranchInfo = function(){
    let branchInfo = getLoginUserInfo();
    $scope.model.branchTitle = branchInfo.branchName + '近期新闻';
  };

  $scope.loadNewsInfo = function(){
    let newsID = document.getElementById('hidden-newsID').value;
    $http.get('/news/detail?newsID=' + newsID).then(function successCallback (response) {
      if(response.data.err){
        if(response.data.expired){
          location.href = '/login';
        }else{
          bootbox.alert(response.data.msg);
          return false;
        }
      }
      if(response.data.news === null){
        layer.msg('未查询到新闻内容！');
        return false;
      }
      $scope.model.newsTitle = response.data.news.newsTitle;
      $scope.model.newsDate = response.data.news.newsDate;
      $scope.model.newsContent = response.data.news.newsContent;
      $('.news-content').html($scope.model.newsContent);

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.initPage();
});