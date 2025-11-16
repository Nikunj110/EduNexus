// FIX 1: Changed 'complainCreate' to our generic 'addStuff' thunk.
// FIX 2: Updated dispatch call in 'handleSubmit' to pass a single object { fields, address }.
// FIX 3: Fixed 'school: currentUser.school' to be 'school: currentUser.school._id'.
// FIX 4: Added useEffect hook to show success/error toasts and clear the form.

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '@/redux/userRelated/userHandle'; // FIX 1
import { underControl } from '@/redux/userRelated/userSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquareWarning } from 'lucide-react';
import { RootState } from '@/redux/store';
import { toast as sonnerToast } from 'sonner';

const TeacherComplain = () => {
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { status, response, error, currentUser } = useSelector((state: RootState) => state.user);
  
  const [complaint, setComplaint] = useState('');
  const [loader, setLoader] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date();

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
      date,
      complaint,
      school: currentUser.school._id, // FIX 3
    };

    // FIX 2: Updated dispatch call
    dispatch(addStuff({ fields, address: 'Complain' }) as any);
  };

  // FIX 4: Added useEffect for feedback
  useEffect(() => {
    if (status === 'added') {
      sonnerToast.success(response || 'Complaint submitted successfully');
      setComplaint('');
      setLoader(false);
      dispatch(underControl());
    } else if (status === 'failed') {
      toast({
        title: "Failed",
        description: response || "Failed to submit complaint",
        variant: "destructive",
      });
      setLoader(false);
    } else if (status === 'error') {
      toast({
        title: "Error",
        description: error || "An error occurred",
        variant: "destructive",
      });
      setLoader(false);
    }
  }, [status, response, error, dispatch, toast]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquareWarning className="h-5 w-5 text-primary" />
            </div>
            <CardTitle>Submit Complaint</CardTitle>
          </div>
          <CardDescription>
            Share your concerns or suggestions. This will be sent directly to the admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="complaint">Your Complaint</Label>
              <Textarea
                id="complaint"
                placeholder="Describe your complaint or concern in detail..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                rows={8}
                className="resize-none"
                required
              />
            </div>
            <Button type="submit" disabled={loader} className="w-full bg-gradient-primary">
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherComplain;