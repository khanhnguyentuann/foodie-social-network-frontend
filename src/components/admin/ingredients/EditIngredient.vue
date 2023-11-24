<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/html-indent -->
<template>
    <div class="edit-ingredient-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Quay lại</button>

        <div class="header-section">
            <h3>Update Ingredient</h3>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="updateIngredient">
                    <div class="mb-3">
                        <label for="ingredientName" class="form-label">Name</label>
                        <input id="ingredientName" v-model="ingredient.name" type="text" class="form-control" required />
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Update Ingredient</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const ROUTES = {
    getIngredient: id => `ingredients/${id}`,
    updateIngredient: id => `ingredients/${id}`
};

export default {
    setup() {
        const ingredient = ref({ name: '' });
        const router = useRouter();
        const route = useRoute();

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        const goBack = () => {
            router.back();  // điều hướng quay lại trang trước
        };

        onMounted(async () => {
            try {
                const ingredientId = route.params.id;
                const response = await axios.get(apiURL(ROUTES.getIngredient(ingredientId)));
                ingredient.value.name = response.data.name;
            } catch (error) {
                console.error("Error fetching ingredient:", error);
            }
        });

        const updateIngredient = async () => {
            try {
                const ingredientId = route.params.id;
                const response = await axios.put(apiURL(ROUTES.updateIngredient(ingredientId)), {
                    name: ingredient.value.name,
                });
                if (response.status === 200) {
                    alert('Ingredient updated successfully');
                    router.push('/admin/ingredient-list');
                } else {
                    alert('Failed to update ingredient. Please try again.');
                }
            } catch (error) {
                console.error("Error updating ingredient:", error);
                alert('Error updating ingredient. Please try again.');
            }
        };

        return {
            ingredient,
            updateIngredient,
            apiURL,
            goBack
        };
    },
};
</script>


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
  