<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/attributes-order -->
<template>
    <div class="container mt-3">
        <div class="form">
            <i class="fa fa-search"></i>

            <div class="input-field second-wrap position-relative">
                <input type="text" class="form-control form-input" placeholder="Type the title!" v-model="title"
                    @keyup.enter="searchByTitle">
                <span v-if="title" class="clear-btn position-absolute" @click="clearSearch">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        </div>

        <!-- Hiển thị lịch sử tìm kiếm -->
        <div v-if="searchHistory.length && !searchAttempted" class="mt-3">
            <h5>Recent Searches:</h5>
            <ul class="list-group">
                <li v-for="(item, index) in searchHistory" :key="index"
                    class="list-group-item list-group-item-action list-group-item-dark d-flex justify-content-between align-items-center">
                    <span style="cursor: pointer;" @click="title = item; searchByTitle()">{{ item }}</span>
                    <span @click="removeFromSearchHistory(index)" style="cursor: pointer;">
                        <i class="fas fa-times"></i>
                    </span>
                </li>
            </ul>
        </div>

        <!-- Thông báo kết quả tìm kiếm cho tiêu đề cụ thể -->
        <div v-if="searchAttempted" class="mt-3">
            <p>Search results for the title: "{{ title }}"</p>
        </div>

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

        <!-- Thông báo khi không có kết quả -->
        <div v-else-if="searchAttempted" class="alert alert-warning mt-3" role="alert">
            No results found.
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const ROUTES = {
    searchByTitle: `search/searchByTitle`,
};

export default {
    name: "TitleSearch",
    setup() {
        const title = ref('');
        const recipes = ref([]);
        const searchAttempted = ref(false);
        const router = useRouter();
        const searchHistory = ref([]);

        const apiURL = (relativePath) => {
            return window.baseURL + '/' + relativePath;
        };

        onMounted(() => {
            searchHistory.value = JSON.parse(localStorage.getItem('searchHistory')) || [];
            const titleFromQuery = router.currentRoute.value.query.title;
            if (titleFromQuery) {
                title.value = titleFromQuery;
                searchByTitle();
            }
        });

        const updateSearchHistory = (newSearch) => {
            let searches = JSON.parse(localStorage.getItem('searchHistory')) || [];
            if (!searches.includes(newSearch)) {
                searches.unshift(newSearch); // Thêm vào đầu danh sách
                searches = searches.slice(0, 5); // Giữ chỉ 5 mục tìm kiếm gần đây
                localStorage.setItem('searchHistory', JSON.stringify(searches)); // Cập nhật localStorage
                searchHistory.value = searches; // Cập nhật trạng thái reactive
            }
        };

        const removeFromSearchHistory = (index) => {
            let searches = searchHistory.value;
            searches.splice(index, 1); // Xoá item ở vị trí index
            localStorage.setItem('searchHistory', JSON.stringify(searches)); // Cập nhật localStorage
            searchHistory.value = searches; // Cập nhật trạng thái reactive
        };


        const searchByTitle = async () => {
            searchAttempted.value = true;
            updateSearchHistory(title.value);
            try {
                const response = await axios.get(apiURL(ROUTES.searchByTitle), {
                    params: { title: title.value }
                });
                recipes.value = response.data.recipes;

                // Cập nhật URL sau khi tìm kiếm
                router.push({ path: '/titlesearch', query: { title: title.value } });
            } catch (error) {
                console.error('Error while fetching data:', error);
            }
        };

        const clearSearch = () => {
            title.value = '';
        };

        watch(title, (newVal) => {
            if (newVal === '') {
                searchAttempted.value = false;
                recipes.value = []; // Xoá các kết quả tìm kiếm
            }
        });

        watch(() => router.currentRoute.value.query.title, (newTitle) => {
            if (newTitle !== undefined && newTitle !== title.value) {
                title.value = newTitle;
                searchByTitle();
            }
        });

        return {
            apiURL,
            searchByTitle,
            searchAttempted,
            clearSearch,
            title,
            recipes,
            searchHistory,
            removeFromSearchHistory
        };
    }
}
</script>

<style scoped>
/* Clearserach ---------- */
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

/* Hover for recent searches */
</style>