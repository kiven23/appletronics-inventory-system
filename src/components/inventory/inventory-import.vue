<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <div class="col-3">
      <div style="margin-bottom: 12px">
        <q-btn icon="fas fa-angle-double-left" color="teal" to="/"></q-btn>
      </div>
      <q-card class="my-card">
        <q-uploader :factory="factoryFn" max-files="1" style="width: 371px" />
        <q-select
          filled
          v-model="branch"
          :options="options"
          stack-label
          label="Appletronics Warehouse"
          color="secondary"
        >
          <template v-slot:selected-item="scope">
            <q-chip
              removable
              dense
              @remove="scope.removeAtIndex(scope.index)"
              :tabindex="scope.tabindex"
              color="teal"
              text-color="white"
              class="q-ma-none"
            >
              <q-avatar
                color="teal"
                text-color="white"
                :icon="scope.opt.icon"
              />
              {{ scope.opt.label }}
            </q-chip>
          </template>
        </q-select>
        <div
          class="q-mb-sm"
          style="margin-left: 10px; margin-bottom: 10px; margin-top: 10px"
        >
          <q-badge color="teal"> As-Of: {{ date }} </q-badge>
        </div>
        <q-btn
          icon="event"
          round
          color="primary"
          style="margin-left: 10px; margin-bottom: 10px"
        >
          <q-popup-proxy
            @before-show="updateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date v-model="proxyDate">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Cancel" color="primary" flat v-close-popup />
                <q-btn
                  label="OK"
                  color="primary"
                  flat
                  @click="save"
                  v-close-popup
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
      </q-card>
    </div>
  </div>
</template>
<script>
const axios = require("axios");
const token = localStorage.getItem("user-token");
const instance = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    Authorization: "Bearer " + token,
  },
});

export default {
  data() {
    return {
      branch: null,
      options: [],
      date: "2021/06/18",
      proxyDate: "2021/06/18",
    };
  },
  methods: {
    factoryFn(files) {
      const fileData = new FormData();
      fileData.append("file_path", files[0]);
      fileData.append("branch", this.branch.value);
      fileData.append("date", this.proxyDate);
      instance.post("/import/inventory", fileData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.log(err);
          }
        );
    },
    branches() {
      instance.get("/branches/get").then((res) => {
        let branches = [];
        res.data.forEach((element) => {
          branches.push({
            label: element.branch,
            value: element.id,
            icon: "house",
          });
        });
        this.options = branches;
      });
    },
    updateProxy() {
      this.proxyDate = this.date;
    },

    save() {
      this.date = this.proxyDate;
    },
  },
  mounted() {
    this.branches();
  },
};
</script>