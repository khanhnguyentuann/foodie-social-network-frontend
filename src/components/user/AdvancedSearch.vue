<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<template>
    <div class="container mt-3">
        <div class="bordered-container">
            <form>
                <div class="mb-4">
                    <label for="ingredients" class="form-label">Type the ingredient name:</label>
                    <input v-model="ingredientQuery" @input="filterIngredients" type="text"
                        placeholder="Type to search ingredients..." class="form-control form-input mb-3">
                    <div class="row gy-3">
                        <div v-for="ingredient in filteredIngredients" :key="ingredient.id" class="col-md-3">
                            <div class="form-check">
                                <input type="checkbox" :value="ingredient.name" v-model="selectedIngredients"
                                    class="form-check-input" :id="'ingredient-' + ingredient.id">
                                <label class="form-check-label" :for="'ingredient-' + ingredient.id">{{ ingredient.name
                                }}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <button type="button" @click="searchRecipes" class="btn btn-primary mr-3">Search</button>
                    <button type="button" @click="resetSelection" class="btn btn-outline-secondary">Reset</button>
                </div>
            </form>
        </div>
        <div v-if="searchedIngredients && hasSearched" class="mt-3">
            Search results for ingredients: "{{ searchedIngredients }}"
        </div>
        <div v-if="recipes.length === 0 && hasSearched" class="mt-3 alert alert-warning text-center">
            No recipes found with the selected ingredients.
        </div>

        <div v-if="recipes.length > 0 && hasSearched" class="row row-cols-1 row-cols-md-2 mt-3 mb-3">
            <div class="col-3 mt-3" v-for="recipe in recipes" :key="recipe.id">
                <div class="card h-100 rounded shadow-sm position-relative"
                    style="background-color: rgba(255, 255, 255, 0.12);">
                    <router-link :to="'/postdetails/' + recipe.id" class="text-decoration-none text-dark">
                        <img :src="apiURL(recipe.firstImage)" class="card-img-top rounded-top img-fluid" alt="Post Image">
                        <div class="card-body text-light">
                            <h5 class="card-title" style="font-weight: bold;">{{ recipe.name }}</h5>
                            <div class="row">
                                <p class="card-text col-6 text-light" style="color: #555; font-size: 13px;">Cooking Time: {{
                                    recipe.cookingTime }} minutes</p>
                                <p class="card-text col-6 text-light" style="color: #555; font-size: 13px;">Serves: {{
                                    recipe.servingFor }} people</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const ROUTES = {
    ingredientList: 'search/getAllIngredients',
    searchByIngredients: 'search/searchByIngredients',
};

export default {
    name: "AdvancedSearch",
    setup() {
        const ingredients = ref([]);
        const ingredientQuery = ref('');
        const selectedIngredients = ref([]);
        const recipes = ref([]);
        const hasSearched = ref(false);
        const searchedIngredients = ref('');

        const filteredIngredients = computed(() => {
            return ingredients.value
                .filter(ing => ing.name.toLowerCase().includes(ingredientQuery.value.toLowerCase()))
                .slice(0, 24);
        });

        const apiURL = (relativePath, params = '') => {
            return window.baseURL + '/' + relativePath + params;
        };

        const fetchIngredients = async () => {
            try {
                const response = await axios.get(apiURL(ROUTES.ingredientList));
                ingredients.value = response.data.ingredients;
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            }
        };

        const searchRecipes = async () => {
            const ingredientsString = selectedIngredients.value.join(',');
            searchedIngredients.value = ingredientsString;
            try {
                const response = await axios.get(apiURL(ROUTES.searchByIngredients, `?ingredients=${ingredientsString}`));
                recipes.value = response.data.recipes;
                hasSearched.value = true;
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
        };

        const resetSelection = () => {
            selectedIngredients.value = [];
            recipes.value = [];
            hasSearched.value = false;
        };

        onMounted(() => {
            fetchIngredients();
        });

        return {
            ingredients,
            ingredientQuery,
            filteredIngredients,
            selectedIngredients,
            recipes,
            searchRecipes,
            apiURL,
            resetSelection,
            hasSearched,
            searchedIngredients
        };
    }
}
</script>

<style scoped>
.bordered-container {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.12);
}

/* search */
.form {
    width: 100%;
    position: relative;
}

.form .fa-search {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #9ca3af;
}

.form-input {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    height: 55px;
    text-indent: 33px;
    border-radius: 10px;
}

.form-input:focus {
    box-shadow: none;
    border: none;
}

/* Search results */
.card-img-top {
    height: 200px;
    object-fit: cover;
}

.card:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
