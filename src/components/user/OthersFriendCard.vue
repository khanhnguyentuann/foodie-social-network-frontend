<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';

const props = defineProps({
    userId: {
        type: String,
        required: true,
    },
});

const userStore = useUserStore();
const friends = ref([]);
const router = useRouter();

const fetchData = async () => {
    try {
        const { data } = await axios.get(`/api/friendship/friends`, { params: { userId: props.userId } });
        friends.value = data;
    } catch (error) {
        console.error('Failed to fetch friend list', error);
    }
};

watch(() => props.userId, fetchData);

onMounted(fetchData);

const goToUserProfile = (userId) => {
    if (userId === userStore.user.id) {
        router.push({ name: 'MyProfile' });
    } else {
        router.push({ name: 'OtherProfile', params: { userId } });
    }
};
</script>

<template>
    <div class="container mt-3 mb-3">
        <ul class="list-group mt-3">
            <p class="text-muted">{{ friends.length }} friends</p>

            <li v-for="friend in friends" :key="friend.id" style=""
                class="list-group-item d-flex align-items-center shadow-sm rounded" @click="goToUserProfile(friend.id)">
                <img :src="friend?.avatar ? '/api/' + friend.avatar : ''" alt="Friend Avatar" class="rounded-circle mr-3"
                    width="50" height="50">
                <span class="ml-3 font-weight-bold">{{ friend.name }}</span>
            </li>
        </ul>

        <div v-if="friends.length === 0" class="text-muted text-center mt-3 mb-3">
            This user has no friends yet!
        </div>
    </div>
</template>

<style scoped>
.list-group-item {
    background-color: rgba(255, 255, 255, 0.12);
    cursor: pointer;
}

.list-group-item:hover {
    background-color: #616164;
}
</style>
