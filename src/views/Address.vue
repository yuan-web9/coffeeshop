<template>
  <div class="address">
    <van-nav-bar :title="isCreate?'新增地址':'修改地址'" left-text="返回" left-arrow  @click-left="goBack"/>

    <van-address-edit
      :area-list="province_list"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :address-info="initData"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import province_list from "../assets/js/area.js";
import "../assets/css/address.less";
export default {
  name: "Address",
  data() {
    return {
      //   areaList,
      province_list,
      searchResult: [],
      isCreate: 1,
      initData: {
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: true
      }
    };
  },
  created() {
    this.createOrChange();
  },
  methods: {
    // 获取判断值,确认添加修改地址
    createOrChange() {
      let boo = this.$route.query.bool;
      let aid = this.$route.query.aid;
      this.isCreate = boo;
      if (boo == 0) {
        this.getAddress(aid);
      }
    },

    // 获取已存地址的数据
    getAddress(aid) {
      let tokenString = localStorage.getItem("__Tk");

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: aid
        }
      })
        .then(result => {
          this.$toast.clear();
          
          if (result.data.code == 40000) {
            let data = result.data.result[0];
            data.isDefault=1?true:false;
            this.initData = data;
          }
        //   
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 添加地址事件
    addAddress(addressMsg) {
      let tokenString = localStorage.getItem("__Tk");
      let data = {};

      for (let key in addressMsg) {
        data[key] = addressMsg[key];
      }
      data.tokenString = tokenString;
      data.appkey = this.appkey;

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/addAddress",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          this.goBack()
        })
        .catch(err => {
          this.$toast.clear();
          
        });
    },

    // 修改地址事件
    changeAddress(addressMsg) {
      let tokenString = localStorage.getItem("__Tk");
      let data = {};

      for (let key in addressMsg) {
        data[key] = addressMsg[key];
      }
      data.tokenString = tokenString;
      data.appkey = this.appkey;
      data.aid = this.initData.aid;

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });

      this.axios({
        method: "POST",
        url: "/editAddress",
        data
      })
        .then(result => {
          this.$toast.clear();
          
          this.goBack()
        })
        .catch(err => {
          this.$toast.clear();
          
        });
        
    },

    // 返回上一页面
    goBack(){
        this.$router.go(-1);
    },

    // 保存按钮事件
    onSave(content) {
      let data = {
        name: content.name,
        tel: content.tel,
        province: content.province,
        city: content.city,
        county: content.county,
        addressDetail: content.addressDetail,
        areaCode: content.areaCode,
        postalCode: content.postalCode,
        isDefault: content.isDefault ? 1 : 0
      };

      // 判断新增地址还是修改地址
      if(this.isCreate==1){
          this.addAddress(data);
      }else{
          this.changeAddress(data);
      }
    },
    onDelete() {
      //   Toast("delete");
    },
    
  }
};
</script>
