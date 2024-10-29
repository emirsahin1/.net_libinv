'use client'
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { signup } from "@/api/auth";
import { User, UserSignupResponse } from "@/types/User";

export default function SignUp() {
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        isLibrarian: false
    });

    const [error, setError] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [beginValidation, setBeginValidation] = React.useState(false);
    const { toast } = useToast()
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;

    const validatePassword = (password) => {
        return passwordPattern.test(password);
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setBeginValidation(true);
        if (e.target.name === 'password')
            if (!validatePassword(e.target.value))
                setError('Password must have at least one uppercase letter and one none numeric character');
            else    
                setError('');
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.fullName === '' || formData.email === '' || formData.password === '')
            setError('Email and password are required');
        else if (formData.password !== formData.confirmPassword)
            setError('Passwords do not match');
        else {
            try {
                const response: UserSignupResponse = await signup(formData.fullName, formData.email, formData.password, formData.isLibrarian);
                if (response?.user) {
                    window.location.href = '/';
                    toast({ description: "Successfully signed up!" });
                }
                else {
                    if (response?.response.status === 400)
                        setError('Please fill out all the required fields');

                    else if (response?.response.status === 500) {
                        console.error("Error signing up: " + response?.response.statusText);
                        toast({ variant: "destructive", description: "Error signing up!" });
                        setError('');
                    }
                }
            }
            catch (error) {
                console.error("Error signing up: " + error);
                toast({ variant: "destructive", description: "Error signing up!" });
                setError('');
            }
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Toaster />
            <Card className="w-full max-w-md p-6">
                <CardHeader>
                    <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
                    <p className="text-center text-gray-500">Sign up with a new account.</p>
                </CardHeader>

                <CardContent>
                    {error && <Alert variant="destructive" className="mb-3">{error}</Alert>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                name="fullName"
                                placeholder="Enter your Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                            />
                            {(formData.fullName === '' && beginValidation) && (
                                <p className="text-red-500 text-sm">Full Name is required</p>
                            )}
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {(formData.email === '' && beginValidation) && (
                                <p className="text-red-500 text-sm">Email is required</p>
                            )}
                        </div>

                        <div>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {(formData.password === '' && beginValidation) && (
                                <p className="text-red-500 text-sm">Password is required</p>
                            )}
                        </div>
                        <div>
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                placeholder="Enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {((formData.password !== formData.confirmPassword) && beginValidation) && (
                                <p className="text-red-500 text-sm">Password does not match!</p>
                            )}
                        </div>

                        <div className="items-top flex space-x-2">
                            <Checkbox id="role" checked={formData.isLibrarian}  
                                onCheckedChange={(e) => setFormData({ ...formData, isLibrarian: e })}/>
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="role"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Are you a Librarian at this library?
                                </label>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Signing up...' : 'Sign up'}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="text-center">
                    <p className="text-gray-500">
                        Already have an account? <a href="/" className="text-blue-500 hover:underline">Log in</a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
