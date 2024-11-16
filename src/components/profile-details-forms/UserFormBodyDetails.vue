<template>
  <el-form
    ref="formRef"
    :rules="formRules"
    :model="localFormModel"
    class="mt-[20px] flex flex-col gap-2 overflow-hidden"
    label-position="top"
    label-width="auto"
    require-asterisk-position="right"
    :size="$elComponentSize.large"
    @submit.prevent="submit"
  >
    <div class="h-full overflow-y-auto">
      <div class="flex gap-5 pb-1">
        <el-form-item class="flex-1" label="Select your sex" prop="sex">
          <el-select
            v-model="localFormModel.sex"
            placeholder="Select your sex"
          >
            <el-option label="Male" value="male" />

            <el-option label="Female" value="female" />
          </el-select>
        </el-form-item>

        <el-form-item class="flex-1" label="Age" prop="age">
          <el-input v-model.number="localFormModel.age" type="number" placeholder="Enter your age" />
        </el-form-item>
      </div>

      <el-form-item label="Select your activity level" prop="activityLevel">
        <el-select v-model="localFormModel.activityLevel" placeholder="How active are you on daily basis?">
          <el-option
            v-for="activity of activityLevels"
            :key="activity.value"
            :label="activity.label"
            :value="activity.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Height in (cm)" prop="height">
        <el-input v-model.number="localFormModel.height" type="number" placeholder="Enter your height" />
      </el-form-item>
      <el-form-item label="Current Weight in (kg)" prop="currentWeight">
        <el-input v-model.number="localFormModel.currentWeight" type="number" placeholder="Enter your weight" />
      </el-form-item>

      <el-form-item label="Goal Weight in (kg)" prop="goalWeight">
        <el-input v-model.number="localFormModel.goalWeight" type="number" placeholder="Enter your goal weight" />
      </el-form-item>
    </div>

    <slot name="submitBtn">
      <el-form-item>
        <el-button
          :loading="isSubmitButtonLoading"
          native-type="submit"
          class="w-full"
          :disabled="isSubmitButtonDisabled"
          :type="$elComponentType.primary"
          :size="$elComponentSize.large"
        >
          {{ submitButtonText }}
        </el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  bodyFormData: Partial<IBodyDetails>
  submitButtonText: string
  isSubmitButtonDisabled?: boolean
  isSubmitButtonLoading?: boolean
}>(), {
  submitButtonText: 'Submit'
})

const emit = defineEmits<{
  (e: 'submit', localFormModel: Partial<IBodyDetails>): Partial<IBodyDetails>
}>()

const formRef = useTemplateRef<TElementPlus['FormInstance']>('formRef')

interface IActivityLevel {
  label: string
  value: number
}

const activityLevels: IActivityLevel[] = [
  {
    label: 'Sedentary active (mostly sitting)',
    value: 1.2
  },
  {
    label: 'Moderately active (mostly standing)',
    value: 1.375
  },
  {
    label: 'Active (mostly walking)',
    value: 1.55
  },
  {
    label: 'Very active (physically demanding job)',
    value: 1.75
  }
]

const localFormModel = reactive<Partial<IBodyDetails>>({ ...props.bodyFormData })

const formRules = reactive({
  age: [useRequiredRule(), useMinAgeRule()],
  sex: useRequiredRule(),
  activityLevel: useRequiredRule(),
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
