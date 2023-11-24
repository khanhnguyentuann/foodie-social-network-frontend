<template>
  <div class="app-layout">
    <!-- Header -->
    <header class="app-layout-navbar">
      <div class="navbar-left">
        <a class="ml-2 mr-3" href="#">
          <img src="@/assets/logos/main_logo.png" alt="Logo" width="50" height="40">
        </a>
        <div class="d-flex align-items-center justify-content-center">
          <strong>Admin Dashboard</strong>
        </div>
      </div>
      <div class="navbar-center"></div>
      <div class="navbar-right">
        <div class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="dropdownUser1" role="button" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
            <img :src="apiURL(userStore.user?.avatar)" alt="User Avatar" width="32" height="32" class="rounded-circle">
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownUser1"
            style="background-color: #333;color: #fff;">
            <li class="hover-li" @click="goTo('/profile')">
              <a type="button" class="dropdown-item">
                <img :src="apiURL(userStore.user?.avatar)" alt="User Avatar" width="25" height="25"
                  class="rounded-circle mr-2">
                <span class="ml-2">{{ userName }}</span>
              </a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
            <li>
              <a class="dropdown-item" style="color: #fff;" href="#" @click.prevent="logout">
                <i class="fas fa-sign-out-alt mr-3"></i> Log out
              </a>
            </li>
          </div>
        </div>
      </div>
    </header>
    <!-- Body -->
    <div class="app-layout-content">
      <div class="app-layout-sidebar">
        <div class="user-panel mt-3 pb-3 mb-3 d-flex">
          <div class="image">
            <img :src="apiURL(userStore.user?.avatar)" class="img-circle elevation-2" alt="User Image">
          </div>
          <div class="info">
            <a href="#" class="d-block" style="color: #c2c7d0;">{{ userName }}</a>
          </div>
        </div>
        <div class="form-inline">
          <div class="input-group" data-widget="sidebar-search">
            <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
            <div class="input-group-append">
              <button class="btn btn-sidebar">
                <i class="fas fa-search fa-fw"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="sidebar-menu mt-3">
          <div @click="navigateTo('/admin', 'Dashboard')"
            :class="['sidebar-item', selectedTab === 'Dashboard' ? 'selected' : '']">
            <i class="icon fas fa-tachometer-alt"></i>
            <div>Dashboard</div>
          </div>
          <div @click="navigateTo('/admin/user-list', 'Users')"
            :class="['sidebar-item', selectedTab === 'Users' ? 'selected' : '']">
            <i class="icon fas fa-users"></i>
            <div>User management</div>
          </div>
          <div @click="navigateTo('/admin/recipes-list', 'Recipes')"
            :class="['sidebar-item', selectedTab === 'Recipes' ? 'selected' : '']">
            <i class="icon fas fa-file-text"></i>
            <div>Post management</div>
          </div>
          <div @click="navigateTo('/admin/tag-list', 'Tags')"
            :class="['sidebar-item', selectedTab === 'Tags' ? 'selected' : '']">
            <i class="icon fas fa-hashtag"></i>
            <div>Hashtag management</div>
          </div>
          <div @click="navigateTo('/admin/ingredient-list', 'Ingredients')"
            :class="['sidebar-item', selectedTab === 'Ingredients' ? 'selected' : '']">
            <i class="icon fas fa-carrot"></i>
            <div>Ingredient management</div>
          </div>
          <div @click="navigateTo('/admin/comments', 'Comments')"
            :class="['sidebar-item', selectedTab === 'Comments' ? 'selected' : '']">
            <i class="icon fas fa-comments"></i>
            <div>Comment management</div>
          </div>
        </div>
      </div>

      <div class="app-layout-page p-3">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '../store/userStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'AdminLayout',
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const selectedTab = ref('Dashboard');

    const apiURL = (relativePath) => {
      return window.baseURL + '/' + relativePath;
    };

    const navigateTo = (route, tabName) => {
      router.push(route);
      selectedTab.value = tabName;
    };

    const logout = async () => {
      userStore.clearData();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      router.push('/login');
    };

    const userName = computed(() => {
      return userStore.user?.name || '';
    });

    return {
      apiURL,
      userStore,
      userName,
      selectedTab,
      navigateTo,
      logout
    };
  }
}
</script>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout-navbar {
  height: 73px;
  padding: 0.1rem 1rem;
  background-color: #343a40;
  color: #fff;
  fill: rgb(38, 40, 36);
  box-shadow: 0 .25rem .5rem 0 rgba(0, 0, 0, 0.12);
  z-index: 2;
  display: grid;
  grid-template: "left center right" /1fr auto 1fr;
  align-items: center;

}

.navbar-left {
  display: flex;
  grid-area: left;
}

.navbar-center {
  display: flex;
  justify-content: center;
  grid-area: center;
}

.navbar-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  grid-area: right;
}

.sidebar-menu {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  width: 16rem;
}

.app-layout-content {
  display: flex;
  height: calc(100vh - 4rem);
  flex: 1;
}

.app-layout-sidebar {
  color: #c2c7d0;
  position: relative;
  height: 100%;
  background-color: #343a40;
  padding: 0px 8px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  display: flex;
  padding: 15px;
  min-height: 58px;
  border-radius: .25rem;
  transition: all 0.2s ease-in;
}

.sidebar-item:hover {
  background-color: rgba(255, 255, 255, .1);
}

.sidebar-item.selected {
  background-color: #fff;
  color: #212529;
}

.icon {
  font-size: 19px;
  height: 19px;
  line-height: 19px;
  width: 1.5rem;
  display: flex;
  margin-right: 15px;
}

.app-layout-page {
  flex-grow: 2;
  overflow-y: scroll;
  background-color: #454d55;
  color: #fff;
}

.nav-link.dropdown-toggle::after {
  display: none;
}

.user-panel {
  border-bottom: 1px solid #4f5962;
  position: relative;
}

.user-panel,
.info {
  overflow: hidden;
  white-space: nowrap;
  transition: margin-left .3s linear, opacity .3s ease, visibility .3s ease;
  display: inline-block;
  padding: 5px 5px 5px 10px;
}

.img-circle {
  border-radius: 50%;
  height: auto;
  width: 2.1rem;
}

.elevation-2 {
  box-shadow: 0 3px 6px rgba(0, 0, 0, .16), 0 3px 6px rgba(0, 0, 0, .23) !important;
}

.btn-sidebar,
.form-control-sidebar {
  background-color: #3f474e;
  border: 1px solid #56606a;
  color: #fff;
}
</style>
