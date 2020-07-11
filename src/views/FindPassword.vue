<template>
  <div class="find-password">
    <van-nav-bar
      title="找回密码"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-form class="find-box" @submit="checkNumber">
      <van-field
        v-model="userphone"
        name="手机号"
        label="手机号"
        placeholder="手机号"
        :rules="[{ required: true, message: '请填写手机号' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="新密码"
        label="新密码"
        placeholder="新密码"
        :rules="[{ required: true, message: '请填写6-16位新密码' }]"
      />
      <van-field
        v-model="email"
        name="邮箱"
        label="邮箱"
        placeholder="邮箱"
        :rules="[{ required: true, message: '请填写邮箱' }]"
      />
      <van-field
        v-model="number"
        name="邮箱验证码"
        label="邮箱验证码"
        placeholder="邮箱验证码"
        
      >
      <template #right-icon>
        <van-button type="default" class="send-btn" :disabled="isSend" @click='sendNumber'>{{sendBtnWord}}</van-button>
      </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import validForm from '../assets/js/validForm'
export default {
  name: "FindPassword",

  data() {
    return {
      userphone: '',
      password: '',
      email:'',
      number:'',
      sendBtnWord:'发送验证码',
      isSend:false
    };
  },

  methods: {

    // 返回上一个页面
    goBack(){
      this.$router.go(-1);
    },

    // 发送邮箱验证码按钮
    sendNumber(){
      // 校验邮箱地址
      if(!validForm.validUserForm({email:this.email})){
        return;
      }

      // 设置60秒后可以重新发送
      let time=60;
      this.sendBtnWord=time+'s';
      this.isSend=true;
      let timer=setInterval(()=>{
        if(time==0){
          clearInterval(timer);
          timer=null;
          this.sendBtnWord='发送验证码';
          this.isSend=false;
        }else{
          time--;
          this.sendBtnWord=time+'s';
        }
      },1000);

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      }),

      this.axios({
        method:'POST',
        url:'/emailValidCode',
        data:{
          appkey:this.appkey,
          email:this.email
        }
      }).then(result=>{
        this.$toast.clear();
        
      }).catch(err=>{
        this.$toast.clear();
        
      })

    },

    // 验证接收的验证码
    checkNumber(){
      // let number=this.number;
      if(!validForm.validUserForm({email:this.email,number:this.number,phone:this.userphone,password:this.password})){
        return;
      }

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      }),

      this.axios({
        method:'POST',
        url:'/checkValidCode',
        data:{
          appkey:this.appkey,
          validCode:this.number
        }
      }).then(result=>{
        this.$toast.clear();
        

        this.retrievePassword();
      }).catch(err=>{
        this.$toast.clear();
        
      })
    },

    // 找回密码(修改密码)
    retrievePassword(){
      
      let phone=this.userphone;
      let password=this.password;

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      }),

      this.axios({
        method:'POST',
        url:'/retrievePassword',
        data:{
          appkey:this.appkey,
          phone,
          password
        }
      }).then(result=>{
        this.$toast.clear();
        
        if(result.data.code=='L001'){
          this.$toast.success('修改成功');
          setTimeout(()=>{
            this.$router.push({name:'Login'});
          },1000);
        }else{
          this.$toast.fail(result.data.msg);
        }
      }).catch(err=>{
        this.$toast.clear();
        
      })
    }

  },
};
</script>

<style lang="less" scoped>
.find-box{
  margin-top: 20px;
}
.send-btn{
  background-color: #1989fa;
  color:#fff;
}
</style>