<template>
  <div class="shopcart">
    <div v-if="!isHas" class="hhh">
      <van-empty description="购物车空空如也，逛一逛" />
    </div>
    <div v-else>
      <van-nav-bar :right-text="manahing?'完成':'管理'" @click-right="manager" />

      <!-- 购物车商品卡片 -->
      <div class="shopcart-list">
        <div class="shopcart-item" v-for="(item,index) in shopcartData" :key="index">
          <van-swipe-cell class="list-container">
            <div class="card-radio">
              <van-checkbox v-model="item.checked" @click="checkChange"></van-checkbox>
            </div>
            <div class="card-msg">
              <div class="msg-img">
                <img class="auto-img" :src="item.small_img" />
              </div>
              <div class="msg-word">
                <div class="name-rule">
                  <span class="name">{{item.name}}</span>
                  <span class="rule">{{item.rule}}</span>
                </div>
                <div class="enname">{{item.enname}}</div>
                <div class="price">￥{{item.price}}</div>
              </div>
            </div>
            <div class="card-num">
              <van-stepper
                v-model="item.count"
                min="1"
                theme="round"
                button-size="22"
                disable-input
                @change="changeShopcart(item.sid, item.count)"
              />
            </div>
            <template #right>
              <van-button
                square
                text="删除"
                type="danger"
                class="delete-button"
                @click="delShopcart([item.sid],index)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </div>

      <!-- 底部总价与提交按钮 -->
      <div class="total-submit" v-if="!manahing">
        <div class="allSelect">
          <van-checkbox class="radio-btn" v-model="allChecked" @click="allCheckChange"></van-checkbox>
          <span>全选</span>
        </div>
        <div class="total">
          <span class="total-title">合计:</span>
          <span class="total-price">
            ￥
            <span>{{this.total.toFixed(2)}}</span>
          </span>
        </div>
        <div class="submit-btn">
          <van-button round type="info" @click="goPage('SubmitOrder')">提交订单</van-button>
        </div>
      </div>

      <!-- 底部管理操作按钮 -->
      <div class="managing-box" v-else>
        <div class="allSelect">
          <van-checkbox class="radio-btn" v-model="allChecked" @click="allCheckChange"></van-checkbox>
          <span>全选</span>
        </div>
        <div class="del-btn">
          <van-button round type="info" @click="removeShopcart">删除选中</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/css/shopcart.less";

export default {
  name: "Shopcart",
  data() {
    return {
      isHas: false,
      total: 0.0,
      allChecked: false,
      value: 0,
      shopcartData: [],
      manahing: false,

      // 懒加载使用
      list: [],
      loading: false,
      finished: false
    };
  },

  created() {
    this.getShopcartData();
    
  },

  methods: {
    // 子多选框点击事件
    checkChange() {
      // 
      this.getTotal();
      for (let i = 0; i < this.shopcartData.length; i++) {
        if (!this.shopcartData[i].checked) {
          this.allChecked = false;
          // 
          return;
        }
      }
      // 
      this.allChecked = true;
    },

    // 全选多选框点击事件
    allCheckChange() {
      this.shopcartData.forEach(e => {
        e.checked = this.allChecked;
      });
      this.getTotal();
    },

    // 点击管理的事件
    manager() {
      // 
      this.manahing = this.manahing ? false : true;
    },

    // 遍历选择的商品获取总价格
    getTotal() {
      let t = 0;
      this.shopcartData.forEach(e => {
        if (e.checked) {
          t = t + e.price * e.count;
        }
      });
      // 
      this.total = t;
    },

    // 获取购物车数据
    getShopcartData() {
      // 获取token字符串
      let tokenString = localStorage.getItem("__Tk");

      // 打开加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 5000) {
            // this.isHas = true;
            let data = result.data.result;
            data.forEach(v => {
              v.checked = false;
            });
            // data.allCheck=false;
            this.shopcartData = data;
            if (result.data.result.length == 0) {
              this.isHas = false;
            } else {
              this.isHas = true;
            }
          }
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 改变购物车商品数量
    changeShopcart(sid, count) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString: tokenString,
          sid: sid,
          count: count
        }
      })
        .then(result => {
          this.$toast.clear();
          
          this.getTotal();
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 删除一个购物车商品
    delShopcart(delSid, index) {
      let tokenString = localStorage.getItem("__Tk");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(delSid)
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            this.shopcartData.splice(index, 1);
            if (this.shopcartData.length == 0) {
              this.isHas = false;
            }
            this.$toast.success("删除成功");
          } else {
            this.$toast.success("删除成功");
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 删除多个购物车商品(这是假删除)
    removeShopcart() {
      let tokenString = localStorage.getItem("__Tk");
      let delArr = [];

      this.shopcartData.forEach(e => {
        if (e.checked) {
          delArr.push(e.sid);
        }
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/removeShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(delArr)
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 7000) {
            for (let i = this.shopcartData.length - 1; i >= 0; i--) {
              if (this.shopcartData[i].checked) {
                // 
                this.shopcartData.splice(i, 1);
              }
            }
            

            if (this.shopcartData.length == 0) {
              this.allChecked = false;
              this.isHas = false;
            }
            this.$toast.success("删除成功");
          } else {
            this.$toast.success("删除成功");
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 提交订单按钮,跳转到提交订单界面
    goPage(name) {
      let sidArr = [];
      this.shopcartData.forEach(e => {
        if (e.checked) {
          sidArr.push(e.sid);
        }
      });
      if (sidArr.length != 0) {
        this.$router.push({ name, query: sidArr });
      } else {
        this.$toast.fail("你没有选择任何商品");
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>