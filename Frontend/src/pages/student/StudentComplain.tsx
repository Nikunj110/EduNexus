// FIX: The dispatch call for 'addStuff' in submitHandler is now a single object, as required by our new 'userHandle.ts'.
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStuff } from "@/redux/userRelated/userHandle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { RootState } from "@/redux/store";
import { underControl } from "@/redux/userRelated/userSlice";
import { toast as sonnerToast } from "sonner";

const StudentComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { status, response, currentUser, error } = useSelector((state: RootState) => state.user);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);

    if (!complaint.trim() || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setLoader(false);
      return;
    }

    const fields = {
      user: currentUser._id,
      date,
      complaint,
      school: currentUser.school._id,
    };

    // FIX: Updated dispatch to pass a single object { fields, address }
    dispatch(addStuff({ fields, address: "Complain" }) as any);
  };

  useEffect(() => {
    if (status === 'added') {
      sonnerToast.success(response || 'Complaint submitted successfully');
      setComplaint("");
      setDate("");
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
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Complaint</CardTitle>
          <CardDescription>
            Please provide details about your complaint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="complaint">Your Complaint</Label>
              <Textarea
                id="complaint"
                placeholder="Describe your issue or concern in detail..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
                rows={6}
                className="resize-none"
              />
            </div>

            <Button type="submit" disabled={loader} className="w-full bg-gradient-primary">
              {loader ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentComplain;