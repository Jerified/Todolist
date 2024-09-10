import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout/Layout";
import { Link } from "react-router-dom";

const signUpSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false); 
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormValues) => {
        setLoading(true);
        try {
            await signup(data.username, data.email, data.password);
        } catch (error) {
            console.error('Signup failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col text-white w-[80%] md:w-[60%] mx-auto lg:w-[50%] h-svh justify-center items-center rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
                <h2 className="font-bold text-2xl">Register</h2>
                <form className="my-8 w-full" onSubmit={handleSubmit(onSubmit)}>
                    {/* Username */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            {...register("username")}
                            placeholder="Jerrified"
                            type="text"
                            className={`text-black ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.username && (
                            <span className="text-red-500 text-sm">{errors.username.message}</span>
                        )}
                    </LabelInputContainer>

                    {/* Email */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            {...register("email")}
                            placeholder="jerrified.com"
                            type="email"
                            className={`text-black ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email.message}</span>
                        )}
                    </LabelInputContainer>

                    {/* Password */}
                    <LabelInputContainer className="mb-8">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            {...register("password")}
                            placeholder="••••••••"
                            type="password"
                            className={`text-black ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">{errors.password.message}</span>
                        )}
                    </LabelInputContainer>

                    {/* Submit Button */}
                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                        disabled={loading} 
                    >
                        {loading ? "Signing up..." : "Sign up →"}
                        <BottomGradient />
                    </button>
                </form>
                {/* Sign Ip Link */}
        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
            </div>
        </Layout>
    );
}

const BottomGradient = () => (
    <>
        <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
);

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
);
