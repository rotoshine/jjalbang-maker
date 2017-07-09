<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link to="/" class="navbar-brand">짤방생성기</router-link>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li v-for="source in sources">
              <router-link v-bind:to="'/sources/' + source.id">{{source.name}}</router-link>
            </li>
            <li>
              <router-link to="/source-extract">소스 생성</router-link>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li v-if="isLoginCheckComplete" class="auth-buttons">
              <button v-if="!isLogin" class="btn btn-sm btn-primary" v-on:click="login()"><i class="fa fa-twitter"></i>
                로그인
              </button>
              <button v-else-if="isLogin" class="btn btn-sm btn-primary" v-on:click="logout()">
                {{displayName}} 로그아웃
              </button>
            </li>
            <li v-else-if="!isLoginCheckComplete">
              <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
              <span class="sr-only">Loading...</span>
            </li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
  import 'bootstrap/dist/css/bootstrap.min.css';
  import sources from './assets/sources';

  const { firebase } = window;
  export default {
    name: 'app',
    data() {
      return {
        sources,
        isLoginCheckComplete: false,
        isLogin: false,
        displayName: null
      };
    },
    mounted() {
      this.loadCurrentUser();
      firebase.auth().getRedirectResult().then(() => {
        this.loadCurrentUser();
      });
    },
    methods: {
      loadCurrentUser() {
        if (firebase.auth().currentUser !== null) {
          this.isLogin = true;
          this.displayName = firebase.auth().currentUser.displayName;
        }
        this.isLoginCheckComplete = true;
      },
      login() {
        const provider = new firebase.auth.TwitterAuthProvider();
        firebase.auth().signInWithRedirect(provider);
      },
      logout() {
        firebase.auth().signOut().then(() => {
          this.isLogin = false;
          this.user = null;
        });
      }
    }
  };
</script>

<style>
  .auth-buttons {
    padding-top: 10px;
  }
</style>
