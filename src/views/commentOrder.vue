<template>
  <div>
    <p style="text-align: center;">评价订单</p>
    <div style="display: flex;justify-content: center;align-items: center;">
        <p style="margin-right: 3%;">订单号：{{ order.id }}</p>
        <p style="margin-left: 3%;">{{ order.createTime }}</p>
    </div>
    <div style="margin-left: 15%;margin-top: 8%;display: flex;">
        <div style="flex: 1;">
            <el-image :src="item.url" style="width: 150px;height: 150px;"></el-image>
            <p>{{ item.itemName }}</p>
        </div>
        <div style="flex: 2;">
            <div style="display: flex;align-items: center;">
                <p>商品评分</p>
                <el-rate
                    v-model="mark"
                    style="margin-left: 2%;">
                </el-rate>
            </div>
            <div>
                <p>评价</p>
                <el-input style="width: 500px;" v-model="comment" type="textarea" maxlength="100"></el-input>
            </div>
        </div>
    </div>
    <div style="text-align: center;">
        <el-button type="danger" @click="submitComment">发表</el-button>
    </div>
  </div>
</template>

<script>
export default {
    name:"comment_order",
    data(){
        return{
            orderId:"",
            itemId:"",
            token:"",
            item:{},
            order:{},
            mark:0,
            comment:null,
            user:{}
        }
    },
    methods:{
        submitComment(){
            if(this.comment == null || this.comment.length < 3){
                alert("评价字数过少");
                return;
            }
            const itemCommnet = {
                "username" : this.user.username,
                "itemId" : this.itemId,
                "orderId" : this.orderId,
                "mark" : this.mark,
                "comment" : this.comment,
                "avatar":this.user.avatar
            }
            this.$axios.post("/item/authorize/comment",itemCommnet,{
                headers:{
                    "token" : this.token
                }
            }).then(res=>{
                console.log(res);
                if(res.data.data != -1){
                    alert("评价已完成");
                    this.$router.push('/index')
                }else{
                    alert("评价失败");
                    
                }
            })
        }
    },
    created(){
        this.itemId = this.$route.query.itemId;
        this.orderId = this.$route.query.orderId;
        this.token = localStorage.getItem("token");
        this.user = JSON.parse(localStorage.getItem("user"));
        this.$axios.get("/item/permit/getItemById",{
            params:{
                "itemId" : this.itemId
            }
        }).then(res=>{
            console.log(res.data.data);
            this.item = res.data.data;
        });
        this.$axios.get("/order/authorize/getOrderById",{
            params:{
                "orderId" : this.orderId
            },headers:{
                "token" : this.token
            }
        }).then(res=>{
            console.log(res.data.data);
            this.order = res.data.data;
        })
    }
}
</script>

<style>

</style>