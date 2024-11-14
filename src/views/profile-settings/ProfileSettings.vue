<template>
  <div class="app-container--compact flex flex-col h-full">
    <h1 class="w-full page-header">Profile settings</h1>

    <div class="mx-0 flex-1 flex w-full justify-between overflow-hidden">
      <el-tabs v-model="activeTab" stretch class="flex w-full h-full">
        <el-tab-pane lazy label="Body Details" name="bodyDetails" class="h-full py-5 flex justify-center items-center">
          <el-card class="h-full px-10 max-w-[600px] card--no-shadow w-full">
            <UserFormBodyDetails
              class="overflow-y-auto w-full"
              :body-form-data="formData"
              submit-button-text="Save"
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
