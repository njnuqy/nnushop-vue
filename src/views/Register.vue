<template>
    <div>
      <p style="text-align: center;font-size: 25px; color:#409EFF;">请注册</p>
      <el-form :model="userData" ref="userData" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input placeholder="请输入账号" v-model="userData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="userData.password"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;justify-content: center;">
          <el-button type="primary" @click="register('userData')">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>

<script>
export default {
    name:"Register_",
    data(){
        return{
            userData:{
                username:'',
                password:'',
            },
            rules:{
              username:[
                {required:true,message:"请输入用户名",trigger:'blur'}
              ],
              password:[
                {required:true,message:"请输入密码",trigger:'blur'}
              ]
            }
        }
    },
    methods:{
        register(userData){
          this.$refs[userData].validate(valid=>{
            if(valid){
              console.log(this.userData)
              this.$axios.post("/user/permit/register",this.userData).then(res=>{
                console.log(res);
              })
              .catch(error=>{
                console.log(error)
              })
            }else{
              alert("输入格式不正确")
            }
          })
        }
    }
}
</script>

<style>

</style>