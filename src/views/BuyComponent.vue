<template>
  <div>
    <el-container>
      <el-header>
        <div style="display: flex; align-items: center;"> 
          <span style="color:green;">nnushop</span>
        </div>
        <el-steps :active="1" align-center class="custom-steps">
          <el-step title="拍下商品"></el-step>
          <el-step title="支付"></el-step>
          <el-step title="确认收货"></el-step>
          <el-step title="评价"></el-step>
        </el-steps>
      </el-header>
      <el-main style="margin-top: 5%;">
        <div>
          <p>选择收货地址</p>
          <div style="display: flex;">
            <div v-for="(userinfo,index) in userinfos" :key="index" style="border: 1px dashed black;margin: 1%;width: 150px;" @click="selectAddress(index)" :class="{ 'selected': selectedAddressIndex == index }" >
              <p>{{ userinfo.address }}({{ userinfo.name }}收)</p>
              <p>{{ userinfo.mobile }}</p>
            </div>
          </div>
          <p style="float:right;" @click="manageUserInfo" class="clickable-text">管理收货地址</p>
        </div>
        <div style="margin-top: 8%;">
          <div>确认订单信息</div>
          <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem;margin-top: 5%;" class="order">
            <div style="width: 200px;">店铺宝贝</div>
            <div>单价</div>
            <div>数量</div>
            <div>优惠方式</div>
            <div>小计</div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem;margin-top: 10%;" class="order">
            <div>
              <el-image
                :src="item.url"
                style="width: 100px; height: auto; object-fit: cover;"
              ></el-image>
            </div>
            <div>￥{{item.price}}</div>
            <div>
              <el-input type="number" v-model="number" min="1" style="width: 30%;"></el-input>
            </div>
            <div>无</div>
            <div>￥{{item.price * number}}</div>
          </div>
        </div>
        <div style="margin-top: 10%;">
          <div style="float:right;">
            <div >实付款:￥<span style="font-size: 70px;color: red;">{{ item.price * number }}</span></div>
            <div>
              <p>寄送至：{{ selectedUserinfo.address }}</p>
              <p>收货人：{{ selectedUserinfo.name }}</p>
            </div>
            <el-button type="primary" style="width: 200px;background-color: red;" @click="submitOrder">提交订单</el-button>
          </div>
        </div>
      </el-main>
    </el-container>
    <!-- 如果没有收货地址，弹出创建地址弹窗 -->
    <el-dialog
      title="创建地址"
      :visible.sync="dialogVisible"
    >
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
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'BuyComponent',
    data(){
      return{
        dialogVisible:true,
        number:1,
        formData:{
          userId:"",
          address:"",
          name:"",
          mobile:"" 
        },
        selectedAddressIndex:0,
        user:"",
        token:"",
        userinfos:[],
        selectedUserinfo: { address: '', name: '', mobile: '' },
        item:{},
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
        }
      }
    },
    methods:{
      submitOrder(){
        if(this.selectedUserinfo.address == "" || this.selectedUserinfo.name == "" || this.selectedUserinfo.mobile == ""){
          alert("请选择收货地址");
          return;
        }
        const order = {
          "itemId" : this.item.id,
          "number" : this.number,
          "userId" : this.user.id,
          "name" : this.selectedUserinfo.name,
          "phone" : this.selectedUserinfo.mobile,
          "address" : this.selectedUserinfo.address,
          "orderStatus" : "",
          "itemUrl" : this.item.url
        }
        console.log(order)
        this.$axios.post("/order/authorize/addOrder",order,{
          headers:{
            "token" : this.token
          }
        }).then(res=>{
          console.log(res);
          // this.$router.push({
          //   path:"/payOrder",
          //   query:{
          //     "orderId" : res.data.data.id
          //   }
          // })
          window.open(`http://localhost:8081/alipay/permit/pay?subject=${this.item.itemName}&traceNo=${res.data.data.id}&totalAmount=${this.item.price * this.number}`,'_self')
        })
      },
      manageUserInfo(){
        const newUrl = `${window.location.origin}/manage/userinfo`;
        window.open(newUrl,'_blank');
      },
      selectAddress(index){
        this.selectedAddressIndex = index;
        this.selectedUserinfo = this.userinfos[index];
      },
      submit(formData){
        this.$refs[formData].validate((valid)=>{
          if(valid){
            this.formData.userId = this.user.id
            console.log(this.formData)
            this.$axios.post("/userinfo/authorize/addUserInfo",this.formData,{
              headers:{
                "token":this.token
              }
            }).then(res=>{
              console.log(res.data.data);
              alert("添加成功");
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
      this.user = JSON.parse(localStorage.getItem('user'));
      this.token = localStorage.getItem("token");
      this.item = JSON.parse(sessionStorage.getItem("item"));
      this.$axios.get("/userinfo/authorize/getUserInfos",{
        params:{
          "userId" : this.user.id
        },
        headers:{
          "token" : this.token
        }
      }).then(res=>{
        console.log(res.data.data);
        this.userinfos = res.data.data;
        if(this.userinfos.length != 0){
          this.dialogVisible = false;
          this.selectedUserinfo = this.userinfos[0];
        }
        console.log(this.userinfos)
      })
    }
}
</script>

<style scoped>
  /* 自定义步骤之间的间距 */
  .custom-steps::before {
    content: "";
    display: table;
    clear: both;
  }

  .custom-steps .el-step {
    float: left;
    position: relative;
  }

  .custom-steps .el-step + .el-step::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 2px; /* 步骤之间的连线高度 */
    background-color: #409eff; /* 连线颜色 */
    z-index: -1;
  }
  .selected {
  /* 在这里添加你想要的选中状态样式 */
  border-color: red !important;
}
.clickable-text {  
  text-decoration: underline; /* 添加下划线 */  
  color: orange; /* 设置字体颜色 */  
  cursor: pointer; /* 设置鼠标悬停时的光标为手型 */  
}  



</style>
