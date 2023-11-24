<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/attributes-order -->
<!-- eslint-disable vue/first-attribute-linebreak -->
<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/max-attributes-per-line -->
<!-- eslint-disable vue/html-indent -->
<template>
    <div class="edit-user-container">
        <button @click="goBack" class="btn btn-secondary mb-3">Quay lại</button>
        <div class="header-section">
            <h3>Update For This User</h3>
        </div>
        <div class="form-section">
            <form @submit.prevent="updateUser" class="row">
                <div class="col-md-4">
                    <div class="form-group">
                        <label for="userAvatar" class="form-label">Avatar</label>
                        <input id="userAvatar" ref="avatarInput" type="file" class="form-control" @change="uploadAvatar" />
                    </div>
                    <div class="avatar-preview" v-if="avatarPreview">
                        <img :src="avatarPreview" alt="Avatar Preview">
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
                        <button type="submit" class="btn btn-primary">Update User</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    name: 'EditUser',
    data() {
        return {
            user: {
                id: '',
                name: '',
                email: '',
                password: '',
                role: '',
                avatar: null
            },
            avatarPreview: null
        };
    },
    async mounted() {
        try {
            const userId = this.$route.params.id;  // Get user ID from route
            const response = await axios.get(`http://localhost:3000/users/${userId}`);
            this.user = response.data;
            this.user.password = null;  // Set password to null
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1); // Điều hướng người dùng quay lại trang trước đó
        },
        uploadAvatar(event) {
            const file = event.target.files[0];
            if (file) {
                this.user.avatar = file;

                // Hiển thị ảnh xem trước
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.avatarPreview = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        },
        async updateUser() {
            try {
                const userId = this.$route.params.id;
                const formData = new FormData();

                // Nếu mật khẩu mới không được cung cấp, xóa trường mật khẩu khỏi đối tượng user
                if (!this.user.password || this.user.password.trim() === '') {
                    delete this.user.password;
                }

                for (let key in this.user) {
                    formData.append(key, this.user[key]);
                }

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                };

                const response = await axios.put(`http://localhost:3000/users/${userId}`, formData, config);

                if (response.data.message === 'User updated successfully') {
                    alert('User updated successfully');
                    this.$router.push('/admin/user-list');
                }
            } catch (error) {
                console.error('Error updating user:', error);
                alert('Error updating user. Please try again.');
            }
        }
    }
}
</script>
  
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
  