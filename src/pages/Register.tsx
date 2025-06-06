import { useAuth, UserRole } from '@/components/auth/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('school');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await register(name, email, password, role);
      setRegistrationSuccess(true);
    } catch (error: any) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-bold text-navy">
            Create an Account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our network of education professionals
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card className="shadow-lg border-0 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                {registrationSuccess ? "Check Your Email" : "Register"}
              </CardTitle>
              <CardDescription className="text-center">
                {registrationSuccess 
                  ? "We've sent a verification email to your address"
                  : "Enter your details to create your account"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {registrationSuccess ? (
                <div className="text-center py-6">
                  <div className="mb-4">
                    <svg 
                      className="w-16 h-16 text-green-500 mx-auto" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Registration Successful!
                  </h3>
                  <p className="mt-2 text-gray-600">
                    We've sent a verification email to <span className="font-semibold">{email}</span>.
                    Please check your inbox and click the link to activate your account.
                  </p>
                  <div className="mt-6 flex justify-center gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Return Home
                    </Button>
                    <Button 
                      onClick={() => {
                        setRegistrationSuccess(false);
                        setName('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                      }}
                    >
                      Create Another Account
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-animated"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-animated"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-animated"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-animated"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <RadioGroup 
                      value={role || 'school'} 
                      onValueChange={(value) => setRole(value as UserRole)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="school" id="school" />
                        <Label htmlFor="school" className="font-normal">School Coordinator</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="supplier" id="supplier" />
                        <Label htmlFor="supplier" className="font-normal">Supplier</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" className="font-normal">Administrator</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal to-primary hover:from-teal-dark hover:to-primary-dark text-white btn-animated"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              )}
            </CardContent>
            
            {!registrationSuccess && (
              <CardFooter className="flex justify-center">
                <div className="text-sm text-center text-gray-500">
                  Already have an account?{' '}
                  <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto text-teal"
                    onClick={() => navigate('/login')}
                  >
                    Log in
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;