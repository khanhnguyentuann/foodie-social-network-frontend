<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="mt-3 card">
        <div class="card-header msg_head">
            <div class="d-flex bd-highlight">
                <router-link to="/conversations">
                    <i class="bi bi-reply-fill pr-3" style="font-size: 24px; color: grey;"></i>
                </router-link>
                <div class="img_cont">
                    <img :src="apiURL(user?.avatar)" class="rounded-circle user_img">
                    <span class="online_icon"></span>
                </div>
                <div class="user_info">
                    <span>Chat with {{ user?.name }}</span>
                    <!-- <p>{{ user?.messagesCount }} Messages</p> -->
                    <!-- <p>1767 Messages</p> -->
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

        <div class="card-body msg_card_body">
            <div v-for="message in messages" :key="message.id" class="d-flex mb-4"
                :class="{ 'justify-content-start': message.sender_id !== userStore.user.id, 'justify-content-end': message.sender_id === userStore.user.id }">

                <div v-if="message.sender_id !== userStore.user.id" class="img_cont_msg">
                    <img :src="apiURL(user?.avatar)" class="rounded-circle user_img_msg">
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
                    <span class="input-group-text attach_btn"><i class="fas fa-paperclip"></i></span>
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

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useUserStore } from '../../store/userStore';

const ROUTES = {
    getUserChatInfo: id => `userchat/${id}`,
    getMessages: id => `userchat/conversations/${id}/messages`
};

export default {
    name: "ChatBox",
    props: {
        otherUserId: {
            type: String,
            required: true
        },
        conversationId: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const userStore = useUserStore();
        const user = ref(null);
        const messageText = ref(''); // Lấy giá trị từ textarea
        const messages = ref([]);
        const otherUserId = Number(props.otherUserId);
        const conversationId = Number(props.conversationId);

        // Kết nối đến Socket.io server
        const socket = io('http://localhost:3000');

        // Hàm để gửi tin nhắn mới
        const sendMessage = () => {
            const messageContent = messageText.value.trim();
            const senderId = userStore.user.id;

            if (senderId && conversationId && messageContent) {
                const newMessage = {
                    content: messageContent,
                    sender_id: senderId,
                    sent_at: new Date().toISOString(),
                    id: Date.now()
                };
                messages.value.push(newMessage);
                socket.emit('chat message', {
                    content: messageContent,
                    senderId: senderId,
                    conversationId: conversationId
                });
                messageText.value = '';
            } else {
                console.error("Thông tin người dùng hoặc cuộc trò chuyện bị thiếu hoặc nội dung tin nhắn trống.");
            }
        };

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        // Format thời gian
        const formatTime = (isoString) => {
            const date = new Date(isoString);
            const now = new Date();
            let formattedTime;

            // So sánh ngày hiện tại với ngày của tin nhắn để xác định format
            if (date.toDateString() === now.toDateString()) {
                // Nếu là cùng ngày thì chỉ hiển thị giờ và phút
                formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            } else if (date.getFullYear() === now.getFullYear()) {
                // Nếu là cùng năm thì hiển thị ngày và giờ
                formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
            } else {
                // Nếu là các năm khác nhau thì hiển thị ngày, tháng và năm
                formattedTime = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
            }

            return formattedTime;
        };

        const fetchUserChatDetails = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.getUserChatInfo(otherUserId)));
                user.value = response.data;
            } catch (error) {
                console.error("Failed to fetch user details", error);
            }
        };

        const fetchMessages = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.getMessages(conversationId)));
                messages.value = response.data;
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        onMounted(async () => {
            await fetchUserChatDetails();
            await fetchMessages();
            socket.emit('join conversation', conversationId);

            // Lắng nghe tin nhắn mới từ server qua socket
            socket.on('chat message', (newMessage) => {
                // Kiểm tra xem tin nhắn mới có thuộc cuộc trò chuyện hiện tại không
                if (newMessage.conversation_id === conversationId) {
                    // Cập nhật danh sách tin nhắn
                    messages.value.push(newMessage);
                }
            });
        });


        return {
            user,
            apiURL,
            sendMessage,
            messageText,
            messages,
            userStore,
            formatTime
        };
    }
}
</script>

