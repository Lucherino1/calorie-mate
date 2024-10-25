<template>
  <div>
    <el-form-item label="First name" prop="firstName">
      <el-input v-model="localModel.firstName" placeholder="Anthony" type="text" />
    </el-form-item>

    <el-form-item label="Last name" prop="lastName">
      <el-input v-model="localModel.lastName" placeholder="Soprano" type="text" />
    </el-form-item>

    <el-form-item label="Email" prop="email">
      <el-input v-model="localModel.email" placeholder="email@example.com" type="email" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  model: IProfileFields
}>()

const localModel = reactive({ ...props.model })
</script>
