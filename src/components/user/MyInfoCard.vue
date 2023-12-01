<script setup>
import { useUserStore } from '../../store/userStore';
import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();
const userStore = useUserStore();
const isEditingProfile = ref(false);
const userAvatar = computed(() => `/api/${userStore?.user.avatar}`);
const userName = computed(() => userStore?.user.name || 'Guest');
const userEmail = computed(() => userStore?.user.email || '');

let originalUsername = '';
let originalEmail = '';
let originalAvatar = '';
let selectedAvatar = null;
let editedUsername = '';
let editedEmail = '';
let newPassword = '';
let confirmPassword = '';
const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');
const fileInput = ref(null);

onMounted(() => {
    fileInput.value = document.querySelector('#fileInput');
    originalUsername = userName.value;
    originalEmail = userEmail.value;
    originalAvatar = userAvatar.value;
    editedUsername = originalUsername;
    editedEmail = originalEmail;
});

const selectFile = () => {
    // Kích hoạt sự kiện click của input tệp
    if (fileInput.value) {
        fileInput.value.click();
    }
};

const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        selectedAvatar = selectedFile; // Lưu trữ đối tượng File thay vì chuỗi base64
        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector('#userImage').src = e.target.result; // Gán selectedAvatar vào src của phần tử img và hiển thị ảnh xem trước
        };
        reader.readAsDataURL(selectedFile);
    }
};

const goBack = () => isEditingProfile.value = false;


const editProfile = () => {
    isEditingProfile.value = true;
    editedUsername = userName.value;
    editedEmail = userEmail.value;
    selectedAvatar = userAvatar.value;
    newPassword = '';
    confirmPassword = '';
    usernameError.value = '';
    emailError.value = '';
    passwordError.value = '';
    confirmPasswordError.value = '';
};

const isValidEmail = (email) => {
    const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

const isValidPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
};

const isValidUsername = (username) => {
    const regex = /^[a-zA-ZÀ-ỹ0-9 ]*$/;
    return regex.test(username);
};

const sendUpdateRequest = async () => {
    usernameError.value = '';
    emailError.value = '';
    confirmPasswordError.value = '';
    passwordError.value = '';
    const userId = userStore.user.id;
    const formData = new FormData();
    let hasError = false;

    if (editedUsername !== originalUsername) {
        if (!isValidUsername(editedUsername)) {
            usernameError.value = 'Username should not contain special characters.';
            hasError = true;
        } else {
            formData.append('name', editedUsername);
        }
    }

    if (editedEmail !== originalEmail) {
        if (!isValidEmail(editedEmail)) {
            emailError.value = 'Email is not valid.';
            hasError = true;
        } else {
            formData.append('email', editedEmail);
        }
    }

    if (newPassword !== '') {
        if (confirmPassword === '') {
            confirmPasswordError.value = 'Please enter the confirmation password.';
            hasError = true;
        } else if (newPassword !== confirmPassword) {
            confirmPasswordError.value = 'Passwords do not match.';
            hasError = true;
        } else if (!isValidPassword(newPassword)) {
            passwordError.value = 'Password must be at least 8 characters long and include uppercase, lowercase letters, numbers, and symbols.';
            hasError = true;
        } else {
            formData.append('password', newPassword);
        }
    }

    if (selectedAvatar instanceof File) {
        formData.append('avatar', selectedAvatar);
    }

    if (hasError == false) {
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        return await axios.put(`/api/myprofile/${userId}`, formData, config);
    }

    return null;
};

const updateUserData = async (userId) => {
    const updatedUserData = { ...userStore.user };

    if (editedUsername !== originalUsername) {
        updatedUserData.name = editedUsername;
    }

    if (editedEmail !== originalEmail) {
        updatedUserData.email = editedEmail;
    }

    if (selectedAvatar instanceof File) {
        const response = await axios.get(`/api/myprofile/get-new-avatar/${userId}`);
        const newAvatarPath = response.data.avatar.avatar;
        updatedUserData.avatar = newAvatarPath;
        localStorage.setItem('userAvatar', newAvatarPath);
    }
    isEditingProfile.value = false;
    userStore.setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
};

