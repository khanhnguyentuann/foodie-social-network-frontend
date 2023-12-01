<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useUserStore } from '../../store/userStore';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const userStore = useUserStore();
const savedRecipes = ref([]);

const fetchSavedRecipes = async () => {
    try {
        const { data } = await axios.get('api/favorite', {
            params: { userId: userStore.user.id }
        });
        savedRecipes.value = data;
    } catch (error) {
        console.error('Lỗi khi lấy danh sách công thức đã lưu:', error);
    }
};

const unsaveRecipe = async (recipeId) => {
    try {
        await axios.delete(`api/favorite/${recipeId}`, {
            params: { userId: userStore.user.id }
        });
        await fetchSavedRecipes();
        toast.success('Recipe removed from bookmarks successfully');
    } catch (error) {
        console.error('Error removing recipe from bookmarks:', error);
        toast.error('Failed to remove recipe from bookmarks');
    }
};

const confirmDelete = async (recipeId) => {
    const userConfirmed = confirm("Are you sure you want to remove this recipe from your bookmarks?");
    if (userConfirmed) {
        await unsaveRecipe(recipeId);
    }
};

onMounted(fetchSavedRecipes);

</script>

<template>
    <div class="container mt-3">
        <h2 class="text-center mb-4"
            style="color: #dbe2ef; font-weight: 700; letter-spacing: -0.5px; text-shadow: 2px 2px 5px rgba(0,0,0,0.1);">
            <i class="fas fa-star text-warning mr-2"></i>
            Bookmark List
        </h2>

        <div v-if="savedRecipes.length" class="row row-cols-1 row-cols-md-2 g-4">
            <div v-for="recipe in savedRecipes" :key="recipe.id" class="col mt-3">
                <div class="card h-100 rounded shadow-sm position-relative"
                    style="background-color: rgba(255, 255, 255, 0.12);">
                    <button type="button" class="btn btn-link text-danger position-absolute m-2 bg-transparent"
                        @click="confirmDelete(recipe.id)">
                        <i class="fas fa-times"></i>
                    </button>

                    <router-link :to="'/postdetails/' + recipe.id" class="text-decoration-none text-dark">
                        <!-- <img :src="'http://localhost:3000/' + (recipe.firstImage ? recipe.firstImage : recipe.image)"
                            class="card-img-top rounded-top img-fluid" alt="Recipe Image"
                            v-if="recipe.firstImage || recipe.image"> -->

                        <img :src="recipe?.firstImage ? '/api' + recipe.firstImage : recipe.image"
                            class="card-img-top rounded-top img-fluid" alt="Recipe Image"
                            v-if="recipe.firstImage || recipe.image">

                        <div class="card-body text-light">
                            <h5 class="card-title">{{ recipe.name }}</h5>
                            <div class="row">
                                <p class="card-text col-6 text-light">Cooking Time: {{ recipe.preparationTime }} minutes</p>
                                <p class="card-text col-6 text-light">Serves: {{ recipe.servingFor }} people</p>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
        <div v-else class="text-center mt-3">
            <span>Favorites list is empty!</span>
        </div>
    </div>
</template>

<style scoped>
.card-img-top {
    height: 200px;
    object-fit: cover;
}

.card:hover {
    transform: translateY(-5px);
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-weight: bold;
}

.card-text {
    color: #555;
    font-size: 13px;
}

.btn-link.position-absolute {
    right: 0;
}

.btn-link.text-danger {
    border: 2px solid white;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
}

.btn-link.text-danger:hover {
    background-color: rgba(255, 255, 255, 0.6);
}

.fas.fa-times {
    font-size: 1.5rem;
}
</style>