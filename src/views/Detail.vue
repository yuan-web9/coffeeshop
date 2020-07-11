<template>
  <div class="detail-box">
    <!-- 顶部图片与返回小图标 -->
    <div class="top-img">
      <span class="back-btn">
        <van-icon name="close" color="#fff" size="28px" @click="back" />
      </span>
      <img class="auto-img" :src="DetailData.large_img" />
    </div>

    <!-- 选择区域部分 -->
    <div class="select-box">
      <div class="detail-name">{{DetailData.name}}</div>
      <div class="detail-enname">{{DetailData.enname}}</div>
      <van-icon
        class="collect-icon"
        :name="isCollect?'star':'star-o'"
        :color="isCollect?'#f4bd00':'#000'"
        size="28px"
        @click="changeCollect"
      />
      <div class="select">
        <div :class="item.type" v-for="(item,index) in DetailData.rule" :key="index">
          <span class="select-title">{{item.title}}</span>
          <span
            class="selector"
            :class="{active:citem.isActive}"
            v-for="(citem,cindex) in item.tag"
            :key="cindex"
            @click="changeRule(item.tag,citem)"
          >{{citem.name}}</span>
        </div>
      </div>
    </div>

    <!-- 商品详情部分 -->
    <div class="product-detail">
      <div class="product-title">商品详情</div>
      <div class="product-content">
        <div
          class="product-content-child"
          v-for="(item,index) in (DetailData.desc)"
          :key="index"
        >{{item}}</div>
      </div>
    </div>

    <div class="num-price">
      <div class="total">￥{{DetailData.price}}</div>
      <div class="number">
        <van-stepper
          class="number-selector"
          v-model="count"
          theme="round"
          button-size="22"
          disable-input
        />
      </div>
    </div>

    <!-- 底部的添加购物车和购买部分 -->
    <div class="cart-buy">
      <!-- 底部按钮 -->
      <van-goods-action>
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="shopcartRows == 0 ? '' : shopcartRows"
          @click="goShopcart()"
        />
        <van-goods-action-button color="#f5916d" type="warning" text="加入购物车" @click="addShopcart" />
        <van-goods-action-button color="#6d86c4" type="danger" text="立即购买" @click="buyNew" />
      </van-goods-action>
    </div>

    <div class="duiqi"></div>
  </div>
</template>

<script>
import "../assets/css/detail.less";
export default {
  name: "Detail",

  data() {
    return {
      DetailData: {},
      selectData: [],
      count: 1,
      isCollect: false,
      pid: "",
      shopcartRows: 0
    };
  },

  created() {
    // this.a();
    this.pid = this.$route.query.id;
    this.getDetailData(this.pid);
    this.findLike(this.pid);
    this.findShopcart();
  },

  methods: {
    // a() {
    //   
    // },

    // 获取商品详细的数据
    getDetailData(id) {
      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        // 延迟自动关闭加载提示
        duration: 0
      });
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          appkey: this.appkey,
          pid: id
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 600) {
            //   把数据传到data
            let data = result.data.result[0];
            let r = this.getRule(data);
            // 把选择数据和详细内容划分开
            data.desc = data.desc.split(/\n/);
            data.rule = r;
            this.DetailData = data;
            // 
            // 
            
            // 
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 返回事件
    back() {
      // 
      this.$router.go(-1);
    },

    // 获取规格信息
    getRule(data) {
      let productRule = ["tem", "sugar", "cream"];
      let rules = [];
      productRule.forEach(v => {
        if (data[v] != "") {
          let rule = {
            title: data[v + "_desc"],
            tag: []
          };
          let tag = data[v].split(/\//);
          tag.forEach((item, i) => {
            let t = {
              name: item,
              isActive: i == 0
            };
            rule.tag.push(t);
          });
          rules.push(rule);
        }
      });
      return rules;
    },

    // 规格切换事件
    changeRule(item, citem) {
      if (citem.isActive) {
        return;
      }
      item.forEach(e => {
        e.isActive = false;
      });
      citem.isActive = true;
    },

    // 获取购买数据
    // getBuyData() {
    //   let data = {
    //     pid: this.DetailData.pid,
    //     pname: this.DetailData.name,
    //     rule: "",
    //     price: this.DetailData.price,
    //     num: this.count
    //   };
    //   
    // },

    // 改变收藏
    changeCollect() {
      // 获取token
      let tokenString = localStorage.getItem("__Tk");

      // 未登录时跳转
      if (tokenString == null) {
        this.$toast.fail("你还未登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 1000);
        return;
      }

      // 请求路径
      let url = this.isCollect ? "/notlike" : "/like";

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url,
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 800 || result.data.code == 900) {
            // 收藏成功
            this.isCollect = result.data.code == 800;
            this.$toast(result.data.msg);
          } else {
            // 如果token无效,则跳转到登录页面
            this.$outer.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 查看当前商品是否已收藏
    findLike(pid) {
      // 获取token
      let tokenString = localStorage.getItem("__Tk");

      // 开启加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          appkey: this.appkey,
          pid,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          

          if ((result.data.code = 1000)) {
            this.isCollect = result.data.result.length > 0;
          } else {
            // 如果token无效,则跳转到登录界面
            this.$router.push({ name: "Login" });
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 查看购物车商品数量
    findShopcart() {
      // 获取token
      let tokenString = localStorage.getItem("__Tk");

      // 打开加载提示
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      // 购物车条数
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
            this.shopcartRows = result.data.result.length;
            // 
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 加入购物车
    addShopcart() {
      // 获取token
      let tokenString = localStorage.getItem("__Tk");

      // 未登录时进行跳转
      if (tokenString == null) {
        this.$toast.fail("你还未登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 1000);
        return;
      }

      // 获取商品规格
      let rules = this.DetailData.rule;
      
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
            break;
          }
        }
      });
      

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
          count: this.count,
          rule: rule.join("/")
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              this.shopcartRows++;
            }
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 立即购买事件
    buyNew() {
      // 获取token
      let tokenString = localStorage.getItem("__Tk");

      // 未登录时进行跳转
      if (tokenString == null) {
        this.$toast.fail("你还未登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 1000);
        return;
      }

      // 获取商品规格
      let rules = this.DetailData.rule;
      
      let rule = [];
      rules.forEach(v => {
        for (let i = 0; i < v.tag.length; i++) {
          if (v.tag[i].isActive) {
            rule.push(v.tag[i].name);
            break;
          }
        }
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
          count: this.count,
          rule: rule.join("/")
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 3000) {
              this.shopcartRows++;
              let sidArr=[];
              sidArr.push(result.data.sid);
              this.$router.push({name:'SubmitOrder',query:sidArr});
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 跳转到购物车
    goShopcart() {
      this.$router.push({ name: "Shopcart" });
    }

  }
};
</script>

<style lang="less" scoped>
</style>