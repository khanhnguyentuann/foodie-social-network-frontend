<template>
    <div class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1 class="m-0">Dashboard</h1>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item active">Dashboard</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box mb-3">
                        <span class="info-box-icon bg-warning elevation-1"><i class="fas fa-users"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text">Members</span>
                            <span class="info-box-number">{{ totalUsers }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box mb-3">
                        <span class="info-box-icon bg-info elevation-1"><i class="fas fa-file-text"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text">Posts</span>
                            <span class="info-box-number">{{ totalPosts }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box mb-3">
                        <span class="info-box-icon bg-success elevation-1"><i class="fas fa-hashtag"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text">Hashtags</span>
                            <span class="info-box-number">{{ totalHashtags }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box mb-3">
                        <span class="info-box-icon bg-danger elevation-1"><i class="fas fa-carrot"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text">Ingredients</span>
                            <span class="info-box-number">{{ totalIngredients }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-sm-6 col-md-3">
                    <div class="info-box mb-3">
                        <span class="info-box-icon bg-success elevation-1"><i class="fas fa-comments"></i></span>
                        <div class="info-box-content">
                            <span class="info-box-text">Comments</span>
                            <span class="info-box-number">{{ totalComments }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const ROUTES = {
    totalUsers: `dashboard/total-users`,
    totalHashtags: `dashboard/total-hashtags`,
    totalPosts: `dashboard/total-posts`,
    totalIngredients: `dashboard/total-ingredients`,
    totalComments: `dashboard/total-comments`
};

export default {
    name: "Dashboard",
    setup() {
        const totalUsers = ref(0);
        const totalHashtags = ref(0);
        const totalPosts = ref(0);
        const totalIngredients = ref(0);
        const totalComments = ref(0);

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        const fetchTotalUsers = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.totalUsers));
                totalUsers.value = response.data.totalUsers; // Cập nhật số lượng người dùng từ phản hồi JSON
            } catch (error) {
                console.error(error);
            }
        };

        const fetchTotalHashtags = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.totalHashtags));
                totalHashtags.value = response.data.totalHashtags; // Cập nhật số lượng hashtag từ phản hồi JSON
            } catch (error) {
                console.error(error);
            }
        };

        const fetchTotalPosts = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.totalPosts));
                totalPosts.value = response.data.totalPosts;
            } catch (error) {
                console.error(error);
            }
        };

        const fetchTotalIngredients = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.totalIngredients));
                totalIngredients.value = response.data.totalIngredients;
            } catch (error) {
                console.error(error);
            }
        };

        const fetchTotalComments = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.totalComments));
                totalComments.value = response.data.totalComments;
            } catch (error) {
                console.error(error);
            }
        };

        // Gọi hàm fetchTotalUsers khi component được mounted
        onMounted(() => {
            fetchTotalUsers();
            fetchTotalHashtags();
            fetchTotalPosts();
            fetchTotalIngredients();
            fetchTotalComments();
        });

        return {
            totalUsers,
            totalHashtags,
            totalPosts,
            totalIngredients,
            totalComments,
            apiURL
        };
    }
}
</script>

<style scoped>
.content-header {
    color: #fff;
    padding: 15px .5rem;
}

.content-header .breadcrumb {
    background-color: transparent;
    line-height: 1.8rem;
    margin-bottom: 0;
    padding: 0;
}

.breadcrumb {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    padding: .75rem 1rem;
    margin-bottom: 1rem;
    list-style: none;
    background-color: #e9ecef;
    border-radius: .25rem;
}

.content {
    padding: 0 .5rem;
}

.info-box {
    background: #343a40;
    color: #fff;
    box-shadow: 0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2);
    border-radius: .25rem;
    display: flex;
    margin-bottom: 1rem;
    min-height: 80px;
    padding: .5rem;
}

.info-box .info-box-icon {
    border-radius: .25rem;
    align-items: center;
    display: flex;
    font-size: 1.875rem;
    justify-content: center;
    width: 70px;
}

.info-box .info-box-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 1.8;
    flex: 1;
    padding: 0 10px;
}

.info-box .info-box-text,
.info-box .info-box-number {
    display: block;
    overflow: hidden;
}

.info-box .info-box-text {
    text-overflow: ellipsis;
    white-space: nowrap;
}

.info-box .info-box-number {
    margin-top: .25rem;
    font-weight: 700;
}

.elevation-1 {
    box-shadow: 0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24) !important;
}
</style>