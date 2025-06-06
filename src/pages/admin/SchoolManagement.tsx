import { useAuth } from '@/components/auth/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Loader2, Search } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface School {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_sign_in: string | null;
  resetPassword?: string;
}

const SchoolManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchSchools = async () => {
    try {
      setIsLoading(true);
      // Fetch schools from profiles table where role is 'school'
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .eq('role', 'school')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Set schools data without last sign in (we'll handle this differently)
      setSchools(data.map(school => ({
        ...school,
        last_sign_in: null // We'll update this if needed
      })));
    } catch (error: any) {
      console.error('Error fetching schools:', error);
      toast({
        title: "Error",
        description: "Failed to load schools. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSchools();
    }
  }, [user]);

  const handleResetPassword = async (schoolId: string) => {
    try {
      setIsResettingPassword(schoolId);
      
      // Generate a random password
      const newPassword = Math.random().toString(36).slice(-8);
      
      // Use the regular auth API to reset password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      // Update the schools state to include the reset password
      setSchools(prevSchools => 
        prevSchools.map(school => 
          school.id === schoolId 
            ? { ...school, resetPassword: newPassword }
            : school
        )
      );

      toast({
        title: "Password Reset Successful",
        description: "New password has been generated. Use the copy button to copy it.",
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResettingPassword(null);
    }
  };

  const handleCopyPassword = async (password: string) => {
    try {
      await navigator.clipboard.writeText(password);
      toast({
        title: "Copied!",
        description: "Password has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredSchools = schools.filter(school => 
    school.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy">School Management</h1>
          <p className="text-gray-600 mt-2">
            Manage registered schools and reset their passwords
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Registered Schools ({filteredSchools.length})</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search schools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name || 'Unnamed School'}</TableCell>
                      <TableCell>{school.email}</TableCell>
                      <TableCell>{new Date(school.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(school.id)}
                            disabled={isResettingPassword === school.id}
                          >
                            {isResettingPassword === school.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                              </>
                            ) : (
                              'Reset Password'
                            )}
                          </Button>
                          {school.resetPassword && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyPassword(school.resetPassword!)}
                              className="text-teal hover:text-teal/80"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Password
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSchools.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No schools found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SchoolManagement; 