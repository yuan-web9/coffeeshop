<template>
  <div class="submitOrder">
    <div class="sOrder-top">
      <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="goBack" />
    </div>

    <!-- 设置地址部分 -->
    <div class="setAddress-box">
      <span class="setAddrWord" @click="openAddress">{{addressShow.length==0?'请选择收货地址':addressShow}}</span>
      <van-action-sheet class="actionSheet" v-model="show" title="选择收货地址">
        <div class="empty-show" v-if="addressList.length==0" style="height: 50px;"></div>
        <div class="addressList" v-else>
          <div
            class="address-item"
            v-for="(item,index) in addressList"
            :key="index"
            @click="selectAddress(item)"
          >
            <div class="check-box"></div>
            <div class="address-msg">
              <div class="msg-top">
                <span class="top-name">{{item.name}}</span>
                <span class="top-phone">{{item.tel}}</span>
              </div>
              <div class="msg-bottom">{{item.address}}</div>
            </div>
          </div>
        </div>

        <!-- 新增地址按钮 -->
        <div class="add-btn">
          <van-button round type="info" size="large" @click="addNewAddress">新增地址</van-button>
        </div>
      </van-action-sheet>
    </div>

    <!-- 商品订单部分 -->
    <div class="product-order">
      <div class="pOrder-list">
        <div class="pOrder-item" v-for="(item,index) in submitOrderData" :key="index">
          <van-card
            :num="item.count"
            :price="item.price"
            :title="item.name"
            :thumb="item.small_img"
          >
            <template #desc>
              <div class="card-enname">{{item.enname}}</div>
              <div class="card-rule">{{item.rule}}</div>
            </template>
          </van-card>
        </div>
      </div>
      <div class="pOrder-total">
        <div class="total-word">
          <span class="word-title">共计{{count}}件商品 合计:</span>
          <span class="word-price">￥{{total}}</span>
        </div>
      </div>
    </div>

    <div class="settlement">
      <van-submit-bar :price="total*100" button-text="提交订单" @submit="submitOrder" />
    </div>
  </div>
</template>

<script>
import "../assets/css/SubmitOrder.less";

export default {
  name: "SubmitOrder",

  data() {
    return {
      submitOrderData: [],
      total: 0,
      count: 0,

      // 选择地址弹框数据
      show: false,

      //   已保存地址列表
      addressList: [],

      //   即将提交的数据
      submitData: {},

      addressShow: ""
    };
  },

  created() {
    // 获取订单数据
    this.getOrderData();

    // 获取地址数据
    this.getAddress();
  },

  methods: {
    // 获取提交的商品数据
    getOrderData() {
      let sidArr = [];
      let tokenString = localStorage.getItem("__Tk");

      for (let i in this.$route.query) {
        sidArr.push(this.$route.query[i]);
      }
      // sidArr.push(...this.$route.query)
      //   
      //   

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sidArr)
        }
      })
        .then(result => {
          this.$toast.clear();
          

          if (result.data.code == 50000) {
            let data = result.data.result;
            this.submitOrderData = data;
            this.getCountAndTotal();
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 获取已有地址
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
          if (result.data.code == 20000) {
            let data = result.data.result;
            data.forEach(e => {
              e.address = e.province + e.city + e.county + e.addressDetail;
              e.checked = false;
            });
            this.addressList = data;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 结算提交订单按钮事件
    submitOrder() {
      
      let tokenString = localStorage.getItem("__Tk");
      let addressData = {};
      let sidArr = [];
      this.addressList.forEach(e => {
        if (e.checked) {
          addressData = e;
        }
      });
      this.submitOrderData.forEach(e => {
        sidArr.push(e.sid);
      });
      if(addressData.address==undefined){
        this.$toast.fail('请选择收货地址')
        return;
      }
      let data = {
        tokenString: tokenString,
        appkey: this.appkey,
        sids: JSON.stringify(sidArr),
        phone: addressData.tel,
        address: addressData.address,
        receiver: addressData.name
      };
      // 

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data
      })
        .then(result => {
          this.$toast.clear();
          // 
          if (result.data.code == 60000) {
            this.$toast.success("结算成功");
            setTimeout(() => {
              // this.$router.push({ name: "Shopcart" });
              this.goBack();
            },1000);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 添加新地址(跳转添加地址界面)
    addNewAddress() {
      this.$router.push({ name: "Address", query: { bool: 1 } });
    },

    // 获取商品总数
    getCountAndTotal() {
      let count = 0;
      let total = 0;
      this.submitOrderData.forEach(e => {
        count = count + e.count;
        total = total + e.count * e.price;
      });
      this.count = count;
      this.total = total;
    },

    // 打开地址选择弹框
    openAddress() {
      // this.show=this.show?false:true;
      this.show = true;
    },

    // 选择地址事件
    selectAddress(item) {
      //   
      this.addressShow = item.address;
      this.addressList.forEach(e => {
        e.checked = false;
      });
      item.checked = true;
      this.show = false;
    },

    // 返回上一个页面
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="less" scoped>
</style>