<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/attributes-order -->
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

        <!-- Display message for the search criteria -->
        <div v-if="searchAttempted" class="mt-3">
            <p>Search results for the hashtag: "{{ tag }}"</p>
        </div>

        <!-- Display popular hashtags when no search is made -->
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


        <!-- <router-link :to="'/favorites/' + recipe.id" class="text-decoration-none text-dark">

        </router-link> -->


        <!-- Message when no results are found -->
        <div v-else-if="searchAttempted" class="alert alert-warning mt-3" role="alert">
            No results found.
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const ROUTES = {
    searchByTag: `search/searchByTag`,
    getAllTags: `search/getAllTags`,
};

export default {
    name: 'TagSearch',
    setup() {
        const tag = ref('');
        const recipes = ref([]);
        const searchAttempted = ref(false);
        const allTags = ref([]);
        const selectedTags = ref([]);
        const router = useRouter();

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

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
            selectedTags.value = []; // Xoá các tag đã được chọn
        };


        onMounted(async () => {
            try {
                const { data } = await axios.get(apiURL(ROUTES.getAllTags));
                allTags.value = data.tags;
            } catch (error) {
                console.error('An error occurred while fetching tags:', error);
            }
        });

        // Thêm cảnh quan sát cho biến 'tag'
        watch(tag, (newVal) => {
            if (newVal === '') {
                searchAttempted.value = false;
                recipes.value = []; // Xoá các kết quả tìm kiếm
            }
        });

        const searchByTag = async () => {
            searchAttempted.value = true;
            try {
                const { data } = await axios.get(apiURL(ROUTES.searchByTag), {
                    params: { tag: tag.value }
                });
                recipes.value = data.recipes;
                router.push({ path: '/tagsearch', query: { tag: tag.value } });
            } catch (error) {
                console.error('An error occurred while fetching data:', error);
            }
        };

        return {
            tag,
            recipes,
            selectedTags,
            searchAttempted,
            searchByTag,
            apiURL,
            selectTag,
            allTags,
            clearSearch
        };
    }
};
</script>

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
