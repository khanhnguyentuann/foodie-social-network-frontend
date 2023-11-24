<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/max-attributes-per-line -->
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
            <img :src="'http://localhost:3000/' + user.avatar" alt="User Avatar" class="rounded-circle"
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
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      currentPage: 1, // trang hiện tại
      usersPerPage: 4, // số người dùng trên mỗi trang
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.users.length / this.usersPerPage);
    },
    displayedUsers() {
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;
      return this.users.slice(start, end);
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3000/users');
      this.users = response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  },
  methods: {
    goToAddUser() {
      this.$router.push('/admin/user-list/add-user');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    goToEditUser(userId) {
      this.$router.push(`/admin/user-list/edit-user/${userId}`);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    async deleteUser(userId) {
      try {
        const confirmation = confirm('Are you sure you want to delete this user?');

        if (confirmation) {
          await axios.delete(`http://localhost:3000/users/${userId}`);
          // Tải lại danh sách người dùng sau khi xóa
          this.users = this.users.filter(user => user.id !== userId);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    },
  }
}
</script>
