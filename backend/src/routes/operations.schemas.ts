import { z } from 'zod'

const intish = z.coerce.number().int().positive()

const baseFlow = z.object({
  requestId: z.string().min(1),
  assetId: intish,
  remark: z.string().optional(),
})

export const CheckOutSchema = baseFlow.extend({
  userName: z.string().trim().min(1),
  departmentId: intish,
  ignoreConflict: z.union([z.boolean(), z.literal('true'), z.literal('1')]).optional(),
})

export const AssignSchema = baseFlow.extend({
  userName: z.string().trim().min(1),
  departmentId: intish,
})

export const CancelAssignSchema = baseFlow

export const PickUpSchema = baseFlow

export const LendSchema = baseFlow.extend({
  userName: z.string().trim().min(1),
  departmentId: intish,
  expectedReturnDate: z.string().min(1),
  ignoreConflict: z.union([z.boolean(), z.literal('true'), z.literal('1')]).optional(),
})

export const ReturnSchema = baseFlow

export const RetireSchema = baseFlow

export const ConfirmSignatureSchema = z.object({
  recordId: intish,
  signatureImage: z.string().regex(/^data:image\//, 'Invalid signature image'),
})

export const ManualRecordSchema = z.object({
  requestId: z.string().min(1),
  assetId: intish,
  userName: z.string().trim().min(1),
  departmentId: intish,
  actionDate: z.string().min(1),
  remark: z.string().optional(),
})

export const ResetSignatureSchema = z.object({
  requestId: z.string().min(1),
  recordId: intish,
  remark: z.string().optional(),
})
