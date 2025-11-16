export const calculateOverallAttendancePercentage = (subjectAttendance: any[]) => {
  if (!subjectAttendance || subjectAttendance.length === 0) {
    return 0;
  }

  let totalSessionsSum = 0;
  let presentCountSum = 0;

  subjectAttendance.forEach((attendance) => {
    totalSessionsSum += attendance.sessions || 0;
    presentCountSum += attendance.present || 0;
  });

  const overallAttendancePercentage = totalSessionsSum > 0 
    ? (presentCountSum / totalSessionsSum) * 100 
    : 0;

  return parseFloat(overallAttendancePercentage.toFixed(2));
};

export const calculateSubjectAttendancePercentage = (present: number, sessions: number) => {
  if (sessions === 0) {
    return 0;
  }
  const subjectAttendancePercentage = (present / sessions) * 100;
  return parseFloat(subjectAttendancePercentage.toFixed(2));
};

export const groupAttendanceBySubject = (subjectAttendance: any[]) => {
  const attendanceBySubject: Record<string, any> = {};

  subjectAttendance.forEach((attendance) => {
    const subName = attendance.subName?.subName || 'Unknown';
    const subCode = attendance.subName?.subCode || 'N/A';
    const subId = attendance.subName?._id;
    const status = attendance.status;
    const date = attendance.date;

    if (!attendanceBySubject[subName]) {
      attendanceBySubject[subName] = {
        present: 0,
        absent: 0,
        sessions: 0,
        allData: [],
        subCode,
        subId,
      };
    }

    if (status === 'Present') {
      attendanceBySubject[subName].present++;
    } else if (status === 'Absent') {
      attendanceBySubject[subName].absent++;
    }

    attendanceBySubject[subName].sessions++;
    attendanceBySubject[subName].allData.push({ date, status });
  });

  return attendanceBySubject;
};
