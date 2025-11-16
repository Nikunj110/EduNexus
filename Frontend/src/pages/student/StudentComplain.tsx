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

const StudentComplain = () => {
  const [complaint, setComplaint] = useState("");
  const [date, setDate] = useState("");
  const [loader, setLoader] = useState(false);

  const dispatch = useDispatch();
  const { toast } = useToast();
  const { status, currentUser, error } = useSelector((state: RootState) => state.user);

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);

    const fields = {
      user: currentUser._id,
      date,
      complaint,
      school: currentUser.school._id,
    };

    dispatch(addStuff(fields, "Complain") as any);
  };

  useEffect(() => {
    if (status === "added") {
      setLoader(false);
      toast({
        title: "Success",
        description: "Complaint submitted successfully",
      });
      setComplaint("");
      setDate("");
    } else if (error) {
      setLoader(false);
      toast({
        title: "Error",
        description: "Failed to submit complaint. Please try again.",
        variant: "destructive",
      });
    }
  }, [status, error, toast]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">Submit a Complaint</h2>
        <p className="text-muted-foreground">
          Let us know about any issues or concerns you have
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Complaint Form</CardTitle>
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

            <Button type="submit" disabled={loader} className="w-full">
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
