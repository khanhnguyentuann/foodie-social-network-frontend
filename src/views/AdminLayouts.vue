<script setup>
import { useUserStore } from '../store/userStore';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const selectedTab = ref('Dashboard');

const navigateTo = (route, tabName) => {
  router.push(route);
  selectedTab.value = tabName;
};

const logout = async () => {
  userStore.clearData();
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  router.push({ name: 'Login' });
};

const userName = computed(() => userStore.user?.name || '');
</script>

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
            <img :src="userStore.user?.avatar ? '/api/' + userStore.user.avatar : ''" alt="User Avatar" width="32"
              height="32" class="rounded-circle">
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownUser1"
            style="background-color: #333;color: #fff;">
            <li class="hover-li">
              <a type="button" class="dropdown-item">
                <img :src="userStore.user?.avatar ? '/api/' + userStore.user.avatar : ''" alt="User Avatar" width="25"
                  height="25" class="rounded-circle mr-2">
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
            <img :src="userStore.user?.avatar ? '/api/' + userStore.user.avatar : ''" class="img-circle elevation-2"
              alt="User Image">
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
          <div @click="navigateTo('/admin/posts-containing-comments', 'PostsContainingComments')"
            :class="['sidebar-item', selectedTab === 'PostsContainingComments' ? 'selected' : '']">
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

<style src="../assets/Adminlayout.css" scoped></style>
