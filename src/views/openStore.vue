<template>
  <div>
    <P style="text-align: center;">开启您的店铺生涯</P>
    <el-form>
        <el-form-item label="店铺名称：">
            <el-input placeholder="请输入你的店铺名称" v-model="storeName"></el-input>
        </el-form-item>
        <el-form-item>
            <el-upload
             action="http://localhost:8081/item/authorize/upload"
            :headers="tokenObject"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>    只能上传jpg/png文件，且不超过500kb
        </el-upload>
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
            payUrl:"",
            token:"",
            tokenObject:{},
            user:{}
        }
    },
    methods:{
        register(){
            const _this = this;
            console.log(localStorage.getItem("token"))
            console.log(_this.storeName)
            console.log(this.payUrl)
            const storeRequest = {
                "storeName" : _this.storeName,
                "userId" : this.user.di,
                "url" : "test",
                "payUrl" : this.payUrl
            }
            this.$axios.post("/store/authorize/register?storeName",storeRequest,{
                headers:{
                    "token":this.token
                }
            }).then(res=>{
                console.log(res)
                if(res.data.code == 401){
                    this.$router.push("/login");
                }else{
                    this.$router.push("/index");
                }
            })
            .catch(error=>{
                console.log(error)
                this.$router.push("/login")
            })
        },
        uploadError(){
            console.log("上传失败")
        },
        uploadSuccess(res){
            console.log(res)
            console.log("==============")
            console.log(res.data)
            this.payUrlurl = res.data
            console.log("上传成功")
        },
    },
    created(){
        this.token = localStorage.getItem("token");
        this.tokenObject = {
            "token":this.token
        }
        this.user = JSON.parse(localStorage.getItem("user"));
    }
}
</script>

<style>

</style>