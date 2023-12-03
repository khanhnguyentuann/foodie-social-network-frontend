<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();
const tag = ref({ name: '' });
const router = useRouter();
const route = useRoute();

const goBack = () => router.back();

onMounted(async () => {
    try {
        const tagId = route.params.id;
        const response = await axios.get(`/api/tags/${tagId}`);
        tag.value.name = response.data.tag_name;
    } catch (error) {
        console.error("Error fetching tag:", error);
    }
});

const updateTag = async () => {
    try {
        const tagId = route.params.id;
        const response = await axios.put(`/api/tags/${tagId}`, { name: tag.value.name });
        if (response.status === 200) {
            toast.success(response.data.message);
            router.push('/admin/tag-list');
        } else {
            toast.error('Failed to update tag. Please try again.');
        }
    } catch (error) {
        console.error("Error updating tag:", error);
        toast.error('Error updating tag. Please try again.');
    }
};
</script>

<template>
    <div class="edit-tag-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

        <div class="header-section">
            <h3>Update tag</h3>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="updateTag">
                    <div class="mb-3">
                        <label for="tagName" class="form-label">Name</label>
                        <input id="tagName" v-model="tag.name" type="text" class="form-control" required />
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
.edit-tag-container {
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
  