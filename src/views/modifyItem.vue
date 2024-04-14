<template>
  <div>
    <div>
        <el-image :src="item.url"  style="width: 300px; height: 300px;"></el-image>
        <el-form>
            <el-form-item label="商品名称">
                <el-input v-model="item.itemName"></el-input>
            </el-form-item>
            <el-form-item label="商品价格">
                <el-input v-model="item.price"></el-input>
            </el-form-item>
            <el-form-item style="text-align: center;justify-content: center;">
                <el-button type="primary" @click="modify">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-dialog  
      :visible.sync="dialogVisible"  
      width="30%"  
      :before-close="handleClose">  
      <span>修改成功</span>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible = false">确 定</el-button>  
      </span>  
    </el-dialog>  
  </div>
</template>

<script>
export default {
    name:"modify_data",
    data(){
        return{
            item:{},
            token:"",
            dialogVisible:false
        }
    },
    methods:{
        modify(){
            this.$axios.post("/item/authorize/updateItem",this.item,{
                headers:{
                    "token" : this.token
                }
            }).then(res=>{
                console.log(res);
                this.dialogVisible = true;
            })
        }
    },
    created(){
        this.item = JSON.parse(sessionStorage.getItem("item"))
        console.log(this.item)
        this.token = localStorage.getItem("token")
    }
}
</script>

<style>

</style>