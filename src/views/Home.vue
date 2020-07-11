<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="a fl"></div>
    <div class="a fl"></div>
    <div class="a fl"></div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // HelloWorld
  }
}
</script>

<style lang="less" scoped>
.a{
  width: 100px;
  height: 100px;
  background: red;
}
</style>