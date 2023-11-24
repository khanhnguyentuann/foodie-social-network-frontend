<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/attribute-hyphenation -->
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
                <OthersPostCard :userId="userId" :userRecipes="userRecipes" :token="userStoreToken" />
            </div>

            <div class="tab-pane fade" id="friends" role="tabpanel" aria-labelledby="friends-tab">
                <OthersFriendCard :userId="userId" />
            </div>
        </div>
    </div>
</template>

<script>
import OthersInfoCard from './OthersInfoCard.vue';
import OthersFriendCard from './OthersFriendCard.vue';
import OthersPostCard from './OthersPostCard.vue';
import { useUserStore } from '../../store/userStore';
import { useFriendshipStore } from '../../store/friendshipStore';
import { computed, ref, onMounted, watch } from 'vue';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export default {
    name: 'OtherProfile',
    components: {
        OthersInfoCard,
        OthersFriendCard,
        OthersPostCard
    },
    props: {
        userId: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const userStore = useUserStore();
        const friendshipStore = useFriendshipStore();
        const userRecipes = ref([]);
        const user = ref(null);

        const fetchData = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/otherprofile/${props.userId}`);
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

        return {
            userAvatarComputed: computed(() => user.value && user.value.avatar ? `${BASE_URL}/${user.value.avatar.replace(/\\/g, '/')}` : ''),
            userNameComputed: computed(() => user?.value?.name || 'Guest'),
            userRecipes,
            userStoreToken: computed(() => userStore.token),
        };
    },
};
</script>

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