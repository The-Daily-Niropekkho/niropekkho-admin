import { z } from "zod";

export const SignupSchema = z.object({
    full_name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .trim(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    phone: z
        .string()
        .min(10, { message: "Please enter a valid phone number." }),
    password: z
        .string()
        .min(8, { message: "Be at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Contain at least one special character.",
        })
        .trim(),
});

export type FormState =
    | {
          errors?: {
              name?: string[];
              email?: string[];
              password?: string[];
          };
          message?: string;
      }
    | undefined;

export const TempUserRegisterSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
        .string()
        .min(8, { message: "Be at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, {
            message: "Contain at least one special character.",
        })
        .trim(),
});

export type TempUserRegister = z.infer<typeof TempUserRegisterSchema>;
export type Signup = z.infer<typeof SignupSchema>;