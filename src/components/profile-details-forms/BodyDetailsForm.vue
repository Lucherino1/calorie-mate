<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="localFormModel"
    class="mt-[20px] flex flex-col gap-2"
    label-position="top"
    label-width="auto"
    require-asterisk-position="right"
    :size="$elComponentSize.large"
    @submit.prevent="submit"
  >
    <el-form-item label="Age" prop="age">
      <el-input v-model.number="localFormModel.age" type="number" placeholder="Enter your age" />
    </el-form-item>

    <el-form-item label="Select your sex" prop="sex">
      <el-select v-model="localFormModel.sex" placeholder="Select your sex">
        <el-option label="Male" value="male" />
        <el-option label="Female" value="female" />
      </el-select>
    </el-form-item>

    <el-form-item label="Height" prop="height">
      <el-input v-model.number="localFormModel.height" type="number" placeholder="Enter your height" />
    </el-form-item>
    <el-form-item label="Current Weight" prop="currentWeight">
      <el-input v-model.number="localFormModel.currentWeight" type="number" placeholder="Enter your weight" />
    </el-form-item>

    <el-form-item label="Goal Weight" prop="goalWeight">
      <el-input v-model.number="localFormModel.goalWeight" type="number" placeholder="Enter your goal weight" />
    </el-form-item>
    <slot name="submitBtn">
      <el-form-item>
        <el-button
          native-type="submit"
          class="w-full"
          :type="$elComponentType.primary"
          :size="$elComponentSize.large"
        >
          Submit
        </el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>

<script lang="ts" setup>
const props = defineProps<{
  bodyFormData: TNullableBodyDetails
}>()

const emit = defineEmits<{
  (e: 'submit', localFormModel: TNullableBodyDetails): TNullableBodyDetails
}>()

const formRef = ref()

const localFormModel = reactive<TNullableBodyDetails>({ ...props.bodyFormData })

const formRules = reactive({
  age: [useRequiredRule(), useMinAgeRule()],
  sex: useRequiredRule(),
  height: [useRequiredRule(), useHeightRangeRule()],
  currentWeight: [useRequiredRule(), useCurrentWeightRule()],
  goalWeight: [
    useRequiredRule(),
    useGoalWeightRule()
  ]
})

function submit () {
  formRef.value?.validate((isValid: boolean) => {
    if (isValid) {
      emit('submit', { ...localFormModel })
    }
  })
}
</script>
