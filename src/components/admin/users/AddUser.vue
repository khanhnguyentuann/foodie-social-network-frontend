<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <div class="add-user-container">

    <button @click="goBack" class="btn btn-secondary mb-3">Quay lại</button>
    <div class="header-section">
      <h3>Add A New User</h3>
    </div>
    <div class="form-section">
      <form @submit.prevent="addUser">
        <div class="form-group">
          <label for="userName" class="form-label">Name</label>
          <input id="userName" v-model="newUser.name" type="text" class="form-control">
        </div>
        <div class="form-group">
          <label for="userEmail" class="form-label">Email</label>
          <input id="userEmail" v-model="newUser.email" type="email" class="form-control">
        </div>
        <div class="form-group">
          <label for="userPassword" class="form-label">Password</label>
          <input id="userPassword" v-model="newUser.password" type="password" class="form-control">
        </div>
        <div class="form-group">
          <label for="userRole" class="form-label">Role</label>
          <select id="userRole" v-model="newUser.role" class="form-control">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Add User</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AddUser',
  data() {
    return {
      newUser: {
        name: '',
        email: '',
        password: '',
        role: 'user',
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1); // Điều hướng người dùng quay lại trang trước đó
    },
    async addUser() {
      const formData = new FormData();

      formData.append('name', this.newUser.name);
      formData.append('email', this.newUser.email);
      formData.append('password', this.newUser.password);
      formData.append('role', this.newUser.role);

      // Nếu có file ảnh được chọn, thêm vào formData
      if (this.selectedFile) {
        formData.append('avatar', this.selectedFile);
      }

      try {
        const response = await axios.post('http://localhost:3000/users', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 201) {
          alert('User added successfully');
          this.$router.push('/admin/user-list');  // Trả về user-list
        } else {
          alert('Failed to add user. Please try again.');
        }
      } catch (error) {
        console.error('Error adding user:', error);
        alert('Error adding user. Please try again.');
      }
    }
  }
}
</script>
  
<style scoped>
.add-user-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.avatar-preview {
  margin-top: 1rem;
  max-width: 150px;
  display: flex;
  justify-content: center;
}

.header-section {
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-actions {
  text-align: center;
}

.card {
  background-color: #6c757d;
  border-color: #6c757d;
}
</style>
