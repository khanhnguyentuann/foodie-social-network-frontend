<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();
const router = useRouter();
const route = useRoute();

const user = reactive({
    id: '',
    name: '',
    email: '',
    password: '',
    role: '',
    avatar: null
});

const avatarPreview = ref(null);

onMounted(async () => {
    try {
        const userId = route.params.userId;
        const response = await axios.get(`/api/users/${userId}`);
        Object.assign(user, response.data);
        if (user.avatar) {
            avatarPreview.value = '/api/' + user.avatar;
        }
        user.password = null;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});

const uploadAvatar = (event) => {
    const file = event.target.files[0];
    if (file) {
        user.avatar = file;

        const reader = new FileReader();
        reader.onload = (e) => {
            avatarPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const updateUser = async () => {
    try {
        const userId = route.params.userId;
        const formData = new FormData();

        if (!user.password || user.password.trim() === '') {
            delete user.password;
        }

        for (let key in user) {
            formData.append(key, user[key]);
        }

        const config = { headers: { 'Content-Type': 'multipart/form-data' } };

        const response = await axios.put(`/api/users/${userId}`, formData, config);

        if (response.status == 200) {
            toast.success('User updayed successfully!');
            router.push({ name: 'UserList' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        toast.error('Error updating user. Please try again.');
    }
};

const goBack = () => router.go(-1);
</script>

<template>
    <div class="edit-user-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Back</button>
        <div class="header-section">
            <h3>Update this user</h3>
        </div>
        <div class="form-section">
            <form @submit.prevent="updateUser" class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="userAvatar" class="form-label">Avatar</label>
                        <input id="userAvatar" ref="avatarInput" type="file" class="form-control" @change="uploadAvatar" />
                    </div>
                    <div class="avatar-preview" v-if="avatarPreview">
                        <img :src="avatarPreview" alt="Avatar Preview" height="200" width="200" class="rounded-circle">
                    </div>
                </div>

                <div class="col-md-8">
                    <div class="form-group">
                        <label for="userName" class="form-label">Name</label>
                        <input id="userName" v-model="user.name" type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="userEmail" class="form-label">Email</label>
                        <input id="userEmail" v-model="user.email" type="email" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="userPassword" class="form-label">Password</label>
                        <input id="userPassword" v-model="user.password" type="password" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="userRole" class="form-label">Role</label>
                        <select id="userRole" v-model="user.role" class="form-control">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Update</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
  
<style scoped>
.edit-user-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.header-section {
    margin-bottom: 2rem;
    text-align: center;
}

.form-group {
    margin-bottom: 1.5rem;
}

.avatar-preview {
    margin-top: 1rem;
    max-width: 150px;
    display: flex;
    justify-content: center;
}

.form-actions {
    text-align: center;
}
</style>
  