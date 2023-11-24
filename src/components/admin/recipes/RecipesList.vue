<!-- eslint-disable vue/first-attribute-linebreak -->
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
          <th scope="col">#</th>
          <th scope="col">ID</th>
          <th scope="col">Tên công thức</th>
          <th scope="col">Mức độ khó</th>
          <th scope="col">Người tạo</th>
          <th scope="col">Ngày tạo</th>
          <th scope="col">Thao tác</th>
        </tr>
      </thead>
      <tbody style="color: #fff;">
        <tr v-for="(recipe, index) in recipes" :key="recipe.id" class="hover-effect">
          <th scope="row">{{ (currentPage - 1) * 5 + index + 1 }}</th>
          <td>{{ recipe.id }}</td>
          <td><a class="btn btn-link" @click="viewDetails(recipe.id)">{{ recipe.name }}</a></td>
          <td>{{ recipe.difficulty }}</td>
          <td>{{ recipe.creator }}</td>
          <td>{{ new Date(recipe.created_at).toLocaleDateString() }}</td>
          <td><button class="btn btn-danger" @click="deleteRecipe(recipe.id)">Xoá</button></td>
        </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation example" style="color: #333;">
      <ul class="pagination justify-content-center">
        <li :class="{ 'page-item': true, disabled: currentPage === 1 }">
          <a class="page-link" @click="if (currentPage > 1) { currentPage--; fetchRecipes(); }">Previous</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" @click="currentPage = page; fetchRecipes();">{{ page }}</a>
        </li>
        <li :class="{ 'page-item': true, disabled: currentPage === totalPages }">
          <a class="page-link" @click="if (currentPage < totalPages) { currentPage++; fetchRecipes(); }">Next</a>
        </li>
      </ul>
    </nav>

  </div>
</template>


<script>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const ROUTES = {
  recipesList: `recipes`,
  deleteRecipe: id => `recipes/${id}`,
};

export default {
  name: 'RecipesList',
  setup() {
    const recipes = ref([]);
    const router = useRouter();
    const currentPage = ref(1);
    const totalPages = ref(0);

    const apiURL = (relativePath) => {
      return window.baseURL + '/' + relativePath;
    };

    const fetchRecipes = async () => {
      try {
        const response = await axios.get(apiURL(`${ROUTES.recipesList}?page=${currentPage.value}`));
        recipes.value = response.data.data;
        totalPages.value = response.data.pagination.total;
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    const viewDetails = (recipeId) => {
      router.push(`/admin/recipes-list/${recipeId}`);
    };

    const deleteRecipe = async (recipeId) => {
      if (confirm('Bạn chắc chắn muốn xoá công thức này?')) {
        try {
          await axios.delete(apiURL(ROUTES.deleteRecipe(recipeId)));
          fetchRecipes();
        } catch (error) {
          console.error('Error deleting recipe:', error);
        }
      }
    };

    onMounted(fetchRecipes);

    return {
      recipes,
      apiURL,
      viewDetails,
      deleteRecipe,
      fetchRecipes,
      currentPage,
      totalPages
    };
  }
};
</script>

<style scoped>
.hover-effect:hover {
  background-color: rgba(0, 0, 0, .05);
}
</style>
