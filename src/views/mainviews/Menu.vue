<template>
  <div class="menu">
    <!-- 顶部轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in bannerData" :key="index">
        <img class="auto-img" :src="item.bannerImg" />
      </van-swipe-item>
    </van-swipe>

    <div class="menu-box">
      <!-- 侧边子导航栏 -->
      <div class="sidebar fl">
        <van-sidebar v-model="activeKey" >
          <van-sidebar-item v-for="(item,index) in typeData" :key="index" :title="item.typeDesc" @click="getProductByType(item)"/>
        </van-sidebar>
      </div>

      <div class="class-content fl">
          <div v-for="(item,index) in productData" :key="index" class="item" @click="goPage(item.pid,'Detail')">
              <span class="item-img-box">
                  <img class="auto-img" :src="item.smallImg">
              </span>
              <div class="item-msg">
                  <p class="item-title">{{item.name}}</p>
                  <p class="item-type">{{item.enname}}</p>
                  <p class="item-choice">大/热/无糖</p>
                  <p class="item-price">￥{{item.price}}</p>
              </div>
              <span class="item-icon"></span>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

import {createNamespacedHelpers} from 'vuex';
import '../../assets/css/menu.less';

const {mapState} = createNamespacedHelpers('menuModule')

export default {
  name: "Menu",
  data() {
    return {
      bannerData: [],

      typeData:[],

      productData:[],

      activeKey: 0,

      menuData: {
        hot: {
          title: "最新推荐",
          key: "isHot",
          value: 1,
          data: []
        },
        latte: {
          title: "拿铁",
          key: "type",
          value: "latte",
          data: []
        },
        coffee: {
          title: "咖啡",
          key: "type",
          value: "coffee",
          data: []
        },
        rena_ice: {
          title: "瑞纳冰",
          key: "type",
          value: "lrena_ice",
          data: []
        }
      }
    };
  },

  created() {
    // 获取banner数据
    this.getBannerData();
    this.getTypeData();

  },

  computed: {
    ...mapState(['bannerDataCache'])
  },

  methods: {
    // 根据类型获取商品数据
    // getData(key, value, tag) {
    //   this.axios({
    //     // method: 'GET',
    //     url: "/typeProducts",
    //     params: {
    //       appkey: this.appkey,
    //       key: key,
    //       value: value
    //     }
    //   })
    //     .then(result => {
    //       // 关闭加载提示
    //         this.$toast.clear();
    //       //   
    //       tag.push(...result.data.result);
    //     })
    //     .catch(err => {
    //       // 关闭加载提示
    //         this.$toast.clear();
    //       
    //     });
    // },

  // 获取轮播图数据
    getBannerData(tag) {
      // 获取vuex的banner缓存数据,如果存在缓存数据,则不发起请求,否则发起请求
      if(this.bannerDataCache.length>0){
        this.bannerData=this.bannerDataCache;
        // 
        return;
      }

      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        // 延迟自动关闭加载提示
        duration:0
      });

      this.axios({
        method: 'GET',
        url: "/banner",
        params: {
          appkey: this.appkey,
        }
      })
        .then(result => {
          // 关闭加载提示
            this.$toast.clear();
          //   
          if(result.data.code==300){
            this.bannerData=result.data.result;
            // 
            // 缓存banner数据在vuex中
            this.$store.commit('menuModule/changeData',{
              key:'bannerDataCache',
              value:result.data.result
            })
          }
          // tag.push(...result.data.result);
        })
        .catch(err => {
          // 关闭加载提示
            this.$toast.clear();
          
        });
    },

    // 获取商品类型
    getTypeData(){
      // 开启加载提示
      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        // 延迟自动关闭加载提示
        duration:0
      });
      this.axios({
        method:'GET',
        url:'/type',
        params:{
          appkey:this.appkey
        }
      }).then(result=>{
        this.$toast.clear();
        
        if(result.data.code==400){
          result.data.result.forEach(v=>{
            v.isActive=false;
          })
          result.data.result.unshift({type:'isHot',typeDesc:'最新推荐',isActive:true});
          this.typeData=result.data.result;

          this.getProductByType({type: 'isHot'});
        }
      }).catch(err=>{
        this.$toast.clear();
        
      })
    },

    // 根据商品类型获取数据
    getProductByType(item){
      // let item=this.typeData[index];
      
      this.productData=[];

      let params={
        appkey:this.appkey,
        key:'type',
        value:item.type
      };

      // 最新推荐
      if(item.type=='isHot'){
        params.key='isHot';
        params.value=1
      }

      // 开启加载提示,
      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      });

      this.axios({
        method:'GET',
        url:'/typeProducts',
        params
      }).then(result=>{
        this.$toast.clear();
        
        if(result.data.code==500){
          this.productData=result.data.result;
        }
      }).catch(err=>{
        this.$toast.clear();
        
      })
    },

    // 跳转到相应详细页
    goPage(pid,addr){
      this.$router.push({name:addr,query:{id:pid}});
    }

  }
};
</script>

<style lang="less" scoped>

</style>