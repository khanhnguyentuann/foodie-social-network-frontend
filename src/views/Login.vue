<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/userStore';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const email = ref('');
const password = ref('');
const router = useRouter();

const goToRegister = () => {
    router.push({ name: 'Register' });
};

const goToForgotPassword = () => {
    router.push({ name: 'ForgotPassword' });
};

const login = async () => {
    const userStore = useUserStore();
    try {
        const response = await axios.post('api/auth/login', {
            email: email.value,
            password: password.value
        });

        const data = response.data;
        if (response.status === 200) {
            userStore.setToken(data.token);
            userStore.setUser(data.user);

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            if (data.user.role === 'admin') {
                router.push({ name: 'Dashboard' });
            } else {
                router.push({ name: 'RecipeNewsFeed' });
            }
            toast.success('Login successful');
        } else {
            console.error('Error logging in:', data.message);
            toast.error(data.message);
        }
    } catch (error) {
        console.error('Error logging in:', error);
        toast.error('An error occurred while logging in');
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
                        <form @submit.prevent="login">
                            <div class="row px-3">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Email Address</h6>
                                </label>
                                <input v-model="email" type="email" class="mb-4" name="email"
                                    placeholder="Enter a valid email address" required />
                            </div>
                            <div class="row px-3">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Password</h6>
                                </label>
                                <input v-model="password" type="password" name="password" placeholder="Enter password"
                                    required />
                            </div>
                            <div class="row px-3 mb-4">
                                <div class="custom-control custom-checkbox custom-control-inline col">
                                    <input id="chk1" type="checkbox" name="chk" class="custom-control-input">
                                    <label for="chk1" class="custom-control-label text-sm">Remember me</label>
                                </div>
                                <a href="#" class="ml-auto col mb-0 text-sm text-right" @click="goToForgotPassword">
                                    Forgot Password?
                                </a>
                            </div>
                            <div class="row mb-3 px-3">
                                <button type="submit" class="btn btn-blue text-center">Login</button>
                            </div>
                            <div class="row mb-4 px-3">
                                <small class="font-weight-bold">Don't have an account? <a class="text-danger"
                                        @click="goToRegister">Register</a></small>
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

  