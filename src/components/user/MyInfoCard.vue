<script setup>
import { useUserStore } from '../../store/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const { user } = userStore;

const userAvatar = computed(() => `/api/${user?.avatar}`);
const userName = computed(() => user?.name || 'Guest');
const userEmail = computed(() => user?.email || '');

const editProfile = () => {
    // Thực hiện hành động chỉnh sửa thông tin cá nhân ở đây
};
</script>

<template>
    <div class="card mb-4">
        <img class="card-img-top" src="https://i.imgur.com/K7A78We.jpg" alt="Card image cap">
        <div class="card-body little-profile text-center">
            <div class="pro-img"><img :src="userAvatar" alt="User Avatar"></div>
            <h3 class="mb-2">{{ userName }}</h3>
            <h5 class="mb-2">{{ userEmail }}</h5>
            <a href="javascript:void(0)" class="waves-effect waves-dark btn btn-primary btn-md btn-rounded" data-abc="true"
                @click="editProfile">
                Edit Profile
                <i class="fa fa-pencil ml-2"></i>
            </a>
        </div>
    </div>
</template>

<style scoped>
.card-img-top {
    height: 240px;
}

.mb-2 {
    color: #455a64;
}

.card-no-border .card {
    border-color: #d7dfe3;
    border-radius: 4px;
    margin-bottom: 30px;
    -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05)
}

.card-body {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1.25rem
}

.pro-img {
    margin-top: -80px;
    margin-bottom: 20px
}

.little-profile .pro-img img {
    width: 128px;
    height: 128px;
    -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 100%
}

.btn-rounded.btn-md {
    padding: 12px 35px;
    font-size: 16px
}

.btn-primary,
.btn-primary.disabled {
    background: #7460ee;
    border: 1px solid #7460ee;
    -webkit-box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14), 0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
    box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14), 0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
    -webkit-transition: 0.2s ease-in;
    -o-transition: 0.2s ease-in;
    transition: 0.2s ease-in
}

.btn-rounded {
    border-radius: 60px;
    padding: 7px 18px
}
</style>
