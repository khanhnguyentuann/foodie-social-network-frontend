<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/attributes-order -->
<template>
    <div class="row mb-4 profile-header">
        <div class="col-md-4 text-center">
            <img :src="userAvatar" alt="User Avatar" width="150" height="150" class="rounded-circle">
        </div>
        <div class="col-md-8 d-flex flex-column justify-content-center">
            <h2>{{ userName }}</h2>
            <div class="text-left">
                <button class="btn btn-light mr-2" v-if="friendshipStatus === 'none'" @click="sendFriendRequest">
                    Add Friend
                </button>
                <button class="btn btn-light mr-2" v-if="friendshipStatus === 'pending' && requestDirection === 'outgoing'"
                    @click="cancelRequest">
                    Cancel Request
                </button>
                <button class="btn btn-light mr-2" @click="acceptRequest"
                    v-if="friendshipStatus === 'pending' && requestDirection === 'incoming'">
                    Accept Request
                </button>
                <button class="btn btn-light mr-2" @click="cancelRequest"
                    v-if="friendshipStatus === 'pending' && requestDirection === 'incoming'">
                    Decline Request
                </button>
                <button class="btn btn-light dropdown-toggle mr-2" v-if="friendshipStatus === 'accepted'"
                    :key="friendshipStatus" id="friendDropdown" data-toggle="dropdown">
                    Friend
                </button>

                <div class="dropdown-menu">
                    <button class="dropdown-item" @click="unfriend">Unfriend</button>
                </div>
                <button class="btn btn-light mr-2" @click="navigateToChat">
                    Message
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useUserStore } from '../../store/userStore';
import { useFriendshipStore } from '../../store/friendshipStore';
import axios from 'axios';
import { useRouter } from 'vue-router';

const ROUTES = {
    conversationCheck: `conversation/conversation-check`,
    createConversation: `conversation/create-conversation`,
    sendFriendRequest: `friendship/send-request`,
    acceptRequest: `friendship/accept-request`,
    cancelRequest: `friendship/cancel-request`,
    unfriend: `friendship/unfriend`
};

export default {
    props: {
        userId: {
            type: String,
            required: true,
        },
        userAvatar: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const userStore = useUserStore();
        const friendshipStore = useFriendshipStore();
        const router = useRouter();

        const friendshipStatus = computed(() => friendshipStore.friendshipStatus);
        const requestDirection = computed(() => friendshipStore.requestDirection);

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        async function navigateToChat() {
            try {
                // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
                let response = await axios.get(apiURL(ROUTES.conversationCheck), {
                    params: { user1_id: userStore.user.id, user2_id: props.userId }
                });

                let conversationId = response.data ? response.data.id : null;

                // Nếu chưa tồn tại, tạo cuộc trò chuyện mới
                if (!conversationId) {
                    response = await axios.post(apiURL(ROUTES.createConversation), {
                        user1_id: userStore.user.id,
                        user2_id: props.userId
                    });
                    conversationId = response.data.id;
                }

                // Điều hướng đến Conversations.vue
                router.push({
                    name: 'Conversations',
                });
            } catch (error) {
                handleErrors('Failed to create or find conversation', error);
            }
        }

        async function sendFriendRequest() {
            try {
                await axios.post(apiURL(ROUTES.sendFriendRequest), { userId1: userStore.user.id, userId2: props.userId });
                friendshipStore.setFriendshipStatus('pending');
                friendshipStore.setRequestDirection('outgoing');
            } catch (error) {
                handleErrors('Failed to send friend request', error);
            }
        }

        async function acceptRequest() {
            try {
                await axios.post(apiURL(ROUTES.acceptRequest), { userId1: userStore.user.id, userId2: props.userId });
                friendshipStore.setFriendshipStatus('accepted');
                alert('Cả hai đã trở thành bạn bè!');
            } catch (error) {
                handleErrors('Failed to accept friend request', error);
            }
        }

        async function cancelRequest() {
            try {
                await axios.delete(apiURL(ROUTES.cancelRequest), { params: { userId1: userStore.user.id, userId2: props.userId } });
                friendshipStore.setFriendshipStatus('none');
            } catch (error) {
                handleErrors('Failed to cancel friend request', error);
            }
        }

        async function unfriend() {
            try {
                if (window.confirm('Bạn có chắc chắn muốn hủy kết bạn không?')) {
                    await axios.delete(apiURL(ROUTES.unfriend), {
                        params: { userId1: userStore.user.id, userId2: props.userId }
                    });

                    friendshipStore.setFriendshipStatus('none');
                    alert('Đã hủy kết bạn');
                }
            } catch (error) {
                handleErrors('Failed to unfriend', error);
            }
        }

        function handleErrors(message, error) {
            console.error(message, error);
        }

        return {
            friendshipStatus,
            apiURL,
            requestDirection,
            sendFriendRequest,
            acceptRequest,
            cancelRequest,
            unfriend,
            navigateToChat
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
