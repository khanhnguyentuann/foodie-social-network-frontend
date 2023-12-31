<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import makePaginationService from '../../../services/pagination.service';

const toast = useToast();
const router = useRouter();
const recipes = ref([]);
const currentPage = ref(1);
const recipesPerPage = 1;
const totalPages = computed(() => Math.ceil(recipes.value.length / recipesPerPage));

const { changePage, nextPage, prevPage, calculatePagesToShow, changePageToEllipsis } = makePaginationService(currentPage, totalPages);
const pagesToShow = computed(calculatePagesToShow);
const displayedRecipes = computed(() => recipes.value.slice((currentPage.value - 1) * recipesPerPage, currentPage.value * recipesPerPage));

const fetchRecipes = async () => {
  try {
    const response = await axios.get('/api/recipes');
    recipes.value = response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
  }
};

onMounted(fetchRecipes);

const viewDetails = (recipeId) => router.push({ name: 'RecipesDetail', params: { recipeId } });

const deleteRecipe = async (recipeId) => {
  if (!confirm('Bạn chắc chắn muốn xoá công thức này?')) return;

  try {
    const response = await axios.delete(`/api/recipes/${recipeId}`);
    recipes.value = recipes.value.filter(recipe => recipe.id !== recipeId);
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error deleting recipe:', error);
  }
};

</script>

<template>
  <div class="container mt-3">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of posts</h3>
    </div>
    <!-- Search form -->
    <form class="form-inline d-flex justify-content-center md-form form-sm">
      <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
      <i class="fas fa-search" aria-hidden="true"></i>
    </form>
    <table class="table mt-3">
      <thead class="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Tên công thức</th>
          <th scope="col">Mức độ khó</th>
          <th scope="col">Người tạo</th>
          <th scope="col">Ngày tạo</th>
          <th scope="col">Thao tác</th>
        </tr>
      </thead>
      <tbody style="color: #fff;">
        <tr v-for="recipe in displayedRecipes" :key="recipe.id">
          <td>{{ recipe.id }}</td>
          <td><a class="btn btn-link" @click="viewDetails(recipe.id)">{{ recipe.name }}</a></td>
          <td>{{ recipe.difficulty }}</td>
          <td>{{ recipe.creator }}</td>
          <td>{{ new Date(recipe.created_at).toLocaleDateString() }}</td>
          <td><button class="btn btn-danger" @click="deleteRecipe(recipe.id)">Xoá</button></td>
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
