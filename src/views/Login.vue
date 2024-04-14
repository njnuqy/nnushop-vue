<template>
  <div>
    <p style="text-align: center;font-size: 25px; color:#409EFF;">请登录</p>
    <el-form :model="userData" ref="userData" :rules="rules">
      <el-form-item label="账号" prop="username">
        <el-input placeholder="请输入账号" v-model="userData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="userData.password"></el-input>
      </el-form-item>
      <el-form-item style="text-align: center;justify-content: center;">
        <el-button type="primary" @click="login('userData')">登录</el-button>
      </el-form-item>
    </el-form>
    <el-dialog  
      :visible.sync="dialogVisible"  
      width="30%"  
      :before-close="handleClose">  
      <span>用户名或密码错误，请重新输入！</span>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible = false">确 定</el-button>  
      </span>  
    </el-dialog>  
  </div>
</template>
  
  <script>
  
  export default {
    name:"Login_",
    data() {
      return {
        dialogVisible: false,
        userData:{
          username:'',
          password:''
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
    methods: {
      login(userData) {
        this.$refs[userData].validate((valid)=>{
          if(valid){
            this.$axios.post('/login', this.userData).then(res => {
            res.data.user.password = "";
            console.log(res.data);
            localStorage.setItem("token",res.data.token);
            localStorage.setItem("user",JSON.stringify(res.data.user))
            this.$router.push("/index");
          })
          .catch(error => {
            console.error('Login error', error);
            // 处理登录失败的操作
            this.dialogVisible = true;
          });
          }else{
            alert("输入格式有误")
          }
        })
        
      },
      handleClose(done) {  
      this.$confirm('确认关闭？')  
        .then(() => {  
          done();  
        })  
        .catch(() => {});  
    }  
    }
  }
  </script>