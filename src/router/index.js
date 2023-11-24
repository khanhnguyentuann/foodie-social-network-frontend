import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../store/userStore';

const isSignedIn = () => {
    const userStore = useUserStore();
    return userStore.isAuthenticated;
};

const isAdmin = () => {
    const userStore = useUserStore();
    return userStore.user.role === 'admin';
};

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPassword.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/NotFoundView.vue'),
    },
    {
        path: '/',
        component: () => import('../views/UserLayouts.vue'),
        children: [
            {
                path: '',
                name: 'RecipeNewsFeed',
                component: () => import('../components/user/RecipeNewsFeed.vue'),
            },
            {
                path: 'create-recipe',
                name: 'CreateRecipe',
                component: () => import('../components/user/CreateRecipe.vue')
            },
            {
                path: '/myprofile',
                name: 'MyProfile',
                component: () => import('../components/user/MyProfile.vue')
            },
            {
                path: '/otherprofile/:userId',
                name: 'OtherProfile',
                component: () => import('../components/user/OtherProfile.vue'),
                props: true
            },
            {
                path: 'friends',
                name: 'FriendList',
                component: () => import('../components/user/FriendList.vue')
            },
            {
                path: '/friends/requests',
                name: 'FriendRequest',
                component: () => import('../components/user/FriendRequest.vue')
            },
            {
                path: 'favorites',
                name: 'FavoriteRecipe',
                component: () => import('../components/user/FavoriteRecipe.vue')
            },
            {
                path: 'postdetails/:id',
                name: 'PostDetails',
                component: () => import('../components/user/PostDetails.vue'),
            },
            {
                path: 'tagsearch',
                name: 'TagSearch',
                component: () => import('../components/user/TagSearch.vue')
            },
            {
                path: 'titlesearch',
                name: 'TitleSearch',
                component: () => import('../components/user/TitleSearch.vue')
            },
            {
                path: 'advancedsearch',
                name: 'AdvancedSearch',
                component: () => import('../components/user/AdvancedSearch.vue')
            },
            {
                path: 'conversations',
                name: 'Conversations',
                component: () => import('../components/user/Conversations.vue')
            },
            {
                path: 'conversations/chat/:otherUserId/:conversationId',
                name: 'ChatBox',
                component: () => import('../components/user/ChatBox.vue'),
                props: true
            }
        ]
    },
    {
        path: '/admin',
        component: () => import('../views/AdminLayouts.vue'),
        children: [
            {
                path: '',
                name: 'Dashboard',
                component: () => import('../components/admin/dashboard/Dashboard.vue')
            },
            {
                path: 'user-list',
                name: 'UserList',
                component: () => import('../components/admin/users/UserList.vue')
            },
            {
                path: 'user-list/add-user',
                name: 'AddUser',
                component: () => import('../components/admin/users/AddUser.vue')
            },
            {
                path: 'user-list/edit-user/:id',
                name: 'EditUser',
                component: () => import('../components/admin/users/EditUser.vue')
            },
            {
                path: 'tag-list',
                name: 'TagList',
                component: () => import('../components/admin/tags/TagList.vue')
            },
            {
                path: 'tag-list/add-tag',
                name: 'AddTag',
                component: () => import('../components/admin/tags/AddTag.vue')
            },
            {
                path: 'tag-list/edit-tag/:id',
                name: 'EditTag',
                component: () => import('../components/admin/tags/EditTag.vue')
            },
            {
                path: 'ingredient-list',
                name: 'IngredientList',
                component: () => import('../components/admin/ingredients/IngredientList.vue')
            },
            {
                path: 'ingredient-list/add-ingredient',
                name: 'AddIngredient',
                component: () => import('../components/admin/ingredients/AddIngredient.vue')
            },
            {
                path: 'ingredient-list/edit-ingredient/:id',
                name: 'EditIngredient',
                component: () => import('../components/admin/ingredients/EditIngredient.vue')
            },
            {
                path: 'comments',
                name: 'Comments',
                component: () => import('../components/admin/comments/Comments.vue')
            },
            {
                path: 'comments/:recipeId',
                name: 'CommentList',
                component: () => import('../components/admin/comments/CommentList.vue')
            },
            {
                path: 'notifications',
                name: 'NotificationPanel',
                component: () => import('../components/admin/notifications/Notifications.vue')
            },
            {
                path: 'recipes-list',
                name: 'RecipesList',
                component: () => import('../components/admin/recipes/RecipesList.vue')
            },
            {
                path: 'recipes-list/:id',
                name: 'RecipesDetail',
                component: () => import('../components/admin/recipes/RecipesDetail.vue'),
                props: true
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path.startsWith('/admin')) {
        if (!isSignedIn()) {
            next('/login');
        } else if (!isAdmin()) {
            next('/');
        } else {
            next();
        }
    } else if (to.path !== '/login' && to.path !== '/register' && to.path !== '/forgot-password' && !isSignedIn()) {
        next('/login');
    } else {
        next();
    }
});

export default router;