import { defineStore } from 'pinia';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export const useFriendshipStore = defineStore({
    id: 'friendship',
    state: () => ({
        friendshipStatus: 'none',
        requestDirection: 'none',
        friendRequestsCount: 0
    }),
    actions: {
        setFriendshipStatus(newStatus) {
            this.friendshipStatus = newStatus;
        },
        setRequestDirection(newDirection) {
            this.requestDirection = newDirection;
        },
        async fetchFriendshipStatus(userId1, userId2) {
            try {
                const { data } = await axios.get(`${BASE_URL}/friendship/status`, { params: { userId1, userId2 } });
                this.setFriendshipStatus(data.status);
                this.setRequestDirection(data.direction);
            } catch (error) {
                console.error('Failed to fetch friendship status', error);
            }
        },

        async fetchFriendRequestsCount(userId) {
            try {
                const { data } = await axios.get(`${BASE_URL}/friendship/requests`, { params: { userId } });
                this.friendRequestsCount = data.length;
            } catch (error) {
                console.error('Failed to fetch friend requests count', error);
            }
        },
    },
});

