import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '@/redux/userRelated/userHandle';
import { underControl } from '@/redux/userRelated/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status, error } = useSelector((state: any) => state.user);
  const { currentUser } = useSelector((state: any) => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const [loader, setLoader] = useState(false);

  const adminID = currentUser._id;
  const address = 'Notice';

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const fields = { title, details, date, adminID };
    dispatch(addStuff(fields, address) as any);
  };

  useEffect(() => {
    if (status === 'added') {
      toast({
        title: "Success",
        description: "Notice added successfully"
      });
      navigate('/Admin/notices');
      dispatch(underControl());
    } else if (status === 'error') {
      toast({
        title: "Error",
        description: error || "Network Error",
        variant: "destructive"
      });
      setLoader(false);
    }
  }, [status, navigate, error, dispatch, toast]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Notice</h1>
        <p className="text-muted-foreground mt-1">Create a new announcement for the school</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notice title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                placeholder="Enter notice details..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loader} className="flex-1">
                {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Notice
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/Admin/notices')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNotice;
