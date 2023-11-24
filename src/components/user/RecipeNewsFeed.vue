<script setup>
import NewsFeedPost from './NewsFeedPost.vue';
import { useUserStore } from '../../store/userStore';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const userName = computed(() => userStore.user?.name);

const goToCreateRecipe = () => {
    router.push({ name: 'CreateRecipe' });
};

</script>

<template>
    <div class="mt-3">
        <div class="click thought-box card mb-4 p-3"
            style="background-color: rgb(18, 18, 18); background: rgba(255, 255, 255, 0.12);" @click="goToCreateRecipe">
            <div class="d-flex align-items-center">
                <img :src="userStore.user?.avatar ? '/api' + userStore.user.avatar : ''" alt="User Avatar" width="40"
                    height="40" class="rounded-circle">
                <span class="ml-3 font-weight-bold">{{ userName }}, what are you thinking!</span>
            </div>
        </div>

        <NewsFeedPost />
    </div>
</template>

<style scoped>
.user-avatar {
    width: 48px;
    height: 48px;
    margin-right: 10px;
    border-radius: 50%;
}

.click {
    cursor: pointer;
}
</style>