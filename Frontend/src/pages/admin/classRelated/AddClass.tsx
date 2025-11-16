// FIX: The dispatch call for 'addStuff' in handleSubmit is now a single object, as required by our new 'userHandle.ts'.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '@/redux/userRelated/userHandle';
import { underControl } from '@/redux/userRelated/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RootState } from '@/redux/store';

const AddClass = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, response, error, currentUser } = useSelector((state: RootState) => state.user);
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(false);

  const adminID = currentUser._id;
  const address = 'Sclass';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!className.trim()) {
      toast.error('Please enter a class name');
      return;
    }

    setLoading(true);
    const fields = { sclassName: className, adminID };
    
    // FIX: Updated dispatch to pass a single object { fields, address }
    dispatch(addStuff({ fields, address }) as any);
  };

  useEffect(() => {
    if (status === 'added') {
      toast.success(response || 'Class added successfully');
      navigate('/Admin/classes');
      dispatch(underControl());
    } else if (status === 'failed') {
      toast.error(response || 'Failed to add class');
      setLoading(false);
    } else if (status === 'error') {
      toast.error(error || 'An error occurred');
      setLoading(false);
    }
  }, [status, response, error, navigate, dispatch]);

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
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Create New Class</CardTitle>
            <CardDescription className="text-center">
              Add a new class to your school system
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                placeholder="e.g., Class 10A, Grade 5B"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">
                Enter a unique name for the class
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/Admin/classes')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-primary"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  'Create Class'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClass;