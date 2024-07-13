<template>
  <div>
    <el-container>
      <el-header>
        <div style="display: flex; align-items: center;"> 
          <span style="color:green;">nnushop</span>
        </div>
      </el-header>
      <el-main style="margin-top: 1%;">
        <div style="display: flex;">
          <div style="flex:1;text-align: center;">
            <p>订单号:{{ order.id }}</p>
            <p style="color:green;">完成</p>
            <el-button @click="comment" v-if="order.orderStatus != 'COMMENTED'">评价</el-button>
            <el-button type="primary" v-if="order.orderStatus == 'COMMENTED'">已评价</el-button>
          </div>
          <div style="flex:4;">
            <p>订单已经完成，感谢您在nnushop进行购物</p>
            <el-steps :active="4" align-center class="custom-steps" style="margin-top: 5%;">
              <el-step title="拍下商品"></el-step>
              <el-step title="支付"></el-step>
              <el-step title="确认收货"></el-step>
              <el-step title="评价"></el-step>
            </el-steps>
          </div>
        </div>
        <div style="margin-top: 8%;display: flex;">
          <div style="flex:1;">
            <p>收货人信息</p>
            <p>收货人：{{ order.name }}</p>
            <p>地址：{{ order.address }}</p>
            <p>手机号：{{ order.phone }}</p>
          </div>
          <div style="flex:1;">
            <p>配送信息</p>
            <p>配送方式：暂无</p>
            <p>期望送货日期：暂无</p>
            <p>期望配送时间：暂无</p>
          </div>
          <div style="flex:1;">
            <p>付款信息</p>
            <p>付款方式：alipay</p>
            <p>付款时间：{{ order.payTime }}</p>
          </div>
        </div>
        <div style="margin-top: 5%;">
          <div style="margin-top: 8%;">
            <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem;margin-top: 5%;" class="order">
              <div style="width: 200px;">商品</div>
              <div>商品编号</div>
              <div>价格</div>
              <div>商品数量</div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem;margin-top: 5%;" class="order">
              <div style="display: flex;">
                <el-image
                  :src="order.itemUrl"
                  style="width: 100px; height: auto; object-fit: cover;"
                ></el-image>
                <p style="margin-left: 3%;">{{ item.itemName }}</p>
              </div>
              <div>{{order.itemId}}</div>
              <div>{{ item.price }}</div>
              <div>{{order.number}}</div>
            </div>
          </div>
          <div style="float:right;">
            <p style="color:red;font-size: 50px;">商品总价：{{ order.number * item.price }}</p>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
    name:"order_detail",
    data(){
      return{
        token:"",
        order:{},
        item:{},
      }
    },
    methods:{
      comment(){
        console.log("comment");
        const newUrl = `${window.location.origin}/comment?orderId=${this.order.id}&itemId=${this.item.id}`;
        window.open(newUrl,'_blank');
      }
    },
    created(){
      this.token = localStorage.getItem("token");
      this.$axios.get("/order/authorize/getOrderById",{
        params:{
          "orderId" : this.$route.query.orderId
        },headers:{
          "token" : this.token
        }
      }).then(res=>{
        console.log(res.data.data);
        this.order = res.data.data;
        this.$axios.get("/item/permit/getItemById",{
          params:{
            "itemId" : res.data.data.itemId
          }
        }).then(res=>{
          console.log(res.data.data);
          this.item = res.data.data;
        })
      })
    }
}
</script>

<style>

</style>