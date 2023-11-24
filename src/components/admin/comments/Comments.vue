<!-- eslint-disable vue/first-attribute-linebreak -->
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
        <tr v-for="(recipe, index) in paginatedRecipes" :key="recipe.id" @click="navigateToCommentList(recipe.id)">
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
import { useRouter } from 'vue-router';

const ROUTES = {
  recipesList: `comments/recipes-with-comments`
};

export default {
  name: 'Comments',
  setup() {
    const recipes = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(4);
    const totalItems = ref(0);
    const router = useRouter();

    const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
    const paginatedRecipes = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return recipes.value.slice(start, end);
    });

    const navigateToCommentList = (recipeId) => {
      router.push({ name: 'CommentList', params: { recipeId } });
    };

    const changePage = (newPage) => {
      currentPage.value = newPage;
    };

    const apiURL = (relativePath) => {
      return window.baseURL + '/' + relativePath;
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get(apiURL(ROUTES.recipesList));
        recipes.value = response.data;
        totalItems.value = recipes.value.length; // Cập nhật tổng số mục
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      paginatedRecipes,
      apiURL,
      fetchRecipes,
      changePage,
      navigateToCommentList
    };
  }
};
</script>

<style scoped>
.hover-effect:hover {
  background-color: rgba(0, 0, 0, .05);
}
</style>
