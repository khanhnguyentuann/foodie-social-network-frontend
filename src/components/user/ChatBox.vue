<script setup>
import { ref, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'vue-router';

const props = defineProps({
    otherUserId: String,
    conversationId: String,
});

const router = useRouter();
const userStore = useUserStore();
const user = ref(null);
const messageText = ref('');
const messages = ref([]);
const otherUserId = Number(props.otherUserId);
const conversationId = Number(props.conversationId);
const socket = io('http://localhost:3000');
const messagesContainer = ref(null);
const messagesCount = ref(0);

const goBack = () => router.go(-1);

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const sendMessage = () => {
    const messageContent = messageText.value.trim();
    const senderId = userStore.user.id;

    if (senderId && conversationId && messageContent) {
        // send event from client to server
        socket.emit('chat message', {
            content: messageContent,
            senderId: senderId,
            conversationId: conversationId
        });
        messageText.value = '';
    } else {
        console.error('Thông tin người dùng hoặc cuộc trò chuyện bị thiếu hoặc nội dung tin nhắn trống.');
    }
};

const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    let formattedTime;

    if (date.toDateString() === now.toDateString()) {
        formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (date.getFullYear() === now.getFullYear()) {
        formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            + ', ' + date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
    } else {
        formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
            + ', ' + date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    return formattedTime;
};

const fetchUserChatDetails = async () => {
    try {
        const response = await axios.get(`/api/userchat/${otherUserId}`);
        user.value = response.data;
    } catch (error) {
        console.error('Failed to fetch user details', error);
    }
};

const fetchMessages = async () => {
    try {
        const response = await axios.get(`/api/userchat/conversations/${conversationId}/messages`);
        messages.value = response.data.messages;
        messagesCount.value = response.data.messagesCount;
        scrollToBottom();
    } catch (error) {
        console.error('Failed to fetch messages:', error);
    }
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        // const formData = new FormData();
        // formData.append('image', file);

        // try {
        //     await axios.post('/api/uploadImage', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        // } catch (error) {
        //     console.error('Error uploading image:', error);
        // }
    }
};

onMounted(async () => {
    await fetchUserChatDetails();
    await fetchMessages();
    socket.emit('join conversation', conversationId);

    socket.on('chat message', (newMessage) => {
        if (newMessage.senderId !== userStore.user.id) {
            messages.value.push(newMessage);
            scrollToBottom();
        }
    });
});

</script>

<template>
    <div class="mt-3 card">
        <div class="card-header msg_head">
            <div class="d-flex bd-highlight">
                <div @click="goBack">
                    <i class="bi bi-reply-fill pr-3" style="font-size: 24px; color: grey;"></i>
                </div>
                <div class="img_cont">
                    <img :src="user?.avatar ? '/api/' + user.avatar : ''" class="rounded-circle user_img">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span>Chat with {{ user?.name }}</span>
                    <p>{{ messagesCount }} Messages</p>
                </div>
                <div class="video_cam">
                    <span><i class="fas fa-video"></i></span>
                    <span><i class="fas fa-phone"></i></span>
                </div>
            </div>
            <span id="action_menu_btn"><i class="fas fa-ellipsis-v"></i></span>
            <div class="action_menu">
                <ul>
                    <li><i class="fas fa-user-circle"></i> View profile</li>
                    <li><i class="fas fa-users"></i> Add to close friends</li>
                    <li><i class="fas fa-plus"></i> Add to group</li>
                    <li><i class="fas fa-ban"></i> Block</li>
                </ul>
            </div>
        </div>

        <div ref="messagesContainer" class="card-body msg_card_body">
            <div v-for="message in messages" :key="message.id" class="d-flex mb-4"
                :class="{ 'justify-content-start': message.sender_id !== userStore.user.id, 'justify-content-end': message.sender_id === userStore.user.id }">

                <div v-if="message.sender_id !== userStore.user.id" class="img_cont_msg">
                    <img :src="user?.avatar ? '/api/' + user.avatar : ''" class="rounded-circle user_img_msg">
                </div>
                <div
                    :class="{ 'msg_cotainer': message.sender_id !== userStore.user.id, 'msg_cotainer_send': message.sender_id === userStore.user.id }">
                    {{ message.content }}
                    <span
                        :class="{ 'msg_time': message.sender_id !== userStore.user.id, 'msg_time_send': message.sender_id === userStore.user.id }">
                        {{ formatTime(message.sent_at) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="card-footer">
            <div class="input-group">
                <div class="input-group-append">
                    <label class="input-group-text attach_btn">
                        <i class="fas fa-paperclip"></i>
                        <input type="file" @change="handleFileUpload" hidden>
                    </label>
                </div>

                <textarea v-model="messageText" class="form-control type_msg" placeholder="Type your message..."></textarea>

                <div class="input-group-append">
                    <span class="input-group-text send_btn" @click="sendMessage"><i
                            class="fas fa-location-arrow"></i></span>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="../../assets/Chatbox.css" scoped></style>