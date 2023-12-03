<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const usernameError = ref('');
const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Các hàm validate và register
const validate = () => {
    usernameError.value = !isValidUsername(username.value) ? 'Username should not contain special characters.' : '';
    emailError.value = !isValidEmail(email.value) ? 'Email is not valid.' : '';
    passwordError.value = !isValidPassword(password.value) ? 'Password must be at least 8 characters long and include uppercase, lowercase letters, numbers, and symbols.' : '';
    confirmPasswordError.value = password.value !== confirmPassword.value ? 'Passwords do not match.' : '';
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

const goToLogin = () => {
    router.push({ name: 'Login' });
};

const register = async () => {
    validate();

    if (usernameError.value || emailError.value || passwordError.value || confirmPasswordError.value) {
        return;
    }

    try {
        const response = await axios.post('/api/auth/register', {
            username: username.value,
            email: email.value,
            password: password.value
        });

        if (response.status === 201) {
            toast.success("Success! You're In!");
            router.push({ name: 'Login' });
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        if (error.response && error.response.data) {
            toast.error(error.response.data.message || 'Error during registration');
        } else {
            toast.error(error.message || 'Registration error');
        }
    }
};
</script>

<template>
    <div class="container-fluid px-1 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
        <div class="card card0 border-0">
            <div class="row d-flex">
                <div class="col-lg-6">
                    <div class="card1 pb-5">
                        <div class="row">
                            <img src="@/assets/logos/main_logo.png" class="logo">
                        </div>
                        <div class="row px-3 justify-content-center mt-4 mb-5 border-line">
                            <img src="@/assets/images/login-image.jpg" class="image">
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card2 card border-0 px-4 py-5">
                        <div class="row px-3">
                            <h6 class="mb-0 col mr-4 mt-2">Login with </h6>
                            <div class="social-contact ml-4 ml-sm-5 mb-2 col">
                                <span class="fab fa-facebook-f mr-4 text-sm"></span>
                                <span class="fab fa-google-plus-g mr-4 text-sm"></span>
                                <span class="fab fa-linkedin-in mr-4 text-sm"></span>
                                <span class="fab fa-twitter mr-4 mr-sm-5 text-sm"></span>
                            </div>
                        </div>
                        <div class="row px-2 mb-4">
                            <div class="line"></div>
                            <div class="line"></div>
                        </div>

                        <form @submit.prevent="register">
                            <div class="row px-3 mt-4">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Username</h6>
                                </label>
                                <input v-model="username" type="text" name="username" placeholder="Enter a username"
                                    required />
                                <small v-if="usernameError !== ''" class="text-danger">{{ usernameError }}</small>
                            </div>
                            <div class="row px-3 mt-4">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Email Address</h6>
                                </label>
                                <input v-model="email" type="email" name="email" placeholder="Enter a valid email address"
                                    required />
                                <small v-if="emailError !== ''" class="text-danger">{{ emailError }}</small>
                            </div>
                            <div class="row px-3 mt-4">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Password</h6>
                                </label>
                                <input v-model="password" type="password" name="password" placeholder="Enter password"
                                    required />
                                <small v-if="passwordError !== ''" class="text-danger">{{ passwordError }}</small>
                            </div>
                            <div class="row px-3 mt-4">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Confirm Password</h6>
                                </label>
                                <input v-model="confirmPassword" type="password" name="confirmPassword"
                                    placeholder="Confirm password" required />
                                <small v-if="confirmPasswordError !== ''" class="text-danger">{{ confirmPasswordError
                                }}</small>
                            </div>
                            <div class="row mb-3 px-3 mt-4">
                                <button type="submit" class="btn btn-blue text-center">Register</button>
                            </div>
                            <div class="row mb-4 px-3">
                                <small class="font-weight-bold">Already have an account? <a class="text-danger"
                                        @click="goToLogin">Login</a></small>
                            </div>
                        </form>

                    </div>
                </div>
            </div>

            <div class="bg-blue py-4">
                <div class="row px-3">
                    <div class="social-contact ml-4 ml-sm-5 mb-2">
                        <span class="fab fa-facebook-f mr-4 text-sm"></span>
                        <span class="fab fa-google-plus-g mr-4 text-sm"></span>
                        <span class="fab fa-linkedin-in mr-4 text-sm"></span>
                        <span class="fab fa-twitter mr-4 mr-sm-5 text-sm"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style src="../assets/AuthStyles.css" scoped></style>
