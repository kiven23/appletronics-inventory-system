<template >
  <div class="q-pa-md hero-image">
    <q-layout view="hHh Lpr lff">
      <q-header elevated style="background: linear-gradient(#4db8ff, #005c99)">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>WebPortal</q-toolbar-title>
          <div class="text-h4">
            <q-btn class="glossy" color="teal" dense icon="menu">
              <q-menu>
                <div class="row no-wrap q-pa-md">
                  <div class="column">
                    <div class="text-h6 q-mb-md">Options</div>
                    <p>Version 1.0</p>
                    <br />
                    <q-btn
                      color="teal"
                      size="sm"
                      label="About"
                      @click="about()"
                    />
                  </div>
                  <q-separator vertical inset class="q-mx-lg"/>
                  <div class="column items-center">
                    <q-avatar size="72px">
                      <img src="/logo.svg" />
                    </q-avatar>
                    <div class="text-subtitle1 q-mt-md q-mb-xs">
                      {{name}}
                    </div>
                    <q-btn
                      color="primary"
                      label="Logout"
                      push
                      size="sm"
                      @click="logout()"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        show-if-above
        :mini="miniState"
        mini-to-overlay
        :width="200"
        :breakpoint="500"
        bordered
        content-class="bg-blue-3"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <!--<q-item clickable v-ripple to="/">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section> Dashboard </q-item-section>
            </q-item> -->

            <q-item clickable v-ripple to="/messagecast/marketing/index">
              <q-item-section avatar>
                <q-icon name="fas fa-sms" />
  
              </q-item-section>
                 <q-item-section> Message Cast Marketing </q-item-section>
            </q-item>

            <q-item clickable v-ripple to="/messagecast/branch/index">
              <q-item-section avatar>
                <q-icon name="fas fa-comment-alt" />
  
              </q-item-section>
                 <q-item-section> Message Cast Branch </q-item-section>
            </q-item>

            <!-- <q-item clickable v-ripple to="/users">
              <q-item-section avatar>
                <q-icon name="fas fa-users" />
              </q-item-section>
            </q-item>

            <q-separator /> -->

            <q-item clickable v-ripple to="/settings">
              <q-item-section avatar>
                <q-icon name="fas fa-cogs" />
              </q-item-section>

              <q-item-section> Settings </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <!-- <div class="q-pa-md row items-start q-gutter-md">
          <div class="example-cell" tabindex="0">
            <q-card  bordered class="bg-white-3  my-card">
                <q-card-section> -->
        <router-view></router-view>
        <!-- </q-card-section>
            </q-card>
          </div>
 
        </div> -->
      </q-page-container>
    </q-layout>
    <q-dialog v-model="inception">
      <q-card>
        <q-card-section>
          <div class="text-h6">About</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Webportal <br />
          web base application
        </q-card-section>
        <q-card-section class="q-pt-none">
          System info<br />
          The system is contain 2 separate parts, front-end and back-end<br />
          The system is using vuetify as a front-end frameworks, and laravel for
          the back-end frameworks
        </q-card-section>
        <q-card-section class="q-pt-none">
          Resources List,(Plugins)<br />
          Quaser,Downloadjs,domPDF,Axios,Fontawesome,html2canvas
        </q-card-section>
        <q-card-section class="q-pt-none">
          Web Developer<br />
          @stevefox_linux
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
        <div id="footer">
            © Copyright 2021 Appletronics | Stevefox_Linux 
        </div>
  </div>
</template>
<script>
const axios = require("axios");
const token = localStorage.getItem("user-token");
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    Authorization: "Bearer " + token,
  },
});
export default {
  data() {
    return {
      name: null,
      inception: false,
      drawer: false,
      miniState: true,
      showing: false,
      invnty:  false,
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("user-token");
      this.$router.push("/login");
    },
    about() {
      this.inception = true;
    },
    usersmenu() {
      this.showing = true;
    },
    invtymenu() {
      this.invnty = true;
    },
  },
  mounted() {
    this.checkAuth();
    instance.post('/Users/Authorize').then((res)=>{
      this.name = res.data.user.name
    })
  },
};
</script>
  <style>
  .hero-image {
    background-image: url("https://appletronics.webportal.ac/login.jpg");
    background-color: #cccccc;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
  }
  #footer {
    position: absolute;
    bottom: 0px;
    background-color: #80ccff;
    width: 99%;
    text-align: center;
}
 </style>
 