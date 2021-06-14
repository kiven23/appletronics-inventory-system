<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col">
        <div style="margin-bottom: 12px">
           <q-btn
            icon="fas fa-angle-double-left"
            color="teal"
            to="/"
          ></q-btn>
        </div>
        <q-table
          dense
          flat
          bordered
          class="statement-table"
          title="Branch Inventory Phy"
          :data="InventoryInfocData"
          :hide-header="mode === 'grid'"
          :columns="InventoryInfoColumns"
          row-key="__index"
          :grid="mode == 'grid'"
          :filter="filter"
          virtual-scroll
        >
          <template v-slot:top-right="">
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'"
            >
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
                mode === "grid" ? "List" : "Grid"
              }}</q-tooltip>
            </q-btn>
            <div class="q-pa-sm q-gutter-sm"></div>
          </template>

          <template #body-cell-physical="props">
            <q-td :props="props">
              <q-input
                dense
                square
                outlined
                v-model="phy[props.row.id]"
                @change="
                  update({
                    id: props.row.id,
                    unitP: props.row.unitprice,
                    sap: props.row.sap,
                  })
                "
                label="PHY"
                mask="######"
                hint="Physical Inventory"
              />
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-glossy text-white">
        <q-bar>
          <q-space />

          <q-btn
            dense
            flat
            icon="minimize"
            @click="maximizedToggle = false"
            :disable="!maximizedToggle"
          >
            <q-tooltip
              v-if="maximizedToggle"
              content-class="bg-white text-primary"
              >Minimize</q-tooltip
            >
          </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          >
            <q-tooltip
              v-if="!maximizedToggle"
              content-class="bg-white text-primary"
              >Maximize</q-tooltip
            >
          </q-btn>
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <iframe
            :src="code"
            height="900px"
            width="700px"
            title="Iframe Example"
          ></iframe>
        </q-card-section>
      </q-card>
    </q-dialog>
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
const defaultItem = {
  brand: "",
  partname: "",
  partno: "",
  phy: "",
};

const InventoryInfoColumns = [
  {
    name: "brand",
    align: "left",
    label: "BRAND",
    field: "brand",
    sortable: true,
  },

  {
    name: "partname",
    align: "left",
    label: "PARTS NAME",
    field: "partname",
    sortable: true,
  },
  {
    name: "partno",
    align: "left",
    label: "PART NO.",
    field: "partnameno",
    sortable: true,
  },

  {
    name: "physical",
    align: "left",
    label: "PHY",
    field: "phy",
    sortable: true,
  },
];

const InventoryInfocData = [];

export default {
  data() {
    return {
      phy: [],
      dataurl: "",
      dialog: false,
      maximizedToggle: true,
      inFs: false,
      noti: () => {},
      show_dialog: false,
      editedIndex: -1,
      editedItem: defaultItem,
      filter: "",
      mode: "list",
      code: null,
      InventoryInfoColumns: InventoryInfoColumns,
      InventoryInfocData: InventoryInfocData,
      pagination: {
        page: 1,
      },
      page: 1,
      totalRecord: 0,
      pageCount: 1,
    };
  },
  methods: {
    render() {
      instance
        .post("/inventory/index", {
          branch: this.$route.params.branch,
          asof: this.$route.params.asof,
        })
        .then((res) => {
          this.InventoryInfocData = res.data;
          let c = [];
          res.data.forEach(element => {
              this.phy[element.id] = element.phy
          });
          console.log(c)
        });
    },
    update(req) {
      instance
        .post("/inventory/index/update", {
          unitP: req.unitP,
          id: req.id,
          phy: this.phy[req.id],
          sap: req.sap,
        })
        .then((res) => {
          console.log(res);
        });
    },
    exportData() {},
  },
  mounted() {
    this.render();
  },
};
</script>