<template>
  <el-cascader
    :model-value="normalizedModel"
    class="department-cascader"
    :options="options"
    :props="cascaderProps"
    :placeholder="placeholder"
    filterable
    clearable
    @update:model-value="onChange"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buildDepartmentCascaderOptions } from '../utils/departmentTree'

const props = withDefaults(
  defineProps<{
    modelValue: number | null
    departments: Array<{
      id: number
      name: string
      campusId: number
      parentId: number | null
      sortOrder: number
    }>
    campuses: Array<{ id: number; name: string; sortOrder: number }>
    placeholder?: string
  }>(),
  { placeholder: '按园区展开后选择部门' },
)

const emit = defineEmits<{ 'update:modelValue': [v: number | null] }>()

const options = computed(() => buildDepartmentCascaderOptions(props.departments, props.campuses))

/** Cascader 内部用 undefined 表示清空 */
const normalizedModel = computed(() => (props.modelValue == null ? undefined : props.modelValue))

const cascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  emitPath: false,
  checkStrictly: true,
}

function onChange(v: number | undefined) {
  if (v == null || (typeof v === 'number' && v < 0)) {
    emit('update:modelValue', null)
    return
  }
  emit('update:modelValue', v)
}
</script>

<style scoped>
.department-cascader {
  width: 100%;
}
</style>
