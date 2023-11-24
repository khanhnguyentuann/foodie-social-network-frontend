<template>
    <div class="row mb-4 profile-header">
        <div class="col-md-4 text-center">
            <img :src="userAvatar" alt="User Avatar" width="150" height="150" class="rounded-circle">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center">
            <h2>{{ userName }}</h2>
            <p>Email: {{ userEmail }}</p>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../../store/userStore';
import { computed } from 'vue';

const BASE_URL = 'http://localhost:3000';

export default {
    name: 'MyInfoCard',
    setup() {
        const userStore = useUserStore();
        const { user } = userStore;

        return {
            userAvatar: computed(() => `${BASE_URL}/${user?.avatar}`),
            userName: computed(() => user?.name || 'Guest'),
            userEmail: computed(() => user?.email || ''),
        };
    },
};
</script>

<style scoped>
.profile-header {
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
    background-color: rgba(255, 255, 255, 0.12);
    color: #fff;
}
</style>
