<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div v-if="recipe" class="recipe-card card mt-3 p-3" style="background-color: rgba(255, 255, 255, 0.12);">

        <!-- Post Header -->
        <div class="d-flex align-items-center mb-1">
            <i class="bi bi-reply-fill click" style="font-size: 24px; color: grey;" @click="goBack"></i>
            <img :src="apiURL(recipe.user.avatar)" alt="User Avatar" class="ml-3 click user-avatar"
                @click="goToUserProfile(recipe.user_id)">

            <span class="click ml-3 font-weight-bold" @click="goToUserProfile(recipe.user_id)">
                {{ recipe.user.name }}
            </span>

            <span class="ml-2 text-muted">{{ formatTime(recipe.created_at) }}</span>
        </div>

        <hr>

        <!-- Post Body -->
        <div class="card-body p-0">
            <h5 class="card-title mb-3 text-center">{{ recipe.name }}</h5>
            <div class="row">
                <p class="col-6 font-weight-bold">
                    Difficulty:
                    <i v-for="n in difficultyToStars(recipe.difficulty)" :key="n" class="fas fa-star"></i>
                </p>

                <p class="col-6 text-right font-weight-bold">
                    <i class="fas fa-users mr-2"></i>
                    Serves: {{ recipe.servingFor }} people
                </p>
            </div>

            <p class="font-weight-bold">
                <i class="fas fa-utensils mr-2"></i>
                Main Ingredients:
            </p>
            <div class="row ml-2 mb-3">
                <div class="col-4 font-italic" v-for="ingredient in getMainIngredientsArray(recipe.ingredients)"
                    :key="ingredient.name">
                    > {{ ingredient.name }}: {{ ingredient.amount }}
                </div>
            </div>

            <!-- Carousel displaying recipe images -->
            <div v-if="recipe && recipe.images && recipe.images.length" class="carousel slide" data-ride="carousel"
                id="recipe-carousel">
                <ol class="carousel-indicators">
                    <li v-for="(image, index) in recipe.images" :key="index" data-target="#recipe-carousel"
                        :data-slide-to="index" :class="{ 'active': index === 0 }"></li>
                </ol>
                <div class="carousel-inner">
                    <div v-for="(image, index) in recipe.images" :key="index"
                        :class="{ 'carousel-item': true, 'active': index === 0 }">
                        <img :src="apiURL(image)" class="d-block w-100" alt="Recipe image" style="height: 333px">
                    </div>
                </div>
                <a class="carousel-control-prev" href="#recipe-carousel" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#recipe-carousel" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                </a>
            </div>

            <div class="row mt-3">
                <p class="col-6 font-weight-bold">
                    <i class="fas fa-clock"></i>
                    Preparation Time: {{ recipe.preparationTime }} minutes
                </p>
                <p class="col-6 text-right font-weight-bold">
                    <i class="fas fa-clock"></i>
                    Cooking Time: {{ recipe.cookingTime }} minutes
                </p>
            </div>

            <div class="text-justify mb-3">
                <p class="font-weight-bold mb-2">
                    <i class="fas fa-list-ul"></i> Cooking Steps:
                </p>

                <span class="click font-weight-bold font-italic text-primary mb-2 d-block" v-if="!showSteps[recipe.id]"
                    @click="showSteps[recipe.id] = true">View more</span>

                <div v-if="showSteps[recipe.id]">
                    <ul class="list-group list-group-flush">
                        <li v-for="(step, index) in recipe.steps" :key="index" class="list-group-item"
                            style="background-color: rgba(255, 255, 255, 0.12); color: #fff;">
                            <strong>Step {{ index + 1 }}:</strong> {{ step }}
                        </li>
                    </ul>
                    <span class="click font-weight-bold font-italic text-primary mt-2 d-block"
                        @click="showSteps[recipe.id] = false">Hide</span>
                </div>
            </div>

            <div class="row" v-if="getHashtags(recipe.tags).length">
                <div class="col-3 font-weight-bold text-center">
                    <i class="fas fa-hashtag"></i> Hashtags:
                </div>
                <div class="col-9">
                    {{ getHashtags(recipe.tags) }}
                </div>
            </div>
        </div>

        <!-- Post Footer -->
        <div class="card-footer mt-3">

            <div class="row">
                <div v-if="recipe.likesCount >= 1" class="col-6" style="color: #fff;">
                    <i class="fas fa-thumbs-up"></i>
                    {{ recipe.likesCount }}
                </div>

                <div v-else class="col-6" style="color: #fff;">
                    Be the first to like this post!
                </div>

                <div class="col-6 text-right">
                    {{ recipe.commentsCount }} Comments
                </div>
            </div>

            <div class="row mt-3 text-center">
                <div v-if="recipe.isLiked" class="col-4 btn btn-hover text-white" @click="toggleLike(recipe)">
                    <i class="far fa-thumbs-up" style="color: blue;"></i> Like
                </div>
                <div v-else class="col-4 btn btn-hover text-white" @click="toggleLike(recipe)">
                    <i class="far fa-thumbs-up"></i> Like
                </div>

                <div class="col-4 btn btn-hover text-white" @click="toggleComments(recipe)">
                    <i class="far fa-comment-alt"></i> Comment
                </div>
                <div type="button" class="col-4 btn btn-hover text-white" data-toggle="modal" data-target="#shareModal">
                    <i class="fas fa-share"></i> Share
                </div>
            </div>

            <div class="modal fade" id="shareModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <ShareModal @shareLinkCopy="shareLinkCopy" />
            </div>

        </div>

        <div class="card mt-3" v-if="showComments[recipe.id]" style="background-color: rgba(255, 255, 255, 0.12);">

            <div class="card-header">
                <i class="far fa-comment-alt mr-2"></i>
                <span class="ml-2">Comments</span>
            </div>

            <div class="card-body">
                <div v-for="comment in recipe.comments" :key="comment.id" class="row mb-3">
                    <!-- Root Comment -->
                    <div class="col">
                        <div class="d-flex flex-start">
                            <img :src="apiURL(comment.userAvatar)" alt="User Avatar"
                                class="rounded-circle shadow-1-strong me-3 mr-2" width="40" height="40">
                            <div class="flex-grow-1">
                                <p class="mb-1">
                                    <strong>{{ comment.userName }}</strong> - <span class="small">{{
                                        formatTime(comment.created_at) }}</span>
                                </p>
                                <p class="small mb-2">{{ comment.content }}</p>
                            </div>
                            <div class="col-4 btn btn-hover d-flex justify-content-center align-items-center"
                                @click="toggleReplyComments(comment)">
                                <i class="far fa-comment-alt mr-2"></i> Reply
                            </div>
                        </div>

                        <!-- Reply Input Field -->
                        <div class="reply-input d-flex align-items-center" v-if="showReplyInput[comment.id]">
                            <div class="row">
                                <div class="col-md-10">
                                    <textarea v-model="replyText[comment.id]" placeholder="Reply..."
                                        style="background-color: rgba(255, 255, 255, 0.12); color: #fff;"
                                        class="form-control" rows="1"></textarea>
                                </div>
                                <div class="col-md-2 d-flex justify-content-center align-items-center">
                                    <button @click="addReply(recipe.id, comment.id)" class="btn btn-primary btn-sm mt-2">
                                        Reply
                                    </button>
                                </div>

                            </div>
                        </div>


                    </div>

                    <!-- Display Replies -->
                    <div v-if="comment.replies && comment.replies.length" class="col-11 offset-1">
                        <div v-for="reply in comment.replies" :key="reply.id" class="reply mt-2">
                            <img :src="apiURL(reply.userAvatar)" alt="User Avatar"
                                class="rounded-circle shadow-1-strong me-3" width="30" height="30">
                            <div class="flex-grow-1">
                                <p class="mb-1">
                                    <strong>{{ reply.userName }}</strong> - <span class="small">{{
                                        formatTime(reply.created_at) }}</span>
                                </p>
                                <p class="small mb-0">{{ reply.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card-footer">
                <div class="d-flex align-items-center">
                    <img :src="apiURL(userStore.user.avatar)" class="rounded-circle mr-2" width="40">

                    <textarea style="background-color: rgba(255, 255, 255, 0.12); color: #fff;" class="form-control"
                        v-model="newCommentText[recipe.id]" rows="3" placeholder="Write a comment..."></textarea>

                    <button class="btn btn-primary btn-sm ml-2" @click="addComment(recipe)">Send</button>
                </div>
            </div>

        </div>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script>
import ShareModal from './ShareModal.vue';
import axios from 'axios';
import { ref, onMounted, computed, nextTick } from 'vue';
import moment from 'moment';
import 'moment/locale/vi';
import { useUserStore } from '../../store/userStore';
import { useRoute, useRouter } from 'vue-router';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ROUTES = {
    favoriteDetail: id => `favorite/${id}`,
    comment: id => `newsfeed/${id}/comments`,
    replycomment: id => `newsfeed/comments/${id}/replies`,
    unlike: id => `newsfeed/unlike/${id}`,
    like: id => `newsfeed/like/${id}`
};

export default {
    name: 'PostDetails',
    components: {
        ShareModal,
    },
    setup() {
        const userStore = useUserStore();
        const route = useRoute();
        const router = useRouter();
        const recipe = ref(null);
        const newCommentText = ref({});
        const showComments = ref({});
        const showSteps = ref({});
        const replyText = ref({});
        const showReplyInput = ref({});

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        const goBack = () => {
            router.go(-1);
        };

        onMounted(async () => {
            await fetchInitialData();
            $(document).ready(function () {
                $('#exampleModal').modal({
                    show: false
                });

                $(".btn-primary").click(function () {
                    $('#exampleModal').modal('show');
                });
            });
        });

        const fetchInitialData = async () => {
            const userId = userStore.user.id;
            const { id: recipeId } = route.params;
            try {
                const { data: recipeData } = await axios.get(apiURL(ROUTES.favoriteDetail(recipeId)), { params: { userId } });
                recipe.value = {
                    ...recipeData,
                    isLiked: recipeData.isLikedByCurrentUser,
                    likesCount: recipeData.totalLikes,
                    comments: recipeData.comments || []
                };

                // Load comments for the recipe
                try {
                    const { data: commentsData } = await axios.get(apiURL(ROUTES.comment(recipeId)));
                    recipe.value.comments = commentsData;
                } catch (error) {
                    console.error(`Error loading comments for recipe ${recipeId}:`, error);
                }

            } catch (error) {
                console.error('Lỗi khi tải công thức:', error);
            }
        };

        const shareLinkCopy = () => {
            $(".message").text("link copied");
        }

        const formatTime = (time) => {
            moment.locale('vi');
            return moment(time).fromNow();
        };

        const toggleComments = (recipe) => {
            nextTick(() => {
                showComments.value[recipe.id] = !showComments.value[recipe.id];
            });
        };

        const toggleReplyComments = async (comment) => {
            await nextTick();
            const isCurrentlyOpen = showReplyInput.value[comment.id];

            // Đặt tất cả các input trả lời về trạng thái đóng
            Object.keys(showReplyInput.value).forEach(key => {
                showReplyInput.value[key] = false;
            });

            if (!isCurrentlyOpen) {
                showReplyInput.value[comment.id] = true;
            }
        };

        const toggleLike = async (recipe) => {
            try {
                if (recipe.isLiked) {
                    await axios.delete(apiURL(ROUTES.unlike(recipe.id)), { data: { sender_id: userStore.user.id } });
                    recipe.isLiked = false;
                    recipe.likesCount -= 1;
                } else {
                    await axios.post(apiURL(ROUTES.like(recipe.id)), { sender_id: userStore.user.id });
                    recipe.isLiked = true;
                    recipe.likesCount += 1;
                }
            } catch (error) {
                console.error('Lỗi khi thích/bỏ thích bài viết:', error);
            }
        };

        const addComment = async (recipe) => {
            try {
                const { data } = await axios.post(apiURL(ROUTES.comment(recipe.id)), {
                    userId: userStore.user.id,
                    content: newCommentText.value[recipe.id],
                });

                recipe.comments.push(data);
                newCommentText.value[recipe.id] = '';
                reloadComments(recipe.id);
            } catch (error) {
                console.error('Lỗi khi thêm bình luận:', error);
            }
        };

        const reloadComments = async (recipeId) => {

            try {
                const { data: commentsData } = await axios.get(apiURL(ROUTES.comment(recipeId)));
                if (recipe.value && recipe.value.id === recipeId) {
                    recipe.value.comments = commentsData;
                }
            } catch (error) {
                console.error(`Error loading comments for recipe ${recipeId}:`, error);
            }
        };

        const addReply = async (recipeId, commentId) => {
            try {
                // Kiểm tra xem nội dung trả lời có trống không
                if (!replyText.value[commentId]) {
                    console.log('Nội dung trả lời không được trống');
                    return; // Ngừng thực thi hàm nếu trường trả lời trống
                }
                const { data } = await axios.post(apiURL(ROUTES.replycomment(commentId)), {
                    userId: userStore.user.id,
                    content: replyText.value[commentId],
                });

                // Cập nhật UI sau khi thêm trả lời
                replyText.value[commentId] = '';
                reloadComments(recipeId);
            } catch (error) {
                console.error('Lỗi khi thêm trả lời:', error);
            }
        };

        const difficultyToStars = (difficulty) => {
            const difficultyMap = { 'dễ': 1, 'trung bình': 2, 'khó': 3 };
            return difficultyMap[difficulty] || 1;
        };

        const getMainIngredientsArray = (ingredients = []) => {
            return ingredients.map(ingredient => ({
                name: ingredient.name,
                amount: ingredient.amount
            }));
        };

        const getHashtags = (tags = []) => {
            return tags.length ? tags.map(tag => `#${tag}`).join(', ') : '';
        };

        const goToUserProfile = (userId) => {
            router.push(userId === userStore.user.id ? '/myprofile' : `/otherprofile/${userId}`);
        };

        return {
            apiURL,
            recipe,
            newCommentText,
            showComments,
            showSteps,
            formatTime,
            toggleComments,
            toggleLike,
            addComment,
            reloadComments,
            difficultyToStars,
            getMainIngredientsArray,
            getHashtags,
            goToUserProfile,
            userName: computed(() => user?.name),
            userStore,
            shareLinkCopy,
            goBack,
            replyText,
            addReply,
            toggleReplyComments,
            showReplyInput
        };
    }
}
</script>

<style scoped>
.recipe-card {
    border-radius: 8px;
    padding: 20px;
    border: 1px solid #e5e5e5;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
}

.user-avatar {
    width: 48px;
    height: 48px;
    margin-right: 10px;
    border-radius: 50%;
}

.back-button {
    display: flex;
    align-items: center;
}

.back-button .btn {
    display: flex;
    align-items: center;
}

.back-button .btn i.fas.fa-arrow-left {
    margin-right: 8px;
}

.click {
    cursor: pointer;
}

.btn-hover {
    color: #fff;
}

.btn-hover:hover {
    background-color: rgba(112, 120, 131, 0.15);
}

.liked {
    color: blue;
}

.recipe-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
}

.star-container {
    display: flex;
    align-items: center;
    min-height: 38px;
}

i.fas.fa-star {
    color: gold;
}

i.far.fa-star {
    color: lightgray;
}

/* Reply comment */
.reply-input textarea {
    width: 100%;
    margin-top: 10px;
}

.reply {
    display: flex;
    align-items: flex-start;
}

.reply img {
    margin-right: 10px;
}

.card-body .col-11.offset-1 {
    padding-left: 20px;
    border-left: 1px solid #eee;
}
</style>