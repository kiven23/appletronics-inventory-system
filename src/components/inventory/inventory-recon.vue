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
         
                <q-btn class="float-right" icon="fas fa-download" color="teal">
                    <export-excel
                      :data="InventoryReconcData"
                      :fields="json_fields"
                      worksheet="My Worksheet"
                      :name="filename"
                    >
                    </export-excel>
                  </q-btn>
           
          </div>
        <q-table
          dense
          flat
          bordered
          class="statement-table"
          title="Branch Inventory Reconcilation"
          :data="InventoryReconcData"
          :hide-header="mode === 'grid'"
          :columns="InventoryReconColumns"
          row-key="__index"
          :grid="mode == 'grid'"
          :filter="filter"
          virtual-scroll
        ><template v-slot:top-right="">
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Search"
            ><template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'"
            ><q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
                mode === "grid" ? "List" : "Grid"
              }}</q-tooltip>
            </q-btn>
            <div class="q-pa-sm q-gutter-sm"></div>
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
          ><q-tooltip
              v-if="maximizedToggle"
              content-class="bg-white text-primary"
              >Minimize</q-tooltip
            >  </q-btn>
          <q-btn
            dense
            flat
            icon="crop_square"
            @click="maximizedToggle = true"
            :disable="maximizedToggle"
          ><q-tooltip
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
  sap: "",
  phy: "",
  me: "",
  unitcost: "",
  totalcost: "",
};

const InventoryReconColumns = [
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
    name: "sap",
    align: "left",
    label: "SAP",
    field: "sap",
    sortable: true,
  },
  {
    name: "physical",
    align: "left",
    label: "PHY",
    field: "phy",
    sortable: true,
  },
  {
    name: "me",
    align: "left",
    label: "M/E",
    field: "me",
    sortable: true,
  },
  {
    name: "unitcost",
    align: "left",
    label: "UNIT COST",
    field: "unitprice",
    sortable: true,
  },
  {
    name: "totalcost",
    align: "left",
    label: "TOTAL COST",
    field: "total",
    sortable: true,
  },
];

const InventoryReconcData = [];

export default {
  data() {
    return {
      json_fields: {
        BRAND: "brand",
        "PARTS NAME": "partname",
        "PART NO.": "partnameno",
        SAP: "sap",
        PHY: "phy",
        "M/E": "me",
        "UNIT COST": "unitprice",
        "TOTAL COST": "total",
      },
      filename: null,
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
      InventoryReconColumns: InventoryReconColumns,
      InventoryReconcData: InventoryReconcData,
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
          this.InventoryReconcData = res.data;
        });
    },
    exportData() {
      alert();
    },
  },
  mounted() {
    this.render();
    let filename =
      "invty-" + this.$route.params.branch + "-" + this.$route.params.asof;
    this.filename = filename + ".xls";
  },
};
</script>