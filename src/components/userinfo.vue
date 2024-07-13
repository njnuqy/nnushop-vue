<template>
  <div>
    <div>
        <el-form :model="formData" ref="formData" :rules="rules">
            <el-form-item label="地址信息" prop="address">
                <el-input style="width: 50%;" v-model="formData.address"></el-input>
            </el-form-item>
            <el-form-item label="收货人姓名" prop="name">
                <el-input style="width: 50%;" v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input style="width:50%" v-model="formData.mobile"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit('formData')">确 定</el-button>
        </span>
    </div>
    <div>
        <p>已经保存了{{userinfos.length}}条，还能保存{{ 10-userinfos.length }}条</p>
        <div>
            <el-table
                :data="userinfos"
                max-height="250">   
                <el-table-column prop="name" label="收货人姓名"></el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="120">
                    <template slot-scope="scope">
                        <el-button
                        @click="deleteRow(scope.row)"
                        type="text"
                        size="small">
                        移除
                        </el-button>
                        <el-button
                        @click="modifyRow(scope.row)"
                        type="text"
                        size="small">
                        修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name:"user_info",
    data(){
        return{
            formData:{
                userId:"",
                address:"",
                name:"",
                mobile:""
            },
            rules:{
                name:[
                    {required:true,message:"请输入收件人姓名",trigger:'blur'},
                ],
                address:[
                    {required:true,message:"请输入地址",trigger:'blur'}
                ],
                mobile:[
                    {required:true,message:"请输入手机号码",trigger:'blur'},
                    {min:11,max:11,message:"请输入正确格式的手机号",trigger:'blur'}
                ]
            },
            userinfos:[],
            token:"",
        }
    },
    methods:{
        deleteRow(userinfoId){
            console.log(userinfoId);
        },
        modifyRow(userinfoId){
            console.log(userinfoId);
        },
        submit(formData){
        this.$refs[formData].validate((valid)=>{
          if(valid){
            console.log(this.formData)
            this.$axios.post("/userinfo/authorize/addUserInfo",this.formData,{
              headers:{
                "token":this.token
              }
            }).then(res=>{
              console.log(res.data.data);
              alert("添加成功");
              location.reload();
            })
            .catch(error=>{
              console.log(error);
              alert("添加失败")
            })
          }else{
            alert("输入格式不正确");
          }
        })
        this.dialogVisible = false;
      }
    },
    created(){
        this.formData.userId = JSON.parse(localStorage.getItem("user")).id;
        this.token = localStorage.getItem("token");
        this.$axios.get("/userinfo/authorize/getUserInfos",{
        params:{
          "userId" : this.formData. userId
        },
        headers:{
          "token" : this.token
        }
      }).then(res=>{
        this.userinfos = res.data.data;
        if(this.userinfos.length != 0){
          this.dialogVisible = false;
        }
        console.log(this.userinfos)
      })
    }
}
</script>

<style>

</style>