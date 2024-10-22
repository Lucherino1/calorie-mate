<template>
  <el-table :data="tableData" class="w-full">
    <el-table-column
      v-for="header of prop.headers"
      :key="header.value"
      :prop="header.value"
      :sortable="header.sort"
      :label="header.label"
    >
      <template #header>
        <slot :name="`header_${header.value}`">
          {{ header.label }}
        </slot>
      </template>

      <template #default="{ row }">
        <slot :name="header.value" :row="row">
          {{ row[header.value] }}
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
const prop = defineProps<{
  headers: TTableHeadings
  tableData: TIndexedObject[]
}>()
</script>