<style scoped>
.card {
    height: 630px;
    border-radius: 15px !important;
    background-color: rgba(255, 255, 255, 0.12);
}

.contacts_body {
    padding: 0.75rem 0 !important;
    overflow-y: auto;
    white-space: nowrap;
}

.msg_card_body {
    overflow-y: auto;
}

.card-header {
    border-radius: 15px 15px 0 0 !important;
    border-bottom: 0 !important;
}

.card-footer {
    border-radius: 0 0 15px 15px !important;
    border-top: 0 !important;
}

.container {
    align-content: center;
}

.search {
    border-radius: 15px 0 0 15px !important;
    background-color: rgba(0, 0, 0, 0.3) !important;
    border: 0 !important;
    color: white !important;
}

.search:focus {
    box-shadow: none !important;
    outline: 0px !important;
}

.type_msg {
    background-color: rgba(0, 0, 0, 0.3) !important;
    border: 0 !important;
    color: white !important;
    height: 60px !important;
    overflow-y: auto;
}

.type_msg:focus {
    box-shadow: none !important;
    outline: 0px !important;
}

.attach_btn {
    border-radius: 15px 0 0 15px !important;
    background-color: rgba(0, 0, 0, 0.3) !important;
    border: 0 !important;
    color: white !important;
    cursor: pointer;
}

.send_btn {
    border-radius: 0 15px 15px 0 !important;
    background-color: rgba(0, 0, 0, 0.3) !important;
    border: 0 !important;
    color: white !important;
    cursor: pointer;
}

.search_btn {
    border-radius: 0 15px 15px 0 !important;
    background-color: rgba(0, 0, 0, 0.3) !important;
    border: 0 !important;
    color: white !important;
    cursor: pointer;
}

.contacts {
    list-style: none;
    padding: 0;
}

.contacts li {
    width: 100% !important;
    padding: 5px 10px;
    margin-bottom: 15px !important;
}

.active {
    background-color: rgba(0, 0, 0, 0.3);
}

.user_img {
    height: 70px;
    width: 70px;
    border: 1.5px solid #f5f6fa;

}

.user_img_msg {
    height: 40px;
    width: 40px;
    border: 1.5px solid #f5f6fa;

}

.img_cont {
    position: relative;
    height: 70px;
    width: 70px;
}

.img_cont_msg {
    height: 40px;
    width: 40px;
}

.online_icon {
    position: absolute;
    height: 15px;
    width: 15px;
    background-color: #4cd137;
    border-radius: 50%;
    bottom: 0.2em;
    right: 0.4em;
    border: 1.5px solid white;
}

.offline {
    background-color: #c23616 !important;
}

.user_info {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 15px;
}

.user_info span {
    font-size: 20px;
    color: white;
}

.user_info p {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.6);
}

.video_cam {
    margin-left: 50px;
    margin-top: 5px;
}

.video_cam span {
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-right: 20px;
}

.msg_cotainer {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 10px;
    border-radius: 25px;
    background-color: #82ccdd;
    padding: 10px;
    position: relative;
}

.msg_cotainer_send {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 10px;
    border-radius: 25px;
    background-color: #78e08f;
    padding: 10px;
    position: relative;
}

.msg_time {
    position: absolute;
    left: 0;
    bottom: -15px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
}

.msg_time_send {
    position: absolute;
    right: 0;
    bottom: -15px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 10px;
}

.msg_head {
    position: relative;
}

#action_menu_btn {
    position: absolute;
    right: 10px;
    top: 10px;
    color: white;
    cursor: pointer;
    font-size: 20px;
}

.action_menu {
    z-index: 1;
    position: absolute;
    padding: 15px 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 15px;
    top: 30px;
    right: 15px;
    display: none;
}

.action_menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.action_menu ul li {
    width: 100%;
    padding: 10px 15px;
    margin-bottom: 5px;
}

.action_menu ul li i {
    padding-right: 10px;

}

.action_menu ul li:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
}

@media(max-width: 576px) {
    .contacts_card {
        margin-bottom: 15px !important;
    }
}
</style>