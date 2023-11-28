<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/userStore';
import { useFriendshipStore } from '../../store/friendshipStore';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import moment from 'moment';

const userStore = useUserStore();
const friendshipStore = useFriendshipStore();
const friendRequests = ref([]);
const router = useRouter();

const goToOtherProfile = (userId) => {
    router.push({ name: 'OtherProfile', params: { userId } });
};

const loadFriendRequests = async () => {
    try {
        const response = await axios.get(`/api/friendship/requests`, { params: { userId: userStore.user.id } });

        friendRequests.value = response.data.slice(0, 1).map(request => ({
            ...request,
            timeAgo: getTimeAgo(request.created_at),
        }));
    } catch (error) {
        console.error('Failed to fetch friend requests', error);
    }
};

const acceptRequest = async (userId) => {
    try {
        await axios.post(`/api/friendship/accept-request`, { userId1: userStore.user.id, userId2: userId });
        friendshipStore.setFriendshipStatus('accepted');
        alert('Cả hai đã trở thành bạn bè!');
        friendRequests.value = friendRequests.value.filter(request => request.user_id1 !== userId);
    } catch (error) {
        console.error('Failed to accept friend request', error);
    }
};

const declineRequest = async (userId) => {
    try {
        await axios.delete(`/api/friendship/cancel-request`, { params: { userId1: userStore.user.id, userId2: userId } });
        friendshipStore.setFriendshipStatus('none');
        alert('Lời mời kết bạn đã được hủy');
        friendRequests.value = friendRequests.value.filter(request => request.user_id1 !== userId);
        await loadFriendRequests();
    } catch (error) {
        console.error('Failed to cancel friend request', error);
    }
};

const getTimeAgo = (created_at) => {
    const now = moment();
    const createdAtMoment = moment(created_at);
    const diffInSeconds = now.diff(createdAtMoment, 'seconds');

    if (diffInSeconds < 60) {
        return diffInSeconds + ' giây';
    }
    const diffInMinutes = now.diff(createdAtMoment, 'minutes');
    if (diffInMinutes < 60) {
        return diffInMinutes + ' phút';
    }
    const diffInHours = now.diff(createdAtMoment, 'hours');
    if (diffInHours < 24) {
        return diffInHours + ' giờ';
    }
    const diffInDays = now.diff(createdAtMoment, 'days');
    return diffInDays + ' ngày';
};

const goToFriendRequest = () => {
    router.push({ name: 'FriendRequest' });
};

watch(() => userStore.user.id, () => {
    // When userStore.user.id changes, load friend requests
    loadFriendRequests();
});

// Load friend requests when component is mounted
onMounted(() => {
    loadFriendRequests();
});

</script>

<template>
    <div class="mt-3">
        <div class="row">
            <div class="col-8">
                <h4>Friend Requests</h4>
            </div>
            <div class="click col-4 text-right" @click="goToFriendRequest()" style="z-index: 10;">
                <p>See All</p>
            </div>
        </div>

        <ul class=" list-group mt-2">
            <li v-if="friendRequests.length === 0" class="mt-3 mb-3 d-flex justify-content-center">
                You have no friend requests!
            </li>
            <li v-else v-for="request in friendRequests" :key="request.user_id1" class="list-group-item d-flex row"
                style="background-color: rgba(255, 255, 255, 0.12);">
                <div class="col-4">
                    <img :src="request?.avatar ? '/api' + request.avatar : ''" alt="User Avatar" class="rounded-circle"
                        style="width: 100%; height: auto; cursor: pointer;" @click="goToOtherProfile(request.user_id1)">
                </div>

                <div class="col-8">
                    <div class="row">
                        <div class="font-weight-bold col-6">
                            {{ request.name }}
                        </div>
                        <div class="col-6">
                            <span class="text-muted">{{ request.timeAgo }}</span>
                        </div>
                    </div>
                    <div class="row">
                        <div @click="acceptRequest(request.user_id1)" class="btn btn-primary col-7 mr-1">Accept</div>
                        <div @click="declineRequest(request.user_id1)" class="btn btn-secondary col-4">Decline</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.click {
    cursor: pointer;
}
</style>