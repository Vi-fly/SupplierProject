import LegalComplaintsList from '@/components/admin/LegalComplaintsList';
import { useAuth } from '@/components/auth/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LegalComplaints = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">You do not have permission to view this page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <LegalComplaintsList />
    </div>
  );
};

export default LegalComplaints; 