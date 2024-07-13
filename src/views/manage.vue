<template>
  <div>
    <el-container style="height: 800px; border: 1px solid #eee">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-message"></i>账号信息</template>
        <el-menu-item-group>
          <el-menu-item @click="goToUserInfo">管理收货信息</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item @click="manageChat">消息管理</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group>
          <el-menu-item @click="manageGoods">订单管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>

  <el-container>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</el-container>
  </div>
</template>

<script>
export default {
    name:"manage_user_info",
    data(){
        return{
        }
    },
    methods:{
      goToUserInfo(){
        if (this.$route.name !== 'userinfo') {
          this.$router.push({ name: 'userinfo' });
        }
      },
      manageChat(){
        if (this.$route.name !== 'ChatRoom') {
          this.$router.push({ name: 'ChatRoom' });
        }
      },
      manageGoods(){
        if(this.$route.name !== 'manageGoods'){
          this.$router.push({name:'manageGoods'})
        }
      }
    },
}
</script >

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>