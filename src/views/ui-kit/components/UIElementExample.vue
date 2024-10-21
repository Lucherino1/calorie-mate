<template>
  <div class="flex">
    <el-card class="max-w-[500px] m-5">
      <div class="flex flex-wrap gap-2">
        <el-button class="max-w-[200px] truncate">
          Hello world default
        </el-button>
        <div class="w-[400px]">
          <el-button class="w-full py-7 font-bold" :type="$elComponentType.primary" :size="$elComponentSize.large">
            Hello large
          </el-button>
        </div>
        <el-button :type="$elComponentType.primary" :size="$elComponentSize.large">
          Hello world
        </el-button>
      </div>
    </el-card>
    <el-card class="max-w-[700px]">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="name" label="Name" width="180" />
        <el-table-column prop="address" label="Address" />
      </el-table>
    </el-card>
  </div>

  <el-card class="max-w-[500px] m-5">
    <div class="flex flex-col gap-3">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="70" />
      <el-progress
        :text-inside="true"
        :stroke-width="24"
        :percentage="100"
        status="success"
      />
      <el-progress
        :text-inside="true"
        :stroke-width="22"
        :percentage="80"
        status="warning"
      />
      <el-progress
        :text-inside="true"
        :stroke-width="20"
        :percentage="50"
        status="exception"
      />
    </div>
  </el-card>

  <el-card class="max-w-[500px] m-5">
    <div class="flex gap-5 demo-progress">
      <div class="flex flex-col">
        <el-progress type="dashboard" :percentage="percentage" :color="colors" />
        <div>
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

  <div class="flex flex-col w-[410px] h-[400px] gap-4 m-5 p-5 rounded-sm shadow-md bg-white">
    <p>Form</p>
    <el-form
      ref="ruleFormRef"
      status-icon
      label-width="auto"
    >
      <el-form-item>
        <el-input
          v-model="text2"
          placeholder="test1"
          type="text"
        />
      </el-form-item>

      <el-form-item>
        <el-input
          v-model="text3"
          placeholder="test2"
          type="password"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item>
        <el-input v-model="text" placeholder="test3" />
      </el-form-item>
      <el-form-item>
        <el-button class="w-full" :type="$elComponentType.primary" :size="$elComponentSize.large">
          Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-card class="max-w-[500px] m-5 flex justify-center items-center">
    <div class="demo-date-picker">
      <div class="date-picker-wrapper w-full">
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="Pick a day"
          :size="size"
        />
      </div>
    </div>
  </el-card>
</template>

<script lang="ts" setup>
const percentage = ref(10)
const percentage2 = ref(0)

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  }
]

const text = ref('')
const text2 = ref('')
const text3 = ref('')

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 }
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
const size = ref<'default' | 'large' | 'small'>('default')

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
   @apply text-white font-medium text-xl
  }
}

</style>
