<template>
  <div>
    <p>我的购物车</p>
    <el-table
      :data="items"
      style="width: 100%">
      <el-table-column
        prop="itemName"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="180">
      </el-table-column>
      <el-table-column  
        label="图片"  
        width="200">  
        <template slot-scope="scope">  
          <el-image :src="scope.row.url" :alt="scope.row.itemName" style="width: 300px; height: 300px;">  </el-image>
        </template>  
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    name:"my_shoppingCart",
    data(){
        return{
            userId:"",
            token:"",
            items:[]
        }
    },
    methods:{
        getShoppingCartItems(){
            const _this = this
            this.$axios.get("/cart/authorize/getShoppingCartItems",{
                params:{
                    "userId" :this.userId
                },
                headers:{
                    "token" : this.token
                }
            }).then(res=>{
                _this.items = res.data.data
                console.log(_this.items)
            })
        }
    },
    created(){
        this.userId = this.$route.query.userId;
        this.token = localStorage.getItem("token");
        this.getShoppingCartItems();
    }
}
</script>

<style>

</style>