<template>
  <div class="q-pa-md">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="users" icon="fas fa-user-plus" label="Users" v-if="hasPermission('Create User')" />
        <q-tab
          name="authorization"
          icon="fas fa-user-cog"
          label="Authorization"
          v-if="hasPermission('Authorization Access')"
        />
        <q-tab name="branches" icon="fas fa-code-branch" label="Branches" v-if="hasPermission('Create Branch')"/>
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated >
        <q-tab-panel name="authorization" class="q-pa-none">
          <q-splitter v-model="splitterModel" style="height: 500px">
            <template v-slot:before>
              <q-tabs v-model="innerTab" vertical class="text-teal">
                <q-tab
                  name="innerRoles"
                  icon="fas fa-clipboard-check"
                  label="Roles"
                />
                <q-tab
                  name="innerPermissions"
                  icon="fas fa-lock"
                  label="Permissions"
                />
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                v-model="innerTab"
                animated
                transition-prev="slide-down"
                transition-next="slide-up"
              >
                <q-tab-panel name="innerRoles">
                  <div style="margin-bottom: 10px">
                    <!-- CREATE BUTTON ROLE-->
                    <q-btn
                      color="teal"
                      style="margin-right: 5px"
                      dense
                      icon="far fa-plus-square"
                      @click="
                        (RoleCreateDialog = true),
                        (SelectPermissions = []),
                        (RoleCreateModel = [])
                      "
                    ></q-btn>
                    <!-- END CREATE BUTTON ROLE-->
                    <!-- DELETE BUTTON ROLE-->
                    <q-btn
                      color="teal"
                      v-if="selectedRole != ''"
                      @click="RoleDelete()"
                      dense
                      icon="fas fa-trash-alt"
                    ></q-btn>
                    <!-- END DELETE BUTTON ROLE-->
                  </div>
                  <!---------------------------------------  ROLES TABLE -------------------------------------------------->

                  <!------------------------------------------------------------------------------------------------------->
                  <q-table
                    dense
                    :filter="filterRoles"
                    title="Roles"
                    :data="dataRoles"
                    :columns="columnsRoles"
                    row-key="name"
                    :selected-rows-label="RoleMultipleSelect"
                    selection="multiple"
                    :selected.sync="selectedRole"
                  >
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        debounce="300"
                        v-model="filterRoles"
                        placeholder="Search"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                    <template #body-cell-permissions="props">
                      <q-td :props="props">
                        <div v-if="props.row.permissions != ''">
                          <q-chip
                            color="teal"
                            @click="
                              morePermission({
                                data: props.row.permissions,
                                role: props.row.name,
                              })
                            "
                            clickable
                          >
                            {{ props.row.permissions[0]["name"] }}</q-chip
                          >
                          <label clickable>
                            {{ "+" + props.row.permissions.length + " others" }}
                          </label>
                        </div>
                      </q-td>
                    </template>
                    <template #body-cell-actions="props">
                      <q-td :props="props">
                        <q-icon
                          clickable
                          name="fas fa-edit"
                          color="teal"
                          dense
                          @click="
                            RoleEdit({
                              id: props.row.id,
                              data: props.row.permissions,
                              role: props.row.name,
                            })
                          "
                        />
                      </q-td>
                    </template>
                  </q-table>

                  <!--PERMISSION DIALOG ROLES-->
                  <q-dialog
                    v-model="PermissionListDialog"
                    persistent
                    transition-show="scale"
                    transition-hide="scale"
                    ><q-card class="bg-teal text-white" style="width: 300px">
                      <q-bar>{{ PermissionsList.role }}</q-bar>
                      <q-card-section class="bg-white">
                        <div v-for="names in PermissionsList.data">
                          <q-chip color="teal" dense>{{ names.name }}</q-chip>
                        </div>
                      </q-card-section>
                      <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn
                          flat
                          icon="fas fa-times"
                          label="close"
                          v-close-popup
                          @click="PermissionsList = []"
                        />
                      </q-card-actions>
                    </q-card>
                  </q-dialog>
                  <!--END PERMISSION DIALOG ROLES-->
                  <!--------------------------------------- END ROLES TABLE -------------------------------------------------->

                  <!---------------------------------------------------------------------------------------------------------->
                </q-tab-panel>
                <q-tab-panel name="innerPermissions">
                  <div style="margin-bottom: 10px">
                    <!--CREATE BUTTON PERMISSION-->
                    <q-btn
                      color="teal"
                      style="margin-right: 5px"
                      dense
                      icon="far fa-plus-square"
                      @click="permissionCreateDialog = true"
                    ></q-btn>
                    <!-- END CREATE BUTTON PERMISSION-->
                    <!--DELETE BUTTON PERMISSION-->
                    <q-btn
                      color="teal"
                      v-if="selectedPermission != ''"
                      dense
                      icon="fas fa-trash-alt"
                      @click="permissionTrash"
                    ></q-btn>
                    <!--END DELETE BUTTON PERMISSION-->
                  </div>
                  <!---------------------------------------  PERMISSIONS TABLE -------------------------------------------------->

                  <!------------------------------------------------------------------------------------------------------------->
                  <q-table
                    dense
                    :filter="filterPermissions"
                    title="Permissions"
                    :data="dataPermissions"
                    :columns="columnsPermissions"
                    row-key="name"
                    :selected-rows-label="MultipleSelect"
                    selection="multiple"
                    :selected.sync="selectedPermission"
                  >
                    <template v-slot:top-right>
                      <q-input
                        borderless
                        dense
                        debounce="300"
                        v-model="filterPermissions"
                        placeholder="Search"
                      >
                        <template v-slot:append>
                          <q-icon name="search" />
                        </template>
                      </q-input>
                    </template>
                    <template #body-cell-actions="props">
                      <q-td :props="props">
                        <q-icon
                          name="fas fa-edit"
                          color="teal"
                          dense
                          @click="Permissionedit(props.row.id)"
                        />
                      </q-td>
                    </template>
                  </q-table>

                  <!-------------------------------------- PERMISSIONS DIALOG -------------------------------------------------->
                  <!------------------------------------------------------------------------------------------------------------>

                  <!-------------------------------------- END PERMISSION DIALOG -------------------------------------------------->
                </q-tab-panel>
              </q-tab-panels>
            </template>
            <!--EDIT DIALOG ROLES-->
            <q-dialog
              v-model="RoleEditDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
              ><q-card class="bg-teal text-white" style="width: 300px">
                <q-bar> {{ PermissionsList.role }} </q-bar>
                <q-card-section class="bg-white">
                  <q-input
                    ref="RequiredRole"
                    :rules="[this.RequiredRole]"
                    square
                    outlined
                    v-model="RoleUpdateModel"
                    dense
                    label="Role Create"
                  />
                </q-card-section>
                <q-card-section class="bg-white">
                  <q-select
                    ref="RequiredPermission"
                    :rules="[this.RequiredPermission]"
                    filled
                    v-model="SelectPermissions"
                    use-input
                    use-chips
                    multiple
                    emit-value
                    map-options
                    input-debounce="0"
                    :options="filterOptions"
                  />
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-save"
                    label="Update"
                    @click="RoleUpdate()"
                    v-close-popup
                  />
                  <q-btn flat icon="fas fa-times" label="close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END EDIT DIALOG ROLES-->
            <!--CREATE DIALOG ROLES-->
            <q-dialog
              v-model="RoleCreateDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
              ><q-card class="bg-teal text-white" style="width: 300px">
                <q-bar> Create Role</q-bar>
                <q-card-section class="bg-white">
                  <q-input
                    ref="RequiredRole"
                    :rules="[this.RequiredRole]"
                    lazy-rules
                    square
                    outlined
                    v-model="RoleCreateModel"
                    dense
                    label="Role Create"
                  />
                </q-card-section>
                <q-card-section class="bg-white">
                  <q-select
                    ref="RequiredPermission"
                    :rules="[this.RequiredPermission]"
                    lazy-rules
                    filled
                    v-model="SelectPermissions"
                    use-input
                    use-chips
                    multiple
                    emit-value
                    map-options
                    input-debounce="0"
                    :options="filterOptions"
                  />
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-save"
                    label="save"
                    @click="RoleCreate()"
                  />
                  <q-btn flat icon="fas fa-times" label="close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END CREATE DIALOG ROLES-->
            <!--EDIT DIALOG PERMISSION-->
            <q-dialog
              v-model="permissionEditDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
            >
              <q-card class="bg-teal text-white" style="width: 300px">
                <q-bar>Edit Permission</q-bar>
                <q-card-section class="bg-white">
                  <q-input
                    ref="RequiredPermission"
                    :rules="[this.RequiredPermission]"
                    lazy-rules
                    square
                    outlined
                    v-model="PermissionName"
                    dense
                    label="Permission"
                  />
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-save"
                    label="save"
                    @click="PermissionUpdate()"
                  />
                  <q-btn
                    flat
                    icon="fas fa-times"
                    label="close"
                    @click="EditedPermission = []"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END EDIT DIALOG PERMISSION-->
            <!--CREATE DIALOG PERMISSION-->
            <q-dialog
              v-model="permissionCreateDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
            >
              <q-card class="bg-teal text-white" style="width: 300px">
                <q-bar> Create Permission </q-bar>
                <q-card-section class="bg-white">
                  <q-input
                    ref="RequiredPermission"
                    lazy-rules
                    square
                    outlined
                    v-model="PermissionCreateModel"
                    dense
                    :rules="[this.RequiredPermission]"
                    label="Permission Create"
                  >
                  </q-input>
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-save"
                    label="save"
                    @click="PermissionCreate()"
                  />
                  <q-btn flat icon="fas fa-times" label="close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END CREATE DIALOG PERMISSION-->
            <!---------------------------------------END PERMISSIONS TABLE -------------------------------------------------->

            <!--------------------------------------------------------------------------------------------------------------->
          </q-splitter>
        </q-tab-panel>
        <q-tab-panel name="users">
          <div class="q-pa-md">
            <div style="margin-bottom: 10px">
              <q-btn
                color="teal"
                style="margin-right: 5px"
                dense
                icon="far fa-plus-square"
                @click="UsersCreateDialog = true ,email = '',password = '',password_confirmation = '',SeleRoles = '',branch=[],name=''"
              ></q-btn>
              <q-btn
                color="teal"
                v-if="selectedUsers != ''"
                dense
                icon="fas fa-trash-alt"
                @click="userDelete"
              ></q-btn>
            </div>
            <q-table
              dense
              :filter="filterUsers"
              title="Users"
              :data="dataUsers"
              :columns="columnsUsers"
              row-key="id"
              :selected-rows-label="UsersMultipleSelect"
              selection="multiple"
              :selected.sync="selectedUsers"
            >
              <template v-slot:top-right>
                <q-input
                  borderless
                  dense
                  debounce="300"
                  v-model="filterUsers"
                  placeholder="Search"
                >
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-icon
                    name="fas fa-edit"
                    color="teal"
                    dense
                    @click="UsersEdit({ data: props.row })"
                  />
                </q-td>
              </template>
              <template #body-cell-branches="props">
                <q-td :props="props">
                  <div v-if="props.row.branches">
                    {{ props.row.branches.branch }}
                  </div>
                   
                  <!-- <q-icon
                      name="fas fa-edit"
                      color="teal"
                      dense
                      @click="UsersEdit({data: props.row})"
                    /> -->
                </q-td>
              </template>
              <template #body-cell-roles="props">
                <q-td :props="props">
                  <!-- <q-icon
                      name="fas fa-edit"
                      color="teal"
                      dense
                      @click="UsersEdit({data: props.row})"
                    />
                     -->
                  <div v-if="props.row.roles != ''">
                    <q-chip
                      color="teal"
                      @click="
                        moreRoles({
                          data: props.row.roles,
                          role: props.row.roles[0].name,
                        })
                      "
                      clickable
                    >
                      {{ props.row.roles[0].name }}</q-chip
                    >
                    <label clickable>
                      {{ "+" + props.row.roles.length + " others" }}
                    </label>
                  </div>
                </q-td>
              </template>
            </q-table>
            <!--CREATE DIALOG USER -->
            <q-dialog
              v-model="UsersCreateDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
            >
              <q-card class="bg-teal text-white" style="width: 300px">
                <q-bar> Create User </q-bar>
                <q-card-section class="bg-white">
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
                  </q-input>
                  <q-input
                    ref="password_confirmation"
                    square
                    clearable
                    v-model="password_confirmation"
                    :type="passwordFieldType"
                    lazy-rules
                    dense
                    :rules="[this.required, this.short, this.diffPassword]"
                    label="Confirmation"
                    ><template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                  <q-select
                    ref="RolesVal"
                    filled
                    v-model="SelectRoles"
                    :options="RolesData"
                    label="Select Role"
                    multiple
                    emit-value
                    map-options
                    :rules="[this.requiredRole]"
                  >
                    <template
                      v-slot:option="{
                        itemProps,
                        itemEvents,
                        opt,
                        selected,
                        toggleOption,
                      }"
                    >
                      <q-item v-bind="itemProps" v-on="itemEvents">
                        <q-item-section>
                          <q-item-label v-html="opt.label"></q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle
                            :value="selected"
                            @input="toggleOption(opt)"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-select
                    ref="BranchesVal"
                    filled
                    v-model="branch"
                    :options="BranchesList"
                    stack-label
                    emit-value
                    map-options
                    label="Appletronics Warehouse"
                    color="secondary"
                    :rules="[this.requiredBranch]"
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
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-save"
                    label="save"
                    @click="UsersCreate()"
                  />
                  <q-btn flat icon="fas fa-times" label="close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END CREATE DIALOG USER-->

            <!--CREATE DIALOG USER -->
            <q-dialog
              v-model="UsersUpdateDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
            >
              <q-card class="bg-teal text-white" style="width: 300px">
                <q-bar> Edit User </q-bar>
                <q-card-section class="bg-white">
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
                  </q-input>
                  <q-input
                    ref="password_confirmation"
                    square
                    clearable
                    v-model="password_confirmation"
                    :type="passwordFieldType"
                    lazy-rules
                    dense
                    :rules="[this.required, this.short, this.diffPassword]"
                    label="Confirmation"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" />
                    </template>
                  </q-input>
                  <q-select
                    ref="RolesVal"
                    filled
                    v-model="SelectRoles"
                    :options="RolesData"
                    label="Select Role"
                    multiple
                    emit-value
                    map-options
                    :rules="[this.requiredRole]"
                  >
                    <template
                      v-slot:option="{
                        itemProps,
                        itemEvents,
                        opt,
                        selected,
                        toggleOption,
                      }"
                    >
                      <q-item v-bind="itemProps" v-on="itemEvents">
                        <q-item-section>
                          <q-item-label v-html="opt.label"></q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-toggle
                            :value="selected"
                            @input="toggleOption(opt)"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                  <q-select
                    ref="BranchesVal"
                    filled
                    v-model="branch"
                    :options="BranchesList"
                    stack-label
                    emit-value
                    map-options
                    label="Appletronics Warehouse"
                    color="secondary"
                    :rules="[this.requiredBranch]"
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
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-save"
                    label="Update"
                    @click="UsersUpdate()"
                  />
                  <q-btn flat icon="fas fa-times" label="close" v-close-popup />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END CREATE DIALOG USER-->
            <!--PERMISSION DIALOG ROLES-->
            <q-dialog
              v-model="RolesListDialog"
              persistent
              transition-show="scale"
              transition-hide="scale"
              ><q-card class="bg-teal text-white" style="width: 300px">
                <q-bar>Roles</q-bar>
                <q-card-section class="bg-white">
                  <div v-for="names in RolesList.data">
                    <q-chip color="teal" dense>{{ names.name }}</q-chip>
                  </div>
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                  <q-btn
                    flat
                    icon="fas fa-times"
                    label="close"
                    v-close-popup
                    @click="RolesList = []"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
            <!--END PERMISSION DIALOG ROLES-->
          </div>
        </q-tab-panel>
        <q-tab-panel name="branches">
          <div style="margin-bottom: 10px">
            <q-btn
              color="teal"
              style="margin-right: 5px"
              dense
              icon="far fa-plus-square"
              @click="CreateBranchDialog = true"
            ></q-btn>
            <q-btn
              color="teal"
              v-if="selectedBranches != ''"
              dense
              icon="fas fa-trash-alt"
              @click="deleteBranch()"
            ></q-btn>
          </div>
          <q-table
            dense
            :filter="filterBranches"
            title="Branches/WHS"
            :data="dataBranches"
            :columns="columnsBranches"
            row-key="branch"
            :selected-rows-label="BranchesMultipleSelect"
            selection="multiple"
            :selected.sync="selectedBranches"
          >
            <template v-slot:top-right>
              <q-input
                borderless
                dense
                debounce="300"
                v-model="filterBranches"
                placeholder="Search"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template #body-cell-actions="props">
              <q-td :props="props">
                <q-icon
                  name="fas fa-edit"
                  color="teal"
                  dense
                  @click="BranchesEdit({data: props.row})"
                />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
          <!--CREATE BRANCH DIALOG-->
                <q-dialog
                  v-model="CreateBranchDialog"
                  persistent
                  transition-show="scale"
                  transition-hide="scale"
                  ><q-card class="bg-teal text-white" style="width: 300px">
                    <q-bar>Create Branch</q-bar>
                    <q-card-section class="bg-white">
                      <q-input 
                      ref="requiredBranch"
                      v-model="branchField"
                      dense
                      lazy-rules
                      clearable
                      label="Branch"
                      :rules="[this.requiredBranch]"
                      />
                      <q-input 
                      ref="requiredWarehouse"
                      v-model="warehouseField"
                      lazy-rules
                      dense
                      clearable
                      label="Warehouse"
                      :rules="[this.requiredWarehouse]"
                      />
                    </q-card-section>
                    <q-card-actions align="right" class="bg-white text-teal">
                     <q-btn
                        flat
                        icon="fas fa-save"
                        label="save"
                        @click="CreateBranch()"
                      />
                      <q-btn
                        flat
                        icon="fas fa-times"
                        label="close"
                        v-close-popup
                        @click="branchField = ''"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
          <!--END CREATE BRANCH DIALOG-->
          <!--EDIT BRANCH DIALOG-->
                <q-dialog
                  v-model="EditBranchDialog"
                  persistent
                  transition-show="scale"
                  transition-hide="scale"
                  ><q-card class="bg-teal text-white" style="width: 300px">
                    <q-bar>Edit Branch</q-bar>
                    <q-card-section class="bg-white">
                      <q-input 
                      ref="requiredBranch"
                      v-model="branchField"
                      dense
                      lazy-rules
                      clearable
                      label="Branch"
                      :rules="[this.requiredBranch]"
                      />
                      <q-input 
                      ref="requiredWarehouse"
                      v-model="warehouseField"
                      lazy-rules
                      dense
                      clearable
                      label="Warehouse"
                      :rules="[this.requiredWarehouse]"
                      />
                    </q-card-section>
                    <q-card-actions align="right" class="bg-white text-teal">
                     <q-btn
                        flat
                        icon="fas fa-save"
                        label="save"
                        @click="UpdateBranch()"
                      />
                      <q-btn
                        flat
                        icon="fas fa-times"
                        label="close"
                        v-close-popup
                        @click="branchField = ''"
                      />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
          <!--END EDIT BRANCH DIALOG-->
    </q-card>
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
      permissions: [],
      Authorization: false,
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      passwordFieldType: "password",
      UsersUpdateDialog: false,
      RolesData: [],
      RolesList: [],
      RolesListDialog: false,
      SelectRoles: [],
      branch: null,
      BranchesList: [],
      branchField: null,
      EditBranchDialog: false,
      EditBranchID: null,
      warehouseField: null,
      UsersUpdateModel: null,
      UsersCreateDialog: false,
      UserUpdateID: null,
      EditedPermission: null,
      PermissionsList: [],
      PermissionListDialog: false,
      RoleCreateModel: null,
      RoleIdUpdateModel: null,
      RoleUpdateModel: null,
      RoleCreateDialog: false,
      RoleEditDialog: false,
      CreateBranchDialog: false,
      SelectPermissions: [],
      filterOptions: [],
      RoleData: [],
      RoleName: null,
      RoleEditDialog: false,
      selectedRole: [],
      selectedBranches: [],
      selectedUsers: [],
      PermissionCreateModel: null,
      permissionCreateDialog: false,
      PermissionName: null,
      permissionEditDialog: false,
      selectedPermission: [],
      tab: "users",
      innerTab: "innerMails",
      splitterModel: 20,
      filterPermissions: "",
      filterRoles: "",
      filterBranches: "",
      filterUsers: "",
      columnsPermissions: [
        {
          name: "name",
          required: true,
          field: "name",
          label: "Name",
          align: "left",
          sortable: true,
        },
        { name: "actions", label: "Actions", field: "actions", sortable: true },
      ],
      columnsBranches: [
        {
          name: "name",
          required: true,
          field: "branch",
          label: "Name",
          align: "left",
          sortable: true,
        },
         {
          name: "WareHouse",
          required: true,
          field: "whscode",
          label: "WareHouse",
          align: "left",
          sortable: true,
        },
        { name: "actions", label: "Actions", field: "actions", sortable: true },
      ],
      columnsUsers: [
        {
          name: "name",
          required: true,
          field: "name",
          label: "Name",
          align: "left",
          sortable: true,
        },
        {
          name: "email",
          required: true,
          field: "email",
          label: "Email",
          align: "left",
          sortable: true,
        },
        {
          name: "branches",
          required: true,
          label: "Branch/Whs",
          align: "left",
          sortable: true,
        },
        {
          name: "roles",
          required: true,
          label: "Roles",
          align: "left",
          sortable: true,
        },
        { name: "actions", label: "Actions", field: "actions", sortable: true },
      ],
      columnsRoles: [
        {
          name: "name",
          field: "name",
          required: true,
          label: "Name",
          align: "left",
          sortable: true,
        },
        {
          name: "permissions",
          required: true,
          label: "Permissions",
          align: "left",
          sortable: true,
        },
        { name: "actions", label: "Actions", field: "actions", sortable: true },
      ],
      dataPermissions: [],
      dataRoles: [],
      dataBranches: [],
      dataUsers: [],
    };
  },
  methods: {
    requiredWarehouse(val){
      return (val && val.length > 0) || "Required Warehouse";
    },
    requiredBranch(val){
      return (val && val.length > 0) || "Required Branch";
    },
    RequiredRole(val) {
      return (val && val.length > 0) || "Required Role";
    },
    RequiredPermission(val) {
      return (val && val.length > 0) || "Required Permissions";
    },
    required(val) {
      return (val && val.length > 0) || "Please enter password";
    },
    requiredRole(val) {
      return (val && val.length > 0) || "Please Select Roles";
    },
    requiredBranch(val) {
      if (!val) {
        return "Please Select Branch/Whs";
      }
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
    renderPermission() {
      instance.post("/permission/index").then((res) => {
        this.dataPermissions = res.data;
      });
    },
    Permissionedit(id) {
      this.EditedPermission = id;
      this.permissionEditDialog = true;
      instance
        .post("/permission/edit", {
          id,
        })
        .then(
          (res) => {
            this.PermissionName = res.data.name;
 
          },
          () => {
            this.$q.notify({
              type: "warning",
              message: "Something Wrong..!",
            });
          }
        );
    },
    PermissionUpdate() {
      this.PermissionCreateModel = "";
      this.$refs.RequiredPermission.validate();
      if (!this.$refs.RequiredPermission.hasError) {
        instance
          .post("/permission/update", {
            name: this.PermissionName,
            id: this.EditedPermission,
          })
          .then(
            (res) => {
              this.renderPermission();
              this.EditedPermission = [];
              this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
            },
            () => {
              this.$q.notify({
                type: "warning",
                message: "Something Wrong..!",
              });
            }
          );
      }
    },
    PermissionCreate() {
      this.$refs.RequiredPermission.validate();
      if (!this.$refs.RequiredPermission.hasError) {
        instance
          .post("/permission/create", {
            name: this.PermissionCreateModel,
          })
          .then(
            (res) => {
              this.renderPermission();
              this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
            },
            () => {
              this.$q.notify({
                type: "warning",
                message: "Something Wrong..!",
              });
            }
          );
      }
    },
    permissionTrash() {
      let trash = this.selectedPermission;
      instance
        .post("/permission/trash", {
          trash,
        })
        .then(
          (res) => {
            this.renderPermission();
            this.$q.notify({
              type: "" + res.data.color + "",
              message: "" + res.data.msg + "",
            });
            this.selectedPermission = [];
          },
          () => {
            this.$q.notify({
              type: "warning",
              message: "Something Wrong..!",
            });
          }
        );
    },
    RoleCreate() {
      this.$refs.RequiredRole.validate();
      this.$refs.RequiredPermission.validate();
      if (
        !this.$refs.RequiredPermission.hasError &&
        !this.$refs.RequiredRole.hasError
      ) {
        instance
          .post("/role/create", {
            name: this.RoleCreateModel,
            permissions: this.SelectPermissions,
          })
          .then(
            (res) => {
              this.renderRole();
              this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
            },
            () => {
              this.$q.notify({
                type: "warning",
                message: "Something Wrong..!",
              });
            }
          );
      }
    },
    RoleEdit(data) {
      this.RoleIdUpdateModel = data.id;
      this.RoleUpdateModel = data.role;
      this.PermissionsList = data;
      this.RoleEditDialog = true;
      let i = [];
      data.data.forEach((res) => {
        i.push(res.id);
      });
      this.SelectPermissions = i;
    },
    renderRole() {
      instance.post("/role/index").then(
        (res) => {
          this.dataRoles = res.data;
          let role = [];
          res.data.forEach((i) => {
            role.push({ label: i.name, value: i.id });
          });
          this.RolesData = role;
        },
        () => {
          this.$q.notify({
            type: "warning",
            message: "Something Wrong..Please Refresh the page!",
          });
        }
      );
    },
    RoleUpdate() {
      this.$refs.RequiredRole.validate();
      this.$refs.RequiredPermission.validate();
      if (
        !this.$refs.RequiredPermission.hasError &&
        !this.$refs.RequiredRole.hasError
      ) {
        instance
          .post("/role/update", {
            id: this.RoleIdUpdateModel,
            name: this.RoleUpdateModel,
            permissions: this.SelectPermissions,
          })
          .then(
            () => {
              this.renderRole();
              this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
            },
            () => {
              this.$q.notify({
                type: "warning",
                message: "Something Wrong..!",
              });
            }
          );
      }
    },
    CreateRole_btn() {
      instance.post("/permission/index").then(
        (res) => {
          res.data.forEach((element) => {
            this.filterOptions.push({ label: element.name, value: element.id });
          });
        },
        () => {
          this.$q.notify({
            type: "warning",
            message: "Something Wrong..!",
          });
        }
      );
    },
    RoleDelete() {
      let trash = this.selectedRole;
      instance
        .post("/role/trash", {
          trash,
        })
        .then(
          (res) => {
            this.renderRole();
            this.$q.notify({
              type: "" + res.data.color + "",
              message: "" + res.data.msg + "",
            });
            this.selectedRole = [];
          },
          () => {
            this.$q.notify({
              type: "warning",
              message: "Something Wrong..!",
            });
          }
        );
    },
    morePermission(data) {
      this.PermissionsList = data;
      this.PermissionListDialog = true;
    },
    //BRANCHES METHODS
    renderBranches() {
      instance.post("/Branches/index").then((res) => {
        this.dataBranches = res.data;
      });
    },
    BranchesEdit(data) {
      this.branchField = data.data.branch;
      this.warehouseField = data.data.whscode;
      this.branchID = data.data.id;
      this.EditBranchDialog = true
    },
    UpdateBranch(){
      let branch = this.branchField;
      let warehouse = this.warehouseField;
      let branchID = this.branchID;
      this.$refs.requiredWarehouse.validate();
      this.$refs.requiredBranch.validate();
      if(!this.$refs.requiredWarehouse.hasError &&
        !this.$refs.requiredBranch.hasError){
          instance.post('/Branches/update',{
            branch,
            warehouse,
            branchID
          }).then((res)=>{
              this.$q.notify({
              type: "" + res.data.color + "",
              message: "" + res.data.msg + "",
            });
              this.renderBranches();
          })
        }
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
        this.BranchesList = branches;
      });
    },
    CreateBranch(){ 
        this.$refs.requiredWarehouse.validate();
        this.$refs.requiredBranch.validate();
       if(!this.$refs.requiredWarehouse.hasError &&
         !this.$refs.requiredBranch.hasError){
            let branches = this.branchField;
            let warehouse = this.warehouseField;
            instance.post('/Branches/create',{
                branches,
                warehouse
            }).then((res)=>{
              this.$q.notify({
              type: "" + res.data.color + "",
              message: "" + res.data.msg + "",
            });
              this.renderBranches();
            },(err)=>{
              this.$q.notify({
              type: "warning",
              message: "Something Wrong..!",
            });
            })
         }
    },
    deleteBranch(){
       let trash = this.selectedBranches;
       instance.post('/Branches/trash',{
          trash
       }).then((res)=>{
            this.$q.notify({
              type: "" + res.data.color + "",
              message: "" + res.data.msg + "",
            });
              this.selectedBranches = [];
              this.renderBranches();
       },(err)=>{
          console.log(err)
       })
    },
    //END BRANCHED METHODS

    //USERS METHODS
    renderUsers() {
      instance.post("/Users/index").then((res) => {
        this.dataUsers = res.data;
      });
    },
    UsersEdit(data) {
      this.UserUpdateID = data.data.id;
      this.email = data.data.email;
      this.name = data.data.name;
      this.password = data.data.password;
      let roleId = [];
      data.data.roles.forEach((res) => {
        roleId.push(res.id);
      });

      this.SelectRoles = roleId;
      if(data.data.branches){
      this.branch = {
        label: data.data.branches.branch,
        value: data.data.branch_id,
        icon: "house",
      };
      }
 
      this.UsersUpdateDialog = true;
    },
    UsersCreate() {
      this.$refs.email.validate();
      this.$refs.username.validate();
      this.$refs.password.validate();
      this.$refs.password_confirmation.validate();
      this.$refs.RolesVal.validate();
      this.$refs.BranchesVal.validate();
      if (
        !this.$refs.email.hasError &&
        !this.$refs.username.hasError &&
        !this.$refs.password.hasError &&
        !this.$refs.password_confirmation.hasError &&
        !this.$refs.BranchesVal.hasError
      ) {
        instance
          .post("/register/user", {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
            roles: this.SelectRoles,
            branch: this.branch,
          })
          .then(
            (res) => {
              this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
              this.renderUsers();
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
      }
    },
    UsersUpdate(){
      this.$refs.email.validate();
      this.$refs.username.validate();
      this.$refs.RolesVal.validate();
      this.$refs.BranchesVal.validate();
      if (
        !this.$refs.email.hasError &&
        !this.$refs.username.hasError &&
        !this.$refs.BranchesVal.hasError
      ) {
        instance
          .post("/Users/update", {
            id: this.UserUpdateID,
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
            roles: this.SelectRoles,
            branch: this.branch,
          })
          .then(
            (res) => {
              this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
              this.renderUsers();
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
      }
    },
    userDelete(){
      let id = this.selectedUsers;
      instance.post('/Users/trash',{
        id
      }).then((res)=>{
           this.$q.notify({
                type: "" + res.data.color + "",
                message: "" + res.data.msg + "",
              });
              this.renderUsers();
      },( )=>{
              this.$q.notify({
              type: "warning",
              message: "Something Wrong..!",
            });
      })
    },
    moreRoles(data) {
      this.RolesList = data;
      this.RolesListDialog = true;
    },
    //END USERS METHODS
    MultipleSelect() {
      return this.selectedPermission.length === 0
        ? ""
        : `${this.selectedPermission.length} record${
            this.selectedPermission.length > 1 ? "s" : ""
          } selected of ${this.dataPermissions.length}`;
    },

    RoleMultipleSelect() {
      return this.selectedRole.length === 0
        ? ""
        : `${this.selectedRole.length} record${
            this.selectedRole.length > 1 ? "s" : ""
          } selected of ${this.dataRoles.length}`;
    },
    BranchesMultipleSelect() {
      return this.selectedBranches.length === 0
        ? ""
        : `${this.selectedBranches.length} record${
            this.selectedBranches.length > 1 ? "s" : ""
          } selected of ${this.dataBranches.length}`;
    },
    UsersMultipleSelect() {
      return this.selectedUsers.length === 0
        ? ""
        : `${this.selectedUsers.length} record${
            this.selectedUsers.length > 1 ? "s" : ""
          } selected of ${this.dataUsers.length}`;
    },
    hasPermission(val){
      return  this.permissions.includes(val);
    },
  },
  mounted() {
    this.renderPermission();
    this.renderRole();
    this.renderUsers();
    this.branches();
    this.renderBranches();
    this.CreateRole_btn();
    instance.post('/Users/Authorize').then((res)=>{
     this.permissions = res.data.user_permissions;
    })
  },
};
</script>