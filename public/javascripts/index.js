let app = new Vue({
  el: '#app',
  data: {
    title: ''
  },
  methods: {
    setSystemTitle: function () {
      $.ajax({
        url: '/sysName',
        type: 'get',
        success: function(res){
          if(res.err){
            layer.msg(res.msg);
            return false;
          }
          app.$data.title = res.data.sysName;
        },
        error: function(XMLHttpRequest){
          layer.msg('远程服务无响应，状态码：' + XMLHttpRequest.status);
        }
      });
    }
  },
  mounted: function () {
    this.setSystemTitle();
  }
});