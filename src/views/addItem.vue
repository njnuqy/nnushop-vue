<template>
  <div>
    <el-form :model="itemForm" ref="itemForm" :rules="rules">
      <el-form-item label="商品名称" prop="itemName">
        <el-input placeholder="请输入你的商品名称" v-model="itemForm.itemName"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input placeholder="请输入你的商品价格" v-model="itemForm.price">  </el-input>
      </el-form-item>
      <el-form-item label="商品图片">
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
        <el-button @click="addItem('itemForm')">添加商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:"Add_Item",
    data(){
      return{
        itemForm:{
          itemName:"",
          price:"",
          url:""
        },
        storeId:"",
        token:"",
        tokenObject:{},
        fileList: [],
        rules: {
          itemName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          price: [
            { required: true,message:'请输入价格',trigger:"blur" },
            {validator:function(rule,value,callback){
              if(!Number.isInteger(Number(value))){
                callback(new Error("价格只能为整数"));
              }else{
                callback();
              }
            },trigger:"blur"}
          ],
        }
      }
    },
    methods:{
      addItem(itemForm){
        const _this = this;
        console.log(_this.itemForm)
        this.$refs[itemForm].validate((valid)=>{
          if(valid){
            const item = {
              "item" : _this.itemForm,
              "storeId" : this.storeId
            }
            alert('submit')
            this.$axios.post("/item/authorize/addItem",item,{
            headers:{
              "token":_this.token
            }
          }).then(res=>{
            console.log(res)
            this.$router.push({
              path:"/myStore",
              query:{
                "storeId":_this.storeId
              }
            })
          });
          }else{
            console.log("error submit!");
            return false;
          }
        })
        
      },
      uploadError(){
        console.log("上传失败")
      },
      uploadSuccess(res){
        console.log(res.data)
        this.itemForm.url = res.data
        console.log("上传成功")
      },

    },
    created(){
      this.storeId = this.$route.query.storeId;
      this.token = localStorage.getItem("token");
      this.tokenObject = {
        "token":this.token
      }
    }
}
</script>

<style>

</style>