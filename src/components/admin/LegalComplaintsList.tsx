import { useAuth } from '@/components/auth/AuthContext';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, ArrowDown, ArrowUp, Calendar, Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LegalComplaint {
  id: string;
  supplier_id: string;
  complaint_title: string;
  complaint_details: string;
  resolution_status: string;
  submitted_by: string;
  created_at: string;
  updated_at: string;
  supplier_name?: string;
  submitter_name?: string;
}

const LegalComplaintsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<LegalComplaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({ key: 'created_at', direction: 'desc' });

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching legal complaints...');

      // First get the complaints with supplier info
      const { data: complaintsData, error: complaintsError } = await supabase
        .from('legal_complaints')
        .select(`
          *,
          supplier_applications!legal_complaints_supplier_id_fkey (
            org_name
          )
        `)
        .order('created_at', { ascending: false });

      if (complaintsError) {
        console.error('Error in complaints query:', complaintsError);
        throw complaintsError;
      }

      if (!complaintsData) {
        console.log('No complaints data received');
        setComplaints([]);
        return;
      }

      // Get submitter info for each complaint
      const submitterIds = [...new Set(complaintsData.map(c => c.submitted_by))];
      const { data: submitters, error: submittersError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', submitterIds);

      if (submittersError) {
        console.error('Error fetching submitters:', submittersError);
        throw submittersError;
      }

      // Create a map of submitter info
      const submitterMap = (submitters || []).reduce((acc, submitter) => {
        acc[submitter.id] = submitter;
        return acc;
      }, {} as Record<string, any>);

      const formattedComplaints = complaintsData.map(complaint => {
        const submitter = submitterMap[complaint.submitted_by];
        return {
          ...complaint,
          resolution_status: complaint.resolution_status || 'pending',
          supplier_name: complaint.supplier_applications?.org_name || 'Unknown Supplier',
          submitter_name: submitter ? (submitter.name || submitter.email) : 'Unknown User'
        };
      });

      console.log('Formatted complaints:', formattedComplaints);
      setComplaints(formattedComplaints);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load complaints. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchComplaints();
    }
  }, [user]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      console.log('Updating complaint status:', { id, newStatus });
      
      const { error } = await supabase
        .from('legal_complaints')
        .update({ 
          resolution_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setComplaints(complaints.map(complaint => 
        complaint.id === id 
          ? { ...complaint, resolution_status: newStatus }
          : complaint
      ));

      toast({
        title: 'Success',
        description: 'Complaint status updated successfully',
      });
    } catch (err) {
      console.error('Error updating complaint status:', err);
      toast({
        title: 'Error',
        description: 'Failed to update complaint status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedComplaints = () => {
    const sortableComplaints = [...complaints];
    if (sortConfig.key) {
      sortableComplaints.sort((a, b) => {
        if (a[sortConfig.key as keyof LegalComplaint] < b[sortConfig.key as keyof LegalComplaint]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof LegalComplaint] > b[sortConfig.key as keyof LegalComplaint]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableComplaints;
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3 inline" /> : <ArrowDown className="h-3 w-3 inline" />;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'resolved': { color: 'bg-green-100 text-green-800', label: 'Resolved' },
      'rejected': { color: 'bg-red-100 text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', label: status };

    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Please log in to view legal complaints.</p>
        </CardContent>
      </Card>
    );
  }

  const filteredComplaints = statusFilter === 'all' 
    ? getSortedComplaints()
    : getSortedComplaints().filter(complaint => complaint.resolution_status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-navy">Legal Complaints</h2>
          <p className="text-sm text-gray-500">Manage and track legal complaints from suppliers</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
          <p>Loading complaints...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8 text-red-500">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      ) : filteredComplaints.length === 0 ? (
        <Card className="border border-dashed">
          <CardContent className="p-8 text-center text-gray-500">
            <p>No legal complaints found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead 
                    className="font-semibold cursor-pointer"
                    onClick={() => requestSort('created_at')}
                  >
                    Date {getSortIcon('created_at')}
                  </TableHead>
                  <TableHead 
                    className="font-semibold cursor-pointer"
                    onClick={() => requestSort('supplier_name')}
                  >
                    Supplier {getSortIcon('supplier_name')}
                  </TableHead>
                  <TableHead className="font-semibold">Complaint</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(complaint.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{complaint.supplier_name}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{complaint.complaint_title}</div>
                        <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {complaint.complaint_details}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={complaint.resolution_status}
                        onValueChange={(value) => handleStatusUpdate(complaint.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue>
                            {getStatusBadge(complaint.resolution_status)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Search className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Complaint Details</AlertDialogTitle>
                              <AlertDialogDescription className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-1">Title</h4>
                                  <p className="text-gray-600">{complaint.complaint_title}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Details</h4>
                                  <p className="text-gray-600 whitespace-pre-wrap">{complaint.complaint_details}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Submitted By</h4>
                                  <p className="text-gray-600">{complaint.submitter_name}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Submitted On</h4>
                                  <p className="text-gray-600">{formatDate(complaint.created_at)}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-1">Last Updated</h4>
                                  <p className="text-gray-600">{formatDate(complaint.updated_at)}</p>
                                </div>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Close</AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LegalComplaintsList; 