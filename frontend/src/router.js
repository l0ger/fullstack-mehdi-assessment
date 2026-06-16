// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CocktailList from '@/components/cocktails/list.vue';
import CocktailNew from '@/components/cocktails/new.vue';
import CocktailDetail from '@/components/cocktails/detail.vue';

const routes = [
  {
    path: '/',
    name: 'CocktailList',
    component: CocktailList,
  },
  {
    path: '/new',
    name: 'CocktailNew',
    component: CocktailNew,
  },
  {
    path: '/cocktails/:id',
    name: 'CocktailDetail',
    component: CocktailDetail,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;