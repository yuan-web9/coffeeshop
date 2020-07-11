<template>
  <div class="address-manage">
    <van-nav-bar title="管理地址" left-text="返回" left-arrow  @click-left="goBack"/>
    
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认" 
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import "../assets/css/addressManage.less";
export default {
  name: "AddressManage",
  data() {
    return {
      chosenAddressId: 0,
      list: [],
    };
  },

  created() {
    this.getAddress();
  },

  methods: {
    // 新增地址按钮事件
    onAdd() {
      this.$router.push({name:'Address',query:{bool:1}});
    },

    // 修改按钮事件
    onEdit(item, index) {
        this.$router.push({name:'Address',query:{bool:0,aid:item.aid}})
    },

    // 返回上一个页面
    goBack(){
        this.$router.go(-1);
    },

    // 获取用户已保存地址
    getAddress() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if(result.data.code==20000){
              let data=result.data.result;
              let n=1;
              data.forEach(e=>{
                  e.address=e.province+e.city+e.county+e.addressDetail;
                  if(e.isDefault=='1'){
                    this.chosenAddressId=e.id;
                  }
              })
              this.list=data;

          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    delAddress(aid) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data: {
          appkey: this.appkey,
          tokenString,
          aid: aid
        }
      })
        .then(result => {
          this.$toast.clear();
          
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