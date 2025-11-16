import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotices } from "@/redux/noticeRelated/noticeHandle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell } from "lucide-react";
import { RootState } from "@/redux/store";

const SeeNotice = () => {
  const dispatch = useDispatch();
  const { noticesList, loading } = useSelector((state: RootState) => state.notice);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (currentUser?.school?._id) {
      dispatch(getAllNotices(currentUser.school._id, "Notice") as any);
    }
  }, [dispatch, currentUser]);

  if (loading) {
    return <div className="text-center py-4">Loading notices...</div>;
  }

  if (!noticesList || noticesList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No notices available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Notices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {noticesList.slice(0, 5).map((notice: any, index: number) => (
          <div key={notice._id || index}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{notice.title}</h4>
                <p className="text-sm text-muted-foreground">{notice.details}</p>
                {notice.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notice.date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            {index < noticesList.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SeeNotice;
