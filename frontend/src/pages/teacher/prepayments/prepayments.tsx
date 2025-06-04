"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Plus,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  useFetchActivePrepaymentsByClass,
  useFetchClassPrepaymentStatus,
} from "@/services/api/prepayments/prepayments.queries";
import { useFetchStudentsInClass } from "@/services/api/students/students.queries";
import { TableSkeleton } from "@/components/shared/page-loader/loaders";
import type { PrepaymentStatus } from "@/services/api/prepayments/prepayments.api";
import { CreatePrepaymentModal } from "@/components/actions/create-prepayment-modal";

interface StudentWithPrepayment {
  id: number;
  name: string;
  age: number;
  parentPhone?: string;
  gender?: string;
  prepaymentStatus?: PrepaymentStatus;
  hasActivePrepayment: boolean;
}

export default function TeacherPrepayments() {
  const { assigned_class } = useAuthStore();
  const classId = assigned_class?.id ?? 0;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [studentsWithPrepayments, setStudentsWithPrepayments] = useState<
    StudentWithPrepayment[]
  >([]);

  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Fetch data
  const { data: students, isLoading: studentsLoading } =
    useFetchStudentsInClass(classId);
  const { isLoading: prepaymentsLoading } =
    useFetchActivePrepaymentsByClass(classId);
  const { data: prepaymentStatus, isLoading: statusLoading } =
    useFetchClassPrepaymentStatus(classId, formattedDate);

  // Combine students with their prepayment status
  useEffect(() => {
    if (students && prepaymentStatus) {
      const combined = students.map((student: StudentWithPrepayment) => {
        const status = prepaymentStatus.find(
          (ps: PrepaymentStatus) => ps.studentId === student.id
        );
        return {
          ...student,
          prepaymentStatus: status,
          hasActivePrepayment: !!status,
        };
      });
      setStudentsWithPrepayments(combined);
    } else if (students) {
      const combined = students.map((student: StudentWithPrepayment) => ({
        ...student,
        prepaymentStatus: undefined,
        hasActivePrepayment: false,
      }));
      setStudentsWithPrepayments(combined);
    }
  }, [students, prepaymentStatus]);

  const handleCreatePrepayment = () => {
    setShowCreateModal(true);
  };
  const getStatusBadge = (student: StudentWithPrepayment) => {
    if (student.hasActivePrepayment) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Prepaid
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-gray-600">
        <XCircle className="w-3 h-3 mr-1" />
        No Prepayment
      </Badge>
    );
  };

  const getDurationText = (prepayment?: PrepaymentStatus) => {
    if (!prepayment) return "";

    const { durationType, durationValue } = prepayment;
    const unit = durationValue === 1 ? durationType.slice(0, -1) : durationType;
    return `${durationValue} ${unit}`;
  };

  const getRemainingDays = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isLoading = studentsLoading || prepaymentsLoading || statusLoading;

  if (!assigned_class) {
    return (
      <div className="container mx-auto">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No class assigned. Please contact the administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Prepayments Management</h1>
          <p className="text-muted-foreground">
            Manage prepayments for {assigned_class.name}
          </p>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <span className="text-sm font-medium">View prepayments for:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentsWithPrepayments.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Students with Prepayments
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {
                studentsWithPrepayments.filter((s) => s.hasActivePrepayment)
                  .length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Without Prepayments
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                studentsWithPrepayments.filter((s) => !s.hasActivePrepayment)
                  .length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students Prepayment Status</CardTitle>
          <CardDescription>
            View and manage prepayments for students in {assigned_class.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <div className="space-y-4">
              {studentsWithPrepayments.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {student.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Age: {student.age}{" "}
                        {student.gender && `• ${student.gender}`}
                      </p>
                      {student.parentPhone && (
                        <p className="text-sm text-muted-foreground">
                          Parent: {student.parentPhone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {getStatusBadge(student)}
                      {student.prepaymentStatus && (
                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Duration:{" "}
                            {getDurationText(student.prepaymentStatus)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Amount: ₵
                            {student.prepaymentStatus.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {getRemainingDays(
                              student.prepaymentStatus.endDate
                            )}{" "}
                            days left
                          </p>
                        </div>
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={handleCreatePrepayment}
                      disabled={student.hasActivePrepayment}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {student.hasActivePrepayment
                        ? "Active"
                        : "Add Prepayment"}
                    </Button>
                  </div>
                </div>
              ))}

              {studentsWithPrepayments.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No students found in this class.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Prepayment Modal */}
      <CreatePrepaymentModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        classId={classId}
        students={studentsWithPrepayments}
      />
    </div>
  );
}
