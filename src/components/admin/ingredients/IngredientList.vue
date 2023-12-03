<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import makePaginationService from '../../../services/pagination.service';

const toast = useToast();
const router = useRouter();
const ingredients = ref([]);
const currentPage = ref(1);
const ingredientsPerPage = 6;
const totalPages = computed(() => Math.ceil(ingredients.value.length / ingredientsPerPage));

const { changePage, nextPage, prevPage, calculatePagesToShow, changePageToEllipsis } = makePaginationService(currentPage, totalPages);
const pagesToShow = computed(calculatePagesToShow);
const displayedIngredients = computed(() => ingredients.value.slice((currentPage.value - 1) * ingredientsPerPage, currentPage.value * ingredientsPerPage));

const fetchIngredients = async () => {
  try {
    const response = await axios.get('/api/ingredients');
    ingredients.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

onMounted(fetchIngredients);

const addIngredient = () => router.push({ name: 'AddIngredient' });
const editIngredient = (id) => router.push({ name: 'EditIngredient', params: { id } });

const deleteIngredient = async (id) => {
  if (!confirm('Are you sure you want to delete this ingredient ?')) return;

  try {
    const response = await axios.delete(`/api/ingredients/${id}`);
    if (response.status === 200) {
      ingredients.value = ingredients.value.filter(ingredient => ingredient.id !== id);
    }
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    toast.error(error.response.data.message);
  }
};
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of cooking ingredients</h3>
      <button class="btn btn-primary" @click="addIngredient">Add ingredient</button>
    </div>

    <form class="d-flex justify-content-center md-form form-sm">
      <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
      <i class="fas fa-search" aria-hidden="true"></i>
    </form>

    <div v-if="displayedIngredients.length">
      <table class="table mt-3">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col-8">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody style="color: #fff;">
          <tr v-for="(ingredient, index) in displayedIngredients" :key="ingredient.id">
            <th>{{ (currentPage - 1) * ingredientsPerPage + index + 1 }}</th>
            <td>{{ ingredient.id }}</td>
            <td>{{ ingredient.name }}</td>
            <td>
              <button class="btn btn-warning btn-sm mr-2" @click="editIngredient(ingredient.id)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteIngredient(ingredient.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mt-4">No ingredients found.</p>

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
