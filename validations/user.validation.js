import { z } from 'zod'

const validationUser = z.object({
  username: z.string().min(3).max(15),
  email: z.string().email(),
  password: z.string().min(6)
})

export const validateUser = (data) => {
  return validationUser.safeParse(data)
}

export const validatePickUser = (data) => {
  return validationUser.pick({
    username: true,
    password: true
  }).safeParse(data)
}

export const validatePartialUser = (data) => {
  console.log('Datos de entrada:', data)
  const result = validationUser.partial().safeParse(data)
  console.log('Resultado de la validación:', result)
  return result
}
