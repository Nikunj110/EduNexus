import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '@/redux/userRelated/userHandle';
import { underControl } from '@/redux/userRelated/userSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, BellPlus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';
import { toast as sonnerToast } from 'sonner';

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status, response, error, currentUser } = useSelector((state: RootState) => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const [loader, setLoader] = useState(false);

  const adminID = currentUser._id;
  const address = 'Notice';

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!title.trim() || !details.trim() || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setLoader(true);
    const fields = { title, details, date, adminID };
    
    // FIX: Updated dispatch to pass a single object { fields, address }
    dispatch(addStuff({ fields, address }) as any);
  };

  useEffect(() => {
    if (status === 'added') {
      sonnerToast.success(response || 'Notice added successfully');
      navigate('/Admin/notices');
      dispatch(underControl());
    } else if (status === 'failed') {
      toast({
        title: "Failed",
        description: response || "Failed to add notice",
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
  }, [status, response, error, navigate, dispatch, toast]);

  return (
    <div className="flex justify-center items-center min-h-full p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-lg shadow-lg border-border/50">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <BellPlus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Create New Notice</CardTitle>
            <CardDescription className="text-center">
              Post a new notice for all users
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
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
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/Admin/notices')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loader} className="flex-1 bg-gradient-primary">
                {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Notice
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNotice;