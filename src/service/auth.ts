/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import config from "@/config";
import { passwordSetSchema, PasswordSetValues } from "@/schema/change-password.schema";
import { loginSchema, otpSchema } from "@/schema/signin.schema";
import { cookies } from "next/headers";

interface SigninFormValues {
    token_id: string;
    otp: string;
}

interface SignupFormValues {
    full_name: string;
    email: string;
    phone: string;
    password: string;
}

export async function signin(formData: SigninFormValues) {
    
    const validatedFields = otpSchema.safeParse({
        token_id: formData.token_id,
        otp: formData.otp,
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const res = await fetch(`${config.host}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token_id: formData.token_id,
                otp: formData.otp,
            }),
        });

        const result = await res.json();
        
        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Login failed",
            };
        }


        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (result?.success)
            cookies().set("session", result?.data?.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                expires: expiresAt,
            });

            cookies().set("is_change_password", result?.data?.userData?.is_change_password, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            });
        // Return success response
        return {
            success: result?.success,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
}

export async function googleSignIn(code: string) {
    try {
        const res = await fetch(`${config.host}/api/auth/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
            }),
        });

        const result = await res.json();

        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Login failed",
            };
        }

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (result?.success)
            cookies().set("session", result?.data?.token, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: expiresAt,
            });

        // Return success response
        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        // Handle any network or unexpected errors
        return {
            success: false,
            error,
        };
    }
}

export async function ChangePassword(formData: PasswordSetValues) {
    const validatedFields = passwordSetSchema.safeParse({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const sessionCookie = cookies().get("session");
        
        const res = await fetch(`${config.host}/api/v1/auth/change-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${sessionCookie?.value || ""}`
            },
            body: JSON.stringify({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
            }),
        });

        const result = await res.json();
        cookies().delete("is_change_password");
        
        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Password Change failed",
            };
        }
        // Return success response
        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        return {
            success: false,
            error,
        };
    }
}


export async function signup(formData: SignupFormValues) {
    const validatedFields = loginSchema.safeParse({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
    });

    if (!validatedFields.success) {
        return {
            success: false,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const res = await fetch(`${config.host}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                full_name: formData.full_name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            }),
        });

        const result = await res.json();

        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Signup failed",
            };
        }

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (result?.success)
            cookies().set("session", result?.data?.token, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: expiresAt,
            });

        // Return success response
        return {
            success: true,
            data: result.data,
        };
    } catch (error) {
        // Handle any network or unexpected errors
        console.log(error);

        return {
            success: false,
            errors: "Something went wrong. Please try again.",
        };
    }
}

export async function signout() {
    cookies().delete("session");
}
