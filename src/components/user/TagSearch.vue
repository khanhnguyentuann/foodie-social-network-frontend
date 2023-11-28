<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const tag = ref('');
const recipes = ref([]);
const searchAttempted = ref(false);
const allTags = ref([]);
const selectedTags = ref([]);
const router = useRouter();

const selectTag = (tagItem) => {
    const index = selectedTags.value.indexOf(tagItem);
    if (index === -1) {
        selectedTags.value.push(tagItem);
    } else {
        selectedTags.value.splice(index, 1);
    }
    tag.value = selectedTags.value.join(', ');
};

const clearSearch = () => {
    tag.value = '';
    selectedTags.value = [];
};

onMounted(async () => {
    try {
        const response = await axios.get('/api/search/getAllTags');
        allTags.value = response.data.tags;
    } catch (error) {
        console.error('An error occurred while fetching tags:', error);
    }
});

watch(tag, (newVal) => {
    if (newVal === '') {
        searchAttempted.value = false;
        recipes.value = [];
    }
});

const searchByTag = async () => {
    searchAttempted.value = true;
    try {
        const response = await axios.get('/api/search/searchByTag', {
            params: { tag: tag.value }
        });
        recipes.value = response.data.recipes;
        router.push({ name: 'TagSearch', query: { tag: tag.value } });
    } catch (error) {
        console.error('An error occurred while fetching data:', error);
    }
};

const redirectToPostDetails = async (postId) => {
    router.push({ name: 'PostDetails', params: { id: postId } });
}

</script>

<template>
    <div class="container mt-3">
        <div class="form">
            <i class="fa fa-search"></i>

            <div class="input-field second-wrap position-relative">
                <input type="text" class="form-control form-input" placeholder="Type or select below name tag!"
                    v-model="tag" @keyup.enter="searchByTag">
                <span v-if="tag" class="clear-btn position-absolute" @click="clearSearch">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        </div>

        <div v-if="searchAttempted" class="mt-3">
            <p>Search results for the hashtag: "{{ tag }}"</p>
        </div>

        <div v-if="!searchAttempted">
            <h3 class="display-5">Popular Hashtags:</h3>
            <div class="d-flex flex-wrap">
                <span class="badge badge-success m-1" style="cursor: pointer;" v-for="tagItem in allTags" :key="tagItem.id"
                    @click="selectTag(tagItem.tag_name)">
                    {{ tagItem.tag_name }}
                </span>
            </div>
        </div>

        <!-- Display the search results -->
        <div v-if="recipes.length > 0" class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col-3 mt-3" v-for="recipe in recipes" :key="recipe.id">
                <div class="card h-100 rounded shadow-sm position-relative"
                    style="background-color: rgba(255, 255, 255, 0.12);">
                    <a class="text-decoration-none text-dark" @click="redirectToPostDetails(recipe.id)">
                        <img :src="recipe?.firstImage ? '/api/' + recipe.firstImage : ''"
                            class="card-img-top rounded-top img-fluid" alt="Post Image">
                        <div class="card-body text-light">
                            <h5 class="card-title" style="font-weight: bold;">{{ recipe.name }}</h5>
                            <div class="row">
                                <p class="card-text col-6 text-light" style="color: #555; font-size: 13px;">Cooking Time: {{
                                    recipe.cookingTime }} minutes</p>
                                <p class="card-text col-6 text-light" style="color: #555; font-size: 13px;">Serves: {{
                                    recipe.servingFor }} people</p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Message when no results are found -->
        <div v-else-if="searchAttempted" class="alert alert-warning mt-3" role="alert">
            No results found.
        </div>
    </div>
</template>

<style scoped>
/* Clearserach ---------- */
.position-absolute {
    position: absolute;
}

.clear-btn {
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
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
