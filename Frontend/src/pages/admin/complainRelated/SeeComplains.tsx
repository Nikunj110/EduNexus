// FIX: The dispatch call for 'getAllComplains' in useEffect now correctly passes only the 'adminID', as required by our new 'complainHandle.ts'.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains } from '@/redux/complainRelated/complainHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare } from 'lucide-react';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error } = useSelector((state: RootState) => state.complain);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    // FIX: Removed the second argument 'Complain'
    dispatch(getAllComplains(adminID) as any);
  }, [adminID, dispatch]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-9 w-48" />
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading complains: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Complaints</h2>
        <p className="text-muted-foreground">View and manage all user complaints</p>
      </div>
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Complaint Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          {!complainsList || complainsList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Complaints Yet</h3>
              <p>The complaint box is currently empty</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complainsList.map((complain: any) => {
                    const date = new Date(complain.date);
                    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                    return (
                      <TableRow key={complain._id}>
                        <TableCell className="font-medium">{complain.user?.name}</TableCell>
                        <TableCell>{complain.complaint}</TableCell>
                        <TableCell>{dateString}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeeComplains;