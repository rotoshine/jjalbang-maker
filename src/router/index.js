import Vue from 'vue';
import Router from 'vue-router';
import ImageGenerator from '../components/ImageGenerator';
import SourceExtractor from '../components/SourceExtractor';
import NotFound from '../components/NotFound';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/sources/:sourceId',
      name: 'ImageGenerator',
      component: ImageGenerator,
    },
    {
      path: '/source-extract',
      component: SourceExtractor
    },
    {
      path: '/',
      redirect: '/sources/10'
    },
    {
      path: '*',
      component: NotFound
    }
  ],
});
