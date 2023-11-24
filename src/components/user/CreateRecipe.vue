<!-- eslint-disable vue/require-v-for-key -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/attributes-order -->
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
                                        <li v-for="ingredient in filteredIngredients" @click="selectIngredient(ingredient)"
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

<script>
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

const BASE_URL = 'http://localhost:3000/recipes';

export default {
    name: 'CreateRecipe',
    data() {
        return {
            recipe: {
                name: '',
                images: [],
                preparationTime: '',
                servingFor: '',
                cookingTime: '',
                steps: [''],
                tags: '',
                difficulty: 1
            },
            allIngredients: [],
            selectedIngredients: [],
            ingredientAmounts: {},
            ingredientInput: '',
            filteredIngredients: [],
            formErrors: {},
            isLoading: false,
            showDropdown: false
        };
    },
    computed: {
        imagePreviews() {
            return this.recipe.images.map(image => URL.createObjectURL(image));
        }
    },
    mounted() {
        this.fetchIngredients();
        document.addEventListener('click', this.closeDropdown);
    },
    beforeDestroy() {
        document.removeEventListener('click', this.closeDropdown);
    },
    methods: {
        addStep() {
            this.recipe.steps.push('');
        },
        removeStep(index) {
            if (this.recipe.steps.length > 1) {
                this.recipe.steps.splice(index, 1);
            }
        },
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        closeDropdown(event) {
            if (!this.$el.contains(event.target)) {
                this.showDropdown = false;
            }
        },
        onImagesChange(e) {
            const files = Array.from(e.target.files);
            this.recipe.images = files;
        },
        getCurrentUserId() {
            return useUserStore().user?.id ?? null;
        },
        isSelected(id) {
            return this.selectedIngredients.includes(id);
        },
        onIngredientInput() {
            const lowercasedInput = this.ingredientInput.toLowerCase();
            this.filteredIngredients = this.allIngredients
                .filter(ingredient => ingredient.name.toLowerCase().includes(lowercasedInput))
                .sort((a, b) => {
                    // Sắp xếp nguyên liệu dựa trên mức độ khớp với từ khoá tìm kiếm
                    const indexA = a.name.toLowerCase().indexOf(lowercasedInput);
                    const indexB = b.name.toLowerCase().indexOf(lowercasedInput);
                    return indexA - indexB;
                })
        },
        selectIngredient(ingredient) {
            if (!this.ingredientAmounts[ingredient.id]) {
                this.ingredientAmounts[ingredient.id] = '';
                this.selectedIngredients.push(ingredient.id);
            }
            this.ingredientInput = '';
            this.filteredIngredients = [];
        },
        removeIngredient(ingredientId) {
            //  Loại bỏ  một ingredientId cụ thể khỏi mảng this.selectedIngredients
            // filter trả về một new array chỉ bao gồm ingredients mà ID của chúng không phải là ingredientId cần xóa.
            this.selectedIngredients = this.selectedIngredients.filter(id => Number(id) !== Number(ingredientId));
            if (!this.selectedIngredients.includes(Number(ingredientId))) {
                delete this.ingredientAmounts[ingredientId];
            }
        },
        setDifficulty(starCount) {
            this.recipe.difficulty = starCount;
        },
        async fetchIngredients() {
            try {
                const response = await axios.get(`${BASE_URL}/create/list-ingredients`);
                this.allIngredients = response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
            }
        },

        validateField(field, value) {
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
        },

        validateForm() {
            const validationFields = ['name', 'preparationTime', 'servingFor', 'cookingTime', 'steps'];
            validationFields.forEach(field => {
                this.formErrors[field] = this.validateField(field, this.recipe[field]);
            });

            // Xác thực cho mảng steps
            if (this.recipe.steps.length === 0 || !this.recipe.steps.some(step => step.trim() !== '')) {
                this.formErrors.steps = 'Vui lòng thêm ít nhất một bước chế biến có nội dung.';
            } else {
                this.formErrors.steps = '';
            }

            const hasMissingAmounts = this.selectedIngredients.some(id => {
                return !this.ingredientAmounts[id] || !this.ingredientAmounts[id].trim();
            });

            if (!this.selectedIngredients.length) {
                this.formErrors.ingredient = "Vui lòng chọn ít nhất một nguyên liệu.";
            } else if (hasMissingAmounts) {
                this.formErrors.ingredient = "Vui lòng điền số lượng cho tất cả các nguyên liệu đã chọn.";
            } else {
                this.formErrors.ingredient = '';
            }

            return !Object.values(this.formErrors).some(error => error);
        },
        processTags() {
            const tagsArray = (typeof this.recipe.tags === 'string') ? (this.recipe.tags.match(/#[a-zA-Z0-9_]+/g) || []) : [];
            this.recipe.tags = tagsArray.map(tag => tag.substring(1));
        },
        createFormData() {
            const formData = new FormData();
            Object.entries(this.recipe).forEach(([key, value]) => {
                if (key !== 'tags' && key !== 'images' && key !== 'steps') {
                    formData.append(key, value);
                }
            });

            formData.append('steps', JSON.stringify(this.recipe.steps));

            this.recipe.images.forEach((image, index) => {
                formData.append('images', image);
            });

            formData.append('tags', JSON.stringify(this.recipe.tags));
            formData.append('ingredients', JSON.stringify(this.selectedIngredients.filter(id => this.ingredientAmounts[id]).map(id => ({
                id,
                amount: this.ingredientAmounts[id]
            }))));
            formData.append('user_id', this.getCurrentUserId());

            return formData;
        },

        prepareFormData() {
            this.processTags();
            return this.createFormData();
        },
        async submitRecipe() {
            if (!this.validateForm()) {
                alert('Vui lòng điền đầy đủ và chính xác thông tin.');
                return;
            }

            this.isLoading = true;

            try {
                console.log('Gửi yêu cầu tạo công thức');
                await axios.post(`${BASE_URL}/create`, this.prepareFormData(), {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Đã nhận phản hồi từ máy chủ');

                this.$router.push('/');
                alert('Đăng tải công thức thành công!');
            } catch (error) {
                console.error('Lỗi khi đăng công thức:', error.response ? error.response.data : error.message);
                alert('Có lỗi xảy ra khi đăng công thức. Vui lòng thử lại.');
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
<style scoped>
.image-overlay {
    position: absolute;
    top: 140px;
    right: 140px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 50%;
    font-weight: bold;
}

input,
textarea {
    background-color: rgba(255, 255, 255, 0.12);
    color: #fff;
}

.form-group {
    margin-bottom: 1.5rem;
}

.btn-block {
    margin-top: 2rem;
}

.cursor-pointer {
    cursor: pointer;
}

.hover-highlight:hover {
    background-color: #e9ecef;
}

i.fas.fa-star,
i.far.fa-star {
    font-size: 24px;
    margin-right: 8px;
    cursor: pointer;
}

.star-container {
    display: flex;
    align-items: center;
    min-height: 38px;
}

i.fas.fa-star {
    color: gold;
}

i.far.fa-star {
    color: lightgray;

}

.ingredient-selector {
    position: relative;
    /* Giúp có thể sử dụng `position: absolute` cho danh sách nguyên liệu bên dưới */
}

.dropdown-ingredient-list {
    max-height: 250px;
    /* Giới hạn chiều cao dropdown */
    overflow-y: auto;
    position: absolute;
    /* Đặt DS nguyên liệu nổi lên */
    top: 100%;
    left: 0;
    width: 100%;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #333;
    z-index: 1000;
}
</style>
