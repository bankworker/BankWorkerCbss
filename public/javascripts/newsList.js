let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    branchTitle: '',
    branchNewsList: [],
    pageNumber: 1,
    isShowLoadMore: true
  };

  $scope.initPage = function(){
    $scope.loadBranchInfo();
    $scope.loadNewsList();
  };

  $scope.loadBranchInfo = function(){
    let branchInfo = getLoginUserInfo();
    $scope.model.branchTitle = branchInfo.branchName + '近期新闻';
  };

  $scope.loadNewsList = function(){
    $http.get('/newsList/data?pageNumber=' + $scope.model.pageNumber).then(function successCallback (response) {
      if(response.data.err){
        if(response.data.expired){
          location.href = '/login';
        }else{
          bootbox.alert(response.data.msg);
          return false;
        }
      }
      if(response.data.dataList === null || response.data.dataList.length === 0){
        if($scope.model.branchNewsList.length > 0){
          $scope.model.isShowLoadMore = false;
          layer.msg('已经加载所有的新闻啦！');
        }
        return false;
      }
      angular.forEach(response.data.dataList, function (data) {
        $scope.model.branchNewsList.push({
          newsLinkUrl: '/news?newsID=' + data.newsID,
          newsImageUrl: data.thumbnailUrl,
          newsTitle: data.newsTitle,
          newsDate: data.newsDate
        });
      });

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onLoadMore = function(){
    $scope.model.pageNumber++;
    $scope.loadNewsList();
  };

  $scope.initPage();
});