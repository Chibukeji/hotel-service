<template>
  <div :class="{'has-logo':showLogo}">
    <!--<logo v-if="showLogo" :collapse="isCollapse" />-->
    <div v-if="sidebar.opened" class="system-sign">
      服务商管理后台
    </div>
    <div v-else>
      <img src="../../../assets/images/logo.png" alt="" class="system-logo">
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- <logo /> -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    ...mapState({
      sidebar: state => state.app.sidebar
    }),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss" scoped>
.system-sign{
  width: 100%;
  height: 60px;
  line-height: 60px;
  background: #42b983;
  color: #fff;
  font-size: 18px;
  text-align: center;
}
.system-logo{
  width: 34px;
  height: 37px;
  margin-left: 10px;
  margin-top: 10px;
}
</style>
