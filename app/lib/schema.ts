import z from 'zod';


export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    skills: z.array(z.string().min(1)) 
  });

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})


// export type signupSchema = z.infer<typeof signupSchema>
// export type loginSchema = z.infer<typeof loginSchema>
