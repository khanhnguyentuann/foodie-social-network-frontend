<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import makePaginationService from '../../../services/pagination.service';

const router = useRouter();
const recipes = ref([]);
const currentPage = ref(1);
const itemsPerPage = 1;
const totalPages = computed(() => Math.ceil(recipes.value.length / itemsPerPage));

const { changePage, nextPage, prevPage, calculatePagesToShow, changePageToEllipsis } = makePaginationService(currentPage, totalPages);
const pagesToShow = computed(calculatePagesToShow);
const displayedRecipes = computed(() => recipes.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

const fetchRecipess = async () => {
  try {
    const response = await axios.get(`/api/comments/recipes-with-comments`);
    recipes.value = response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

onMounted(fetchRecipess);

const navigateToCommentList = (recipeId) => router.push({ name: 'CommentList', params: { recipeId } });

</script>

<template>
  <div class="container mt-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of posts containing comments</h3>
    </div>

    <!-- Search form -->
    <form class="d-flex justify-content-center md-form form-sm">
      <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
      <i class="fas fa-search" aria-hidden="true"></i>
    </form>
    <table class="table mt-3">
      <thead class="thead-dark">
        <tr>
          <th scope="col">#</th>
          <th scope="col">ID</th>
          <th scope="col">Tên công thức</th>
          <th scope="col">Tổng số bình luận</th>
        </tr>
      </thead>
      <tbody style="color: #fff;">
        <tr v-for="(recipe, index) in displayedRecipes" :key="recipe.id" @click="navigateToCommentList(recipe.id)">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ recipe.id }}</td>
          <td><a class="btn btn-link">{{ recipe.name }}</a></td>
          <td>{{ recipe.totalComments }}</td>
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

<style scoped>
.hover-effect:hover {
  background-color: rgba(0, 0, 0, .05);
}
</style>
