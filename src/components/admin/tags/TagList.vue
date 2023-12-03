<script setup>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import makePaginationService from '../../../services/pagination.service';

const toast = useToast();
const router = useRouter();
const tags = ref([]);
const currentPage = ref(1);
const tagsPerPage = 6;
const totalPages = computed(() => Math.ceil(tags.value.length / tagsPerPage));

const { changePage, nextPage, prevPage, calculatePagesToShow, changePageToEllipsis } = makePaginationService(currentPage, totalPages);
const pagesToShow = computed(calculatePagesToShow);
const displayedTags = computed(() => tags.value.slice((currentPage.value - 1) * tagsPerPage, currentPage.value * tagsPerPage));

const fetchTags = async () => {
  try {
    const response = await axios.get('/api/tags');
    tags.value = response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
  }
};

onMounted(fetchTags);

// Methods
const addTag = () => router.push({ name: 'AddTag' });
const editTag = (id) => router.push({ name: 'EditTag', params: { id } })

const deleteTag = async (id) => {
  if (!confirm('Are you sure you want to delete this tag ?')) return;

  try {
    const response = await axios.delete(`/api/tags/${id}`);
    tags.value = tags.value.filter(tag => tag.id !== id);
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error deleting tag:', error);
  }
};
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of hashtags</h3>
      <button class="btn btn-primary" @click="addTag">Add Tag</button>
    </div>

    <form class="form-inline d-flex justify-content-center md-form form-sm">
      <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
      <i class="fas fa-search" aria-hidden="true"></i>
    </form>

    <div v-if="displayedTags.length">
      <table class="table mt-3">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col-8">Name</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody style="color: #fff;">
          <tr v-for="(tag, index) in displayedTags" :key="tag.id">
            <th>{{ (currentPage - 1) * tagsPerPage + index + 1 }}</th>
            <td>{{ tag.id }}</td>
            <td>{{ tag.tag_name }}</td>
            <td>
              <button class="btn btn-warning btn-sm mr-2" @click="editTag(tag.id)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="deleteTag(tag.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mt-4">No tags found.</p>

    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click="prevPage">Previous</a>
        </li>
        <li class="page-item" v-for="(page, index) in pagesToShow" :key="page"
          :class="{ 'active': currentPage === page }">
          <template v-if="typeof page === 'number'">
            <a class="page-link" href="#" @click="() => changePage(page)">{{ page }}</a>
          </template>
          <template v-else>
            <a class="page-link" href="#" @click="() => changePageToEllipsis(page, index)">...</a>
          </template>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click="nextPage">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>