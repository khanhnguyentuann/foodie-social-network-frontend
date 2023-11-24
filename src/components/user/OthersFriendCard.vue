<!-- eslint-disable vue/require-prop-types -->
<!-- eslint-disable vue/require-prop-types -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="container mt-3">
        <ul class="list-group mt-3">
            <p class="text-muted">{{ friends.length }} friends</p>

            <li v-for="friend in friends" :key="friend.id" style="background-color: rgba(255, 255, 255, 0.12);"
                class="list-group-item d-flex align-items-center shadow-sm rounded" @click="goToUserProfile(friend.id)">
                <img :src="'http://localhost:3000/' + friend.avatar" alt="Friend Avatar" class="rounded-circle mr-3"
                    width="50" height="50">
                <span class="ml-3 font-weight-bold">{{ friend.name }}</span>
            </li>
        </ul>

        <div v-if="friends.length === 0" class="text-muted text-center mt-3">
            This user has no friends yet!
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/userStore';

const BASE_URL = 'http://localhost:3000';

export default {
    name: 'OthersFriendCard',
    props: {
        userId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const userStore = useUserStore();
        const friends = ref([]);
        const router = useRouter();

        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/friendship/friends`, { params: { userId: props.userId } });
                friends.value = data;
            } catch (error) {
                console.error('Failed to fetch friend list', error);
            }
        };

        watch(() => props.userId, fetchData);

        onMounted(fetchData);

        const goToUserProfile = (id) => {
            if (id === userStore.user.id) {
                router.push('/myprofile');
            } else {
                router.push('/otherprofile/' + id)
            }
        };

        return {
            friends,
            goToUserProfile,
        };
    },
}
</script>
