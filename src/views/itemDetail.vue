<template>
  <div>
    <el-container>
        <el-header>
                <div style="display: flex; align-items: center;"> 
                    <span style="color:green;">nnushop</span>
                    <div style="display: flex;margin-left: auto;margin-right: auto;">
                    <el-input style="width: 500px;" placeholder="输入内容以搜索"></el-input>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                </div>
            </div>
        </el-header>
        <el-main>
            <el-row justify="center" type="flex" :gutter="20">  
                <el-col :span="24"><div class="grid-content bg-purple-dark" style="display: flex; align-items: center; height: 100%;">  
                    <el-avatar shape="circle" :size="90" src="https://njnuqy.oss-cn-nanjing.aliyuncs.com/4/08124f84-6057-4138-8793-ff1990f058f9.jpg"></el-avatar>
                    <div style="margin-left: 20px;">
                        <p>{{ store.storeName }}</p>
                        <el-rate
                            v-model="value"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}">
                        </el-rate>
                    </div>
                    <div style="margin-left: auto;">
                        <el-button type="primary" :round="true" @click="contact">联系商家</el-button>
                        <el-button type="primary" :round="true">进入店铺</el-button>
                    </div>
                </div></el-col>
            </el-row>
            <div style="display: flex;margin-top: 40px;">
                <div style="flex:1">
                    <el-image :src="item.url" :fit="fit" style="width: 400px; height: 400px;"></el-image>
                </div>
                <div style="flex:1">
                    <p style="font-size: 30px;font-weight: bold;">{{ item.itemName }}</p>
                    <p style="font-size: 20px;font-weight: bold;">库存剩余： {{ item.stock }}</p>
                    <p>￥{{ item.price }}</p>
                    <div>
                        <el-button type="primary" style="background-color:orange" @click="buy">立即购买</el-button>
                        <el-button type="primary" @click="addItem(itemId)">加入购物车</el-button>
                    </div>
                </div>
            </div>
            <div style="margin-top: 5%;">
                <el-tabs v-model="activeName"  :stretch=true>
                    <el-tab-pane label="商品介绍" name="first">商品介绍</el-tab-pane>
                    <el-tab-pane label="商品评价" name="second">
                        <p>商品评价</p>
                        <div v-for="(comment,index) in comments" :key="index" style="display: flex;align-items: center;margin-top: 3%;">
                            <div style="display: flex;align-items: center;flex: 1;">
                                <el-avatar :src="comment.avatar"></el-avatar>
                                <p>{{ comment.username }}</p>
                            </div>
                            <div style="flex:7;">
                                {{comment.comment}}
                            </div>
                        </div>
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :total="total"
                                style="float: right;"
                                :current-page="currentPage"
                                @current-change="currentChange">
                                
                        </el-pagination>
                    </el-tab-pane>
                    <el-tab-pane label="本店其他商品" name="third">本店其他商品</el-tab-pane>
                </el-tabs>
            </div>
        </el-main>
    </el-container>
    <el-dialog  
      :visible.sync="dialogVisible"  
      width="30%"  
      :before-close="handleClose">  
      <span>加入购物车成功</span>  
      <span slot="footer" class="dialog-footer">  
        <el-button @click="dialogVisible = false">确 定</el-button>  
      </span>  
    </el-dialog>  
    
  </div>
</template>

<script>


