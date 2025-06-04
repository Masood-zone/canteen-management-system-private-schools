"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePrepayment } from "@/services/api/prepayments/prepayments.queries";

const formSchema = z.object({
  studentId: z.string().min(1, "Please select a student"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be a positive number",
    }),
  durationType: z.enum(["days", "weeks", "months"], {
    required_error: "Please select a duration type",
  }),
  durationValue: z
    .string()
    .min(1, "Duration value is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Duration value must be a positive number",
    }),
  startDate: z.date({
    required_error: "Start date is required",
  }),
});

interface CreatePrepaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: number;
  students: Array<{
    id: number;
    name: string;
  }>;
}

export function CreatePrepaymentModal({
  open,
  onOpenChange,
  classId,
  students,
}: CreatePrepaymentModalProps) {
  const { mutate: createPrepayment, isLoading } = useCreatePrepayment();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: "",
      amount: "",
      durationType: "days",
      durationValue: "",
      startDate: new Date(),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPrepayment(
      {
        studentId: Number(values.studentId),
        classId,
        amount: Number(values.amount),
        durationType: values.durationType,
        durationValue: Number(values.durationValue),
        startDate: values.startDate.toISOString(),
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      }
    );
  };

  const calculateEndDate = () => {
    const startDate = form.watch("startDate");
    const durationType = form.watch("durationType");
    const durationValue = Number(form.watch("durationValue"));

    if (!startDate || !durationType || !durationValue) return null;

    const endDate = new Date(startDate);
    switch (durationType) {
      case "days":
        endDate.setDate(startDate.getDate() + durationValue);
        break;
      case "weeks":
        endDate.setDate(startDate.getDate() + durationValue * 7);
        break;
      case "months":
        endDate.setMonth(startDate.getMonth() + durationValue);
        break;
    }

    return endDate;
  };

  const endDate = calculateEndDate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Prepayment</DialogTitle>
          <DialogDescription>
            Set up a prepayment for a student. This will automatically mark them
            as paid for the specified duration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem
                          key={student.id}
                          value={student.id.toString()}
                        >
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (GH₵)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter amount"
                      type="number"
                      min="1"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Value</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter value"
                        type="number"
                        min="1"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {endDate && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>End Date:</strong> {format(endDate, "PPP")}
                </p>
                <p className="text-sm text-muted-foreground">
                  This prepayment will be active from{" "}
                  {format(form.watch("startDate"), "PPP")} to{" "}
                  {format(endDate, "PPP")}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Prepayment"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
