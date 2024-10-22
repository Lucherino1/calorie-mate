<template>
  <div class="flex m-5">
    <el-card class="max-w-[500px] m-5">
      <div class="flex flex-wrap gap-2">
        <div>
          <el-checkbox v-model="checked1" label="Option large 1" :size="$elComponentSize.large" />
          <el-checkbox v-model="checked2" label="Option large 2" :size="$elComponentSize.large" />
        </div>
        <div class="my-2">
          <el-checkbox v-model="checked3" label="Option default" />
          <el-checkbox v-model="checked4" label="Option default 2" />
        </div>
        <div class="mt-2">
          <el-checkbox v-model="checked5" label="Option small 1" :size="$elComponentSize.small" />
          <el-checkbox v-model="checked6" label="Option small 2" :size="$elComponentSize.small" />
        </div>
      </div>
    </el-card>
    <el-card class="w-full max-w-[700px]">
      <div class="overflow-scroll min-w-[400px] w-full overflow-x-auto">
        <AppTable :table-data="tableData" :headers="tableHeaders">
          <template #name="{ row }">
            <span style="text-transform: uppercase;">
              {{ row.name }}
            </span>
          </template>

          <template #address="{ row }">
            <strong>
              {{ row.address }}
            </strong>
          </template>
        </AppTable>
      </div>
    </el-card>
  </div>
  <el-card>
    <div class="w-full flex flex-wrap gap-5">
      <el-switch v-model="isSwitchActive" :size="$elComponentSize.large" />
      <el-switch v-model="isSwitchActive" :size="$elComponentSize.default" />
      <el-switch v-model="isSwitchActive" :size="$elComponentSize.small" />

      <el-button :type="$elComponentType.primary" link>Link button</el-button>
      <el-button :size="$elComponentSize.default" :type="$elComponentType.primary">
        default pr.
      </el-button>
      <el-button :size="$elComponentSize.default" :type="$elComponentType.success">
        default suc.
      </el-button>
      <el-button :size="$elComponentSize.large" :type="$elComponentType.warning">
        large warning
      </el-button>
      <el-button :size="$elComponentSize.large" :type="$elComponentType.danger">
        large danger
      </el-button>
      <el-button :size="$elComponentSize.small" :type="$elComponentType.info">
        small info
      </el-button>
    </div>
  </el-card>
  <div class="flex gap-0">
    <div class="flex-1 max-w-[500px]">
      <el-card class="max-w-[500px] m-5">
        <div class="flex flex-col gap-3">
          <el-progress text-inside :stroke-width="26" :percentage="70" />
          <el-progress
            text-inside
            :stroke-width="24"
            :percentage="100"
            status="success"
          />
          <el-progress
            text-inside
            :stroke-width="22"
            :percentage="80"
            status="warning"
          />
          <el-progress
            text-inside
            :stroke-width="20"
            :percentage="50"
            status="exception"
          />
        </div>
      </el-card>
      <el-card class="max-w-[500px] m-5 flex justify-center items-center">
        <div class="demo-date-picker">
          <div class="date-picker-wrapper w-full">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="Pick a day"
              :size="$elComponentSize.large"
            />
          </div>
        </div>
      </el-card>
    </div>
    <div class="flex flex-1">
      <el-card class="flex flex-col w-[410px] h-auto gap-4 m-5">
        <p class="mb-5 font-bold text-primary">Form</p>
        <el-form
          ref="ruleFormRef"
          status-icon
          label-position="top"
          label-width="auto"
          require-asterisk-position="right"
          :size="$elComponentSize.large"
        >
          <el-form-item label="Email" required>
            <el-input
              v-model="text2"
              placeholder="test1"
              type="text"
            />
          </el-form-item>

          <el-form-item label="Password" required>
            <el-input
              v-model="text3"
              placeholder="test2"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="w-full" :type="$elComponentType.primary" :size="$elComponentSize.large">
              Submit
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="h-[200px] mt-5">
        <div class="flex flex-col gap-4 w-[300px]">
          <el-input v-model="inputLarge" :size="$elComponentSize.large" :placeholder="$elComponentSize.large" />
          <el-input v-model="inputDef" :size="$elComponentSize.default" :placeholder="$elComponentSize.default" />
          <el-input v-model="inputSmall" :size="$elComponentSize.small" :placeholder="$elComponentSize.small" />
        </div>
      </el-card>
    </div>
  </div>
  <el-card class="max-w-[500px] m-5">
    <div class="flex gap-5 demo-progress">
      <div class="flex flex-col">
        <el-progress type="dashboard" :percentage="percentage" :color="colors" />
        <div class="flex justify-center">
          <el-button-group>
            <el-button @click="decrease">
              -
            </el-button>
            <el-button @click="increase">
              +
            </el-button>
          </el-button-group>
        </div>
      </div>
      <el-progress type="dashboard" :percentage="percentage2" :color="colors" />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
const percentage = ref(10)
const percentage2 = ref(0)

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(false)
const checked5 = ref(false)
const checked6 = ref(false)

const inputLarge = ref('')
const inputDef = ref('')
const inputSmall = ref('')

const isSwitchActive = ref(true)

const tableHeaders: TTableHeadings = [
  {
    value: 'date',
    label: 'Date',
    sort: true
  },
  {
    value: 'name',
    label: 'Name',
    sort: false
  },
  {
    value: 'address',
    label: 'Address'
  }
]

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom1',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom2',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom3',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom4',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const text2 = ref('')
const text3 = ref('')

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#4318ff', percentage: 100 }
]

const increase = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 100
  }
}
const decrease = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 0
  }
}
onMounted(() => {
  setInterval(() => {
    percentage2.value = (percentage2.value % 100) + 10
  }, 500)
})

// date picker

const value1 = ref('')
</script>

<style lang="scss" scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
.demo-progress .el-progress--circle {
  margin-right: 15px;
}

.date-picker-wrapper ::v-deep .el-input__wrapper {
  @apply bg-primary
}

.date-picker-wrapper ::v-deep .el-input {
  &__prefix,
  &__inner,
  &__inner::placeholder,
  &__suffix {
   @apply text-white font-normal text-base
  }
}

</style>
