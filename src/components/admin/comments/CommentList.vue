<template>
    <div class="container mt-4">
        <button class="btn btn-secondary mb-3" @click="goBack">Quay lại</button>

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3>The comment list of post with an ID of "{{ recipeId }}"</h3>
        </div>

        <table class="table mt-3">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">ID</th>
                    <th scope="col">Content</th>
                    <th scope="col">Author id</th>
                    <th scope="col">Created at</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody style="color: #fff;">
                <tr v-for="(comment, index) in paginatedComments" :key="comment.id">
                    <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td>{{ comment.id }}</td>
                    <td>{{ comment.content }}</td>
                    <td>{{ comment.user_id }}</td>
                    <td>{{ formatDate(comment.created_at) }}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" @click="deleteComment(comment.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Phân trang -->
        <nav aria-label="Page navigation" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
                </li>
                <li v-for="page in totalPages" :key="page" class="page-item" :class="{ 'active': currentPage === page }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const ROUTES = {
    commentsList: id => `comments/${id}`,
    deleteComment: id => `comments/api/${id}`
};

export default {
    name: 'CommentList',
    setup() {
        const route = useRoute();
        const comments = ref([]);
        const router = useRouter();
        const currentPage = ref(1);
        const itemsPerPage = ref(4);
        const totalItems = ref(0);
        const recipeId = ref(route.params.recipeId);

        const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
        const paginatedComments = computed(() => {
            const start = (currentPage.value - 1) * itemsPerPage.value;
            const end = start + itemsPerPage.value;
            return comments.value.slice(start, end);
        });

        const changePage = (newPage) => {
            currentPage.value = newPage;
        };

        const goBack = () => {
            router.back();  // điều hướng quay lại trang trước
        };

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        const formatDate = (date) => {
            return new Date(date).toLocaleDateString();
        };

        const fetchComments = async () => {
            const recipeId = route.params.recipeId;

            try {
                const response = await axios.get(apiURL(ROUTES.commentsList(recipeId)));
                comments.value = response.data;
                totalItems.value = response.data.length;
            } catch (error) {
                console.error('Lỗi khi lấy bình luận:', error);
            }
        };

        const deleteComment = async (commentId) => {
            try {
                const confirmation = confirm('Are you sure you want to delete this comment?');
                if (confirmation) {
                    await axios.delete(apiURL(ROUTES.deleteComment(commentId)));
                    fetchComments();
                }
            } catch (error) {
                console.error('Lỗi khi xoá bình luận:', error);
            }
        };

        onMounted(fetchComments);

        return {
            comments,
            apiURL,
            formatDate,
            deleteComment,
            goBack,
            currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
            paginatedComments,
            changePage,
            recipeId
        };
    }
};
</script>

<style scoped></style>
