<template>
  <div>
    <div style="width: 800px;height: 600px;;margin-top: 10%;border: 1px solid #ccc;display: flex;">
      <!-- 联系人列表 -->
      <div style="flex:1;">
        <!-- 头部 -->
        <div style="padding-bottom: 30px;">
          <p style="margin-left: 3%;">联系人列表</p>
          <el-input placeholder="搜索最近联系人" v-model="recentContact" ></el-input>
        </div>
        <!-- 联系人信息 -->
        <div v-for="(user,index) in userList" :key="index" class="chat-box" @click="selectUser(index)">
          <div style="display: flex;">
            <el-avatar :size="40" :src="user.avatar"></el-avatar>
            <p style="margin-left: 20px;">{{ user.username }}</p>
          </div>
        </div>
      </div>
      <!-- 聊天界面 -->
      <div style="flex: 2;width: 600px;position: relative;" >
        <div style="margin-left: 5%;width: 500px; height: 580px; overflow-y: auto;">
          <p>{{ selectedUser.username }}</p>
          <div style="margin-top: 10%;">
            <div v-for="(content,index) in chatContent" :key="index" class="message-wrapper">
              <div :class="content.senderId === user.id ? 'message-right' : 'message-left'" class="message-container" >
                <el-avatar :size="30" :src="content.senderId === selectedUser.id? selectedUser.avatar : user.avatar"></el-avatar>
                <p style="margin-left: 2%;">{{ content.content }}</p>
              </div>
            </div> 
          </div>
        </div>
        <div style="position: absolute; bottom: 0; width: 100%; display: flex;">
          <el-input v-model="newMessage" ref="messageInput" style="flex: 1;" @keyup.native.enter="sendMessage(newMessage)"></el-input>
          <el-button @click="sendMessage(newMessage)"  type="primary">发送</el-button>  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name:"chat_room",
    data(){
      return{
        socket : null,
        messages : {},
        newMessage : "",
        userIds:[],
        userData:[],
        token:"",
        showMessages:"",
        showChatbox:false,
        user:"",
        toId:"",
        avatar:"",
        recentContact:"",
        userList:[],
        selectedUser:{},
        chatContent:[],
      }
    },
    methods:{
      selectUser(index){
        this.selectedUser = this.userList[index];
        // 获取聊天内容
        this.$axios.get("/user/authorize/getChatMessage",{
          params:{
            "senderId":this.user.id,
            "receiverId":this.selectedUser.id
          },headers:{
            "token":this.token
          }
        }).then(res=>{
          console.log(res.data.data)
          this.chatContent = res.data.data
        });
      },
      connectToWebSocket(){
            const wsUri = 'ws://localhost:8086/chat'; // 替换为你的WebSocket服务器地址
            this.socket = new WebSocket(wsUri);
            this.socket.onopen = (event) => {
                console.log('WebSocket Connection opened',event);
                //连接打开后，你可以发送一条初始消息或进行其他操作  
                //假设 userObject 是从某处获取的用户对象  
                const JSONUser = localStorage.getItem("user")
                //将用户对象转换为JSON字符串，并发送给服务器  
                this.socket.send(JSONUser); 
            };

            this.socket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log(message)
                this.chatContent.push(message);
            };
            this.socket.onerror = (error) => {
                console.log("Websocket Error observer",error);
            };
        },
        getUsers(){
          this.$axios.post("/user/authorize/getUsersByIds",this.userIds,{
            headers:{
              "token" : this.token
            }
          }).then(res=>{
            console.log(res.data.data)
            this.userData = res.data.data
            console.log(this.userData)
          })
          .catch(err=>{
            console.log(err)
          })
        },
        sendMessage(message){
          if(this.selectedUser.username == null ){
            alert("没有选择发送目标");
            return;
          }
          if(message.length == 0){
            alert("消息不能为空");
            return;
          }
          const JSONMessage = {
                "content" : message,
                "receiverId" : this.selectedUser.id,
                "senderId" : this.user.id
            }
          console.log(JSONMessage)
          if(this.socket && this.socket.readyState === WebSocket.OPEN){
                this.socket.send(JSON.stringify(JSONMessage))
            }else{
                console.log("Websocket connection is not open");
            }
            this.newMessage = ""
            this.chatContent.push(JSONMessage)
            this.$refs.messageInput.focus()
        }
    },
    created(){
      this.connectToWebSocket();
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user"));
      this.$axios.get("/user/authorize/getChatUserList",{
        params:{
          "userId":this.user.id
        },headers:{
          "token":this.token
        }
      }).then(res=>{
        console.log(res.data);
        if(res.data != ""){
          this.userList = res.data.data;
        }
        
      })
    },
    beforeDestroy(){
      if(this.socket){
          this.socket.close();
        }
      }
}
</script>

<style scoped>
/* 基础样式，定义div的基本外观 */
.chat-box {
 
    padding: 20px;
    background-color: #f0f0f0; /* 默认背景色 */
    transition: background-color 0.3s ease; /* 添加过渡效果，使颜色变化更平滑 */
}

/* 当鼠标悬停在div上时的样式 */
.chat-box:hover,
.chat-box:focus { /* 注意：focus 用于处理键盘导航时的高亮效果 */
    background-color: #e0e0e0; /* 鼠标悬停时的背景色 */
}

/* 对于触控设备，可以使用伪类 :active 来模拟按下时的效果 */
.chat-box:active {
    background-color: #d0d0d0; /* 触摸按下时的背景色，可根据需要调整 */
}

/* 保持外部容器的样式不变 */
.message-wrapper {
    display: flex;
    /* justify-content: flex-end; 这一行应该被移除或注释掉 */
}

/* 调整消息容器的基础样式 */
.message-container {
    display: flex;
    flex-direction: row; /* 改变为行排列，以便更好地控制对齐 */
    margin-bottom: 10px; /* 保持消息间的间距 */
    align-items: center;
}

/* 对右侧消息（自己发出的）进行样式设定 */
.message-right {
    margin-left: auto; /* 这将使得右侧消息靠右对齐 */
    text-align: right; /* 确保文本也靠右 */
    flex-direction: row-reverse;
}
.message-right p{
  margin-right: 2%;
}

/* 对左侧消息（对方发出的）进行样式设定 */
.message-left {
    text-align: left; /* 确保文本靠左 */
}

.message-container p {
    /* 防止文本过短时自动换行 */
    width: 200px;
}
</style> 