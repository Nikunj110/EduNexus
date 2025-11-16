import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { complainCreate } from '@/redux/complainRelated/complainHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const TeacherComplain = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const [complaint, setComplaint] = useState('');
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a complaint',
        variant: 'destructive',
      });
      return;
    }

    setLoader(true);
    const fields = {
      user: currentUser._id,
      complaint,
    };

    const date = new Date().toISOString();
    const complaintFields = {
      user: currentUser._id,
      date,
      complaint,
      school: currentUser.school,
    };

    dispatch(complainCreate(complaintFields, 'Complain') as any);

    toast({
      title: 'Success',
      description: 'Complaint submitted successfully',
    });

    setComplaint('');
    setLoader(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Submit Complaint</h1>
        <p className="text-muted-foreground mt-1">Share your concerns or suggestions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="complaint" className="text-sm font-medium mb-2 block">
                Your Complaint
              </label>
              <Textarea
                id="complaint"
                placeholder="Describe your complaint or concern..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            <Button type="submit" disabled={loader}>
              {loader ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherComplain;
