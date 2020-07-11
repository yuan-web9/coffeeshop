<template>
  <div class="security-cente">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      right-text="退出登录"
      left-arrow
      @click-left="goBack"
      @click-right="logout"
    />

    <van-button class="vBtn" type="primary" block @click="showPopup">修改密码</van-button>

    <van-button class="vBtn" type="primary" block @click="openDestroyConfirm">注销账号</van-button>

    <!-- 修改密码弹出层 -->
    <van-action-sheet v-model="show" title="修改密码">
      <van-form @submit="updatePassword">
        <van-field
          v-model="oldPassword"
          type="password"
          name="旧密码"
          label="旧密码"
          placeholder="旧密码(6-16位)"
          :rules="[{ required: true, message: '请填写旧密码' }]"
        />
        <van-field
          v-model="nowPassword"
          type="password"
          name="新密码"
          label="新密码"
          placeholder="新密码(6-16位)"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </van-action-sheet>

    <!-- 注销账号弹窗提示 -->
    <van-popup class="destroy-confirm" v-model="destroyShow" :close-on-click-overlay="false">
      <div class="destroy-msg">确认要注销账号吗?</div>
      <div class="destroy-btn-box">
        <van-button class="destroy-btn" plain type="info" @click="destroyAccount">确定</van-button>
        <van-button class="destroy-btn" plain type="info" @click="closeDestroyConfirm">取消</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "SecurityCente",
  data() {
    return {
      show: false,
      destroyShow: false,
      oldPassword: "",
      nowPassword: ""
    };
  },
  created() {},
  methods: {
    //   返回上一个页面
    goBack() {
      this.$router.go(-1);
    },

    // 显示修改密码弹窗
    showPopup() {
      this.show = true;
    },

    // 打开注销确认弹窗
    openDestroyConfirm() {
      this.destroyShow = true;
    },

    // 关闭注销确认弹窗
    closeDestroyConfirm() {
      this.destroyShow = false;
    },

    // 退出登录
    logout() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/logout",
        data: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "F001") {
            localStorage.removeItem("__Tk");
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 注销账号
    destroyAccount() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/destroyAccount",
        data: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "G001") {
            this.$toast.success("注销成功");
            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 1500);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 修改密码
    updatePassword() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          oldPassword: this.oldPassword,
          password: this.nowPassword
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == "E001") {
            this.show = false;
            this.$toast.success("修改成功");
            setTimeout(() => {
              this.$router.push({ name: "Login" });
            }, 1500);
          }else{
            this.$toast.fail(result.data.msg);
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
.security-cente {
  background-color: #f7f7f7;
  position: fixed;
  bottom: 0;
  left: 0;
  top: 0;
  width: 100%;
}
.vBtn {
  color: #000;
  background-color: #fff;
  border: none;
  margin: 20px auto;
  width: 95%;
}

.destroy-confirm {
  height: 120px;
  width: 200px;
  .destroy-msg {
    font-size: 16px;
    height: 76px;
    line-height: 76px;
  }
  .destroy-btn-box {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    .destroy-btn {
      width: 50%;
      border-color: #ccc;
    }
  }
}
</style>