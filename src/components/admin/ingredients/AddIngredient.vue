<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const name = ref('');
const router = useRouter();
const toast = useToast();

const goBack = () => router.back();

const addIngredient = async () => {
    try {
        const response = await axios.post(`/api/ingredients`, { name: name.value, });
        if (response.status === 200) {
            toast.success(response.data.message);
        } else {
            toast.error('Failed to add ingredient. Please try again.');
        }
    } catch (error) {
        console.error("Error adding ingredient:", error);
        toast.error(error.response.data.message);
    }
};
</script>

<template>
    <div class="add-ingredient-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

        <div class="header-section">
            <h3>Add ingredient</h3>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="addIngredient">
                    <div class="mb-3">
                        <label for="ingredientName" class="form-label">Name the ingredient</label>
                        <input id="ingredientName" v-model="name" type="text" class="form-control" required>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Add</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
  
<style scoped>
.add-ingredient-container {
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