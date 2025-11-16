import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllNotices } from '@/redux/noticeRelated/noticeHandle';
import { deleteUser } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { noticesList, loading, error, response } = useSelector((state: RootState) => state.notice);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    // FIX 1: Removed the second argument 'Notice'
    dispatch(getAllNotices(adminID) as any);
  }, [adminID, dispatch]);

  const deleteHandler = (deleteID: string, address: string) => {
    // FIX 2: Updated dispatch to pass a single object { id, address }
    (dispatch(deleteUser({ id: deleteID, address }) as any) as any).then(() => {
      // FIX 3: Removed the second argument 'Notice'
      dispatch(getAllNotices(adminID) as any);
      toast({
        title: "Success",
        description: "Notice deleted successfully"
      });
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Notices</h2>
          <p className="text-muted-foreground">Manage school-wide announcements</p>
        </div>
        <Button onClick={() => navigate('/Admin/addnotice')} className="gap-2 bg-gradient-primary">
          <Plus className="w-4 h-4" />
          Add Notice
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Published Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {noticesList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Notices Yet</h3>
              <p className="mb-6">Click "Add Notice" to post your first announcement</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noticesList.map((notice: any) => {
                    const date = new Date(notice.date);
                    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
                    return (
                      <TableRow key={notice._id}>
                        <TableCell className="font-medium">{notice.title}</TableCell>
                        <TableCell>{notice.details}</TableCell>
                        <TableCell>{dateString}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteHandler(notice._id, 'Notice')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default ShowNotices;