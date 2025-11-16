import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllComplains } from '@/redux/complainRelated/complainHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

const SeeComplains = () => {
  const dispatch = useDispatch();
  const { complainsList, loading, error, response } = useSelector((state: any) => state.complain);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getAllComplains(currentUser._id, 'Complain') as any);
  }, [currentUser._id, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Complaints</h1>
          <p className="text-muted-foreground mt-1">View and manage student complaints</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {response || !complainsList || complainsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No complaints right now</p>
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
