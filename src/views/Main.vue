<template>
  <div class="main">
    <div class="main-box">
      <router-view></router-view>
    </div>

    <van-tabbar v-model="active" @change="onChange">
      <van-tabbar-item
        v-for="(item,index) in tabBarData"
        :key="index"
        :icon="item.icon"
      >{{item.title}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import "../assets/css/main.less";
export default {
  name: "Main",
  data() {
    return {
      active: 0,
      tabBarName: "home",
      tabBarData: [
        {
          icon: "coupon-o",
          title: "菜单",
          routerName: "Menu"
        },
        {
          icon: "orders-o",
          title: "订单",
          routerName: "Order"
        },
        {
          icon: "shopping-cart-o",
          title: "购物车",
          routerName: "Shopcart"
        },
        {
          icon: "user-o",
          title: "我的",
          routerName: "My"
        }
      ]
    };
  },

  created(){
    this.getNewRoute();
  },

  methods: {
    // 路由跳转
    onChange(index) {
      //   
      this.$router.push({ name: this.tabBarData[index].routerName });
    },

    // 获取当前路径并匹配对应选择
    getNewRoute() {
      let url = location.hash;
      
      let arr = url.split("/");
      
      if (arr[arr.length - 1] == "main" || arr[arr.length - 1] == "menu") {
        // this.nav.forEach(element => {
        //   element.isActive = false;
        // });
        // this.nav[1].isActive = true;
        // this.$router.push(this.nav[1].url);
        this.active=0;
      }else if(arr[arr.length - 1] == "order"){
        this.active=1;
      }else if(arr[arr.length - 1] == "shopcart"){
        this.active=2;
      }else if(arr[arr.length - 1] == "my"){
        this.active=3;
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>