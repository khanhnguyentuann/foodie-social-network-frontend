<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const recipe = ref({
    name: '',
    images: [],
    preparationTime: '',
    servingFor: '',
    cookingTime: '',
    steps: [''],
    tags: '',
    difficulty: 1
});

const router = useRouter();
const allIngredients = ref([]);
const selectedIngredients = ref([]);
const ingredientAmounts = ref({});
const ingredientInput = ref('');
const filteredIngredients = ref([]);
const formErrors = ref({});
const isLoading = ref(false);
const showDropdown = ref(false);

const imagePreviews = computed(() => {
    return recipe.value.images.map(image => URL.createObjectURL(image));
});

const fetchIngredients = async () => {
    try {
        const response = await axios.get(`/api/recipes/create/list-ingredients`);
        allIngredients.value = response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
    }
};

const addStep = () => recipe.value.steps.push('');

const closeDropdown = (event) => {
    if (!document.documentElement.contains(event.target)) {
        showDropdown.value = false;
    }
};

const removeStep = (index) => {
    if (recipe.value.steps.length > 1) {
        recipe.value.steps.splice(index, 1);
    }
};

const toggleDropdown = () => showDropdown.value = !showDropdown.value;

const onImagesChange = (e) => {
    const files = Array.from(e.target.files);
    recipe.value.images = files;
};

const getCurrentUserId = () => useUserStore().user?.id ?? null;

const onIngredientInput = () => {
    const lowercasedInput = ingredientInput.value.toLowerCase();
    filteredIngredients.value = allIngredients.value
        .filter(ingredient => ingredient.name.toLowerCase().includes(lowercasedInput))
        .sort((a, b) => {
            const indexA = a.name.toLowerCase().indexOf(lowercasedInput);
            const indexB = b.name.toLowerCase().indexOf(lowercasedInput);
            return indexA - indexB;
        });
};

const selectIngredient = (ingredient) => {
    if (!ingredientAmounts.value[ingredient.id]) {
        ingredientAmounts.value[ingredient.id] = '';
        selectedIngredients.value.push(ingredient.id);
    }
    ingredientInput.value = '';
    filteredIngredients.value = [];
};

const removeIngredient = (ingredientId) => {
    selectedIngredients.value = selectedIngredients.value.filter(id => Number(id) !== Number(ingredientId));
    if (!selectedIngredients.value.includes(Number(ingredientId))) {
        delete ingredientAmounts.value[ingredientId];
    }
};

const setDifficulty = (starCount) => recipe.value.difficulty = starCount;

const validateField = (field, value) => {
    const fieldNames = {
        name: "Tên công thức",
        steps: "Các bước chế biến",
        servingFor: "số người phục vụ",
        preparationTime: "thời gian chuẩn bị",
        cookingTime: "thời gian chế biến"
    };

    if (typeof value === 'string') {
        switch (field) {
            case 'name':
            case 'steps':
                return value.trim() ? '' : `${fieldNames[field]} không được để trống.`;
            default:
                return '';
        }
    } else if (typeof value === 'number' || !isNaN(value)) {
        switch (field) {
            case 'servingFor':
            case 'preparationTime':
            case 'cookingTime':
                return (value && value > 0) ? '' : `Vui lòng nhập ${fieldNames[field]} hợp lệ.`;
            default:
                return '';
        }
    } else {
        return `Kiểu dữ liệu không hợp lệ cho ${fieldNames[field]}.`;
    }
};

const validateForm = () => {
    const validationFields = ['name', 'preparationTime', 'servingFor', 'cookingTime', 'steps'];
    validationFields.forEach(field => {
        formErrors.value[field] = validateField(field, recipe.value[field]);
    });

    // Xác thực cho mảng steps
    if (recipe.value.steps.length === 0 || !recipe.value.steps.some(step => step.trim() !== '')) {
        formErrors.value.steps = 'Vui lòng thêm ít nhất một bước chế biến có nội dung.';
    } else {
        formErrors.value.steps = '';
    }

    const hasMissingAmounts = selectedIngredients.value.some(id => {
        return !ingredientAmounts.value[id] || !ingredientAmounts.value[id].trim();
    });

    if (!selectedIngredients.value.length) {
        formErrors.value.ingredient = "Vui lòng chọn ít nhất một nguyên liệu.";
    } else if (hasMissingAmounts) {
        formErrors.value.ingredient = "Vui lòng điền số lượng cho tất cả các nguyên liệu đã chọn.";
    } else {
        formErrors.value.ingredient = '';
    }

    return !Object.values(formErrors.value).some(error => error);
};

