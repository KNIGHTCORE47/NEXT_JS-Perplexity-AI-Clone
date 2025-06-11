'use client';

import React, { useState } from 'react'
import { SignUpSchema } from '@/schemas/AuthenticationSchema'
import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignUp } from "@clerk/nextjs";

import {
    Form,
    FormControl,
    FormDescription,
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
    ArrowLeft,
    Mail,
} from 'lucide-react'


export default function SignUpForm() {

    // NOTE - State Management [Spinner]
    const [isSubmitting, setIsSubmitting] = useState(false);

    // NOTE - State Management [Authentication Error message state] 
    const [authError, setAuthError] = useState<string | null>(null);

    // NOTE - State Management [custom page mounting]
    const [isVerifying, setIsVerifying] = useState(false);

    // NOTE - State Management [email verification code state] 
    const [verificationCode, setVerificationCode] = useState<string>('');

    // NOTE - State Management [email verification code error state]
    const [verificationCodeError, setVerificationCodeError] = useState<string | null>(null);

    // NOTE - State Management [password visibility state] 
    const [showPassword, setShowPassword] = useState(false);

    // NOTE - State Management [password confirmation visibility state] 
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const router = useRouter();

    // NOTE - Clerk [custom signup]
    const { isLoaded, signUp, setActive } = useSignUp();

    // NOTE - [Zod Resolver]
    const form = useForm<zod.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    // NOTE - Form Submit Handler [React Hook Form]
    async function onSubmit(data: zod.infer<typeof SignUpSchema>) {
        // NOTE - Check for component state [mounting]
        if (!isLoaded) return;

        // NOTE - Load Spinner
        setIsSubmitting(true);

        // NOTE - Error State
        setAuthError(null);

        try {
            // NOTE - Attempt to sign up
            await signUp.create({
                emailAddress: data.email,
                password: data.password,
            });

            // NOTE - Send Clerk to verify email
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            })

            //NOTE - Set Verification State
            setIsVerifying(true);

        } catch (error: any) {
            console.error("Error signing up:", error);

            // NOTE - Set Error 
            setAuthError(error.errors?.[0]?.message || "Failed to sign up. Please try again.");

        } finally {
            // NOTE - Unload Spinner
            setIsSubmitting(false);
        }
    }


    // NOTE - Verification Code Submit Handler
    async function onSubmitVerificationCode(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // NOTE - Check for component state [mounting]
        if (!isLoaded || !signUp) return;

        // NOTE - Load Spinner
        setIsSubmitting(true);

        // NOTE - Error State
        setVerificationCodeError(null);

        try {
            // NOTE - Recieve verification code [via Clerk OTP Verification]
            const response = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            // NOTE - Set Active Session [Session ID]
            if (response.status === "complete") {
                await setActive({
                    session: response.createdSessionId
                });

                // NOTE - Redirect to Home
                router.push("/");
            } else {
                console.error("Verification failed:", response);

                // NOTE - Set Error 
                setVerificationCodeError("Your OTP verification could not be completed. Please try again.");
            };

        } catch (error: any) {
            console.error("Error signing up:", error);

            // NOTE - Set Error 
            setVerificationCodeError(error.errors?.[0]?.message || "An error occurred during one-time password verification. Please try again.");

        } finally {
            // NOTE - Unload Spinner
            setIsSubmitting(false);
        }
    }

    // NOTE - Resend Verification Code Handler
    async function resendVerificationCode() {
        // NOTE - Check for component state [mounting]
        if (!isLoaded || !signUp) return;

        // NOTE - Load Spinner
        setIsSubmitting(true);

        // NOTE - Error State
        setVerificationCodeError(null);

        try {
            // NOTE - Recieve verification code [via Clerk OTP Verification]
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

        } catch (error: any) {
            console.error("Error signing up:", error);

            // NOTE - Set Error 
            setVerificationCodeError(error.errors?.[0]?.message || "Failed to resend verification code. Please try again.");
        } finally {
            // NOTE - Unload Spinner
            setIsSubmitting(false);
        }
    }


    // NOTE - Go Back Handler
    function goBack() {
        setIsVerifying(false);
        setVerificationCode('');
        setVerificationCodeError(null);
    }


    // NOTE - Password Toggle Handler
    function togglePassword() {
        setShowPassword(!showPassword);
    }

    // NOTE - Password Confirmation Toggle Handler
    function togglePasswordConfirmation() {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    }

    // NOTE - Verify OTP Code [Mounting Component]
    if (isVerifying) {
        return (
            <div
                className='w-full max-w-md p-8 space-y-8 rounded-lg bg-white shadow-md'
            >
                <div
                    className="space-y-2 text-center"
                >
                    <div
                        className="mx-auto w-12 h-12 bg-[#2e757d]/10 rounded-full flex items-center justify-center mb-4"
                    >
                        <Mail
                            className="w-6 h-6 text-[#2e757d]"
                        />
                    </div>

                    <h2
                        className='text-xl font-bold tracking-tight lg:text-3xl'
                    >
                        Verify your email
                    </h2>

                    <p
                        className='text-sm text-muted-foreground'
                    >
                        We've sent a verification code to your email address. Please enter the code below to complete your account setup.
                    </p>
                </div>

                {verificationCodeError && (
                    <Alert
                        variant="destructive"
                    >
                        <AlertCircle
                            className="h-4 w-4"
                        />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {verificationCodeError}
                        </AlertDescription>
                    </Alert>
                )}

                <form
                    onSubmit={onSubmitVerificationCode}
                    className="space-y-6"
                >
                    <div
                        className="space-y-2"
                    >
                        <label
                            htmlFor="verification-code"
                            className="text-sm font-medium"
                        >
                            Verification Code
                        </label>

                        <Input
                            id="verification-code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full rounded-full bg-[#2e757d] hover:bg-[#2e757d]/80"
                        disabled={isSubmitting || verificationCode.length !== 6}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : "Verify Email"}
                    </Button>
                </form>

                <div
                    className="space-y-4"
                >
                    <div
                        className="text-center"
                    >
                        <p
                            className="text-sm text-muted-foreground"
                        >
                            Didn&apos;t receive the code?{' '}
                            <button
                                type="button"
                                onClick={resendVerificationCode}
                                disabled={isSubmitting}
                                className="text-[#2e757d] hover:text-[#2e757d]/80 underline underline-offset-4 disabled:opacity-50"
                            >
                                Resend code
                            </button>
                        </p>
                    </div>

                    <div
                        className="text-center"
                    >
                        <button
                            type="button"
                            onClick={goBack}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft
                                className="mr-2 h-4 w-4"
                            />
                            Back to sign up
                        </button>
                    </div>
                </div>
            </div>
        )
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
                    Create an account
                </h2>
                <p
                    className='text-sm text-muted-foreground'
                >
                    Sign up to start your amazing AI journey
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

                                <FormDescription>
                                    We&#39;ll send you a confirmation code for this email.
                                </FormDescription>

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

                    <FormField
                        name="confirmPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>
                                    Confirm Password
                                </FormLabel>

                                <FormControl>
                                    <div
                                        className='relative'
                                    >
                                        <Input
                                            type={showPasswordConfirmation ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            {...field}
                                        />

                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={togglePasswordConfirmation}
                                        >
                                            {showPasswordConfirmation ? (
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
                                Creating Account...
                            </>
                        ) : "Create Account"}
                    </Button>
                </form>
            </Form>

            <div
                className='text-center'
            >
                <p
                    className='text-sm text-muted-foreground'
                >
                    Already have an account?{' '}
                    <Link
                        href="/sign-in"
                        className="text-[#2e757d] hover:text-[#2e757d]/80 underline underline-offset-4"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}
