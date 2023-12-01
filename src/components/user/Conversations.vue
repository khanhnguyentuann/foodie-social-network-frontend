<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../store/userStore';

const conversations = ref([]);
const userStore = useUserStore();
const router = useRouter();

const openConversation = (conversation) => {
    router.push({
        name: 'ChatBox',
        params: {
            otherUserId: conversation.otherUserId,
            conversationId: conversation.id
        }
    });
};

const fetchConversations = async () => {
    try {
        const userId = userStore.user.id;
        const response = await axios.get(`/api/conversation/get-user-conversations/${userId}`);
        conversations.value = response.data;
    } catch (error) {
        console.error("Failed to fetch conversations", error);
    }
};

onMounted(fetchConversations);
</script>

<template>
    <div class="card mb-sm-3 mb-md-0 contacts_card mt-3">
        <div class="card-header">
            <div class="input-group form">
                <!-- <input type="text" placeholder="Search..." name="" class="form-control search"> -->
                <input type="text" class="form-control search" placeholder="Search..." v-model="searchTerm">
                <div class="input-group-prepend">
                    <span class="input-group-text search_btn"><i class="fas fa-search"></i></span>
                </div>
            </div>
        </div>
        <div class="card-body contacts_body">
            <ul class="contacts">
                <li v-for="conversation in conversations" :key="conversation.id" @click="openConversation(conversation)">
                    <div class="d-flex bd-highlight">
                        <div class="img_cont">
                            <img :src="conversation?.otherUserAvatar ? '/api/' + conversation.otherUserAvatar : ''"
                                class="rounded-circle user_img">
                            <span class="online_icon"></span>
                            <!-- <span class="online_icon offline"></span> -->
                        </div>
                        <div class="user_info">
                            <span>{{ conversation.otherUserName }}</span>
                            <p>{{ conversation.latestMessage }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="card-footer"></div>
    </div>
</template>

<style src="../../assets/Conversation.css" scoped></style>