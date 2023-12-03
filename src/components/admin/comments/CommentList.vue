<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import makePaginationService from '../../../services/pagination.service';

const toast = useToast();
const route = useRoute();
const comments = ref([]);
const router = useRouter();
const currentPage = ref(1);
const itemsPerPage = 1;
const totalPages = computed(() => Math.ceil(comments.value.length / itemsPerPage));
const recipeId = ref(route.params.recipeId);

const { changePage, nextPage, prevPage, calculatePagesToShow, changePageToEllipsis } = makePaginationService(currentPage, totalPages);
const pagesToShow = computed(calculatePagesToShow);
const displayedComments = computed(() => comments.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

const goBack = () => router.back();

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

const fetchComments = async () => {
    const recipeId = route.params.recipeId;
    try {
        const response = await axios.get(`/api/comments/${recipeId}`);
        comments.value = response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};

onMounted(fetchComments);

const deleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await axios.delete(`/api/comments/api/${commentId}`);
        comments.value = comments.value.filter(comment => comment.id !== commentId);
        toast.success(response.data.message);
    } catch (error) {
        console.error('Error deleting comments:', error);
        toast.error(error.response.data.message);
    }
};

</script>

<template>
    <div class="container mt-4">
        <button class="btn btn-secondary mb-3" @click="goBack">Back</button>

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
                <tr v-for="(comment, index) in displayedComments" :key="comment.id">
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
                    <a class="page-link" href="#" @click="prevPage">Previous</a>
                </li>
                <li class="page-item" v-for="(page, index) in pagesToShow" :key="page"
                    :class="{ 'active': currentPage === page }">
                    <template v-if="typeof page === 'number'">
                        <a class="page-link" href="#" @click="() => changePage(page)">{{ page }}</a>
                    </template>
                    <template v-else>
                        <a class="page-link" href="#" @click="() => changePageToEllipsis(page, index)">...</a>
                    </template>
                </li>
                <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                    <a class="page-link" href="#" @click="nextPage">Next</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped></style>