const processTags = () => {
    const tagsArray = (typeof recipe.value.tags === 'string') ? (recipe.value.tags.match(/#[a-zA-Z0-9_]+/g) || []) : [];
    recipe.value.tags = tagsArray.map(tag => tag.substring(1));
};

const createFormData = () => {
    const formData = new FormData();
    Object.entries(recipe.value).forEach(([key, value]) => {
        if (key !== 'tags' && key !== 'images' && key !== 'steps') {
            formData.append(key, value);
        }
    });

    formData.append('steps', JSON.stringify(recipe.value.steps));

    recipe.value.images.forEach((image) => {
        formData.append('images', image);
    });

    formData.append('tags', JSON.stringify(recipe.value.tags));
    formData.append('ingredients', JSON.stringify(selectedIngredients.value.filter(id => ingredientAmounts.value[id]).map(id => ({
        id,
        amount: ingredientAmounts.value[id]
    }))));
    formData.append('user_id', getCurrentUserId());

    return formData;
};

const prepareFormData = () => {
    processTags();
    return createFormData();
};

const submitRecipe = async () => {
    if (!validateForm()) {
        toast.error('Please fill in all required fields correctly.');
        return;
    }

    isLoading.value = true;

    try {
        await axios.post(`/api/recipes/create`, prepareFormData(), {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        router.push({ name: 'RecipeNewsFeed' });
        toast.success('Recipe uploaded successfully!');
    } catch (error) {
        console.error('Error submitting recipe:', error.response ? error.response.data : error.message);
        toast.error('An error occurred while submitting the recipe. Please try again.');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchIngredients();
    document.addEventListener('click', closeDropdown);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', closeDropdown);
});
</script>

<template>
    <div class="container mt-3">
        <div class="card" style="background-color: rgba(255, 255, 255, 0.12);">
            <div class="card-header text-center">
                <strong>Create Recipe</strong>
            </div>
            <div class="card-body">
                <form @submit.prevent="submitRecipe">
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="recipe-name">Enter recipe name</label>
                            <input type="text" class="form-control" id="recipe-name" v-model="recipe.name">
                            <small class="text-danger">{{ formErrors.name }}</small>

                            <div class="form-group ingredient-selector">
                                <label>Select ingredients</label>
                                <div class="dropdown-wrapper" @click="toggleDropdown">
                                    <input class="form-control" v-model="ingredientInput" @input="onIngredientInput">
                                    <small class="text-danger">{{ formErrors.ingredient }}</small>

                                    <ul v-if="showDropdown && filteredIngredients.length"
                                        class="list-group mt-2 dropdown-ingredient-list">

                                        <li v-for="ingredient in filteredIngredients" :key="ingredient.id"
                                            @click="selectIngredient(ingredient)"
                                            class="list-group-item list-group-item-action cursor-pointer hover-highlight">
                                            {{ ingredient.name }}
                                        </li>

                                    </ul>
                                </div>
                            </div>

                            <div v-for="(amount, ingredientId) in ingredientAmounts" :key="ingredientId"
                                class="mt-2 d-flex align-items-center">
                                <label class="mr-2">{{ allIngredients.find(ing => ing.id == ingredientId).name }}</label>
                                <input type="text" class="form-control mr-2" style="flex: 1;"
                                    v-model="ingredientAmounts[ingredientId]" placeholder="Quantity (e.g., 200 gr)">
                                <button type="button" class="btn btn-danger btn-sm"
                                    @click="removeIngredient(ingredientId)">Remove</button>
                            </div>

                        </div>

                        <div class="form-group col-md-6">
                            <label for="recipe-images">Images</label>
                            <input type="file" multiple class="form-control-file" id="recipe-images"
                                @change="onImagesChange">

                            <div class="mt-3" v-if="imagePreviews.length">
                                <img :src="imagePreviews[0]" alt="Selected Image"
                                    style="height: 170px; width: 100%; position: relative;">
                                <span v-if="imagePreviews.length > 1" class="image-overlay">+{{ imagePreviews.length - 1
                                }}</span>
                            </div>

                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-4">
                            <label for="serving-for">For how many people</label>
                            <input type="number" class="form-control" id="serving-for" v-model="recipe.servingFor"
                                placeholder="Enter number of people...">
                            <small class="text-danger">{{ formErrors.servingFor }}</small>
                        </div>
                        <div class="form-group col-md-4">
                            <label for="preparation-time">Preparation time</label>
                            <input type="number" class="form-control" id="preparation-time" v-model="recipe.preparationTime"
                                placeholder="Enter preparation time (minutes)...">
                            <small class="text-danger">{{ formErrors.preparationTime }}</small>
                        </div>

                        <div class="form-group col-md-4">
                            <label for="cooking-time">Cooking time</label>
                            <input type="number" class="form-control" id="cooking-time" v-model="recipe.cookingTime"
                                placeholder="Enter cooking time (minutes)...">
                            <small class="text-danger">{{ formErrors.cookingTime }}</small>
                        </div>
                    </div>

                    <div class="form-group mb-3">
                        <label for="recipe-steps">Cooking steps</label>
                        <div v-for="(step, index) in recipe.steps" :key="index" class="mb-2">
                            <div class="row">
                                <div class="col-11">
                                    <textarea class="form-control" :placeholder="'Step ' + (index + 1)"
                                        v-model="recipe.steps[index]"></textarea>
                                </div>
                                <div class="col-1 d-flex align-items-center justify-content-center">
                                    <!-- Show delete button only if it's step > 1 and is the last step -->
                                    <button v-if="recipe.steps.length > 1 && index === recipe.steps.length - 1"
                                        type="button" class="btn btn-outline-danger" @click="removeStep(index)">
                                        <i class="bi bi-trash3-fill"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <button type="button" class="btn btn-secondary" @click="addStep">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                        <small class="text-danger d-block mt-2">{{ formErrors.steps }}</small>
                    </div>

                    <div class="form-row">
                        <div class="form-group col-md-10">
                            <label for="tags">HashTags</label>
                            <input type="text" class="form-control" id="tags" v-model="recipe.tags"
                                placeholder="Example: #fish #pork #beef    #fish,#pork,#beef   #fish#pork#beef">
                        </div>

                        <div class="form-group col-md-2">
                            <label for="difficulty">Difficulty</label>
                            <div class="star-container">
                                <span v-for="star in [1, 2, 3]" :key="star">
                                    <i :class="star <= recipe.difficulty ? 'fas fa-star' : 'far fa-star'"
                                        @click="setDifficulty(star)"></i>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-9">
                            <button type="submit" class="btn btn-primary w-100">Post Recipe</button>
                        </div>
                        <div v-if="isLoading" class="text-center col-3">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>

<style src="../../assets/CreatePost.css" scoped></style>
