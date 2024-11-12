=<template>
  <el-table flexible :height="height" class="min-w-full" :data="tableData">
    <el-table-column
      v-for="header of prop.headers"
      :key="header.value"
      :prop="header.value"
      :sortable="header.sort"
      :label="header.label"
      :fixed="header.fixed"
      :width="header.width"
      :min-width="header.minWidth"
      :align="header.align"
    >
      <template #header>
        <slot :name="`header_${header.value}`">
          {{ header.label }}
        </slot>
      </template>

      <template #default="{ row }">
        <slot :name="header.value" :row="row">
          <span v-if="header.formatter">
            {{ header.formatter(row) }}
          </span>
          <span v-else>
            {{ row[header.value] }}
          </span>
        </slot>
      </template>
    </el-table-column>
    <template #empty>
      <div class="min-h-[200px] flex justify-center items-center text-base">
        {{ emptyTitle }}
      </div>
    </template>
  </el-table>
</template>

<script lang="ts" setup>
const prop = defineProps<{
  headers: TTableHeadings
  tableData: TIndexedObject[]
  emptyTitle?: string
  height?: string
}>()
</script>
