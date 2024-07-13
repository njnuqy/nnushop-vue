<template>
  <div>
    <p style="color: red;text-align: center;font-size: 30px;">请在{{minutes}}分{{ seconds }}s内完成支付,否则订单将被取消</p>
    <div>
      <div style="text-align: center;">
        <el-image :src="store.payUrl" style="width: 400px;height: auto;"></el-image>
      </div>
    </div>
    <div>
      <el-button type="primary" style="float: right;font-size: 20px;margin-right: 20%;" @click="paySuccess">支付完成</el-button>
    </div>
  </div>
</template>

<script>
export default {
    name:"pay_order",
    data(){
        return{
          order:{},
          startTime:"",
          endTime:"",
          timer:null,
          minutes:"",
          seconds:"",
          store:{},
          token:""
        }
    },
    methods: {
      paySuccess(){
        this.$axios.get("/order/authorize/paySuccess",{
          params:{
            "orderId" : this.order.id
          },
          headers:{
            "token" : this.token
          }
        }).then(res=>{
          console.log(res)
          this.$router.push("/manageGoods")
        })
      },
      startCountdown() {
        this.timer = setInterval(() => {
        let now = new Date().getTime();
        let remainingTime = Math.max(this.endTime.getTime() - now, 0);
        this.minutes = Math.floor((remainingTime / 1000) / 60);
        this.seconds = Math.floor((remainingTime / 1000) % 60);
        // 当倒计时结束时，可以做一些清理工作
        if (remainingTime <= 0) {
          this.stopCountdown();
          window.close();
        }
      }, 1000);
      },
      stopCountdown() {
        clearInterval(this.timer);
      },
    },
    mounted() {
      this.startCountdown();
    },
    beforeDestroy() {
      this.stopCountdown();
    },
    created(){
      this.order = JSON.parse(sessionStorage.getItem('order'));
      this.token = localStorage.getItem("token");
      if(this.order == null){
        var orderId = this.$route.query.orderId;
        this.$axios.get("/order/authorize/getOrderById",{
          params:{
            "orderId" : orderId
          },headers:{
            "token" : this.token
          }
        }).then(res=>{
          console.log(res.data.data);
          this.order = res.data.data
          this.startTime = new Date(this.order.createTime);
          this.endTime = new Date(this.startTime.getTime() + 3 * 60 * 1000);
          this.$axios.get("/store/permit/getStoreByItemId",{
            params:{
          "itemId":this.order.itemId
          }
          }).then(res=>{
          console.log(res.data.data)
          this.store = res.data.data
            })
          })
      }
    }
}
</script>

<style>

</style>