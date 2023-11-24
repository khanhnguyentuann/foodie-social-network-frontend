<script setup>
import { useUserStore } from '../store/userStore';
import { useFriendshipStore } from '../store/friendshipStore';
import $ from 'jquery';
import 'bootstrap-icons/font/bootstrap-icons.css';
import FriendRequestCard from '@/components/user/FriendRequestCard.vue';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';

const userStore = useUserStore();
const friendshipStore = useFriendshipStore();
const router = useRouter();
const selectedTab = ref('MyProfile');
const likeNotificationCount = ref(0);
const isNotificationVisible = ref(false);
const likeNotifications = ref([]);
const contentBox = ref(null);
const scrollBox = ref(null);
const searchTitle = ref('');

const pagecontentBox = ref(null);
const pagescrollBox = ref(null);

const formatTime = (time) => {
    moment.locale('vi');
    return moment(time).fromNow();
};

const navigateTo = (route, tabName) => {
    router.push(route);
    selectedTab.value = tabName;
    isNotificationVisible.value = false;
}

const selectTab = (tabName) => {
    selectedTab.value = tabName;
    if (tabName === 'Notification') {
        isNotificationVisible.value = !isNotificationVisible.value;
    } else {
        isNotificationVisible.value = false;
    }
};

onMounted(async () => {
    await initializeFriendshipStore();
    await initializeLikeNotifications();
    initializeTooltips();
    synchronizeScrolling();
    setScrollContentHeight();

    // Đoạn mã này để theo dõi sự thay đổi
    const observeHeightChange = (elementSelector, callback) => {
        const element = document.querySelector(elementSelector);
        if (element) {
            const observer = new MutationObserver(() => {
                callback();
            });

            observer.observe(element, {
                attributes: true, // theo dõi sự thay đổi của các thuộc tính
                childList: true,  // theo dõi sự thay đổi của các node con
                subtree: true,     // theo dõi sự thay đổi trong toàn bộ cây con của node
                characterData: true // theo dõi sự thay đổi của dữ liệu ký tự của node
            });
        }
    };

    observeHeightChange('.sidebar-menu', setScrollContentHeight);
    observeHeightChange('.page-content', setScrollContentHeight);
    $('#Profile').dropdown();
    $(document).ready(function () {
        $(".dashboard-nav-dropdown-toggle").click(function () {
            $(this).closest(".dashboard-nav-dropdown")
                .toggleClass("show")
                .find(".dashboard-nav-dropdown")
                .removeClass("show");
            $(this).parent()
                .siblings()
                .removeClass("show");
        });
        $(".menu-toggle").click(function () {
            $(".dashboard").toggleClass("dashboard-compact");
        });
    });
});

const initializeFriendshipStore = async () => {
    await friendshipStore.fetchFriendRequestsCount(userStore.user.id);
};

const initializeLikeNotifications = async () => {
    await fetchLikeNotificationsCount();
    await fetchUnreadLikeNotifications();
};

const initializeTooltips = () => {
    $('[data-toggle="tooltip"]').tooltip();
};

const synchronizeScrolling = () => {
    scrollBox.value.addEventListener('scroll', function () {
        contentBox.value.scrollTop = scrollBox.value.scrollTop;
    });

    pagescrollBox.value.addEventListener('scroll', function () {
        pagecontentBox.value.scrollTop = pagescrollBox.value.scrollTop;
    });
};

const setScrollContentHeight = () => {
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const scrollContent = document.querySelector('.scroll-content');
    if (sidebarMenu && scrollContent) {
        scrollContent.style.height = `${sidebarMenu.scrollHeight}px`;
    }

    const pageContent = document.querySelector('.page-content');
    const pagescrollContent = document.querySelector('.page-scroll-content');
    if (pageContent && pagescrollContent) {
        pagescrollContent.style.height = `${pageContent.scrollHeight}px`;
    }
};

const fetchUnreadLikeNotifications = async () => {
    try {
        const userId = userStore.user.id;
        const response = await axios.get('api/notification/unread-like-notifications', { params: { userId } });

        if (response.data) {
            likeNotifications.value = response.data.map(notification => {
                const count = notification.count;
                const lastLikeTime = notification.last_like_time;
                let message = "";
                switch (count) {
                    case 1:
                        message = `${notification.last_sender_name} đã thích công thức của bạn.`;
                        break;
                    case 2:
                        message = `${notification.last_sender_name} và ${notification.second_last_sender_name} đã thích công thức của bạn.`;
                        break;
                    case 3:
                        message = `${notification.last_sender_name}, ${notification.second_last_sender_name} và ${notification.third_last_sender_name} đã thích công thức của bạn.`;
                        break;
                    default:
                        message = `${notification.last_sender_name} và ${count - 1} người khác đã thích công thức của bạn.`;
                        break;
                }
                return {
                    ...notification,
                    message,
                    lastLikeTime
                };
            });
        }
    } catch (error) {
        console.error("Có lỗi khi tải thông báo 'like':", error);
    }
};

