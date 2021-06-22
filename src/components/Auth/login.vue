
<template>
  <div id="q-app">
    <q-layout view="lHh Lpr fff">
      <q-page
        class="window-height window-width row justify-center items-center  hero-image"
      >
        <div class="column q-pa-md">
          <div class="row">
            <q-card
              square
              class="shadow-24"
              style="width: 330px; height: 400px"
            >
              <q-card-section class="bg-blue-4">
                <q-item-label class="text-white q-my-md">
                  Addessa MessageCast
                  <!-- <img src="nav.jpg" style="width: 300px; height: 70px" /> -->
                </q-item-label>
              </q-card-section>
              <q-card-section>
                <!-- <q-fab
                  color="primary"
                  @click="switchTypeForm"
                  icon="add"
                  class="absolute"
                  style="top: 0; right: 12px; transform: translateY(-50%)"
                >
                </q-fab> -->
                <q-form class="q-px-sm q-pt-xs">
                  <q-input
                    ref="email"
                    square
                    clearable
                    v-model="email"
                    type="email"
                    lazy-rules
                    dense
                    :rules="[this.required, this.isEmail, this.short]"
                    label="Email"
                  >
                    <template v-slot:prepend>
                      <q-icon name="email" />
                    </template>
                  </q-input>
                  <q-input
                    ref="username"
                    v-if="register"
                    square
                    clearable
                    v-model="name"
                    lazy-rules
                    dense
                    :rules="[this.required, this.short]"
                    type="username"
                    label="Username"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                  <q-input
                    ref="password"
                    square
                    clearable
                    v-model="password"
                    :type="passwordFieldType"
                    lazy-rules
                    dense
                    :rules="[this.required, this.short]"
                    label="Password"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="visibilityIcon"
                        @click="switchVisibility"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                  <q-input
                    ref="password_confirmation"
                    v-if="register"
                    square
                    clearable
                    v-model="password_confirmation"
                    :type="passwordFieldType"
                    lazy-rules
                    dense
                    :rules="[this.required, this.short, this.diffPassword]"
                    label="Password"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="visibilityIcon"
                        @click="switchVisibility"
                        class="cursor-pointer"
                      />
                    </template>
                  </q-input>
                </q-form>
              </q-card-section>
              

              <q-card-actions class="q-px-lg">
                <q-btn
                 
                  unelevated
                  size="lg"
                  color="secondary"
                  @click="btnLabel == 'Login' ? login() : reg()"
                  dense
                  class="full-width text-white"
                  :label="btnLabel"
                />
               
              </q-card-actions>
              
            </q-card>
            
          </div>
        </div>
   

      </q-page>
    <div id="footer">
                  © Copyright 2021 MessageCast | Stevefox_Linux 
    </div>
    </q-layout>
    
  </div>
</template>
 <script>
import axios from "axios";
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
      title: "Appletronics Portal",
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      register: false,
      passwordFieldType: "password",
      btnLabel: "Login",
      visibility: false,
      visibilityIcon: "visibility",
 
 
    };
  },

  methods: {
 
    required(val) {
      return (val && val.length > 0) || "Please enter password";
    },
    diffPassword(val) {
      const val2 = this.$refs.password.value;
      return (val && val === val2) || "Password does not match!";
    },
    short(val) {
      return (val && val.length > 3) || "The Value is to short";
    },
    isEmail(val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || "Please enter a valid email";
    },
 
    
    submit() {
      if (this.register) {
        this.$refs.email.validate();
        this.$refs.name.validate();
        this.$refs.password.validate();
        this.$refs.repassword.validate();
      } else {
        this.$refs.email.validate();
        this.$refs.password.validate();
      }

      if (!this.register)
        if (!this.$refs.email.hasError && !this.$refs.password.hasError) {
          this.$q.notify({
            icon: "done",
            color: "positive",
            message: "Login",
          });
        }
    },
    switchTypeForm() {
      this.register = !this.register;
      this.title = this.register ? "Create Account" : "Login";
      this.btnLabel = this.register ? "Register" : "Login";
    },
 
 
    switchVisibility() {
      this.visibility = !this.visibility;
      this.passwordFieldType = this.visibility ? "text" : "password";
      this.visibilityIcon = this.visibility ? "visibility_off" : "visibility";
    },
    login() {
      this.$refs.email.validate();
      this.$refs.password.validate();
      if (this.$refs.password.validate() && this.$refs.email.validate()) {
        instance
          .post("/login/user", {
            email: this.email,
            password: this.password,
          })
          .then(
            (resp) => {
              const token = resp.data.access_token;
              localStorage.setItem("user-token", token); // store the token in localstorage
             
              // you have your token, now log in your user :)

              this.$router.push("/");
            },
            () => {
              this.$router.push("/");
         

              localStorage.removeItem("user-token"); // if the request fails, remove any possible user token if possible
            }
          );
      }
    },
    
 
    reg() {
      instance
        .post("/register/user", {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation,
        })
        .then(
          () => {
            this.$router.push("/");
          },
          (error) => {
            this.$q.notify({
              type: "warning",
              message: "" + error.response.data.errors.email[0] + "",
            });
            this.$q.notify({
              type: "warning",
              message: "" + error.response.data.errors.name[0] + "",
            });
            this.$q.notify({
              type: "warning",
              message: "" + error.response.data.errors.password[0] + "",
            });
          }
        );
    },
  },
 
};
</script>
 <style>
  .hero-image {
    background-image: url("https://appletronics.webportal.ac/login.jpg");
 
    background-color: #cccccc;
    height: 500px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
  }
  #footer {
    position: absolute;
    bottom: 0px;
    background-color: #80ccff;
    width: 100%;
    text-align: center;
}
 </style>
 