<template>
  <div>
    <div>
      <ul>
        <li v-for="(user,index) in userData" :key="index" style="list-style: none; display: flex; align-items: center; gap: 8px;">
          <el-avatar :src="user.avatar" shape="circle" :size="90"></el-avatar>
          <p>{{ user.username }}</p>  
          <el-button type="primary" style="margin-left: 20px;" @click="reply(user.id,user.avatar)">回复</el-button>
        </li>
      </ul>
    </div>
    <div v-if="showChatBox" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: aqua; height: 70vh; width: 80vw; display: flex; flex-direction: column;">  
      <ul ref="messageList" style="margin-top: 20px; flex: 1; overflow-y: auto;">  
        <li v-for="(message, index) in showMessages" :key="index" style="list-style: none; margin: 15px;"> 
          <div v-if="message.fromId != user.id" style="display: flex;">
            <el-avatar :src="avatar" shape="circle" :size="50"></el-avatar>
            <p>{{ message.message }}</p>
          </div>
          <div v-if="message.fromId == user.id" style="display: flex; justify-content: flex-end;">  
            <p style="margin-right: 10px;">{{ message.message }}</p>
            <el-avatar :src="user.avatar" shape="circle" :size="50"></el-avatar>
          </div>
        </li>  
      </ul>  
      <div style="padding: 10px;display: flex; text-align: center; background: white; /* 添加背景色以与聊天内容区分 */">  
      <el-input type="text" v-model="newMessage" placeholder="输入消息">  </el-input>
      <el-button @click="sendMessage(newMessage)" type="primary">发送</el-button>  
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
        test : "test",
        userIds:[],
        userData:[],
        token:"",
        showMessages:"",
        showChatbox:false,
        user:"",
        toId:"",
        avatar:"",
        showChatBox : false
      }
    },
    methods:{
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
                const messageFromId = message.fromId
                this.userIds.push(messageFromId)
                if(this.messages[messageFromId]){
                  this.messages[messageFromId].push(message);
                }else{
                  this.messages[messageFromId] = [message]
                }
                this.getUsers()
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
        reply(userId,avatar){
          console.log(userId)
          console.log(this.messages[userId])
          this.showMessages = this.messages[userId]
          this.showChatbox = true
          this.toId = userId
          this.avatar = avatar
          console.log(avatar)
          this.showChatBox = true
        },
        sendMessage(message){
          const JSONMessage = {
                "message" : message,
                "toId" : this.toId,
                "fromId" : this.user.id
            }
          console.log(JSONMessage)
          if(this.socket && this.socket.readyState === WebSocket.OPEN){
                this.socket.send(JSON.stringify(JSONMessage))
            }else{
                console.log("Websocket connection is not open");
            }
            this.newMessage = ""
            this.messages[this.toId].push(JSONMessage)
            this.showMessages = this.messages[this.toId]
            console.log(this.showMessages)
        }
    },
    created(){
      this.connectToWebSocket();
      this.token = localStorage.getItem("token");
      this.user = JSON.parse(localStorage.getItem("user"));
    }
}
</script>

<style scoped>

</style>