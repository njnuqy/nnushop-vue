<template>
  <div>
    <el-container>
      <el-header>
        <div style="display: flex; align-items: center;"> 
          <span style="color:green;">nnushop</span>
          <div style="display: flex;margin-left: auto;margin-right: auto;flex-direction: column;">
            <div style="display: flex;">
              <el-input style="width: 500px;" placeholder="输入内容以搜索" v-model="keyword" @input="inputChange"></el-input>
              <el-button type="primary" icon="el-icon-search">搜索</el-button>
            </div>
            <div>
              <div 
                v-for="(suggest, index) in suggestions" 
                :key="index" 
                style="border: 1px solid #ccc; margin: 10px 0; height: 50px; z-index: 999; display: flex; align-items: center;
                display: flex; align-items: center;cursor: pointer;" @click="itemDetail(suggest.id)">
                {{ suggest.itemName }}
              </div>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="manage" v-if="token">个人中心</el-button>
            <el-button type="warning" @click="myShoppingcart" v-if="token">我的购物车</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <div style="display: flex;justify-content: flex-start;">
          <div style="flex:3;">
            <el-carousel indicator-position="outside" style="width: 50%;z-index: -1;">
              <el-carousel-item v-for="item in itemss" :key="item">
                <img :src="item.url" style="width: auto; height: auto;">
              </el-carousel-item>
            </el-carousel>
          </div>
          <div style="display: flex;flex:1; flex-direction: column; align-items: center; justify-content: center;"> 
            <p style="text-align: center;">Hi! {{ user.username }} 欢迎光临！</p>  
            <div style="display: flex; justify-content: center;"> 
              <div v-if="!token">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="info" @click="register">注册</el-button>
              </div>
              <div v-if="token">
                <el-button type="primary" @click="myStore" v-if="store">我的店铺</el-button>
                <el-button type="primary" @click="openStore" v-if="!store">注册店铺</el-button>
                <el-button type="warning" @click="logout">退出登录</el-button>
              </div>
            </div>
          </div>
        </div>
        <p>猜你喜欢</p>  
        <div class="items" style="display: flex; flex-wrap: wrap; padding: 10px;">  
          <div v-for="item in items" :key="item.id" style="cursor: pointer;width: calc(33.33% - 10px); margin: 5px; box-sizing: border-box;" @click="itemDetail(item.id)"> 
            <el-image :src="item.url"  style="width: 300px; height: 300px;"></el-image>
            <p>商品名称：{{ item.itemName }}</p>
            <p>商品价格：{{ item.price }}</p>
          </div>  
        </div>  
      </el-main>  
    </el-container> 
  </div>
</template>

<script>
export default {
    name:"Index_",
    data(){
      return{
        input:"",
        itemss: [1, 2, 3, 4, 5, 6],
        items: [], // 你的数据项 
        token:"",
        user:{},
        store:{},
        keyword:"",
        suggestions:[],
        searchTimer:null
      }
    }, 
    methods:{
      itemDetail2(itemId){
        console.log(itemId)
      },
      inputChange(){
        clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.search()
				},300)
      },
      search(){
        this.$axios.get("/item/permit/search",{
          params:{
            "keyword":this.keyword
          }
        }).then(res=>{
          this.suggestions = res.data.data
        })
      },
      login(){
        this.$router.push("/login");
      },
      register(){
        this.$router.push("/register");
      },
      openStore(){
        if(this.token != null){
          this.$router.push("/openStore");
        }else{
          this.login()
        }
      },
      myStore(){
        this.$router.push({
          path:'/myStore',
          query:{
            storeId:this.store.id
          }
        });
      },
      itemDetail(itemId){
        console.log(itemId)
        const newTabUrl = `${window.location.origin}/itemDetail?itemId=${itemId}`; // 构建新标签页的 URL  
        window.open(newTabUrl, '_blank'); // 在新标签页中打开 URL

      },
      logout(){
        localStorage.clear();
        location.reload();
      },
      myShoppingcart(){
        const newTabUrl = `${window.location.origin}/myShoppingCart?userId=${this.user.id}`;
        window.open(newTabUrl,'_blank');
      },
      manage(){
        const newTabUrl = `${window.location.origin}/manage/userinfo`; // 构建新标签页的 URL  
        window.open(newTabUrl, '_blank');
      }
    },
    created(){

      this.token = localStorage.getItem("token"); 
      console.log(this.token)
      const JSONuser = localStorage.getItem("user")
      console.log(JSONuser)
      const _this = this
      this.$axios.get("/item/permit/getAllItems").then(res=>{
        _this.items = res.data.data
      })
      .catch(error=>{
        console.log(error)
      })
      if(JSONuser != null){
        _this.user = JSON.parse(JSONuser);
        console.log(_this.user)
      }else{
        _this.user.username = "游客"
      }
      if(this.token != null){
        this.$axios.get("/store/permit/selectStore",{
          params:{
            "token":_this.token
          }
        }).then(res=>{
          _this.store = res.data.data
        })
        .catch(error=>{
          localStorage.clear();
          console.log(error)
          location.reload();
        })
      } 
    }
}
</script>

<style>
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-container{
    margin-right: 10%;
    margin-left: 10%;
  }
  .items {  
  justify-content: space-between; /* 根据需要添加，使元素之间等距 */  
}  
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
  /* 添加在<style>标签内或外部CSS文件中 */
.el-header div[style*="z-index: 999;"] {
  box-sizing: border-box; /* 确保内边距和边框包含在总宽度和高度内 */
  position: relative; /* 为使用绝对定位的内部元素做准备（如有需要） */
  padding: 0; /* 如果需要，移除内边距 */
  margin: 0; /* 移除外边距，或者调整为合适的值 */
}

/* 如果有特定的内部元素影响布局，可以针对性地调整 */
.el-header div[style*="z-index: 999;"] * {
  pointer-events: none; /* 禁止内部元素响应鼠标事件，让点击只作用于外层div */
}
</style>