const saveProfile = async () => {
    if (editedUsername !== originalUsername || editedEmail !== originalEmail || selectedAvatar !== originalAvatar || newPassword !== '') {
        try {
            const response = await sendUpdateRequest();
            if (response === null) return;

            if (response.status === 200) {
                await updateUserData(userStore.user.id);
                toast.success(response.data.message, {});
            } else {
                console.error('Error updating user information:', response.data.message);
                toast.error(response.data.message, {});
            }
        } catch (error) {
            console.error('Error updating user information:', error);
            toast.error('An error occurred while updating user information', {});
        }
    } else {
        toast.info('No changes to update.');
    }
};

</script >

<template>
    <div>
        <div v-if="!isEditingProfile" class="card mb-4">
            <img class="card-img-top" src="https://i.imgur.com/K7A78We.jpg" alt="Card image cap">
            <div class="card-body little-profile text-center">
                <div class="pro-img">
                    <img :src="userAvatar" alt="User Avatar">
                </div>
                <h3 class="mb-2">{{ userName }}</h3>
                <h5 class="mb-2">{{ userEmail }}</h5>
                <a href="javascript:void(0)" class="waves-effect waves-dark btn btn-primary btn-md btn-rounded"
                    data-abc="true" @click="editProfile">
                    Edit Profile
                    <i class="fa fa-pencil ml-2"></i>
                </a>
            </div>
        </div>

        <div v-else class="container rounded bg-white mb-4">
            <form @submit.prevent="saveProfile" class="row">
                <div class="col-md-4 border-right">
                    <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                        <img id="userImage" class="rounded-circle mt-5" :src="selectedAvatar || userAvatar"
                            alt="User Avatar" width="200" height="200">
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <input type="file" class="form-control" accept="image/*" ref="fileInput"
                                    style="display: none" @change="handleFileChange">
                                <button class="btn btn-primary" type="button" @click="selectFile">Upload</button>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="p-3 py-5">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex flex-row align-items-center back" @click="goBack"
                                style="color: #333; cursor: pointer;">
                                <i class="fa fa-long-arrow-left mr-1 mb-1"></i>
                                <h6>Back</h6>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col-md-12">
                                <input type="text" class="form-control" placeholder="Username" v-model="editedUsername">
                                <small v-if="usernameError !== ''" class="text-danger">{{ usernameError }}</small>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <input type="text" class="form-control" placeholder="Email" v-model="editedEmail">
                                <small v-if="emailError !== ''" class="text-danger">{{ emailError }}</small>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <input type="password" class="form-control" placeholder="New Password"
                                    v-model="newPassword">
                                <small v-if="passwordError !== ''" class="text-danger">{{ passwordError }}</small>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <input type="password" class="form-control" placeholder="Confirm New Password"
                                    v-model="confirmPassword">
                                <small v-if="confirmPasswordError !== ''" class="text-danger">{{
                                    confirmPasswordError }}</small>
                            </div>
                        </div>
                        <div class="mt-3 text-right">
                            <button class="btn btn-primary profile-button" type="submit">
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.card-img-top {
    height: 240px;
}

.mb-2 {
    color: #455a64;
}

.card-no-border .card {
    border-color: #d7dfe3;
    border-radius: 4px;
    margin-bottom: 30px;
    -webkit-box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05)
}

.card-body {
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1.25rem
}

.pro-img {
    margin-top: -80px;
    margin-bottom: 20px
}

.little-profile .pro-img img {
    width: 128px;
    height: 128px;
    -webkit-box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    border-radius: 100%
}

.btn-rounded.btn-md {
    padding: 12px 35px;
    font-size: 16px
}

.btn-primary,
.btn-primary.disabled {
    background: #7460ee;
    border: 1px solid #7460ee;
    -webkit-box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14), 0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
    box-shadow: 0 2px 2px 0 rgba(116, 96, 238, 0.14), 0 3px 1px -2px rgba(116, 96, 238, 0.2), 0 1px 5px 0 rgba(116, 96, 238, 0.12);
    -webkit-transition: 0.2s ease-in;
    -o-transition: 0.2s ease-in;
    transition: 0.2s ease-in
}

.btn-rounded {
    border-radius: 60px;
    padding: 7px 18px
}
</style>