const fetchLikeNotificationsCount = async () => {
    try {
        const userId = userStore.user.id;
        const response = await axios.get('api/notification/like-notifications-count', { params: { userId } });

        if (response.data && response.data.count !== undefined) {
            likeNotificationCount.value = response.data.count;
        }
    } catch (error) {
        console.error("Có lỗi khi tải số thông báo 'like':", error);
    }
};


const markAllAsRead = async () => {
    try {
        await axios.post('notification/mark-all-as-read', {
            userId: userStore.user.id
        });
        likeNotificationCount.value = 0;
        likeNotifications.value = [];
    } catch (error) {
        console.error("Có lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
    }
};

const notificationStyle = computed(() => {
    if (isNotificationVisible.value) {
        return {
            height: 'auto',
            opacity: '1'
        };
    } else {
        return {
            height: '0px',
            opacity: '0'
        };
    }
});


const logout = async () => {
    userStore.clearData();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push({ name: 'Login' });
};

const redirectToTitleSearch = (tabName) => {
    router.push({ name: 'TitleSearch', query: { title: searchTitle.value } });
    selectedTab.value = tabName;
    isNotificationVisible.value = false;
};

const userName = computed(() => userStore.user?.name);

const friendRequestsCount = computed(() => friendshipStore.friendRequestsCount);

</script>

<template>
    <div class="app-layout">
        <!-- Header -->
        <header class="app-layout-navbar">
            <div class="navbar-left">
                <a class="ml-2 mr-3" href="#">
                    <img src="@/assets/logos/main_logo.png" alt="Logo" width="50" height="40">
                </a>
                <div class="form">
                    <i class="fa fa-search"></i>
                    <input type="text" class="form-control form-input text-white" placeholder="Search title..."
                        @keyup.enter="redirectToTitleSearch('TitleSearch')" v-model="searchTitle">
                    <span class="left-pan"><i class="fa fa-microphone"></i></span>
                </div>
            </div>
            <div class="navbar-center">

                <!-- Home -->
                <div @click="navigateTo('/', 'NewsFeed')"
                    :class="['navbar-center-item', selectedTab === 'NewsFeed' ? 'selected' : '']" data-toggle="tooltip"
                    data-placement="bottom" title="Home">
                    <i class="bi bi-house-fill"></i>
                </div>

                <!-- Create Post -->
                <div @click="navigateTo('/create-recipe', 'CreatePost')"
                    :class="['navbar-center-item', selectedTab === 'CreatePost' ? 'selected' : '']" data-toggle="tooltip"
                    data-placement="bottom" title="Create Post">
                    <i class="bi bi-patch-plus-fill"></i>
                </div>

                <!-- Friend Requests -->
                <div @click="navigateTo('/friends/requests', 'FriendRequest')"
                    :class="['navbar-center-item', selectedTab === 'FriendRequest' ? 'selected' : '', 'position-relative']"
                    data-toggle="tooltip" data-placement="bottom" title="Friend Requests">
                    <i class="bi bi-person-plus-fill"></i>
                    <span v-if="friendRequestsCount > 0"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style="top: 17%; right: 10%;">
                        {{ friendRequestsCount }}
                    </span>
                </div>

                <!-- Messages -->
                <div @click="navigateTo('/conversations', 'Conversations')"
                    :class="['navbar-center-item', selectedTab === 'Conversations' ? 'selected' : '', 'position-relative']"
                    data-toggle="tooltip" data-placement="bottom" title="Conversations">
                    <i class="bi bi-wechat"></i>
                    <span
                        class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
                        style="top: 17%; right: 10%;">
                    </span>
                </div>
            </div>
            <div class="navbar-right">
                <div @click="selectTab('Notification')"
                    :class="['navbar-center-item', selectedTab === 'Notification' ? 'selected' : '', 'position-relative']"
                    data-toggle="tooltip" data-placement="bottom" title="Notifications" id="bell">
                    <i class="bi bi-bell-fill"></i>
                    <span v-if="likeNotificationCount > 0"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style="top: 17%; right: 10%;">
                        {{ likeNotificationCount }}
                    </span>
                </div>

                <div :style="notificationStyle" class="notifications" id="box">
                    <h2>Notifications</h2>
                    <div type="button" class="btn btn-secondary" style="width:90%; margin-left: 5%;" @click="markAllAsRead">
                        <i class="bi bi-check2-all"></i> Mark All as Read
                    </div>
                    <div v-if="likeNotifications.length > 0">
                        <div v-for="notification in likeNotifications" :key="notification.id" class="notifications-item">
                            <img :src="notification.last_sender_avatar ? '/api' + notification.last_sender_avatar : ''"
                                alt="User Avatar">
                            <div class="text">
                                <p>{{ notification.message }}</p>
                                <small>{{ formatTime(notification.last_like_time) }}</small>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="no-notifications">
                            <p class="text-center">No unread notifications.</p>
                        </div>
                    </div>
                </div>

                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="Profile" role="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        <img :src="userStore.user?.avatar ? '/api' + userStore.user.avatar : ''" alt="User Avatar"
                            width="40" height="40" class="rounded-circle">

                    </a>

                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="Profile">
                        <li class="hover-li" @click="navigateTo('/myprofile', 'MyProfile')">
                            <a type="button" class="dropdown-item">
                                <img :src="userStore.user?.avatar ? '/api' + userStore.user.avatar : ''" alt="User Avatar"
                                    width="32" height="32" class="rounded-circle">
                                <span class="ml-2">{{ userName }}</span>
                            </a>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-cogs mr-3"></i> Settings
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-question-circle mr-3"></i> Help & Support
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-desktop mr-3"></i> Display & Features
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">
                                <i class="fas fa-comment-dots mr-3"></i> Provide Feedback
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" @click.prevent="logout">
                                <i class="fas fa-sign-out-alt mr-3"></i> Log Out
                            </a>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li class="container">
                            <p class="mb-0 text-muted small">Privacy . Terms . Advertising . Ad Choices . Cookies . Learn
                                more.</p>
                        </li>

                    </div>
                </div>
            </div>
        </header>
        <!-- Body -->
        <div class="app-layout-content">

            <div class="app-layout-sidebar col-3 col-sm-3">
                <div class="sidebar-menu" ref="contentBox">
                    <!-- User Profile -->
                    <div @click="navigateTo('/myprofile', 'MyProfile')"
                        :class="['sidebar-item', selectedTab === 'MyProfile' ? 'selected' : '']">
                        <img :src="userStore.user?.avatar ? '/api' + userStore.user.avatar : ''" alt="User Avatar"
                            width="40" height="40" class="rounded-circle mr-2">
                        <div>{{ userName }}</div>
                    </div>

                    <!-- Friends -->
                    <div @click="navigateTo('/friends', 'Friends')"
                        :class="['sidebar-item', selectedTab === 'Friends' ? 'selected' : '']">
                        <i class="bi bi-person-check-fill mr-2"></i>
                        <div>Friends</div>
                    </div>

                    <!-- Favorites -->
                    <div @click="navigateTo('/favorites', 'Favorites')"
                        :class="['sidebar-item', selectedTab === 'Favorites' ? 'selected' : '']">
                        <i class="bi bi-bookmarks-fill mr-2"></i>
                        <div>Favorites</div>
                    </div>

                    <!-- News Feed -->
                    <div @click="navigateTo('/', 'NewsFeed')"
                        :class="['sidebar-item', selectedTab === 'NewsFeed' ? 'selected' : '']">
                        <i class="bi bi-newspaper mr-2"></i>
                        <div>News Feed</div>
                    </div>

                    <div class='dashboard-nav-dropdown'>
                        <div class="dashboard-nav-dropdown-toggle">
                            <i class="bi bi-search mr-2"></i>
                            <div>Search</div>
                        </div>
                        <div class='dashboard-nav-dropdown-menu'>
                            <div @click="navigateTo('/tagsearch', 'TagSearch')"
                                :class="['dashboard-nav-dropdown-item', selectedTab === 'TagSearch' ? 'selected' : '']">
                                Search by hashtag
                            </div>
                            <div @click="navigateTo('/titlesearch', 'TitleSearch')"
                                :class="['dashboard-nav-dropdown-item', selectedTab === 'TitleSearch' ? 'selected' : '']">
                                Search by title
                            </div>
                            <div @click="navigateTo('/advancedsearch', 'AdvancedSearch')"
                                :class="['dashboard-nav-dropdown-item', selectedTab === 'AdvancedSearch' ? 'selected' : '']">
                                Advanced search
                            </div>
                        </div>
                    </div>

                    <footer class="footer mt-2">
                        <div class="container">
                            <p class="mb-0 text-muted small">Privacy . Terms . Ads . Ad Choices . Cookies . More.
                            </p>
                        </div>
                    </footer>
                </div>
                <div class="scroll-box" ref="scrollBox">
                    <div class="scroll-content"></div>
                </div>
            </div>

            <div class="app-layout-page col-9 col-sm-9 col-lg-6">
                <div class="page-content" ref="pagecontentBox">
                    <router-view />
                </div>
                <div class="page-scroll-box" ref="pagescrollBox">
                    <div class="page-scroll-content"></div>
                </div>
            </div>

            <div cclass="app-layout-right-sidebar col-3 d-none d-lg-block col-lg-3">
                <div class="rightsidebar-content" ref="rightsidebarcontentBox">
                    <FriendRequestCard />
                    <hr class="my-4 hr-thick">
                </div>
            </div>
        </div>
    </div>
</template>

<style src="../assets/Userlayout.css" scoped></style>
