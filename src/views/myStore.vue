<template>
  <div>
    <p style="text-align: center;" v-if="!itemLength">没有任何商品哦，快去<span @click="addItem" class="clickable-text">添加</span>吧</p>
    <el-button @click="addItem" type="primary">继续添加</el-button>
    <el-button @click="index" type="primary">回到主页</el-button>
    <el-table
        v-if="itemLength"
      :data="itemData"
      style="width: 100%">
      <el-table-column
        prop="itemName"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="180">
      </el-table-column>
      <el-table-column  
        label="图片"  
        width="200">  
        <template slot-scope="scope">  
          <img :src="scope.row.url" :alt="scope.row.itemName" style="width: 100%; height: auto;">  
        </template>  
      </el-table-column>
      <el-table-column style="display: flex;">
        <template slot-scope="scope">  
          <el-button type="primary" @click="modify(scope.row)">修改</el-button>  
          <el-button type="danger" @click="deleteItem(scope.row)">下架商品</el-button>  
        </template>  
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
export default {
    name:"My_Store",
    data(){
        return{
          token:"",
          itemLength:"",
          storeId:"",
          itemData:[

          ]
        }
    },
    methods:{
      deleteItem(row){
        console.log(row);
        console.log(this.token)
        const _this = this
        this.$axios.get("/item/authorize/deleteItem",{
          params:{
            "objectName":row.objectName,
            "itemId":row.id
          },headers:{
            "token":_this.token
          }
        }).then(res=>{
          console.log(res);
          location.reload();
        })
      },
      getItems(){
          const _this = this
          this.$axios.get("/store/authorize/getItems",{
              params:{
                  "storeId":_this.storeId
              },
              headers:{
                  "token":_this.token
              }
          }).then(res=>{
              this.itemLength = Boolean(res.data.data.length);
              console.log(res.data.data)
              _this.itemData = res.data.data
              console.log(res.data.data.length)
          })
      },
      addItem(){
          this.$router.push({
              path:"/addItem",
              query:{
                  "storeId":this.storeId
              }
          })
      },
      index(){
        this.$router.push("/index")
      },
      modify(item){
        console.log(item)
        var JSONItem = JSON.stringify(item)
        sessionStorage.setItem("item",JSONItem)
        const newTabUrl = `${window.location.origin}/modifyItem`; // 构建新标签页的 URL  
        window.open(newTabUrl, '_blank'); 
      }
    },
    created(){
        this.token = localStorage.getItem("token");
        this.storeId = this.$route.query.storeId;
        this.getItems();
    }
}
</script>

<style scoped>
.clickable-text {  
  text-decoration: underline; /* 添加下划线 */  
  color: blue; /* 设置字体颜色 */  
  cursor: pointer; /* 设置鼠标悬停时的光标为手型 */  
}  
</style>