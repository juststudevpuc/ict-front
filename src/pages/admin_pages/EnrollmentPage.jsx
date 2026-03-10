import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  Plus,
  Trash,
  Loader2,
  Search,
  SearchSlash,
  FilterX,
  User,
  BookOpen,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/helper/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Enrollment() {
  const [enrollment, setEnrollment] = useState([]);
  const [student, setStudent] = useState([]);
  const [course, setCourse] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // --- Filter & Sort State ---
  const [query, setQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "enrollment_date",
    direction: "desc",
  });
  const [stats, setStats] = useState({
    total_expected: 0,
    total_paid: 0,
    total_debt: 0,
  });
  const [form, setForm] = useState({
    id: "",
    student_id: "",
    course_id: "",
    schedule_id: "",
    enrollment_date: "",
    total_price: "",
    discount: "",
    paid_amount: "",
    balance: "0",
    payment_status: "",
    status: true,
  });

  const tbl_head = [
    { label: "No", key: null },
    { label: "Student", key: "student_id" },
    { label: "Course", key: "course_id" },
    { label: "Schedule", key: "schedule_id" },
    { label: "Date", key: "enrollment_date" },
    { label: "Full Price", key: "total_price" },
    { label: "Discount", key: "discount" },
    { label: "Paid", key: "paid_amount" },
    { label: "Payment", key: "payment_status" },
    { label: "Status", key: "status" },
    { label: "Created", key: "created_at" },
    { label: "Updated", key: "updated_at" },
    { label: "Action", key: null },
  ];

  // Unified Fetching Logic (UNCHANGED)
  const fetchingData = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      try {
        const params = {
          q: query,
          course_id: filterCourse,
          month: filterMonth, // ✅ Added month
          year: filterYear, // ✅ Added year
          sort_by: sortConfig.key,
          sort_order: sortConfig.direction,
          ...overrides,
        };

        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== "" && v !== null),
        );

        const queryString = new URLSearchParams(cleanParams).toString();

        const [enroll, courseRes, studentRes, scheduleRes] = await Promise.all([
          request(`enrollment?${queryString}`, "get"),
          request("course", "get"),
          request("student", "get"),
          request("schedule", "get"),
        ]);

        if (enroll) {
          setEnrollment(enroll?.data?.data || enroll?.data || []);
          setStats(
            enroll?.stats || {
              total_expected: 0,
              total_paid: 0,
              total_debt: 0,
            },
          ); // ✅ Store stats
        }
        if (courseRes) setCourse(courseRes?.data || []);
        if (studentRes) setStudent(studentRes?.data || []);
        if (scheduleRes) setSchedule(scheduleRes?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, filterCourse, filterMonth, filterYear, sortConfig],
  );

  useEffect(() => {
    fetchingData();
  }, []);

  const resetFilters = () => {
    setQuery("");
    setFilterCourse("");
    fetchingData({ q: "", course_id: "" });
  };
  const isInvalid =
    !form?.student_id ||
    !form?.course_id ||
    !form?.schedule_id ||
    !form?.total_price ||
    form?.total_price === "0" ||
    form?.total_price === 0;

  const onSubmit = async (e) => {
    e.preventDefault();

    // 1. Calculate using percentage logic
    const total = Number(form?.total_price) || 0;
    const discPercent = Number(form?.discount) || 0;
    const paid = Number(form?.paid_amount) || 0;

    // Actual dollar amount of the discount (e.g., 120 * 50 / 100 = 60)
    const discountCash = (total * discPercent) / 100;

    // Price after the percentage discount
    const netPrice = total - discountCash;

    // Final remaining balance
    const balance = netPrice - paid;

    // 2. Determine Payment Status
    let autoStatus = "unpaid";
    if (paid > 0) {
      autoStatus = balance <= 0 ? "completed" : "partial";
    }

    // 3. Prepare FormData
    const formData = new FormData();
    formData.append("student_id", form?.student_id || "");
    formData.append("course_id", form?.course_id || "");
    formData.append("schedule_id", form?.schedule_id || "");
    formData.append("enrollment_date", form?.enrollment_date || "");
    formData.append("total_price", total);
    formData.append("discount", discPercent); // Saves '50' as the percentage
    formData.append("paid_amount", paid);
    formData.append("payment_status", autoStatus);
    formData.append("status", form?.status ? 1 : 0);

    try {
      let res;
      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`enrollment/${form?.id}`, "post", formData);
      } else {
        res = await request("enrollment", "post", formData);
      }

      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        // Reset form
        setForm({
          id: "",
          student_id: "",
          course_id: "",
          schedule_id: "",
          enrollment_date: "",
          total_price: "",
          discount: "0",
          paid_amount: "0",
          payment_status: "",
          status: true,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const onEdit = (itemEdit) => {
    setIsOpen(true);
    setForm(itemEdit);
    setIsEdit(true);
  };

  const onDelete = (itemDelete) => {
    setIsDelete(true);
    setDeleteData(itemDelete);
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* 1. Header & Add Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Enrollment Student
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage student registration and payment statuses.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm w-full md:w-auto bg-blue-950">
              <Plus className="mr-2 w-4 h-4" /> Add Enrollment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] md:max-w-[800px] lg:max-w-[1000px] overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Update enrollment" : "Create enrollment"}
              </DialogTitle>
              <DialogDescription>
                Fill in the enrollment details below.
              </DialogDescription>
            </DialogHeader>

            {/* FORM REFACTORED FOR RESPONSIVE (Stacked on mobile, side-by-side on desktop) */}
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Student</Label>
                    <Select
                      value={String(form?.student_id)}
                      onValueChange={(v) => setForm({ ...form, student_id: v })}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pls select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {student?.map((item, index) => (
                          <SelectItem
                            key={item?._id || index}
                            value={String(item?._id || item?.id)}
                          >
                            {item?.full_name || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Course</Label>
                    <Select
                      value={String(form?.course_id)}
                      onValueChange={(v) => {
                        // Find price from the course list
                        const selectedCourse = course?.find(
                          (c) => String(c._id || c.id) === v,
                        );

                        setForm({
                          ...form,
                          course_id: v,
                          schedule_id: "", // Reset schedule because course changed
                          total_price: selectedCourse?.price
                            ? String(selectedCourse.price)
                            : "", // Update price
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pls select course" />
                      </SelectTrigger>
                      <SelectContent>
                        {course?.map((item, index) => (
                          <SelectItem
                            key={item?._id || index}
                            value={String(item?._id || item?.id)}
                          >
                            {item?.title || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* <div className="flex flex-col gap-2 w-full">
                    <Label>Schedule</Label>
                    <Select
                      value={String(form?.schedule_id)}
                      onValueChange={(v) =>
                        setForm({ ...form, schedule_id: v })
                      }
                      disabled={!form?.course_id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            form?.course_id
                              ? "Select a schedule"
                              : "Select a course first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {schedule
                          ?.filter(
                            (s) =>
                              String(s.course_id) === String(form?.course_id),
                          )
                          .map((item, index) => (
                            <SelectItem
                              key={item?._id || index}
                              value={String(item?._id || item?.id)}
                            >
                              {item?.days_of_week} | {item?.shift} ({item?.room}
                              )
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Schedule</Label>
                    <Select
                      value={String(form?.schedule_id)}
                      onValueChange={(v) => {
                        // ONLY update the schedule_id. Do not reset anything else here.
                        setForm({ ...form, schedule_id: v });
                      }}
                      disabled={!form?.course_id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            form?.course_id
                              ? "Select a schedule"
                              : "Select a course first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          const filteredSchedules = schedule?.filter(
                            (s) =>
                              String(s.course_id) === String(form?.course_id),
                          );

                          if (filteredSchedules?.length === 0) {
                            return (
                              <SelectItem value="none" disabled>
                                No schedule yet for this course
                              </SelectItem>
                            );
                          }

                          return filteredSchedules?.map((item, index) => (
                            <SelectItem
                              key={item?._id || index}
                              value={String(item?._id || item?.id)}
                            >
                              {item?.days_of_week} | {item?.shift} ({item?.room}
                              )
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Enrollment Date</Label>
                    <Input
                      type="date"
                      value={form?.enrollment_date || ""}
                      onChange={(e) =>
                        setForm({ ...form, enrollment_date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  {/* <div className="flex flex-col gap-2 w-full">
                    <Label>Total Price</Label>
                    <Input
                      type="text"
                      value={form?.total_price}
                      onChange={(e) =>
                        setForm({ ...form, total_price: e.target.value })
                      }
                      required
                    />
                  </div> */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Total Price</Label>
                    <Select
                      value={String(form?.total_price)}
                      onValueChange={(v) =>
                        setForm({ ...form, total_price: v })
                      }
                      disabled={!form?.course_id}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            form?.course_id
                              ? "Select Price"
                              : "Select course first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {course
                          ?.filter(
                            (c) =>
                              String(c._id || c.id) === String(form?.course_id),
                          )
                          .map((item, index) => {
                            // Check if price is missing, null, or 0
                            if (!item?.price || item?.price === 0) {
                              return (
                                <SelectItem key="no-price" value="0" disabled>
                                  No price set for this course
                                </SelectItem>
                              );
                            }
                            return (
                              <SelectItem
                                key={index}
                                value={String(item?.price)}
                              >
                                ${item?.price}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Discount (%)</Label>
                    <Input
                      type="number" // Changed to number for better mobile keyboard support
                      value={form?.discount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, discount: val });
                      }}
                      placeholder="0"
                    />
                  </div>

                  {/* Paid Amount Input */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Paid Amount ($)</Label>
                    <Input
                      type="number"
                      value={form?.paid_amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, paid_amount: val });
                      }}
                      placeholder="0"
                    />
                  </div>

                  {/* Remaining Balance Display (New Section) */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="text-blue-600 font-bold">
                      Remaining Balance
                    </Label>
                    <div className="p-2 border rounded-md bg-slate-50 font-bold text-lg">
                      $
                      {(() => {
                        const total = Number(form?.total_price) || 0;
                        const discPercent = Number(form?.discount) || 0;
                        const paid = Number(form?.paid_amount) || 0;

                        // Math: Total - (Total * (Percent / 100)) - Paid
                        const balance =
                          total - (total * discPercent) / 100 - paid;
                        return balance.toFixed(2);
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Payment Status</Label>
                    <Select
                      value={form?.payment_status}
                      onValueChange={(v) =>
                        setForm({ ...form, payment_status: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="e.g. Paid" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Partial">Partial</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Status</Label>
                    <Select
                      value={String(form?.status)}
                      onValueChange={(v) =>
                        setForm({ ...form, status: v === "true" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsEdit(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-8 bg-green-400"
                  disabled={!!isInvalid} // The !! ensures it's a strict boolean
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* --- FINANCIAL SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 font-khmer md:grid-cols-3 gap-4 mb-6">
        {/* Card 1: Total Expected */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center">
            <DollarSign className="text-violet-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold  uppercase tracking-widest">
              ចំណូលរំពឹងទុក
            </p>
            <h3 className="text-2xl font-black text-slate-900">
              ${stats.total_expected.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Card 2: Total Collected */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <TrendingUp className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold uppercase tracking-widest">
              ទឹកប្រាក់ទទួលបាន
            </p>
            <h3 className="text-2xl font-black text-emerald-600">
              ${stats.total_paid.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Card 3: Remaining Debt */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
            <AlertCircle className="text-rose-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-xl font-bold  uppercase tracking-widest">
              ប្រាក់ជំពាក់របស់សិស្ស (Debt)
            </p>
            <h3 className="text-2xl font-black text-rose-600">
              ${stats.total_debt.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>
      {/* 2. Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-slate-50 p-4 rounded-lg border shadow-sm">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student..."
            className="pl-9 bg-white"
            onKeyDown={(e) => e.key === "Enter" && fetchingData()}
          />
        </div>
        <Select
          value={filterCourse || "all"}
          onValueChange={(val) => {
            const v = val === "all" ? "" : val;
            setFilterCourse(v);
            fetchingData({ course_id: v });
          }}
        >
          <SelectTrigger className="w-full md:w-[220px] bg-white">
            <SelectValue placeholder="Filter by Course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {course?.map((item) => (
              <SelectItem
                key={item?._id || item?.id}
                value={String(item?._id || item?.id)}
              >
                {item?.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Year Filter */}
        <Select
          value={filterYear || "all"}
          onValueChange={(val) => {
            const v = val === "all" ? "" : val;
            setFilterYear(v);
            fetchingData({ year: v });
          }}
        >
          <SelectTrigger className="w-full md:w-[120px] bg-white">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
          </SelectContent>
        </Select>

        {/* Month Filter */}
        <Select
          value={filterMonth || "all"}
          onValueChange={(val) => {
            const v = val === "all" ? "" : val;
            setFilterMonth(v);
            fetchingData({ month: v });
          }}
        >
          <SelectTrigger className="w-full md:w-[140px] bg-white">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {[
              { v: "01", n: "January" },
              { v: "02", n: "February" },
              { v: "03", n: "March" },
              { v: "04", n: "April" },
              { v: "05", n: "May" },
              { v: "06", n: "June" },
              { v: "07", n: "July" },
              { v: "08", n: "August" },
              { v: "09", n: "September" },
              { v: "10", n: "October" },
              { v: "11", n: "November" },
              { v: "12", n: "December" },
            ].map((m) => (
              <SelectItem key={m.v} value={m.v}>
                {m.n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            disabled={loading}
            className="flex-1 md:flex-none bg-blue-950"
            onClick={() => fetchingData()}
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <Search className="w-4 h-4 mr-2" />
            )}{" "}
            Search
          </Button>
          <Button variant="outline" onClick={resetFilters} title="Reset">
            <FilterX className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3. RESPONSIVE SWITCHER (Mobile Cards vs Desktop Table) */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-20 gap-3 text-[#003868]">
          <Loader2 className="w-10 h-10 animate-spin opacity-80" />
          <p className="font-medium animate-pulse">
            Syncing Enrollment Data...
          </p>
        </div>
      ) : (
        <>
          {/* --- MOBILE & TABLET VIEW (Visible only on small screens) --- */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:hidden gap-4">
            {enrollment.length > 0 ? (
              enrollment.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl p-5 shadow-sm space-y-4 border-slate-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-none">
                          {item?.student?.full_name}
                        </h3>
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          {item?.course?.title}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`shadow-none border-none capitalize ${
                        // Use .trim() to remove spaces and .toLowerCase() to match perfectly
                        item?.payment_status?.trim().toLowerCase() ===
                          "completed" || item?.payment_status === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : item?.payment_status?.trim().toLowerCase() ===
                              "partial"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item?.payment_status || "Unknown"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 text-sm border-t pt-4">
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">
                        Schedule
                      </span>
                      <span className="text-slate-700 text-xs">
                        {item?.schedule?.shift}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">
                        Date
                      </span>
                      <span className="text-slate-700 text-xs">
                        {item?.enrollment_date}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">
                        Total Price
                      </span>
                      <span className="text-slate-900 font-bold">
                        ${item?.total_price}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-slate-400 text-[10px] uppercase font-bold">
                        Paid
                      </span>
                      <span className="text-emerald-600 font-bold">
                        ${item?.paid_amount}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      className="flex-1 h-9 gap-2"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-9 gap-2 text-rose-600 hover:text-rose-700"
                      onClick={() => onDelete(item)}
                    >
                      <Trash className="w-3.5 h-3.5" /> Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-slate-400 italic">
                No records found.
              </div>
            )}
          </div>

          {/* --- DESKTOP TABLE VIEW (Hidden on mobile) --- */}
          <div className="hidden lg:block border rounded-xl bg-white shadow-md overflow-hidden border-slate-200">
            <Table>
              <TableHeader className="bg-[#003868]">
                <TableRow className="hover:bg-[#003868]">
                  {tbl_head.map((item, index) => (
                    <TableHead
                      key={index}
                      className={`py-4 text-white font-bold tracking-wide ${item.key ? "cursor-pointer select-none hover:bg-white/10" : ""}`}
                      onClick={() => {
                        if (item.key) {
                          const newDir =
                            sortConfig.key === item.key &&
                            sortConfig.direction === "asc"
                              ? "desc"
                              : "asc";
                          setSortConfig({ key: item.key, direction: newDir });
                          fetchingData({
                            sort_by: item.key,
                            sort_order: newDir,
                          });
                        }
                      }}
                    >
                      <div className="flex items-center gap-1">
                        {item.label}
                        {item.key && sortConfig.key === item.key && (
                          <span className="text-yellow-400">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollment.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/80"} hover:bg-blue-50/50 group`}
                  >
                    <TableCell className="font-medium text-slate-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      {item?.student?.full_name}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                        {item?.course?.title}
                      </span>
                    </TableCell>
                    <TableCell className="text-[11px] text-slate-500 leading-tight">
                      <div className="font-bold text-slate-700">
                        {item?.schedule?.shift}
                      </div>
                      <div>{item?.schedule?.days_of_week}</div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {item?.enrollment_date}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800 text-center">
                      ${item?.total_price}
                    </TableCell>
                    <TableCell className="text-orange-600 font-bold text-center">
                      {item?.discount}%
                    </TableCell>
                    <TableCell className="text-emerald-600 font-extrabold text-center">
                      ${item?.paid_amount}
                    </TableCell>
                    <TableCell>
                      {/* <Badge
                        className={`w-20 justify-center shadow-none border-none ${
                          item?.payment_status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item?.payment_status}
                      </Badge> */}
                      <Badge
                        className={`shadow-none border-none capitalize ${
                          // Use .trim() to remove spaces and .toLowerCase() to match perfectly
                          item?.payment_status?.trim().toLowerCase() ===
                            "completed" || item?.payment_status === "Paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : item?.payment_status?.trim().toLowerCase() ===
                                "partial"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {item?.payment_status || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${item?.status ? "bg-green-500" : "bg-slate-300"}`}
                        />
                        <span
                          className={`text-xs font-medium ${item?.status ? "text-green-700" : "text-slate-400"}`}
                        >
                          {item?.status ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[10px] text-slate-400 italic">
                      {formatDate(item?.created_at)}
                    </TableCell>
                    <TableCell className="text-[10px] text-slate-400 italic">
                      {formatDate(item?.updated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2  group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-100"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-rose-600 hover:bg-rose-100"
                          onClick={() => onDelete(item)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      {/* Delete Modal (UNCHANGED) */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent className="max-w-[90vw] md:max-w-md">
          <DialogHeader>
            <DialogTitle>Are you sure to delete?</DialogTitle>
          </DialogHeader>
          <div className="mt-3 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                const res = await request(
                  `enrollment/${deleteData?.id}`,
                  "delete",
                );
                if (res) {
                  fetchingData();
                  setIsDelete(false);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