export default {
    name:"Item_Detail",
    data(){
        return{
            itemId:"",
            item:{},
            store:{},
            fit:"fit",
            dialogVisible: false,
            showChatbox: false,
            socket : null,
            messages : [],
            newMessage : "",
            user:"",
            storeUser:"",
            token:"",
            value:0,
            comments:[],
            activeName: 'first',
            currentPage:1,
            total:1
        }
    },
    methods:{
        currentChange(val){
            console.log(val);
            this.getComments(val);
        },
        buy(){
            console.log(localStorage.getItem("token"))
            if(localStorage.getItem("token") == null){
                this.$router.push("/login")
                return
            }
            var JSONteim = JSON.stringify(this.item);
            sessionStorage.setItem("item",JSONteim);
            this.$router.push({
                path:"/buy",
                query:{
                    "itemId" : this.itemId
                }
            })
        },
        addItem(){
            const user = JSON.parse(localStorage.getItem("user"))
            const token = localStorage.getItem("token")
            if(user == null || token == null){
                this.$router.push("/login");
                return;
            }
            var userId = user.id
            var shoppingcartItem = {
                "itemId" :this.itemId,
                "userId" : userId
            }
            this.$axios.post("/cart/authorize/addItem",shoppingcartItem,{
                headers:{
                    "token" : token
                }
            }).then(res=>{
                console.log(res)
                this.dialogVisible = true
            })
            .catch(error => {
                this.$router.push("/login")
                console.log(error)
            })
        },
        contact(){
            if(this.user == null){
                this.$router.push("/login")
            }
            const chatMessage = {
                "senderId" : this.store.userId,
                "receiverId": this.user.id,
                "content" : "打招呼",
                "status" : "UNWATCHED",
                "timestamp" : Date.now()
            }
            console.log(this.token)
            this.$axios.post("/user/authorize/addChatMessage",chatMessage,{
                headers:{
                    "token" : this.token
                }
            }).then(res=>{
                console.log(res)
            })
            const newUrl = `${window.location.origin}/ChatRoom`
            window.open(newUrl, '_blank')

        },

        getUserById(){
            this.token = localStorage.getItem("token")
            this.$axios.get("/user/authorize/getUserById",{
                params:{
                    "id" : this.store.userId
                },
                headers:{
                    "token":this.token
                }
            }).then(res=>{
                console.log(res.data.data)
                this.storeUser = res.data.data
            }).catch(error=>{
                console.log(error)
            })
        },
        handleClose(done) {  
      this.$confirm('确认关闭？')  
        .then(() => {  
          done();  
        })  
        .catch(() => {});  
        },
        getComments(pageNum){
            this.$axios.get("/item/permit/getMark",{
            params:{
                "itemId" : this.itemId
            }
        }).then(res=>{
            this.value = res.data.data
        })
        this.$axios.get("/item/permit/getComments",{
            params:{
                "itemId" : this.itemId,
                "pageNum":pageNum
            }
        }).then(res=>{
            console.log(res.data.data)
            this.comments = res.data.data.records
            this.total = res.data.data.total
        })
        }
    },
    created(){
        this.itemId = this.$route.query.itemId;
        this.getComments(1);
        this.token = localStorage.getItem("token")
        this.user = JSON.parse(localStorage.getItem("user"))
        const _this = this
        this.itemId = this.$route.query.itemId
        this.$axios.get("/item/permit/getItemById",{
            params:{
                "itemId":this.itemId
            }
        }).then(res=>{
            _this.item = res.data.data
            console.log(res.data.data)
            this.$axios.get("/store/permit/getStoreByItemId",{
            params:{
                "itemId":res.data.data.id
            }
        }).then(res=>{
            console.log(res.data.data)
            _this.store = res.data.data
        })
        });
    },
    beforeDestroy(){
        if(this.socket){
            this.socket.close();
        }
    },
}
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}
.el-col {
    border-radius: 4px;
}
.grid-content {
    border-radius: 6px;
    min-height: 100px;
}
.chatbox-wrapper {  
  position: fixed; /* 固定定位 */  
  top: 0;  
  left: 0;  
  width: 100%;  
  height: 100%;  
  display: flex; /* 使用flex布局 */  
  justify-content: center; /* 水平居中 */  
  align-items: center; /* 垂直居中 */  
  background-color: rgba(0, 0, 0, 0.5); /* 背景遮罩层，可选 */  
  z-index: 999; /* 确保聊天框在其他内容之上 */  
}  
  
.chatbox {  
  background-color: #fff;  
  border-radius: 10px;  
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);  
  padding: 20px;  
  max-width: 80%; /* 你可以根据需要调整聊天框的最大宽度 */  
  max-height: 80%; /* 你可以根据需要调整聊天框的最大高度 */  
  overflow: auto; /* 如果内容过多，允许滚动 */  
  position: relative; /* 相对于.chatbox-wrapper定位 */  
  transform: translate(-50%, -50%); /* 微调聊天框位置，确保完美居中 */ 
  overflow: hidden; /* 防止内容溢出聊天框 */   
}  
  
.chatbox-content {  
  /* 聊天内容的样式 */  
  height: 200px; /* 根据内容自动调整高度 */  
  max-height: calc(100% - 80px); /* 留出空间给输入框和按钮 */  
  overflow-y: auto; /* 垂直滚动 */  
  border: 1px solid #ddd;  
  padding: 10px;  
  margin-bottom: 20px; /* 留出空间给输入框和按钮 */  
}  
</style>