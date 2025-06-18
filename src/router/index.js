import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

import Layout from '@/components/home/Layout.vue';
import HomePage from '@/components/home/HomePage.vue';
import Login from '@/components/registration/Login.vue';
import Register from '@/components/registration/Register.vue';
import Papers from '@/components/papers/Papers.vue';
import PaperDetails from '@/components/papers/PaperDetails.vue';
import Dashboard from '@/components/dashboard/Dashboard.vue';
import Uploads from '@/components/dashboard/Uploads.vue';
import Downloads from '@/components/dashboard/Downloads.vue';
import Profile from '@/components/dashboard/Profile.vue';
import Earnings from '@/components/dashboard/Earnings.vue';
import UploadFile from '@/components/dashboard/UploadFile.vue';
import Reviews from '@/components/dashboard/Reviews.vue';
import Statistics from '@/components/dashboard/Statistics.vue';
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue';
import Checkout from '@/components/dashboard/checkout.vue';
import PaypalSuccess from '@/components/papers/PaypalSuccess.vue';
import PaypalFailure from '@/components/papers/PaypalFailure.vue';
import StripePaymentSuccess from '@/components/papers/StripePaymentSuccess.vue';
import StripePaymentFailure from '@/components/papers/StripePaymentFailure.vue';
import CoursesPage from '@/components/papers/CoursesPage.vue';
import CategoriesPage from '@/components/papers/CategoriesPage.vue';
import CategoryPapersPage from '@/components/papers/CategoryPapersPage.vue';
import CoursePapersPage from '@/components/papers/CoursePapersPage.vue';
import PaperDownloadView from '@/components/papers/PaperDownloadView.vue';

const routes = [
    {
        path: '/',
        component: Layout, // Layout wraps HomePage, Login, and Register
        children: [
            { path: '', component: HomePage },
            { path: 'login', component: Login },
            { path: 'register', component: Register },
            { path: 'papers', component: Papers },
            { path: '/papers/:id', name: 'paper-details', component: PaperDetails },
            { path: '/payment-success', component: PaypalSuccess },
            { path: '/payment-failure', component: PaypalFailure },
            { path: '/stripe-payment-success', component: StripePaymentSuccess },
            { path: '/stripe-payment-cancelled', component: StripePaymentFailure },
            { path: '/courses', name: 'Courses', component: CoursesPage },
            { path: '/categories', name: 'Categories', component: CategoriesPage },
            {
                path: '/categories/:categoryId/papers',
                name: 'CategoryPapersPage',
                component: CategoryPapersPage,
            },
            {
                path: '/courses/:courseId/papers',
                name: 'CoursePapersPage',
                component: CoursePapersPage,
            },

            {
                path: '/papers/:id/download',
                name: 'PaperDownloadView',
                component: PaperDownloadView,
            },
        ],
    },
    {
        path: '/dashboard',
        component: DashboardLayout, // Wrap Dashboard with DashboardLayout
        meta: { requiresAuth: true },
        children: [
            { path: '', component: Dashboard },
            { path: 'uploads', component: Uploads },
            { path: 'downloads', component: Downloads },
            { path: 'profile', component: Profile },
            { path: 'earnings', component: Earnings },
            { path: 'upload-file', component: UploadFile },
            { path: 'reviews', component: Reviews },
            { path: 'statistics', component: Statistics },
            { path: 'checkout', component: Checkout },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.authentication.token) {
        next({
            path: '/login',
            query: { redirect: to.fullPath },
        });
    } else {
        next();
    }
});

export default router;
