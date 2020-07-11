<template>
  <div class="myCollect">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow @click-left="goBack" />

    <!-- 主体内容 -->
    <div class="collect-container">
      <div
        class="collect-item"
        v-for="(item,index) in collectData"
        :key="index"
        @click="goPage(item.pid,'Detail')"
      >
        <van-image class="item-img" width="100%" height="100%" :src="item.smallImg" />
        <div class="item-name">{{item.name}}</div>
        <div class="item-price">￥{{item.price}}</div>
        <van-icon name="delete" class="del-icon" size="18px" @click.stop="delCollect(item.pid)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyCollect",
  data() {
    return {
      collectData: []
    };
  },
  created() {
    this.getCollectData();
  },
  methods: {
    //   返回上一个页面
    goBack() {
      this.$router.go(-1);
    },

    // 跳转商品详情页
    goPage(pid, addr) {
      this.$router.push({ name: addr, query: { id: pid } });
    },

    // 删除收藏
    delCollect(pid) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/notlike",
        data: {
          appkey: this.appkey,
          tokenString,
          pid: pid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 900) {
            this.$router.go(0);
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 获取收藏数据
    getCollectData() {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 2000) {
            this.collectData = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.myCollect {
  background-color: #f7f7f7;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  .collect-container .collect-item {
    margin: 5px;
    padding: 10px;
    width: calc(~"50% - 30px");
    background-color: #fff;
    float: left;
    position: relative;
    .item-name {
      font-size: 16px;
      text-align: left;
      height: 30px;
      line-height: 30px;
    }
    .item-price {
      font-size: 16px;
      color: #379cfb;
      text-align: left;
    }
    .del-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}
</style>