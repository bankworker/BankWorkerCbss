let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    searchContent: '',
    bankLogoUrl: '',
    branchLogoUrl: '',
    isUseDefaultBackImage: true,
    branchBackImageStyle: {},
    branchName: '',
    branchSystemTitle: '',
    branchModuleList: [],
    branchNewsList: [],
    isShowSearchResult: false,
    searchResultList: []
  };

  $scope.initPage = function () {
    $scope.loadBranchSetting();
    $scope.loadModuleList();
    $scope.loadNewsList();
  };

  $scope.loadBranchSetting = function(){
    $http.get('/login/backImageSetting').then(function successCallback (response) {
      if(response.data.err){
        $scope.model.isUseDefaultBackImage = true;
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        $scope.model.isUseDefaultBackImage = true;
        return false;
      }
      $scope.model.bankLogoUrl = response.data.branchInfo.bankLogo;
      $scope.model.branchLogoUrl = response.data.branchInfo.branchLogo;
      $scope.model.branchSystemTitle = response.data.branchInfo.branchName + '服务档案';
      $scope.model.branchName = response.data.branchInfo.branchName;
      if(response.data.branchInfo.branchBackImage !== ''){
        $scope.model.isUseDefaultBackImage = false;
        $scope.model.branchBackImageStyle = {
          "background": "url(" + response.data.branchInfo.branchBackImage + ") repeat-y center center fixed",
          "background-size": "100%"
        };
      }

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadModuleList = function(){
    $http.get('/index/moduleList').then(function successCallback (response) {
      if(response.data.err){
        if(response.data.expired){
          location.href = '/login';
        }else{
          bootbox.alert(response.data.msg);
          return false;
        }
      }
      if(response.data.dataList === null){
        bootbox.alert('您尚未维护指标信息。');
        return false;
      }
      angular.forEach(response.data.dataList, function (data) {
        $scope.model.branchModuleList.push({
          moduleLinkUrl: '/list?itemID=' + data.archiveID + '&itemName=' + data.archiveName,
          moduleIconUrl: '/images/icons/' + data.archiveName + '.png'
        });
      });

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadNewsList = function(){
    $http.get('/index/newsList').then(function successCallback (response) {
      if(response.data.err){
        if(response.data.expired){
          location.href = '/login';
        }else{
          bootbox.alert(response.data.msg);
          return false;
        }
      }
      if(response.data.dataList === null){
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

  $scope.onSearchChange = function(){
    $scope.model.searchResultList.splice(0, $scope.model.searchResultList.length);
    if($scope.model.searchContent.length === 0){
      $scope.model.isShowSearchResult = false;
      return false;
    }
    $http.get('/index/fuzzyList?fuzzyContent='+$scope.model.searchContent).then(function successCallback (response) {
      if(response.data.err){
        if(response.data.expired){
          location.href = '/login';
        }else{
          bootbox.alert(response.data.msg);
          return false;
        }
      }
      if(response.data.dataList === null){
        $scope.model.isShowSearchResult = false;
        return false;
      }
      angular.forEach(response.data.dataList, function (data) {
        $scope.model.searchResultList.push({
          filePath: data.archiveDetailContent,
          archiveName: data.archiveDetailContent.substr(data.archiveDetailContent.lastIndexOf('/') + 1),
          isMoveOver: false
        });
      });
      $scope.model.isShowSearchResult = true;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onMouseEnter = function(index){
    $scope.model.searchResultList[index].isMoveOver = true;
  };

  $scope.onMouseLeave = function(index){
    $scope.model.searchResultList[index].isMoveOver = false;
  };

  $scope.onSelectedSearchItem = function(filePath){
    window.open(filePath);
  };

  $scope.onContainer = function(){
    $scope.model.isShowSearchResult = false;
  };

  $scope.onExit = function(){
    delCookie('cbssUser');
    delCookie('cbssUserID');
    location.href = '/';
  };

  $scope.initPage();
});