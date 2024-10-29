'use client'
import React from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { login } from "@/api/auth";
import { User, UserAuthResponse } from "@/types/User";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/common/GlobalContext";

export default function Login() {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const { user, setUser } = useUser();
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [beginValidation, setBeginValidation] = React.useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setBeginValidation(true);
  };

  /**
   * Handles form submission for user login.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.email === '' || formData.password === '')
      setError('Email and password are required');
    else {
      try {
        const response: UserAuthResponse = await login(formData.email, formData.password);
        if (response?.user) {
          setUser(response.user);
          router.push('/home');
        }
        else {
          if (response?.response.status === 401)
            setError('Invalid email or password');

          else if (response?.response.status === 400)
            setError('Email and password are required');
        }
      }
      catch (error) {
        console.error("Error Logging in: " + error);
      }
    }
    setIsSubmitting(false);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center">Log In</h2>
          <p className="text-center text-gray-500">Access your library account</p>
        </CardHeader>

        <CardContent>
          {error && <Alert variant="destructive" className="mb-3">{error}</Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center">
          <p className="text-gray-500">
            Don’t have an account? <a href="/sign_up" className="text-blue-500 hover:underline">Sign up</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
