<template>
  <div class="q-pa-md row items-start q-gutter-md">
        <div class="q-gutter-y-md" style="max-width: 800px">
          <q-option-group
            v-model="panel"
            inline
            :options="[
              { label: 'Sending', value: 'sending' },
              { label: 'Create Contact', value: 'create contacts' },
              { label: 'Activity Logs', value: 'activity logs' }
            ]"
          />
          <q-tab-panels v-model="panel" animated class="shadow-2 rounded-borders">
            <q-tab-panel name="sending">
              <div class="text-h6">Sending</div>
              <q-card  dark bordered class="bg-grey-5 my-card">
    <q-card-section>
        <q-chip color="orange" icon="fas fa-sms"> Message Cast </q-chip>
    </q-card-section>
    <q-card-section>
         <q-checkbox v-model="sendAll" color="teal">Send To All</q-checkbox>
        </q-card-section>
      <q-card-section>
                
        <q-select
          v-if="sendAll == false"
          filled
          label="Customer Numbers"
          v-model="contacts"
          use-input
          use-chips
          multiple    
          emit-value
          map-options
          input-debounce="0"
          @new-value="createValue"
          :options="filterOptions"
          @filter="filterFn"
          style="width: 250px"
        />
      </q-card-section>
      <q-card-section>
        <q-input v-model="message" filled type="textarea" label="Message" />
      </q-card-section>
      <q-card-section>
     <div  style="text-align: right">
       <q-btn color="teal" label="Send" @click="send()"></q-btn>
       </div>
      </q-card-section>
    </q-card>
            </q-tab-panel>

            <q-tab-panel name="create contacts">
              <div style="margin-bottom: 5px;">
                <q-btn color="teal" @click="CreateContactDialog = true">Create</q-btn>
              </div>
        <q-table
          flat
          bordered
          class="statement-table"
          title="Contact List"
          :data="contactsData"
          :hide-header="mode === 'grid'"
          :columns="contactsColumns"
          row-key="__index"
          :grid="mode == 'grid'"
          :filter="filter"
          virtual-scroll
 
        >
          <template v-slot:top-right="props">
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
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="setFs(props)"
            >
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
                props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
              }}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'"
            >
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{mode === "grid" ? "List" : "Grid"}}</q-tooltip>
            </q-btn>
            <div class="q-pa-sm q-gutter-sm">
              
            </div>
          </template>
          
          <template #body-cell-status="props">
            <q-td :props="props">
                <q-chip
                  :color="props.row.status == 'Active' ? 'green': props.row.status == 'Disable' ? 'red': 'grey'"
                  text-color="white"
                  dense
                  class="text-weight-bolder"
                  square
                >{{props.row[props.col.name]}}</q-chip>
            </q-td>
          </template>
          <template #body-cell-action="props">
            <q-td>
              <q-btn dense flat round color="blue" field="edit" icon="edit" @click="updateContact(props.row) ,UpdateContactDialog = true"></q-btn>
               <q-btn dense flat round color="blue" field="messege" icon="fab fa-facebook-messenger" @click="SendContact(props.row) ,SendContactDialog = true"></q-btn>
              </q-td>
 
          </template>
          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-card :class="props.selected ? 'bg-grey-2' : ''">
                <q-list dense>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>panel
                      <q-chip v-if="col.name === 'status'"
                        :color="props.row.status == 'Active' ? 'green': props.row.status == 'Disable' ? 'red': 'grey'"
                        text-color="white"
                        dense
                        class="text-weight-bolder"
                        square
                      >{{col.value}}</q-chip>
                      <q-btn v-else-if="col.name === 'action'" dense flat color="primary" field="edit" icon="edit" @click="editItem(props.row)" ></q-btn>
                      <q-item-label v-else caption :class="col.classes ? col.classes : ''">{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
          
        </q-table>
            </q-tab-panel>
            <q-tab-panel name="activity logs">
            <q-table
                flat
                bordered
                class="statement-table"
                title="Activity Logs"
                :data="LogsData"
                :hide-header="mode === 'grid'"
                :columns="LogsColumns"
                row-key="__index"
                :grid="mode == 'grid'"
                :filter="filterLogs"
                virtual-scroll
              >
          <template v-slot:top-right="props">
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
              :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="setFs(props)"
            >
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
                props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
              }}</q-tooltip>
            </q-btn>

            <q-btn
              flat
              round
              dense
              :icon="mode === 'grid' ? 'list' : 'grid_on'"
              @click="mode = mode === 'grid' ? 'list' : 'grid'"
            >
              <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{mode === "grid" ? "List" : "Grid"}}</q-tooltip>
            </q-btn>
            <div class="q-pa-sm q-gutter-sm">
              
            </div>
          </template>
  
          <template #body-cell-action="props">
            <q-td>
              <q-btn dense flat round color="blue" field="edit" icon="edit" @click="updateContact(props.row) ,UpdateContactDialog = true"></q-btn>
              </q-td>
              
          </template>
          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-card :class="props.selected ? 'bg-grey-2' : ''">
                <q-list dense>
                  <q-item v-for="col in props.cols" :key="col.name">
                    <q-item-section>
                      <q-item-label>{{ col.label }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>panel
                      <q-chip v-if="col.name === 'status'"
                        :color="props.row.status == 'Active' ? 'green': props.row.status == 'Disable' ? 'red': 'grey'"
                        text-color="white"
                        dense
                        class="text-weight-bolder"
                        square
                      >{{col.value}}</q-chip>
                      <q-btn v-else-if="col.name === 'action'" dense flat color="primary" field="edit" icon="edit" @click="editItem(props.row)" ></q-btn>
                      <q-item-label v-else caption :class="col.classes ? col.classes : ''">{{ col.value }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </template>
          
        </q-table>
            </q-tab-panel>
           
          </q-tab-panels>
             <!--CREATE CONTACT DIALOG-->
            <q-dialog
              v-model="CreateContactDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
              ><q-card class="bg-teal text-white" style="width: 300px">
                <q-bar>Create</q-bar>
                <q-card-section class="bg-white">
                  <q-input 
                  v-model="CustomerName" 
                  label="FullName" 
                  dense 
                  filled
                   hint="Exp: STEVEN F. CALIMLIM"
                  /> 
                  <q-input
                    dense
                    filled
                    v-model="phone"
                    label="Phone"
                    mask="(###) ### - #####"
                    hint="Sample: (091) 522 - 12345"
                  />
                 <q-input 
                  v-model="Location" 
                  label="Location" 
                  dense 
                  filled
                   hint="Exp: Pangasinan"
                  />
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                   <q-btn
                    flat
                    icon="fas fa-save"
                    label="Save"
                    @click="saveContact()"
                  />
                  <q-btn
                    flat
                    icon="fas fa-times"
                    label="close"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END CREATE CONTACT DIALOG-->
             <!--EDIT CONTACT DIALOG-->
            <q-dialog
              v-model="UpdateContactDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
              ><q-card class="bg-teal text-white" style="width: 300px">
                <q-bar>Edit</q-bar>
                <q-card-section class="bg-white">
                  <q-input 
                  v-model="CustomerName" 
                  label="FullName" 
                  dense 
                  filled
                   hint="Exp: STEVEN F. CALIMLIM"
                  /> 
                  <q-input
                    dense
                    filled
                    v-model="phone"
                    label="Phone"
                    mask="(###) ### - #####"
                    hint="Sample: (091) 522 - 12345"
                  />
                 <q-input 
                  v-model="Location" 
                  label="Location" 
                  dense 
                  filled
                   hint="Exp: Pangasinan"
                  />
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                   <q-btn
                    flat
                    icon="fas fa-save"
                    label="Save"
                    @click="updateActionContact()"
                  />
                  <q-btn
                    flat
                    icon="fas fa-times"
                    label="close"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END EDIT CONTACT DIALOG-->
             <!--SEND CONTACT DIALOG-->
            <q-dialog
              v-model="SendContactDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
              ><q-card class="bg-teal text-white" style="width: 300px">
                <q-bar>Compose Message</q-bar>
                <q-card-section class="bg-white">
                  <q-input v-model="message1" filled type="textarea" label="Message" />
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                   <q-btn
                    flat
                    icon="fas fa-envelope-square"
                    label="sent"
                    @click="sentContact()"
                  />
                  <q-btn
                    flat
                    icon="fas fa-messege"
                    label="close"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END SEND CONTACT DIALOG-->
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
const defaultItem = {
        name: '',
        number: '',
        location: '',
      }
const LogsItem = {
      created_at: '',
      logs: '',
      msg: '',
      number: '',
      response: ''
}
const contactsColumns = [
        {
          name: "name",
          align: "left",
          label: "Name",
          field: "name",
          sortable: true
        },
        {
          name: "contact_number",
          align: "center",
          label: "Contact No",
          field: "contact_number",
          sortable: true,
          classes: 'text-green'
        },
          {
          name: "location",
          align: "center",
          label: "Location",
          field: "location",
          sortable: true,
          classes: 'text-green'
        },
        {
          name: "action",
          align: "right",
          label: "Action",
          field: "action"
        }
      ]
const LogsColumns = [
         {
          name: "name",
          align: "left",
          label: "Name",
          field: "name",
          sortable: true
        },
       {
          name: "msg",
          align: "left",
          label: "Messages",
          field: "msg",
          sortable: true
        },
        {
          name: "number",
          align: "left",
          label: "Number",
          field: "number",
          sortable: true
        },
        {
          name: "response",
          align: "left",
          label: "Response",
          field: "response",
          sortable: true
        },
        {
          name: "created_at",
          align: "center",
          label: "Date Sent",
          field: "created_at",
          sortable: true,
          classes: 'text-green'
        },
           
      ]

const stringOptions = []
export default {
  data() {
    return {
      SendContactDialog: false,
      message1: null,
      CustomerID: null,
      contacts: [],
      CustomerName: null,
      Location: null,
      phone: null,
      persistent: false,
      CreateContactDialog: false,
      UpdateContactDialog: false,
      inFs: false,
      panel: 'sending',
      sendAll: true,
      message: null,
      filterOptions: stringOptions,
      noti: () => {},
      show_dialog: false,
      editedIndex: -1,
      editedItem: defaultItem,
      filter: "",
      filterLogs: "",
      mode: "list",
      contactsColumns: contactsColumns,
      contactsData: [],

      LogsColumns: LogsColumns,
      LogsData: [],
      LogsItem: LogsItem,
    };
  },
  methods: {
    saveContact(){
      instance.post('/messagecast/marketing/create',{
         name: this.CustomerName,
         number: this.phone,
         location: this.Location
      }).then((res)=>{
        this.rendercontactsLogs();
         this.$q.notify({
          type: ''+res.data.color+'',
          message: ''+res.data.msg+''
      })
      },(err)=>{ 
         console.log(err)
      })
    },
    updateContact(data){
      this.phone = data.contact_number;
      this.Location = data.location;
      this.CustomerName = data.name;
      this.CustomerID = data.id
    },
    updateActionContact(){
       instance.post('/messagecast/marketing/update',{
         phone: this.phone,
         location: this.Location,
         name: this.CustomerName,
         id: this.CustomerID
       }).then((res)=>{
         this.rendercontactsLogs();
        this.$q.notify({
          type: ''+res.data.color+'',
          message: ''+res.data.msg+''
      })
       },(err)=>{
         console.log(err);
       })
    },
    SendContact(data){
      console.log(data)
    },
    createValue(val, done) {
      if (val.length > 0) {
        if (!stringOptions.includes(val)) {
          stringOptions.push(val);false
        }
        done(val, "toggle");
      }
    },
    filterFn(val, update) {
      update(() => {
        if (val === "") {
          this.filterOptions = stringOptions;
        } else {
          const needle = val.toLowerCase();
          this.filterOptions = stringOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        }
      });
    },
    render(){
      instance.get('http://127.0.0.1:8000/api/messagecast/branch/index').then((res)=>{
        console.log(res)
          res.data.forEach(element => {
            stringOptions.push({label: element.name, val: element.number})
          });
      })

    },
    rendercontactsLogs(){
       instance.get('http://127.0.0.1:8000/api/messagecast/contacts/index').then((res)=>{
        console.log(res)
        this.contactsData = res.data
       })
       instance.post('http://127.0.0.1:8000/api/messagecast/marketing/logs').then((res)=>{
        console.log(res)
        this.LogsData = res.data
       })
    },
    
    send(){
         var inden = 0;
         var all;
       if(this.sendAll == true){
          inden = 1
       }else{
         all = stringOptions;
       }
        let contact =  this.contacts;
        let message = this.message;
      instance.post('/messagecast/marketing/send',{
          stringOptions,
          contact,
          message,
          inden
      }).then((res)=>{
         this.rendercontactsLogs();
          console.log(res)
      },(err)=>{
        console.log(err)
      })
    }
  },
     mounted(){
      this.render();
      this.rendercontactsLogs();
    },
};
</script>