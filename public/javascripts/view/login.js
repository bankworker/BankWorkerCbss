let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    account: '',
    password: '',
    branchLogoUrl: '',
    branchBackImageStyle: {}
  };

  $scope.initPage = function () {
    $scope.loadData();
  };


  $scope.loadData = function(){
    $http.get('/login/backImageSetting').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }

      if(response.data.branchInfo.branchBackImage !== ''){
        $scope.model.branchBackImageStyle = {
          "background": "url(" + response.data.branchInfo.branchBackImage + ") no-repeat center center fixed",
          "background-size": "100%"
        };
      }

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onLogin = function () {
    $http.post('/', {
      account: $scope.model.account,
      password: $scope.model.password
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.userInfo === null){
        bootbox.alert('您输入的帐号密码不存在！');
        return false;
      }
      //记录Cookie
      setCookie('cbssUser', JSON.stringify(response.data.userInfo));
      setCookie('cbssUserID', response.data.userInfo.accountID);
      setCookie('cbssBankCode', response.data.userInfo.bankCode);
      setCookie('cbssBranchCode', response.data.userInfo.branchCode);
      location.href = '/index';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.initPage();
});