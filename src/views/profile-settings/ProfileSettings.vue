<template>
  <div class="app-container--compact flex flex-col h-full">
    <h1 class="w-full page-header">Profile settings</h1>
    <div class="flex w-full justify-between overflow-hidden">
      <div class="mx-0 flex-1">
        <el-tabs v-model="activeTab" stretch class="flex w-full h-full">
          <el-tab-pane lazy label="Body Details" name="bodyDetails" class="h-full flex justify-center items-center">
            <el-card class="mt-2 h-full px-10 min-w-[600px]">
              <UserFormBodyDetails
                class="overflow-y-auto overflow-x-hidden"
                :body-form-data="formData"
                submit-button-text="Sibmit"
              />
            </el-card>
          </el-tab-pane>

          <el-tab-pane lazy class="h-full" label="Recipes" name="recipes">
            <el-card class="max-w-[600px] mt-2">
              <UserFormProfile
                :profile-form-data="profileFormData"
              />
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = 'bodyDetails'
const formData = ref<IBodyDetails>({
  sex: 'male',
  activityLevel: 1.2,
  height: 172,
  currentWeight: 70,
  goalWeight: 80,
  age: 0
})

const profileFormData = ref<IProfileFields>({
  email: 'goaododwodwo@gmail.com',
  password: 'dwdwdwadwd',
  firstName: 'Amir',
  lastName: 'Stupish',
  confirmPassword: 'dwdwdwadwd'
})
</script>
