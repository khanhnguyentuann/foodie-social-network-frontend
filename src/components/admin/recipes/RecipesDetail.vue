<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const recipe = ref({});
const route = useRoute();
const router = useRouter();

const goBack = () => router.back();

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const fetchRecipeDetails = async () => {
    const recipeId = route.params.recipeId;
    try {
        const response = await axios.get(`/api/recipes/${recipeId}`);
        recipe.value = response.data;
        recipe.value.steps = JSON.parse(recipe.value.steps);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
    }
};

onMounted(fetchRecipeDetails);

</script>

<template>
    <div class="container my-4">
        <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

        <div class="card bg-dark text-white">
            <div class="card-header">
                <h1 class="text-center">{{ recipe.name }}</h1>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <p class="card-text"><strong>ID công thức:</strong> {{ recipe.id }}</p>
                        <p class="card-text"><strong>Người tạo:</strong> {{ recipe.creator }}</p>
                    </div>
                    <div class="col-md-3">
                        <p class="card-text"><strong>Thời gian chuẩn bị:</strong> {{ recipe.preparationTime }}</p>
                        <p class="card-text"><strong>Thời gian chế biến:</strong> {{ recipe.cookingTime }}</p>
                    </div>
                    <div class="col-md-3">
                        <p class="card-text"><strong>Mức độ khó:</strong> {{ recipe.difficulty }}</p>
                        <p class="card-text"><strong>Ngày tạo:</strong> {{ formatDate(recipe.created_at) }}</p>
                    </div>
                    <div class="col-md-3">
                        <p class="card-text"><strong>Dành cho:</strong> {{ recipe.servingFor }}</p>
                    </div>
                </div>


                <h5 class="card-title mt-4">Các bước chế biến:</h5>
                <ul class="list-group list-group-flush">
                    <li v-for="(step, index) in recipe.steps" :key="index" class="list-group-item"
                        style="background-color: rgba(255, 255, 255, 0.12); color: #fff;">
                        <strong>Step {{ index + 1 }}:</strong> {{ step }}
                    </li>
                </ul>

                <h5 class="card-title mt-4">Hashtags:</h5>
                <div class="row">
                    <div class="col-md-2" v-for="tag in recipe.tags" :key="tag">
                        <span class="badge bg-dark text-white">{{ tag }}</span>
                    </div>
                </div>


                <h5 class="card-title mt-4">Hình ảnh minh hoạ:</h5>
                <div class="row">
                    <div class="col-md-4" v-for="image in recipe.images" :key="image">
                        <img :src="'/api/' + image" class="img-fluid img-thumbnail my-2" alt="Recipe Image">
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
