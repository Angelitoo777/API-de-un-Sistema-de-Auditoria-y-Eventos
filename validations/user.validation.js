import { z } from 'zod'

const validationUser = z.object({
  username: z.string().min(3).max(15),
  email: z.string().email(),
  password: z.string().min(6)
})

export const validateUser = (data) => {
  return validationUser.safeParse(data)
}
