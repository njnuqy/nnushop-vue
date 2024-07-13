<template>
  <div>
    <p>订单商品</p>
    <el-table
      :data="goods"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="收货人"
        width="150">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="150">
      </el-table-column>
      <el-table-column
        prop="number"
        label="订单数量"
        width="150">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        width="150">
      </el-table-column>
      <el-table-column  
        label="商品图片"  
        width="150">  
        <template slot-scope="scope">  
          <el-image :src="scope.row.itemUrl" :alt="scope.row.itemUrl" style="width: 150px; height: 150px;"></el-image>
        </template>  
      </el-table-column>
      <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button
                        v-if="scope.row.orderStatus === 'NOTPAID'"
                        @click="pay(scope.row)"
                        type="text"
                        size="small">
                        去支付
                        </el-button>
                        <el-button
                        @click="orderDetail(scope.row)"
                        type="text"
                        size="small">
                        查看详情
                        </el-button>
                    </template>
                </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    name:"manage_goods",
    data(){
        return{
            user:{},
            token:"",
            goods:[]
        }
    },
    methods:{
        pay(row){
            console.log(row);
            const newUrl = `${window.location.origin}/payOrder?orderId=${row.id}`
            window.open(newUrl,'_blank')
        },
        orderDetail(row){
          console.log(row.id)
          const newUrl = `${window.location.origin}/orderDetail?orderId=${row.id}`;
          window.open(newUrl,'_blank');
        }
    },
    created(){
        this.user = JSON.parse(localStorage.getItem("user"));
        this.token = localStorage.getItem("token");
        this.$axios.get("/order/authorize/getOrdersByUserId",{
            params:{
                "userId" : this.user.id
            },
            headers:{
                "token" : this.token
            }
        }).then(res=>{
            console.log(res.data.data);
            this.goods = res.data.data;
        })
    }
}
</script>

<style>

</style>