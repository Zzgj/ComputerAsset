import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, 'username is required'),
  password: z.string().min(1, 'password is required'),
})

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6, '新密码长度不能少于 6 位'),
  })
  .refine((d) => d.oldPassword !== d.newPassword, {
    message: '新密码不能与旧密码相同',
    path: ['newPassword'],
  })
