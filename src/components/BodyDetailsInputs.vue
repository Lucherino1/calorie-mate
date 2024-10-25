<template>
  <div>
    <el-form-item label="Age" prop="age">
      <el-input v-model="localModel.age" type="number" placeholder="Enter your age" />
    </el-form-item>

    <el-form-item label="Sex" prop="sex">
      <el-select v-model="localModel.sex" placeholder="Select your sex">
        <el-option label="Male" value="male" />
        <el-option label="Female" value="female" />
      </el-select>
    </el-form-item>

    <el-form-item label="Main Goal" prop="mainGoal">
      <el-select v-model="localModel.mainGoal" placeholder="Select your sex">
        <el-option label="Loose weight" value="loose" />
        <el-option label="Gain weight" value="gain" />
        <el-option label="Support weight" value="support" />
      </el-select>
    </el-form-item>

    <el-form-item label="Height" prop="height">
      <el-input v-model="localModel.height" type="number" placeholder="Enter your height" />
    </el-form-item>
    <el-form-item label="Current Weight" prop="currentWeight">
      <el-input v-model="localModel.currentWeight" type="number" placeholder="Enter your weight" />
    </el-form-item>

    <el-form-item label="Goal Weight" prop="goalWeight">
      <el-input v-model="localModel.goalWeight" type="number" placeholder="Enter your goal weight" />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  model: IBodyDetails
}>()

const localModel = reactive({ ...props.model })
</script>
