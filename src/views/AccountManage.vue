<template>
  <div class="account-manage">
    <van-nav-bar title="账号管理" left-text="返回" left-arrow @click-left="goBack" />

    <van-cell-group>
      <van-cell title="头像" center>
        <template #default>
          <van-uploader class="updata-avatar" :after-read="afterRead">
            <van-image width="40" height="40" :src="accountInfo.userImg" />
          </van-uploader>
        </template>
      </van-cell>
      <van-cell title="用户id" :value="accountInfo.userId" center />
      <van-cell title="手机号" ref="'tel'" :value="accountInfo.phone" center />
      <van-cell title="昵称" :value="accountInfo.nickName" center @click="openNick" />
      <van-cell title="简介" :value="accountInfo.desc" center @click="openDesc"/>
    </van-cell-group>

    <!-- 改昵称弹窗 -->
    <van-action-sheet class="updateNick" v-model="nickShow" title="修改昵称">
      <div class="content">
        <van-form @submit="updateNickName">
          <van-field v-model="newNick" name="新昵称" label="新昵称" placeholder="请填写新昵称" />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @submit="updateNickName">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-action-sheet>

    <!-- 改简介弹窗 -->
    <van-action-sheet class="updateDesc" v-model="descShow" title="修改简介">
      <div class="content">
        <van-form @submit="updateDesc()">
          <van-field v-model="newDesc" name="新简介" label="新简介" placeholder="请填写新简介" />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit" @click="updateDesc">提交</van-button>
          </div>
        </van-form>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  name: "AccountManage",
  data() {
    return {
      nickShow: false,
      descShow: false,
      newNick:'',
      newDesc:'',
      accountInfo: {}
    };
  },

  created() {
    this.getAccountInfo();
  },

  methods: {
    //   返回上一页面
    goBack() {
      this.$router.go(-1);
    },

    // 打开昵称修改窗口
    openNick(){
        this.nickShow=true;
    },

    // 打开简介修改窗口
    openDesc(){
        this.descShow=true;
    },

    // 提取base64内容
    afterRead(file) {
      let arr = file.content.split(",");
      let type = arr[0].split("/")[1];
      let img = arr[1];
      this.updataAvatar(type, img);
    },

    // 修改昵称方法
    updateNickName() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName:this.newNick
        }
      })
        .then(result => {
          this.$toast.clear();
          
            if (result.data.code == "C001") {
              this.nickShow=false;
              this.getAccountInfo();
            }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 修改简介的方法
    updateDesc() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc:this.newDesc
        }
      })
        .then(result => {
          this.$toast.clear();
          
            if (result.data.code == "D001") {
              this.descShow=false;
              this.getAccountInfo();
            }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },
    // 上传修改头像
    updataAvatar(type, img) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: type,
          serverBase64Img: img
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "H001") {
            this.getAccountInfo();
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 获取账号管理数据
    getAccountInfo() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "B001") {
            this.accountInfo = result.data.result[0];
            
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
.van-cell {
  height: 60px;
  line-height: 60px;
  .van-cell__title {
    text-align: left;
    font-size: 16px;
  }
}

.updata-avatar {
  float: right;
  height: 100%;
  line-height: 100%;
  // .van-image {
  // }
}
</style>