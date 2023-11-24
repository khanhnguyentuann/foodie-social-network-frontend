<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/html-indent -->
<template>
    <div class="edit-tag-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Quay lại</button>

        <div class="header-section">
            <h3>Update Tag</h3>
        </div>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="updateTag">
                    <div class="mb-3">
                        <label for="tagName" class="form-label">Name</label>
                        <input id="tagName" v-model="tag.name" type="text" class="form-control" required />
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Update Tag</button>
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
    getTag: id => `tags/${id}`,
    updateTag: id => `tags/${id}`,
};

export default {
    setup() {
        const tag = ref({ name: '' });
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
                const tagId = route.params.id;
                const response = await axios.get(apiURL(ROUTES.getTag(tagId)));
                tag.value.name = response.data.tag_name;
            } catch (error) {
                console.error("Error fetching tag:", error);
            }
        });

        const updateTag = async () => {
            try {
                const tagId = route.params.id;
                const response = await axios.put(apiURL(ROUTES.updateTag(tagId)), {
                    name: tag.value.name,
                });
                if (response.status === 200) {
                    alert('Tag updated successfully');
                    router.push('/admin/tag-list');
                } else {
                    alert('Failed to update tag. Please try again.');
                }
            } catch (error) {
                console.error("Error updating tag:", error);
                alert('Error updating tag. Please try again.');
            }
        };

        return {
            tag,
            updateTag,
            apiURL,
            goBack
        };
    },
};
</script>

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
  