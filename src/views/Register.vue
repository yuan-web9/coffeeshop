<template>
  <div class="register">
    <!-- 顶部导航 -->
    <van-nav-bar title="注册" left-text="返回" right-text="登录" left-arrow @click-right="goPage('Login')" />

    <!-- <van-image class="logo" round width="5rem" height="5rem" src="../assets/images/logo.jpg"/> -->

    <div class="logo-box">
      <img class="logo auto-img" src="../assets/images/logo.png" />
    </div>

    <!-- 注册表单 -->
    <van-form @submit="register" class="register-form">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        type="text"
        maxlength="11"
        left-icon="phone"
        placeholder="请输入手机号"
      />
      <van-field
        v-model="userInfo.nickName"
        name="昵称"
        label="昵称"
        placeholder="请输入昵称"
        left-icon="manager"
      />
      <van-field
        v-model="userInfo.password"
        :type="isHidden?'password':'text'"
        name="密码"
        label="密码"
        left-icon="lock"
        :right-icon="isHidden?'closed-eye':'eye'"
        placeholder="请输入6-16位密码"
        @click-right-icon="pwHidden"
        @input="pwInput"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">注册</van-button>
      </div>
    </van-form>

    <!-- <div class="a"></div> -->
  </div>
</template>

<script>
// 导入表单验证模块
import validForm from "../assets/js/validForm";
import '../assets/css/register.less';
export default {
  name: "Register",

  data() {
    return {
      userInfo: {
        nickName: "",
        phone: "",
        password: ""
      },
      isHidden: true
    };
  },

  methods: {

    // 页面跳转
    goPage(name) {
      this.$router.push({ name });
    },

    // 密码可见切换
    pwHidden() {
      this.isHidden = this.isHidden ? false : true;
    },

    // 输入时隐藏密码
    pwInput() {
      this.isHidden = true;
    },

    // 注册事件
    register() {
      // 验证表单
      if (validForm.validUserForm(this.userInfo, this)) {
        // 复制对象
        let data = Object.assign({}, this.userInfo);

        // 请求密钥
        data.appkey = this.appkey;

        // 开启加载提示
        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,

          // 延迟自动关闭加载提示,如果该值为0,则不会自动关闭
          duration: 0
        });

        // 发起注册请求
        this.axios({
          method: "POST",
          url: "/register",

          // post传递参数需要写在data
          data
        })
          .then(result => {
            // 关闭加载提示
            this.$toast.clear();
            
            if(result.data.code==100){
              this.$toast.success('注册成功');
              setTimeout(()=>{
                this.$router.push({name:'Login'});
              },1500);
            }
          })
          .catch(err => {
            // 关闭加载提示
            this.$toast.clear();
            
          });
      }
    }
  }
  //   watch:{

  //   }
};
</script>

<style lang="less" scoped>

</style>