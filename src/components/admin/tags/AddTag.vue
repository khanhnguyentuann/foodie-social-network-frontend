<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/html-indent -->
<template>
    <div class="add-tag-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Quay lại</button>

        <div class="header-section">
            <h3>Add Tag</h3>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="addHashtag">
                    <div class="mb-3">
                        <label for="tagName" class="form-label">Name the tag</label>
                        <input id="tagName" v-model="name" type="text" class="form-control" required>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Add Tag</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const ROUTES = {
    addHashtag: `tags`
};

export default {
    setup() {
        const name = ref('');
        const router = useRouter();

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        const goBack = () => {
            router.back();  // điều hướng quay lại trang trước
        };

        const addHashtag = async () => {
            try {
                const response = await axios.post(apiURL(ROUTES.addHashtag), {
                    name: name.value,
                });
                if (response.status === 201) {
                    alert('Hashtag added successfully');
                } else {
                    alert('Failed to add hashtag. Please try again.');
                }
            } catch (error) {
                console.error("Error adding hashtag:", error);
                alert('Error adding hashtag. Please try again.');
            }
        };

        return {
            name,
            addHashtag,
            apiURL,
            goBack
        };
    },
};
</script>
  
<style scoped>
.add-tag-container {
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