import { z } from 'zod'

const intish = z.coerce.number().int().positive()

const EMPLOYEE_RESOURCE_TYPES = ['phone_sim', 'email', 'domain_account', 'badge', 'access_card', 'seat', 'other'] as const

export const ListEmployeesQuerySchema = z.object({
  keyword: z.string().optional(),
  campusId: z.coerce.number().int().positive().optional(),
  departmentId: z.coerce.number().int().positive().optional(),
  status: z.enum(['active', 'resigned']).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(200).default(20),
})

export const CreateEmployeeSchema = z.object({
  employeeNo: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(64),
  campusId: intish,
  departmentId: intish.optional(),
  joinedAt: z.string().optional(),
  remark: z.string().optional(),
})

export const UpdateEmployeeSchema = z.object({
  name: z.string().trim().min(1).max(64).optional(),
  employeeNo: z.string().trim().min(1).max(64).optional(),
  departmentId: z.union([intish, z.null()]).optional(),
  joinedAt: z.union([z.string(), z.null()]).optional(),
  remark: z.union([z.string(), z.null()]).optional(),
})

export const UpdateEmployeeCampusSchema = z.object({
  campusId: intish,
})

export const QuickCreateEmployeeSchema = z.object({
  employeeNo: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(64),
  campusId: intish,
  departmentId: intish.optional(),
  remark: z.string().optional(),
})

export const CreateResourceSchema = z.object({
  type: z.enum(EMPLOYEE_RESOURCE_TYPES),
  identifier: z.string().trim().min(1).max(255),
  status: z.enum(['active', 'closed']).default('active'),
  assignedAt: z.string().optional(),
  remark: z.string().optional(),
})

export const UpdateResourceSchema = z.object({
  type: z.enum(EMPLOYEE_RESOURCE_TYPES).optional(),
  identifier: z.string().trim().min(1).max(255).optional(),
  status: z.enum(['active', 'closed']).optional(),
  remark: z.union([z.string(), z.null()]).optional(),
})

export const ResignSchema = z.object({
  resourceIds: z.array(intish).default([]),
  forceMarkResign: z.boolean().default(false),
  resignedAt: z.string().optional(),
  remark: z.string().optional(),
})

export const ReturnEmployeeAssetsSchema = z.object({
  requestId: z.string().trim().min(1),
  assetIds: z.array(intish).min(1),
  remark: z.string().optional(),
})

export type EmployeeResourceType = (typeof EMPLOYEE_RESOURCE_TYPES)[number]
export const ALL_RESOURCE_TYPES = EMPLOYEE_RESOURCE_TYPES
