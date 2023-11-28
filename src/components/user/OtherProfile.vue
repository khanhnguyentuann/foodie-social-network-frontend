<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { useFriendshipStore } from '../../store/friendshipStore';
import OthersInfoCard from './OthersInfoCard.vue';
import OthersFriendCard from './OthersFriendCard.vue';
import OthersPostCard from './OthersPostCard.vue';

const props = defineProps({
    userId: {
        type: String,
        required: true,
    },
});

const userStore = useUserStore();
const friendshipStore = useFriendshipStore();
const userRecipes = ref([]);
const user = ref(null);

const fetchData = async () => {
    try {
        const { data } = await axios.get(`/api/otherprofile/${props.userId}`);
        user.value = data.user;
        userRecipes.value = data.recipes;
    } catch (error) {
        handleErrors('Lỗi khi tải thông tin người dùng:', error);
    }

    try {
        await friendshipStore.fetchFriendshipStatus(userStore.user.id, props.userId);
    } catch (error) {
        handleErrors('Failed to fetch friendship status', error);
    }
};

watch(() => props.userId, fetchData);
onMounted(fetchData);

function handleErrors(message, error) {
    console.error(message, error);
}

const userAvatarComputed = computed(() => user.value?.avatar ? `/api/${user.value.avatar.replace(/\\/g, '/')}` : '');
const userNameComputed = computed(() => user.value?.name || 'Guest');
const userStoreToken = computed(() => userStore.token);
</script>

<template>
    <div class="user-profile container mt-3">
        <OthersInfoCard :userId="userId" :userAvatar="userAvatarComputed" :userName="userNameComputed" />

        <ul class="nav nav-tabs" id="profileTabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" id="posts-tab" data-toggle="tab" href="#posts" role="tab" aria-controls="posts"
                    aria-selected="true">Posts</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="friends-tab" data-toggle="tab" href="#friends" role="tab" aria-controls="friends"
                    aria-selected="false">Friends</a>
            </li>
        </ul>

        <div class="tab-content" id="profileTabsContent">
            <div class="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                <OthersPostCard v-if="userRecipes" :userId="userId" :userRecipes="userRecipes" :token="userStoreToken" />
            </div>

            <div class="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="friends-tab">
                <OthersFriendCard :userId="userId" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-profile {
    max-width: 800px;
    margin: 0 auto;
}

.nav-tabs {
    border-bottom: 1px solid #dee2e6;
    padding-bottom: 1px;
}

.nav-link {
    color: #fff;
}

.nav-link.active {
    background-color: rgba(255, 255, 255, 0.12);
    color: rgba(255, 59, 92, 1);
    border-bottom: 1px solid rgb(18, 18, 18);
    ;
}
</style>