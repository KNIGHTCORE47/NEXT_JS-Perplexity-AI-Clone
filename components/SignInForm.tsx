'use client';

import React, { useState } from 'react'
import { SignInSchema } from '@/schemas/AuthenticationSchema'
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignIn } from "@clerk/nextjs";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import {
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
} from 'lucide-react'


export default function SignInForm() {
    // NOTE - State Management [Spinner]
    const [isSubmitting, setIsSubmitting] = useState(false);

    // NOTE - State Management [Authentication Error message state] 
    const [authError, setAuthError] = useState<string | null>(null);

    // NOTE - State Management [password visibility state] 
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    // NOTE - Clerk [custom signup]
    const { isLoaded, signIn, setActive } = useSignIn();

    // NOTE - [Zod Resolver]
    const form = useForm<zod.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // NOTE - Form Submit Handler [React Hook Form]
    async function onSubmit(data: zod.infer<typeof SignInSchema>) {
        // NOTE - Check for component state [mounting]
        if (!isLoaded) return;

        // NOTE - Load Spinner
        setIsSubmitting(true);

        // NOTE - Error State
        setAuthError(null);

        try {
            // NOTE - Attempt to sign in
            const response = await signIn.create({
                identifier: data.email,
                password: data.password,
            });

            // NOTE - Set Active Session [Session ID]
            if (response.status === "complete") {
                await setActive({
                    session: response.createdSessionId
                });

                // NOTE - Redirect to Home
                router.push("/");
            } else {
                console.error("Sign in failed:", response);

                // NOTE - Set Error 
                setAuthError("Sign in could not be completed. Please try again.");
            }

        } catch (error: any) {
            console.error("Error signing in:", error);

            // NOTE - Set Error 
            setAuthError(error.errors?.[0]?.message || "Failed to sign in. Please try again.");

        } finally {
            // NOTE - Unload Spinner
            setIsSubmitting(false);
        }
    }

    // NOTE - Password Toggle Handler
    function togglePassword() {
        setShowPassword(!showPassword);
    }

    return (
        <div
            className='w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md'
        >
            <div
                className="space-y-2 text-center"
            >
                <h2
                    className='text-xl font-bold tracking-tight lg:text-3xl'
                >
                    Sign In
                </h2>
                <p
                    className='text-sm text-muted-foreground'
                >
                    Sign In to your account and continue the AI journey
                </p>
            </div>

            {/* NOTE - Error Alert */}
            {authError && (
                <Alert
                    variant="destructive"
                >
                    <AlertCircle
                        className="h-4 w-4"
                    />
                    <AlertTitle>
                        Error
                    </AlertTitle>
                    <AlertDescription>
                        {authError}
                    </AlertDescription>
                </Alert>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                        name="email"
                        control={form.control}
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>
                                    Email
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        name="password"
                        control={form.control}
                        render={({ field }) => (

                            <FormItem>

                                <FormLabel>
                                    Password
                                </FormLabel>

                                <FormControl>
                                    <div
                                        className='relative'
                                    >
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            {...field}
                                        />

                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={togglePassword}
                                        >
                                            {showPassword ? (
                                                <EyeOff
                                                    className="h-4 w-4 text-muted-foreground"
                                                />
                                            ) : (
                                                <Eye
                                                    className="h-4 w-4 text-muted-foreground"
                                                />
                                            )}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* NOTE - CAPTCHA Element */}
                    <div id='clerk-captcha'></div>

                    <Button
                        type="submit"
                        className="w-full rounded-full bg-[#2e757d] hover:bg-[#2e757d]/80"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Signing In...
                            </>
                        ) : "Sign In"}
                    </Button>
                </form>
            </Form>

            <div
                className='text-center'
            >
                <p
                    className='text-sm text-muted-foreground'
                >
                    D&#39;ont have an account?{' '}
                    <Link
                        href="/sign-up"
                        className="text-[#2e757d] hover:text-[#2e757d]/80 underline underline-offset-4"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>

        </div>
    )
}

