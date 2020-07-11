<template>
  <div class="order-page">
    <van-tabs v-model="activeName" color="#1989fa">
      <!-- 全部标签下内容 -->
      <van-tab title="全部" name="a" class="order-content">
        <div class="allOrder">
          <div v-if="completeOrder.length==0"></div>
          <div v-else>
            <!-- 全部下的完成订单 -->
            <div class="all-complete order-container">
              <!-- 循环订单信息 -->
              <div class="order-item" v-for="(item,index) in completeOrder" :key="index">
                <div class="item-header">
                  <span>{{item.oNum}}</span>
                  <div class="header-right fr">
                    <span class="item-status">已完成</span>
                    <van-icon
                      name="delete"
                      class="del-icon"
                      @click="receiptOrRemove(item.oNum,false)"
                    />
                  </div>
                </div>
                <div class="item-main">
                  <div class="product-item" v-for="(citem,cindex) in item.data" :key="cindex">
                    <van-card
                      :num="citem.count"
                      :price="citem.price"
                      :title="citem.name"
                      :thumb="citem.smallImg"
                    >
                      <template #desc>
                        <div class="card-enname">{{citem.enname}}</div>
                        <div class="card-rule">{{citem.rule}}</div>
                      </template>
                    </van-card>
                  </div>
                </div>
                <div class="item-footer">
                  <span class="order-datetime">{{item.dateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                  <div class="order-total-box">
                    合计
                    <span class="order-count">{{item.count}}</span>件商品&nbsp;&nbsp;&nbsp;合计:
                    <span class="order-total">￥{{item.total}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="uncompleteOrder.length==0"></div>
          <div v-else>
            <!-- 全部下的待接收订单 -->
            <div class="all-unComplete order-container">
              <!-- 循环订单信息 -->
              <div class="order-item" v-for="(item,index) in uncompleteOrder" :key="index">
                <div class="item-header">
                  <span>{{item.oNum}}</span>
                  <div class="header-right fr">
                    <span class="item-status receipt" @click="receiptOrRemove(item.oNum,true)">确认收货</span>
                    <!-- <van-icon name="delete" class="del-icon" /> -->
                  </div>
                </div>
                <div class="item-main">
                  <div class="product-item" v-for="(citem,cindex) in item.data" :key="cindex">
                    <van-card
                      :num="citem.count"
                      :price="citem.price"
                      :title="citem.name"
                      :thumb="citem.smallImg"
                    >
                      <template #desc>
                        <div class="card-enname">{{citem.enname}}</div>
                        <div class="card-rule">{{citem.rule}}</div>
                      </template>
                    </van-card>
                  </div>
                </div>
                <div class="item-footer">
                  <span class="order-datetime">{{item.dateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
                  <div class="order-total-box">
                    合计
                    <span class="order-count">{{item.count}}</span>件商品&nbsp;&nbsp;&nbsp;合计:
                    <span class="order-total">￥{{item.total}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="待收货" name="b" class="order-content">
        <!-- 全部下的待接收订单 -->
        <div class="uncomplete order-container">
          <!-- 循环订单信息 -->
          <div class="order-item" v-for="(item,index) in uncompleteOrder" :key="index">
            <div class="item-header">
              <span>{{item.oNum}}</span>
              <div class="header-right fr">
                <span class="item-status receipt" @click="receiptOrRemove(item.oNum,true)">确认收货</span>
                <!-- <van-icon name="delete" class="del-icon" /> -->
              </div>
            </div>
            <div class="item-main">
              <div class="product-item" v-for="(citem,cindex) in item.data" :key="cindex">
                <van-card
                  :num="citem.count"
                  :price="citem.price"
                  :title="citem.name"
                  :thumb="citem.smallImg"
                >
                  <template #desc>
                    <div class="card-enname">{{citem.enname}}</div>
                    <div class="card-rule">{{citem.rule}}</div>
                  </template>
                </van-card>
              </div>
            </div>
            <div class="item-footer">
              <span class="order-datetime">{{item.dateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
              <div class="order-total-box">
                合计
                <span class="order-count">{{item.count}}</span>件商品&nbsp;&nbsp;&nbsp;合计:
                <span class="order-total">￥{{item.total}}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="已收货" name="c" class="order-content">
        <!-- 全部下的完成订单 -->
        <div class="all-complete order-container">
          <!-- 循环订单信息 -->
          <div class="order-item" v-for="(item,index) in completeOrder" :key="index">
            <div class="item-header">
              <span>{{item.oNum}}</span>
              <div class="header-right fr">
                <span class="item-status">已完成</span>
                <van-icon name="delete" class="del-icon" @click="receiptOrRemove(item.oNum,false)" />
              </div>
            </div>
            <div class="item-main">
              <div class="product-item" v-for="(citem,cindex) in item.data" :key="cindex">
                <van-card
                  :num="citem.count"
                  :price="citem.price"
                  :title="citem.name"
                  :thumb="citem.smallImg"
                >
                  <template #desc>
                    <div class="card-enname">{{citem.enname}}</div>
                    <div class="card-rule">{{citem.rule}}</div>
                  </template>
                </van-card>
              </div>
            </div>
            <div class="item-footer">
              <span class="order-datetime">{{item.dateTime | formatDate('yyyy-MM-dd hh:mm:ss')}}</span>
              <div class="order-total-box">
                合计
                <span class="order-count">{{item.count}}</span>件商品&nbsp;&nbsp;&nbsp;合计:
                <span class="order-total">￥{{item.total}}</span>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import "../../assets/css/Order.less";

export default {
  name: "Order",
  data() {
    return {
      activeName: "a",
      uncompleteOrder: [],
      completeOrder: []
    };
  },
  created() {
    // this.getAllOrder();
    this.getUncomplete();
    this.getComplete();
  },

  methods: {
    // 获取未完成订单
    getUncomplete() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: 1
        }
      })
        .then(result => {
          this.$toast.clear();
          

          //   订单数据处理
          let data = result.data.result;
          let newArr = this.orderData(data);
          // 

          this.uncompleteOrder = newArr;

          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 获取已完成订单
    getComplete() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status: 2
        }
      })
        .then(result => {
          this.$toast.clear();
          

          // 订单数据处理
          let data = result.data.result;
          let newArr = this.orderData(data);
          this.completeOrder = newArr;
          
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 划分订单数据
    orderData(array) {
      let map = {};
      let res = [];
      for (let i = 0; i < array.length; i++) {
        let oNum = array[i].oid;
        if (oNum != undefined) {
          if (map[oNum] == undefined) {
            map[oNum] = [];
          }
          map[oNum].push(array[i]);
        }
      }
      //   return map;
      for (let key in map) {
        let count = 0;
        let total = 0;
        let dateTime = "";
        map[key].forEach(e => {
          count = count + e.count;
          total = total + e.count * e.price;
          if (dateTime == "") {
            dateTime = this.getDatetime(e.createdAt);
          }
        });
        res.push({
          oNum: key,
          data: map[key],
          count: count,
          total: total,
          dateTime: dateTime
        });
      }
      return res;
    },

    // 时间字符串提取
    getDatetime(datetime) {
      let timeArr = datetime.split("T");
      let data = timeArr[0];
      let time = timeArr[1].slice(0, 8);
      let newDateTime = data + " " + time;
      return newDateTime;
    },

    // 确认收货事件
    receiptOrRemove(oid, choice) {
      let tokenString = localStorage.getItem("__Tk");
      let postUrl = choice ? "/receive" : "/removeOrder";
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: postUrl,
        data: {
          appkey: this.appkey,
          tokenString,
          oid: oid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 80000 || result.data.code == 90000) {
            this.getUncomplete();
            this.getComplete();
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>
