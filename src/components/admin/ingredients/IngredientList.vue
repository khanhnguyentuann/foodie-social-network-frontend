<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of cooking ingredients</h3>
      <button class="btn btn-primary" @click="addIngredient">Add Ingredient</button>
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
          <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
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

export default {
  name: 'IngredientList',
  data() {
    return {
      ingredients: [],
      currentPage: 1, // trang hiện tại
      ingredientsPerPage: 6,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.ingredients.length / this.ingredientsPerPage);
    },
    displayedIngredients() {
      const start = (this.currentPage - 1) * this.ingredientsPerPage;
      const end = start + this.ingredientsPerPage;
      return this.ingredients.slice(start, end);
    }
  },

  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/ingredients');
      this.ingredients = response.data;
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  },

  methods: {
    addIngredient() {
      this.$router.push('/admin/ingredient-list/add-ingredient');
    },
    editIngredient(id) {
      this.$router.push(`/admin/ingredient-list/edit-ingredient/${id}`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    async deleteIngredient(id) {
      try {
        const confirmation = confirm('Are you sure you want to delete this ingredient ?');

        if (confirmation) {
          const response = await axios.delete(`http://localhost:3000/ingredients/${id}`);

          if (response.data.success) {
            this.ingredients = this.ingredients.filter(ingredient => ingredient.id !== id);
          }
          alert(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting ingredient:', error);
        alert('Failed to delete ingredient. Please try again.');
      }
    }

  }
};
</script>
