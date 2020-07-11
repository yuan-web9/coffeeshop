<template>
  <div class="my-page">
    <!-- 顶部背景头像等部分 -->
    <div
      class="top-box clearfix"
      :style="'background:url('+userInfo.userBg+') no-repeat center center; backgroundSize:cover'"
    >
      <div class="user-img fl">
        <van-image class="head-img" round width="100px" height="100px" :src="userInfo.userImg" />
      </div>
      <div class="user-msg fl">
        <div class="user-name">{{userInfo.nickName}}</div>
        <div class="user-note">{{userInfo.desc==''?'这个人很懒,什么都没写':userInfo.desc}}</div>
      </div>
      <van-uploader class="updata-changeBg" :after-read="afterRead">
        <span class="changeBg">更换背景</span>
      </van-uploader>
    </div>
    <div class="user-nav">
      <div
        class="user-function"
        v-for="(item,index) in uiData"
        :key="index"
        @click="goPage(item.url)"
      >
        {{item.title}}
        <van-icon name="arrow" class="fr right-icon" />
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/my.less";
export default {
  name: "My",
  data() {
    return {
      uiData: [
        { title: "账号管理", url: "AccountManage" },
        { title: "地址管理", url: "AddressManage" },
        { title: "我的收藏", url: "MyCollect" },
        { title: "安全中心", url: "SecurityCente" }
      ],

      maxSize:1,
      userInfo: {}
    };
  },

  created() {
    this.getUserInfo();
  },

  methods: {
    // 跳转到相应管理界面
    goPage(name) {
      let tokenString=localStorage.getItem('__Tk');

      // 未登录时跳转
      if (tokenString == null) {
        this.$toast.fail("你还未登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 1000);
        return;
      }
      this.$router.push({ name });
    },

    // 选择上传背景图
    afterRead(file) {
      // 
      let arr = file.content.split(",");
      let type = arr[0].split("/")[1];
      let img = arr[1];
      // 
      // 
      this.updataBackground(type, img);
    },

    // 上传背景到服务器端
    updataBackground(type, img) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: type,
          serverBase64Img: img
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "I001") {
            this.getUserInfo();
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 获取我的页面的账户信息
    getUserInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "A001") {
            let data = result.data.result[0];
            this.userInfo = data;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
</style>