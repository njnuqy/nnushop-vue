<template>
  <div>
    <P style="text-align: center;">开启您的店铺生涯</P>
    <el-form>
        <el-form-item label="店铺名称：">
            <el-input placeholder="请输入你的店铺名称" v-model="storeName"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;justify-content: center;">
            <el-button type="primary" @click="register">注册店铺！</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:"Open_Store",
    data(){
        return{
            storeName:"",
        }
    },
    methods:{
        test(){
            this.$axios.get("/store/authorize/test",
            {
                params:{
                    "test":"test"
                },
                headers:{
                    'token':localStorage.getItem("token")
                }
            }).then(res=>{
                console.log(res)
            })
            .catch(error=>{
                console.log(error)
            })
        },
        register(){
            const _this = this;
            console.log(localStorage.getItem("token"))
            console.log(_this.storeName)
            this.$axios.post("/store/authorize/register?storeName=" + _this.storeName,null,{
                headers:{
                    "token":localStorage.getItem("token")
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code == 401){
                    this.$router.push("/login")
                }
            })
            .catch(error=>{
                console.log(error)
                this.$router.push("/login")
            })
        }
    }
}
</script>

<style>

</style>