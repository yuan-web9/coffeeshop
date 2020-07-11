<template>
  <div class="login">
    <van-nav-bar title="登录" left-text="关闭" right-text="注册"  @click-right="goPage('Register')"/>
    <div class="logo-box">
      <img class="logo auto-img" src="../assets/images/logo.png" />
    </div>

    <van-form @submit="login">
      <van-field
        v-model="userInfo.phone"
        name="手机号"
        label="手机号"
        left-icon="phone"
        placeholder="请输入手机号"
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
        <van-button round block type="info" native-type="submit">登录</van-button>
      </div>
    </van-form>

    <!-- 找回密码跳转 -->
    <span class="findPassword" @click="findPassword">找回密码</span>
    
  </div>
</template>

<script>
import validForm from '../assets/js/validForm'
export default {
  name: "Login",

  data() {
    return {
      userInfo: {
        phone: "",
        password: ""
      },
      isHidden: true
    };
  },

  methods: {

    // 页面跳转
    goPage(name){
      this.$router.push({name});
    },

    // 密码可见切换事件
    pwHidden() {
      this.isHidden = this.isHidden ? false : true;
    },

    // 输入密码时隐藏密码
    pwInput() {
      this.isHidden = true;
    },

    // 登录事件
    login(){
      if(validForm.validUserForm(this.userInfo,this)){
        // 
        // 复制对象
        let data = Object.assign({},this.userInfo);

        // 请求密钥
        data.appkey=this.appkey;

        // 开启加载提示
        this.$toast.loading({
          message:'加载中...',
          forbidClick:true,

          // 延迟自动关闭加载提示,如果为0,则不会自动关闭
          duration:0
        });

        // 发起登录请求
        this.axios({
          method:'POST',
          url:'/login',

          // post传输参数需要写在data
          data
        }).then(result=>{
          // 关闭加载提示
          this.$toast.clear();
          

          if(result.data.code==200){
            // 跳转到菜单
            

            // 存储token,用于后面登录验证
            localStorage.setItem('__Tk',result.data.token);
            this.goPage('Menu');
          }else{
            this.$toast(result.data.msg);
          }
        }).catch(err=>{
          // 关闭加载提示
          this.$toast.clear();
          
        })
      }
    },

    // 找回密码事件
    findPassword(){
      this.$router.push({name:'FindPassword'})
    },

  }
};
</script>

<style lang="less" scoped>
.logo-box {
  width: 200px;
  height: 200px;
  margin: 30px auto;
}
.findPassword{
  float: right;
  margin-right: 20px;
  color:#aaa;
}
</style>