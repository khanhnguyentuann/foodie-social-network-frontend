<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const email = ref('');
const otp = ref('');
const router = useRouter();
const otpSent = ref(false);
const countdown = ref(60); // 60 giây
const intervalId = ref(null);
const newPassword = ref('');
const confirmPassword = ref('');
const resetToken = ref('');
const showOTPIsVisible = ref(true);
const passwordError = ref('');
const confirmPasswordError = ref('');

const redirectToLogin = () => {
    router.push({ name: 'Login' });
};

const handleApiResponse = (response) => {
    if (response.status === 200) {
        toast.success(response.data.message);
    } else {
        console.error('API error:', response.data);
        toast.error(response.data.error);
    }
};

const validate = () => {
    passwordError.value = !isValidPassword(newPassword.value) ? 'Password must be at least 8 characters long and include uppercase, lowercase letters, numbers, and symbols.' : '';
    confirmPasswordError.value = newPassword.value !== confirmPassword.value ? 'Passwords do not match.' : '';
};

const isValidPassword = (password) => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    return regex.test(password);
};

const sendOTP = async () => {
    if (email.value != '') {
        try {
            const response = await axios.post('api/auth/forgot-password', {
                email: email.value
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                otpSent.value = true;
                intervalId.value = setInterval(() => {
                    countdown.value -= 1;
                    if (countdown.value <= 0) {
                        clearInterval(intervalId.value);
                        otpSent.value = false;
                    }
                }, 1000); // giảm 1 giây mỗi lần

            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error sending otp:', error);
            toast.error('An error occurred. Please try again.');
        }
    } else {
        toast.error('Please enter an email!');
    }
};

const verifyOTP = async () => {
    try {
        const response = await axios.post('api/auth/verify-otp', {
            email: email.value,
            otp: otp.value
        });

        if (response.status === 200) {
            toast.success(response.data.message);
            showOTPIsVisible.value = false; // Ẩn form
            resetToken.value = response.data.resetToken; // Lấy resetToken từ phản hồi JSON
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        toast.error('An error occurred. Please try again.');
    }
};

const resetPassword = async () => {
    validate();

    if (passwordError.value || confirmPasswordError.value) {
        return;
    }

    try {
        const response = await axios.post('api/auth/reset-password', {
            resetToken: resetToken.value,
            newPassword: newPassword.value
        });

        handleApiResponse(response);

        if (response.status === 200) {
            redirectToLogin();
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        toast.error('An error occurred. Please try again.');
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
                        <div class="row mb-4 px-3">
                            <h6 class="mb-0 mr-4 mt-2">Forgot Password</h6>
                        </div>
                        <div class="row px-3 mb-4">
                            <div class="line"></div>
                        </div>

                        <!-- Form gửi OTP và Verify OTP -->
                        <form v-if="showOTPIsVisible" @submit.prevent="verifyOTP">
                            <label class="mb-1">
                                <h6 class="mb-0 text-sm">Email Address</h6>
                            </label>
                            <div class="row">
                                <div class="col-md-8">
                                    <input v-model="email" type="email" class="mb-4" name="email"
                                        placeholder="Enter your email address" required />
                                </div>
                                <div class="col-md-4 mb-4 d-flex justify-content-center align-items-center">
                                    <button type="button" @click="sendOTP" :disabled="otpSent"
                                        class="btn btn-blue text-center">
                                        <span v-if="otpSent">Resend in {{ countdown }}s</span>
                                        <span v-else>Send OTP</span>
                                    </button>
                                </div>
                            </div>

                            <div class="row px-3">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">OTP Code</h6>
                                </label>
                                <input v-model="otp" type="text" name="otp" placeholder="Enter your OTP" required />
                            </div>

                            <div class="row mb-3 px-3 mt-4">
                                <button type="submit" class="btn btn-blue text-center">Verify OTP</button>
                            </div>

                            <div class="row mb-4 px-3">
                                <small class="font-weight-bold">Remember your password? <a class="text-danger"
                                        @click="redirectToLogin">Login</a></small>
                            </div>
                        </form>

                        <!-- Form reset mật khẩu -->
                        <form v-else @submit.prevent="resetPassword">
                            <div class="row px-3">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">New Password</h6>
                                </label>
                                <input v-model="newPassword" type="password" name="newPassword"
                                    placeholder="Enter your new password" required />
                                <small v-if="passwordError !== ''" class="text-danger">{{ passwordError }}</small>
                            </div>

                            <div class="row px-3 mt-4">
                                <label class="mb-1">
                                    <h6 class="mb-0 text-sm">Confirm New Password</h6>
                                </label>
                                <input v-model="confirmPassword" type="password" name="confirmPassword"
                                    placeholder="Confirm your new password" required />
                                <small v-if="confirmPasswordError !== ''" class="text-danger">{{ confirmPasswordError
                                }}</small>
                            </div>

                            <div class="row mb-3 px-3 mt-4">
                                <button type="submit" class="btn btn-blue text-center">Reset Password</button>
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
  