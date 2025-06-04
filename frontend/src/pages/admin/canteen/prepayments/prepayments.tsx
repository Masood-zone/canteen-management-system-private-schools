"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, BadgeCent, Users, Clock } from "lucide-react";
import { format } from "date-fns";
import { useFetchClasses } from "@/services/api/classes/classes.queries";
import { useFetchStudentsInClass } from "@/services/api/students/students.queries";
import { useFetchPrepaymentsByClass } from "@/services/api/prepayments/prepayments.queries";
import { TableSkeleton } from "@/components/shared/page-loader/loaders";
import type { Prepayment } from "@/services/api/prepayments/prepayments.api";
import { CreatePrepaymentModal } from "@/components/actions/create-prepayment-modal";

interface Class {
  id: number;
  name: string;
  description?: string;
}

export default function Prepayments() {
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data: classes } = useFetchClasses();
  const { data: students } = useFetchStudentsInClass(
    Number.parseInt(selectedClassId)
  );
  const { data: prepayments, isLoading: prepaymentsLoading } =
    useFetchPrepaymentsByClass(Number.parseInt(selectedClassId));

  const getStatusBadge = (prepayment: Prepayment) => {
    const now = new Date();
    const startDate = new Date(prepayment.startDate);
    const endDate = new Date(prepayment.endDate);

    if (!prepayment.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }

    if (now < startDate) {
      return <Badge variant="outline">Scheduled</Badge>;
    }

    if (now > endDate) {
      return <Badge variant="destructive">Expired</Badge>;
    }

    return <Badge variant="default">Active</Badge>;
  };

  const getDurationText = (prepayment: Prepayment) => {
    return `${prepayment.durationValue} ${prepayment.durationType}`;
  };

  const activePrepayments = prepayments?.filter((p) => p.isActive) || [];
  const totalAmount = activePrepayments.reduce((sum, p) => sum + p.amount, 0);
  const activeCount = activePrepayments.filter((p) => {
    const now = new Date();
    const startDate = new Date(p.startDate);
    const endDate = new Date(p.endDate);
    return now >= startDate && now <= endDate;
  }).length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Prepayments</h1>
          <p className="text-muted-foreground">
            Manage student prepayments for canteen services
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          disabled={!selectedClassId}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Prepayment
        </Button>
      </div>

      <div className="mb-6">
        <Select onValueChange={setSelectedClassId} value={selectedClassId}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes?.map((classItem: Class) => (
              <SelectItem key={classItem.id} value={classItem.id.toString()}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedClassId && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Prepayments
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {prepayments?.length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Now
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Amount
                </CardTitle>
                <BadgeCent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GH₵ {totalAmount}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {students?.length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prepayments List */}
          {prepaymentsLoading ? (
            <TableSkeleton />
          ) : (
            <div className="space-y-4">
              {prepayments && prepayments.length > 0 ? (
                prepayments.map((prepayment) => (
                  <Card key={prepayment.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {prepayment.student.name}
                          </CardTitle>
                          <CardDescription>
                            {getDurationText(prepayment)} • GH₵{" "}
                            {prepayment.amount}
                          </CardDescription>
                        </div>
                        {getStatusBadge(prepayment)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Start Date</p>
                          <p className="font-medium">
                            {format(new Date(prepayment.startDate), "PPP")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">End Date</p>
                          <p className="font-medium">
                            {format(new Date(prepayment.endDate), "PPP")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created By</p>
                          <p className="font-medium">
                            {prepayment.creator.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No prepayments found
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      No prepayments have been created for this class yet.
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Prepayment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Prepayment Modal */}
      <CreatePrepaymentModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        classId={Number.parseInt(selectedClassId)}
        students={students || []}
      />
    </div>
  );
}
