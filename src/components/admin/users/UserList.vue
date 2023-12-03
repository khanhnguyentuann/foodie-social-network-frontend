<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import makePaginationService from '../../../services/pagination.service';

const toast = useToast();
const router = useRouter();
const users = ref([]);
const currentPage = ref(1);
const usersPerPage = 4;
const totalPages = computed(() => Math.ceil(users.value.length / usersPerPage));

const { changePage, nextPage, prevPage, calculatePagesToShow, changePageToEllipsis } = makePaginationService(currentPage, totalPages);
const pagesToShow = computed(calculatePagesToShow);
const displayedUsers = computed(() => users.value.slice((currentPage.value - 1) * usersPerPage, currentPage.value * usersPerPage));

const fetchUsers = async () => {
  try {
    const response = await axios.get('/api/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

onMounted(fetchUsers);

const goToAddUser = () => router.push({ name: 'AddUser' });
const goToEditUser = (userId) => router.push({ name: 'EditUser', params: { userId } });

const formatDate = (date) => new Date(date).toLocaleDateString();

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const response = await axios.delete(`/api/users/${userId}`);
    users.value = users.value.filter(user => user.id !== userId);
    toast.success(response.data.message);
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error()
  }
};

</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3>List of users</h3>
      <button class="btn btn-primary" @click="goToAddUser">Add User</button>
    </div>

    <form class="form-inline d-flex justify-content-center md-form form-sm">
      <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search" aria-label="Search">
      <i class="fas fa-search" aria-hidden="true"></i>
    </form>

    <table class="table mt-3">
      <thead class="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Avatar</th>
          <th scope="col">Username</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Join Date</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody style="color: #fff;">
        <tr v-for="user in displayedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>
            <img :src="user?.avatar ? '/api/' + user.avatar : ''" alt="User Avatar" class="rounded-circle"
              style="width: 50px;">
          </td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td><span class="badge bg-secondary">{{ user.role }}</span></td>
          <td>{{ formatDate(user.join_date) }}</td>
          <td>
            <button class="btn btn-warning btn-sm mr-2" @click="goToEditUser(user.id)">Update</button>
            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

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
