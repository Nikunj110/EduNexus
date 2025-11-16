import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllNotices } from '@/redux/noticeRelated/noticeHandle';
import { deleteUser } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShowNotices = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { noticesList, loading, error, response } = useSelector((state: any) => state.notice);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getAllNotices(currentUser._id, 'Notice') as any);
  }, [currentUser._id, dispatch]);

  const deleteHandler = (deleteID: string, address: string) => {
    (dispatch(deleteUser(deleteID, address) as any) as any).then(() => {
      dispatch(getAllNotices(currentUser._id, 'Notice') as any);
      toast({
        title: "Success",
        description: "Notice deleted successfully"
      });
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notices</h1>
          <p className="text-muted-foreground mt-1">Manage school announcements and notices</p>
        </div>
        <Button onClick={() => navigate('/Admin/addnotice')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Notice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {response || !noticesList || noticesList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No notices found</p>
              <Button onClick={() => navigate('/Admin/addnotice')} variant="outline">
                Add First Notice
              </Button>
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
