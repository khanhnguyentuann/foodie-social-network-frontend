<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="container mt-3">
        <div class="text-center mb-4">
            <h2>All Friends</h2>

            <div class="form">
                <i class="fa fa-search"></i>

                <div class="input-field second-wrap position-relative">
                    <input type="text" class="form-control form-input" placeholder="Type your friend's name!"
                        v-model="searchTerm">
                    <span v-if="searchTerm" class="clear-btn position-absolute" @click="clearSearch">
                        <i class="fas fa-times"></i>
                    </span>
                </div>
            </div>
        </div>

        <ul class="list-group mt-3">
            <p class="text-muted">{{ filteredFriends.length }} friends</p>

            <li v-for="friend in filteredFriends" :key="friend.id"
                class="list-group-item d-flex align-items-center shadow-sm rounded" @click="goToUserProfile(friend.id)">
                <img :src="'http://localhost:3000/' + friend.avatar" alt="Friend's Avatar" class="rounded-circle mr-3"
                    width="50" height="50">
                <span class="ml-3 font-weight-bold">{{ friend.name }}</span>
            </li>
        </ul>

        <div v-if="filteredFriends.length === 0" class="text-muted text-center mt-3">
            No results found
        </div>
    </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../../store/userStore';
import axios from 'axios';
import router from '@/router';

const BASE_URL = 'http://localhost:3000';

export default {
    name: 'FriendList',
    setup() {
        const userStore = useUserStore();
        const friends = ref([]);
        const searchTerm = ref('');

        const filteredFriends = computed(() => {
            return friends.value.filter(friend =>
                friend.name.toLowerCase().includes(searchTerm.value.toLowerCase())
            );
        });

        const clearSearch = () => {
            searchTerm.value = '';
        };

        onMounted(async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/friendship/friends`, { params: { userId: userStore.user.id } });
                friends.value = data;
            } catch (error) {
                console.error('Failed to fetch friend list', error);
            }
        });

        const goToUserProfile = (id) => {
            router.push('/otherprofile/' + id);
        };

        return {
            friends,
            goToUserProfile,
            searchTerm,
            filteredFriends,
            clearSearch
        };
    },
};
</script>

<style>
.list-group-item {
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    border: 1px solid rgba(0, 0, 0, .125);
    cursor: pointer;
    transition: background-color 0.3s ease;
    background-color: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.list-group-item:hover {
    background-color: #616164;
}

.click {
    cursor: pointer;
}

/* Clearserach ---------- */
.position-relative {
    position: relative;
}

.position-absolute {
    position: absolute;
}

.clear-btn {
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
}

/* search */
.form {
    width: 100%;
    position: relative;
}

.form .fa-search {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #9ca3af;
}

.form-input {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    height: 55px;
    text-indent: 33px;
    border-radius: 10px;
}

.form-input:focus {
    box-shadow: none;
    border: none;
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
}
</style>
