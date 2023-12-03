<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'user',
});
const toast = useToast();
const router = useRouter();

const goBack = () => router.go(-1);

const addUser = async () => {
  const formData = new FormData();

  formData.append('name', newUser.value.name);
  formData.append('email', newUser.value.email);
  formData.append('password', newUser.value.password);
  formData.append('role', newUser.value.role);

  try {
    const response = await axios.post('/api/users', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    if (response.status === 201) {
      toast.success('User added successfully');
      router.push({ name: 'UserList' });
    } else {
      toast.error('Failed to add user. Please try again.');
    }
  } catch (error) {
    console.error('Error adding user:', error);
    toast.error('Error adding user. Please try again.');
  }
};
</script>

<template>
  <div class="add-user-container">

    <button @click="goBack" class="btn btn-secondary mb-3">Back</button>
    <div class="header-section">
      <h3>Add new user</h3>
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
          <button type="submit" class="btn btn-primary">Add</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
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
