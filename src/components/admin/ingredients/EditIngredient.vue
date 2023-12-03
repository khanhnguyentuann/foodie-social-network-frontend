<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const ingredient = ref({ name: '' });
const router = useRouter();
const route = useRoute();
const toast = useToast();

const goBack = () => router.back();

onMounted(async () => {
    try {
        const ingredientId = route.params.id;
        const response = await axios.get(`/api/ingredients/${ingredientId}`);
        ingredient.value.name = response.data.name;
    } catch (error) {
        console.error("Error fetching ingredient:", error);
    }
});

const updateIngredient = async () => {
    try {
        const ingredientId = route.params.id;
        const response = await axios.put(`/api/ingredients/${ingredientId}`, { name: ingredient.value.name });
        if (response.status === 200) {
            toast.success(response.data.message);
            router.push({ name: 'IngredientList' });
        } else {
            toast.error('Failed to update ingredient. Please try again.');
        }
    } catch (error) {
        console.error("Error updating ingredient:", error);
        toast.error(error.response.data.message);
    }
};
</script>

<template>
    <div class="edit-ingredient-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

        <div class="header-section">
            <h3>Update ingredient</h3>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="updateIngredient">
                    <div class="mb-3">
                        <label for="ingredientName" class="form-label">Name</label>
                        <input id="ingredientName" v-model="ingredient.name" type="text" class="form-control" required />
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.edit-ingredient-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.header-section {
    margin-bottom: 2rem;
    text-align: center;
}

.card {
    background-color: #6c757d;
    border-color: #6c757d;
}
</style>
  