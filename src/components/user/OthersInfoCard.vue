<script setup>
import { computed } from 'vue';
import { useUserStore } from '../../store/userStore';
import { useFriendshipStore } from '../../store/friendshipStore';
import axios from 'axios';
import { useRouter } from 'vue-router';

const props = defineProps({
    userId: { type: String, required: true },
    userAvatar: { type: String, required: true },
    userName: { type: String, required: true }
});

const userStore = useUserStore();
const friendshipStore = useFriendshipStore();
const router = useRouter();

const friendshipStatus = computed(() => friendshipStore.friendshipStatus);
const requestDirection = computed(() => friendshipStore.requestDirection);

const navigateToChat = async () => {
    try {
        let response = await axios.get(`/api/conversation/conversation-check`, {
            params: { user1_id: userStore.user.id, user2_id: props.userId }
        });

        let conversationId = response.data ? response.data.id : null;

        if (!conversationId) {
            response = await axios.post(`/api/conversation/create-conversation`, {
                user1_id: userStore.user.id,
                user2_id: props.userId
            });
            conversationId = response.data.id;
        }

        router.push({ name: 'Conversations' });
    } catch (error) {
        handleErrors('Failed to create or find conversation', error);
    }
};

const sendFriendRequest = async () => {
    try {
        await axios.post(`/api/friendship/send-request`, { userId1: userStore.user.id, userId2: props.userId });
        friendshipStore.setFriendshipStatus('pending');
        friendshipStore.setRequestDirection('outgoing');
    } catch (error) {
        handleErrors('Failed to send friend request', error);
    }
};

const acceptRequest = async () => {
    try {
        await axios.post(`/api/friendship/accept-request`, { userId1: userStore.user.id, userId2: props.userId });
        friendshipStore.setFriendshipStatus('accepted');
        alert('Cả hai đã trở thành bạn bè!');
    } catch (error) {
        handleErrors('Failed to accept friend request', error);
    }
};

const cancelRequest = async () => {
    try {
        await axios.delete(`/api/friendship/cancel-request`, { params: { userId1: userStore.user.id, userId2: props.userId } });
        friendshipStore.setFriendshipStatus('none');
    } catch (error) {
        handleErrors('Failed to cancel friend request', error);
    }
};

const unfriend = async () => {
    try {
        const userConfirmed = confirm("Are you sure you want to unfriend?");

        if (userConfirmed) {
            await axios.delete(`/api/friendship/unfriend`, { params: { userId1: userStore.user.id, userId2: props.userId } });
            friendshipStore.setFriendshipStatus('none');
            alert('Friendship has been ended');
        }
    } catch (error) {
        handleErrors('Failed to unfriend', error);
    }
};

const handleErrors = (message, error) => console.error(message, error);
</script>

<template>
    <div class="card mb-4">
        <img class="card-img-top" src="https://i.imgur.com/K7A78We.jpg" alt="Card image cap">
        <div class="card-body little-profile text-center">
            <div class="pro-img"><img :src="userAvatar" alt="User Avatar"></div>
            <h3 class="mb-2">{{ userName }}</h3>
            <div class="waves-effect waves-dark text-center">
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

<style scoped>
.card-img-top {
    height: 240px;
}

.mb-2 {
    color: #455a64;
}

.card {
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

.btn-rounded {
    padding: 12px 35px;
    font-size: 16px
}

.btn-rounded {
    border-radius: 60px;
    padding: 7px 18px
}

button {
    background-color: #7460ee;
    color: #fff;
}
</style>
