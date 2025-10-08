import api from '@/api';

const state = {
    blogPosts: [],
    categories: [],
    tags: [],
    loading: false,
    error: null,
    selectedPost: null,
    likeStatus: {},
};

const mutations = {
    SET_BLOG_POSTS(state, posts) {
        state.blogPosts = posts;
    },
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_TAGS(state, tags) {
        state.tags = tags;
    },
    SET_LOADING(state, status) {
        state.loading = status;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    SET_SELECTED_POST(state, post) {
        state.selectedPost = post;
    },
    ADD_BLOG_POST(state, post) {
        state.blogPosts.unshift(post);
    },
    UPDATE_BLOG_POST(state, updatedPost) {
        const index = state.blogPosts.findIndex((post) => post.id === updatedPost.id);
        if (index !== -1) {
            state.blogPosts.splice(index, 1, updatedPost);
        }
        if (state.selectedPost && state.selectedPost.id === updatedPost.id) {
            state.selectedPost = updatedPost;
        }
    },
    DELETE_BLOG_POST(state, postId) {
        state.blogPosts = state.blogPosts.filter((post) => post.id !== postId);
        if (state.selectedPost && state.selectedPost.id === postId) {
            state.selectedPost = null;
        }
    },
    ADD_COMMENT(state, { postId, comment }) {
        const post = state.blogPosts.find((p) => p.id === postId);
        if (post && post.comments) {
            post.comments.push(comment);
        }
        if (state.selectedPost && state.selectedPost.id === postId) {
            if (!state.selectedPost.comments) {
                state.selectedPost.comments = [];
            }
            state.selectedPost.comments.push(comment);
        }
    },
    UPDATE_LIKES(state, { postId, likesCount, liked }) {
        // Update blog posts list
        const post = state.blogPosts.find((p) => p.id === postId);
        if (post) {
            post.likes_count = likesCount;
        }

        // Update selected post
        if (state.selectedPost && state.selectedPost.id === postId) {
            state.selectedPost.likes_count = likesCount;
        }

        // Update like status
        state.likeStatus[postId] = liked;
    },
    CLEAR_ERROR(state) {
        state.error = null;
    },
    CLEAR_SELECTED_POST(state) {
        state.selectedPost = null;
    },
};

const actions = {
    async fetchBlogPosts({ commit }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.get('/blog/posts/');
            commit('SET_BLOG_POSTS', response.data.results || response.data);
        } catch (error) {
            commit('SET_ERROR', error.response?.data || 'Failed to fetch blog posts.');
            console.error('Error fetching blog posts:', error);
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchSinglePost({ commit }, slug) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.get(`/blog/posts/${slug}/`);
            commit('SET_SELECTED_POST', response.data);
        } catch (error) {
            commit('SET_ERROR', error.response?.data || 'Failed to fetch post.');
            console.error('Error fetching single post:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async createBlogPost({ commit }, formData) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.post('/blog/posts/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            commit('ADD_BLOG_POST', response.data);
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data || 'Failed to create post.';
            commit('SET_ERROR', errorMsg);
            console.error('Error creating blog post:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async updateBlogPost({ commit }, { postId, formData }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.put(`/blog/posts/${postId}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            commit('UPDATE_BLOG_POST', response.data);
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data || 'Failed to update post.';
            commit('SET_ERROR', errorMsg);
            console.error('Error updating blog post:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async deleteBlogPost({ commit }, postId) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            await api.delete(`/blog/posts/${postId}/`);
            commit('DELETE_BLOG_POST', postId);
        } catch (error) {
            const errorMsg = error.response?.data || 'Failed to delete post.';
            commit('SET_ERROR', errorMsg);
            console.error('Error deleting blog post:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async fetchCategories({ commit }) {
        try {
            const response = await api.get('/blog/categories/');
            commit('SET_CATEGORIES', response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    },

    async fetchTags({ commit }) {
        try {
            const response = await api.get('/blog/tags/');
            commit('SET_TAGS', response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    },

    async addComment({ commit }, { postId, content }) {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        try {
            const response = await api.post(`/blog/${postId}/comments/`, { content });
            const comment = response.data;
            commit('ADD_COMMENT', { postId, comment });
            return comment;
        } catch (error) {
            const errorMsg = error.response?.data || 'Failed to add comment.';
            commit('SET_ERROR', errorMsg);
            console.error('Error adding comment:', error);
            throw error;
        } finally {
            commit('SET_LOADING', false);
        }
    },

    async toggleLike({ commit, state }, postId) {
        commit('SET_ERROR', null);
        try {
            const response = await api.post(`/blog/${postId}/like/`);
            const { message } = response.data;
            const isLiked = message === 'Liked';
            const currentPost = state.blogPosts.find((p) => p.id === postId) || state.selectedPost;
            const currentLikes = currentPost?.likes_count || 0;
            const newLikesCount = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);

            commit('UPDATE_LIKES', {
                postId,
                likesCount: newLikesCount,
                liked: isLiked,
            });

            return { liked: isLiked, likesCount: newLikesCount };
        } catch (error) {
            const errorMsg = error.response?.data || 'Failed to toggle like.';
            commit('SET_ERROR', errorMsg);
            console.error('Error toggling like:', error);
            throw error;
        }
    },

    async checkLikeStatus({ commit, state }, postId) {
        // Since the backend doesn't have a check endpoint, we'll assume not liked initially
        // You might want to add this endpoint to your Django API
        if (!state.likeStatus.hasOwnProperty(postId)) {
            commit('UPDATE_LIKES', { postId, likesCount: 0, liked: false });
        }
        return state.likeStatus[postId] || false;
    },

    clearError({ commit }) {
        commit('CLEAR_ERROR');
    },

    clearSelectedPost({ commit }) {
        commit('CLEAR_SELECTED_POST');
    },
};

const getters = {
    blogPosts: (state) => state.blogPosts,
    categories: (state) => state.categories,
    tags: (state) => state.tags,
    blogLoading: (state) => state.loading,
    blogError: (state) => state.error,
    selectedPost: (state) => state.selectedPost,
    isLiked: (state) => (postId) => state.likeStatus[postId] || false,
    getPostsByCategory: (state) => (categoryId) => {
        return state.blogPosts.filter((post) => post.category?.id === categoryId);
    },
    getPostsByTag: (state) => (tagId) => {
        return state.blogPosts.filter((post) => post.tags?.some((tag) => tag.id === tagId));
    },
    getFeaturedPosts: (state) => {
        return state.blogPosts.slice(0, 3);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
