<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-sm">
      <div class="col">
        <div style="margin-bottom: 12px">
          <q-btn
            icon="fas fa-file-import"
            to="/inventory/import"
            color="teal"
          ></q-btn>
        </div>
        <q-table
          dense
          flat
          bordered
          class="statement-table"
          title="Branch Inventory"
          :data="InventorycData"
          :hide-header="mode === 'grid'"
          :columns="InventoryColumns"
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

          <template #body-cell-sender="props">
            <q-td :props="props">
              <strong>{{ props.row.user.email }}</strong>
            </q-td>
          </template>
          <template #body-cell-branch="props">
            <q-td :props="props">
              <strong>
                <p>{{ props.row.branch.branch }}</p></strong
              >
            </q-td>
          </template>
          <template #body-cell-created="props">
            <q-td :props="props">
              {{ new Date(props.row.created_at) }}
            </q-td>
          </template>
   
          <template #body-cell-asof="props">
            <q-td :props="props">
              <q-chip color="teal"
                ><strong>{{ props.row.as_of }}</strong></q-chip
              >
            </q-td>
          </template>
          <template #body-cell-action="props">
            <q-td :props="props">
              <q-btn
                dense
                flat
                round
                color="blue"
                field="edit"
                icon="far fa-eye"
                :to="{
                  name: 'inventory_info',
                  params: {
                    branch: props.row.branch_id,
                    asof: props.row.as_of,
                  },
                }"
              ></q-btn>
              <q-btn
                v-if="props.row.stat == 'Complete'"
                dense
                flat
                round
                hint="Reconcilation"
                color="blue"
                field="edit"
                icon="fas fa-file-contract"
                :to="{
                  name: 'inventory_recon',
                  params: {
                    branch: props.row.branch_id,
                    asof: props.row.as_of,
                  },
                }"
              >
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :offset="[10, 10]"
                >
                  Reconcilation
                  <q-icon name="keyboard_arrow_right" />
                </q-tooltip>
              </q-btn>
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
      ><q-card class="bg-glossy text-white">
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
  sender: "",
  branch: "",
  status: "",
  asof: "",
  created: "",
};

const InventoryColumns = [
  {
    name: "sender",
    align: "left",
    label: "Sender",
    field: "sender",
    sortable: true,
  },
  {
    name: "branch",
    align: "left",
    label: "Branch",
    field: "branch",
    sortable: true,
  },
  {
    name: "status",
    align: "left",
    label: "Status",
    field: "stat",
    sortable: true,
  },
  {
    name: "created",
    align: "left",
    label: "Date Created",
    field: "created_at",
    sortable: true,
  },
  {
    name: "asof",
    align: "left",
    label: "As_Of",
    field: "asof",
    sortable: true,
  },
  {
    name: "action",
    align: "right",
    label: "Action",
    field: "action",
  },
];
const InventorycData = [];

export default {
  data() {
    return {
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
      InventoryColumns: InventoryColumns,
      InventorycData: InventorycData,
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
      instance.get("/inventory/index").then((res) => {
        this.InventorycData = res.data;
       
        res.data.forEach((element,index) => {
            let isnull = "Complete";
           element.invty_list.forEach((res)=>{
             console.log(res.me);
              if(!res.phy){
                isnull = "Incomplete";
              }
           })
           this.InventorycData[index].stat = isnull;
        });
       
      });
    },
  },

  mounted() {
    this.render();
  },
};
</script>