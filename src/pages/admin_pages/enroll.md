import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash, Loader2, Search, SearchSlash } from "lucide-react"; // ✅ Added Loader2
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/helper/format";
// import { configs } from "@/utils/config/configs"; // Optional if you rely fully on getImageUrl
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
  const [query, setQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "enrollment_date",
    direction: "desc",
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
    payment_status: "",
    status: true,
  });

  const tbl_head = [
    { label: "No", key: null },
    { label: "Student", key: "student_id" },
    { label: "Course", key: "course_id" },
    { label: "Schedule", key: "schedule_id" },
    { label: "Date", key: "enrollment_date" },
    { label: "Price", key: "total_price" },
    { label: "Discount", key: "discount" },
    { label: "Paid", key: "paid_amount" },
    { label: "Payment", key: "payment_status" },
    { label: "Status", key: "status" },
    { label: "Created", key: "created_at" },
    { label: "Updated", key: "updated_at" },
    { label: "Action", key: null },
  ];

  // ✅ Fixed Loading Logic
  // 1. Add 'params = {}' here so the function can receive new sort/filter data
  const fetchingData = async (params = {}) => {
    setLoading(true);
    try {
      // 2. Define the params object FIRST
      const allParams = {
        sort_by: sortConfig.key,
        sort_order: sortConfig.direction,
        q: query, // current search term
        ...params, // override with new sort/filter data
      };

      // 3. Create the query string
      const queryString = new URLSearchParams(allParams).toString();

      // 4. Make the requests
      // We only need ONE enrollment request (the one with the query string)
      const enroll = await request(`enrollment?${queryString}`, "get");
      const courseRes = await request("course", "get");
      const studentRes = await request("student", "get");
      const scheduleRes = await request("schedule", "get");

      // 5. Update states
      if (enroll) {
        // Use the nested path if your Laravel backend returns a wrapped object
        setEnrollment(enroll?.data?.data || enroll?.data || []);
      }
      if (courseRes) {
        setCourse(courseRes?.data);
      }
      if (studentRes) {
        setStudent(studentRes?.data);
      }
      if (scheduleRes) {
        setSchedule(scheduleRes?.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  // ✅ Fixed Form Submission Logic
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("student_id", form?.student_id || "");
    formData.append("course_id", form?.course_id || "");
    formData.append("schedule_id", form?.schedule_id || "");

    // 🛠️ FIXED: Changed form?.phone to form?.enrollment_date!
    formData.append("enrollment_date", form?.enrollment_date || "");

    formData.append("total_price", form?.total_price || "");
    formData.append("discount", form?.discount || "");
    formData.append("paid_amount", form?.paid_amount || "");
    formData.append("payment_status", form?.payment_status || "");
    formData.append("status", form?.status ? 1 : 0);

    try {
      let res;

      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`enrollment/${form?.id}`, "post", formData);
        if (res) console.log("Updated enrollment : ", res);
      } else {
        res = await request("enrollment", "post", formData);
        if (res) console.log("Created enrollment : ", res);
      }

      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        setForm({
          id: "",
          student_id: "",
          course_id: "",
          schedule_id: "",
          enrollment_date: "",
          total_price: "",
          discount: "",
          paid_amount: "",
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

  // 2. Create the sorting function
  const sortedEnrollments = [...enrollment].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Handle nested data (like course title) or flat data (like total_price)
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Create a function to toggle sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="">
      <div className="">
        <div className="flex items-center gap-3">
          <h1>Enrollment student</h1>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student name..."
          />
          {/* <Button
            disabled={loading}
            onClick={async () => {
              if (!query) return; // Don't search for nothing
              setLoading(true);

              // FIXED: Changed 'student/search' to 'enrollment/search'
              // added leading slash check depending on your request helper
              const res = await request(`enrollment/search?q=${query}`, "get");

              if (res) {
                console.log("Response Enrollment: ", res);

                // FIXED: Ensure you are setting the state that controls your TABLE/LIST
                // If your main list uses 'setEnrollments', use that here.
                setEnrollment(res?.data);
              }
              setLoading(false);
            }}
          >
            {loading ? "..." : <Search />}
          </Button> */}
          <Button
            disabled={loading}
            onClick={() => fetchingData()} // This now handles name search AND filters
          >
            {loading ? "..." : <Search />}
          </Button>
          <Button
            onClick={() => {
              setQuery("");
              fetchingData(); // This should reset the list to show all enrollments
            }}
          >
            <SearchSlash />
          </Button>
        </div>
        <div className="flex justify-end px-5">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 w-4 h-4" />
                Add enrollment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>
                  {isEdit ? "Update enrollment" : "Create enrollment"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the enrollment details below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-3 w-full">
                      <Label>Student</Label>
                      <Select
                        value={form?.student_id}
                        onValueChange={(value) =>
                          setForm({ ...form, student_id: value })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pls select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {student?.map((item, index) => (
                            <SelectItem
                              key={item?._id || index}
                              // 🛠️ FIXED: Check for _id first, then id, and force it to be a string
                              // value={item?.id || item?.id}
                              value={String(item?._id || item?.id)}
                            >
                              {item?.full_name ? item.full_name : "N/A"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <Label>Course</Label>
                      <Select
                        value={form?.course_id}
                        onValueChange={(value) =>
                          // Reset schedule_id when course changes to avoid old data staying selected
                          setForm({
                            ...form,
                            course_id: value,
                            schedule_id: "",
                          })
                        }
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

                  <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-3 w-full">
                      <Label>Schedule</Label>
                      <Select
                        value={form?.schedule_id}
                        onValueChange={(value) =>
                          setForm({ ...form, schedule_id: value })
                        }
                        disabled={!form?.course_id} // Disable if no course is selected yet
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
                            ) // 👈 THE MAGIC FILTER
                            .map((item, index) => (
                              <SelectItem
                                key={item?._id || index}
                                value={String(item?._id || item?.id)}
                              >
                                {item?.days_of_week} | {item?.shift} (
                                {item?.room})
                              </SelectItem>
                            ))}

                          {/* Show message if no schedule exists for the selected course */}
                          {form?.course_id &&
                            schedule?.filter(
                              (s) =>
                                String(s.course_id) === String(form?.course_id),
                            ).length === 0 && (
                              <div className="p-2 text-xs text-red-500 text-center">
                                No schedules available for this course
                              </div>
                            )}
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

                  <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-3 w-full">
                      <Label>Total Price</Label>
                      <Input
                        type="data"
                        value={form?.total_price}
                        onChange={(e) =>
                          setForm({ ...form, total_price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <Label>Discount</Label>
                      <Input
                        type="data"
                        value={form?.discount}
                        onChange={(e) =>
                          setForm({ ...form, discount: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-3 w-full">
                      <Label>Paid Amount</Label>
                      <Input
                        type="data"
                        value={form?.paid_amount}
                        onChange={(e) =>
                          setForm({ ...form, paid_amount: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <div className="flex flex-col gap-3">
                      <Label>Payment Status</Label>
                      <Select
                        value={form?.payment_status}
                        onValueChange={(value) =>
                          setForm({ ...form, payment_status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="e.g. Paid" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Partial">
                            Partial (Pay half)
                          </SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Status</Label>
                      <Select
                        value={String(form?.status)}
                        onValueChange={(value) =>
                          setForm({ ...form, status: value === "true" })
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

                <div className="flex justify-end mt-6">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setIsEdit(false);
                        setForm({
                          id: "",
                          student_id: "",
                          course_id: "",
                          schedule_id: "",
                          enrollment_date: "",
                          total_price: "",
                          discount: "",
                          paid_amount: "",
                          payment_status: "",
                          status: true,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Delete Modal */}
        <Dialog open={isDelete} onOpenChange={setIsDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure to delete "{deleteData?.enrollment_id}"?
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 flex justify-end ">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteData(null);
                    setIsDelete(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      // ✅ Fixed endpoint URL
                      const res = await request(
                        `enrollment/${deleteData?.id}`,
                        "delete",
                      );
                      if (res) {
                        fetchingData();
                        setDeleteData(null);
                        setIsDelete(false);
                      }
                    } catch (error) {
                      console.error("Delete error:", error);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex gap-4 mb-4">
          <Select
            onValueChange={(val) => fetchingData({ payment_status: val })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
            </SelectContent>
          </Select>

          {/* Add a button to reset all filters */}
          <Button variant="outline" onClick={() => fetchingData()}>
            Clear Filters
          </Button>
        </div>

        {/* Table */}

        <div className="mt-10 border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {tbl_head?.map((item, index) => (
                  <TableHead
                    key={index}
                    className={`whitespace-nowrap ${item.key ? "cursor-pointer select-none hover:text-blue-600" : ""}`}
                    onClick={() => {
                      if (item.key) {
                        const newDirection =
                          sortConfig.key === item.key &&
                          sortConfig.direction === "asc"
                            ? "desc"
                            : "asc";
                        setSortConfig({
                          key: item.key,
                          direction: newDirection,
                        });

                        // Trigger the backend fetch with sorting params
                        fetchingData({
                          sort_by: item.key,
                          sort_order: newDirection,
                        });
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {item.label}
                      {item.key && sortConfig.key === item.key && (
                        <span>
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  {/* ✅ Fixed colSpan and Loading Spinner */}
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex justify-center items-center w-full">
                      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {enrollment?.length > 0 ? (
                    enrollment.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {item?.student?.full_name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item?.course?.title}
                        </TableCell>{" "}
                        <TableCell className="font-medium">
                          {item?.schedule?.shift} \{" "}
                          {item?.schedule?.days_of_week}
                        </TableCell>
                        <TableCell>{item?.enrollment_date}</TableCell>
                        <TableCell>{item?.total_price}</TableCell>
                        <TableCell>{item?.discount}%</TableCell>
                        <TableCell>{item?.paid_amount}</TableCell>
                        <TableCell>
                          {item?.payment_status === "Paid" ? (
                            <Badge className="bg-green-500 hover:bg-green-600 text-white">
                              Paid
                            </Badge>
                          ) : item?.payment_status === "Partial" ? (
                            <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                              Partial
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Unpaid</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {item?.status ? (
                            <Badge className="bg-slate-200 hover:bg-slate-200 text-slate">
                              Active
                            </Badge>
                          ) : (
                            <Badge className="bg-black hover:bg-slate-800 text-white">
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(item?.created_at)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDate(item?.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => onEdit(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => onDelete(item)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-24 text-center text-gray-500"
                      >
                        No enrollments found.
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

---------------------for course 
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

  // --- Filter & Sort State ---
  const [query, setQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "enrollment_date",
    direction: "desc",
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
    payment_status: "",
    status: true,
  });

  const tbl_head = [
    { label: "No", key: null },
    { label: "Student", key: "student_id" },
    { label: "Course", key: "course_id" },
    { label: "Schedule", key: "schedule_id" },
    { label: "Date", key: "enrollment_date" },
    { label: "Price", key: "total_price" },
    { label: "Discount", key: "discount" },
    { label: "Paid", key: "paid_amount" },
    { label: "Payment", key: "payment_status" },
    { label: "Status", key: "status" },
    { label: "Created", key: "created_at" },
    { label: "Updated", key: "updated_at" },
    { label: "Action", key: null },
  ];

  // Unified Fetching Logic
  const fetchingData = useCallback(
    async (overrides = {}) => {
      setLoading(true);
      try {
        const params = {
          q: query,
          course_id: filterCourse,
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

        if (enroll) setEnrollment(enroll?.data?.data || enroll?.data || []);
        if (courseRes) setCourse(courseRes?.data || []);
        if (studentRes) setStudent(studentRes?.data || []);
        if (scheduleRes) setSchedule(scheduleRes?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [query, filterCourse, sortConfig],
  );

  useEffect(() => {
    fetchingData();
  }, []);

  const resetFilters = () => {
    setQuery("");
    setFilterCourse("");
    fetchingData({ q: "", course_id: "" });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("student_id", form?.student_id || "");
    formData.append("course_id", form?.course_id || "");
    formData.append("schedule_id", form?.schedule_id || "");
    formData.append("enrollment_date", form?.enrollment_date || "");
    formData.append("total_price", form?.total_price || "");
    formData.append("discount", form?.discount || "");
    formData.append("paid_amount", form?.paid_amount || "");
    formData.append("payment_status", form?.payment_status || "");
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
        setForm({
          id: "",
          student_id: "",
          course_id: "",
          schedule_id: "",
          enrollment_date: "",
          total_price: "",
          discount: "",
          paid_amount: "",
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
          <h1 className="text-2xl font-bold">Enrollment Student</h1>
          <p className="text-muted-foreground text-sm">
            Manage student registration and payment statuses.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="mr-2 w-4 h-4" /> Add Enrollment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] md:max-w-[800px] lg:max-w-[1000px]">
            <DialogHeader>
              <DialogTitle>
                {isEdit ? "Update enrollment" : "Create enrollment"}
              </DialogTitle>
              <DialogDescription>
                Fill in the enrollment details below.
              </DialogDescription>
            </DialogHeader>
            {/* EXACT FORM AS REQUESTED (Unchanged) */}
            <form onSubmit={onSubmit}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-3 w-full">
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
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Course</Label>
                    <Select
                      value={String(form?.course_id)}
                      onValueChange={(v) =>
                        setForm({ ...form, course_id: v, schedule_id: "" })
                      }
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

                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-3 w-full">
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

                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Total Price</Label>
                    <Input
                      type="text"
                      value={form?.total_price}
                      onChange={(e) =>
                        setForm({ ...form, total_price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Discount</Label>
                    <Input
                      type="text"
                      value={form?.discount}
                      onChange={(e) =>
                        setForm({ ...form, discount: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <Label>Paid Amount</Label>
                    <Input
                      type="text"
                      value={form?.paid_amount}
                      onChange={(e) =>
                        setForm({ ...form, paid_amount: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-col gap-3">
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
                  <div className="flex flex-col gap-3">
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
                <Button type="submit">{isEdit ? "Update" : "Save"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 2. Filter & Search Bar - REFACTORED FOR FUNCTIONALITY */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-slate-50 p-4 rounded-lg border shadow-sm">
        <div className="relative w-full flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student name..."
            className="pl-9 bg-white"
            onKeyDown={(e) => e.key === "Enter" && fetchingData()}
          />
        </div>

        {/* Replace the old Payment Status Select with this */}
        <Select
          value={filterCourse || "all"}
          onValueChange={(val) => {
            const v = val === "all" ? "" : val;
            setFilterCourse(v);
            fetchingData({ course_id: v }); // Pass course_id to the API
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

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            disabled={loading}
            className="flex-1 md:flex-none"
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

      {/* 3. Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              {tbl_head.map((item, index) => (
                <TableHead
                  key={index}
                  className={`py-4 ${item.key ? "cursor-pointer select-none hover:text-blue-600" : ""}`}
                  onClick={() => {
                    if (item.key) {
                      const newDir =
                        sortConfig.key === item.key &&
                        sortConfig.direction === "asc"
                          ? "desc"
                          : "asc";
                      setSortConfig({ key: item.key, direction: newDir });
                      fetchingData({ sort_by: item.key, sort_order: newDir });
                    }
                  }}
                >
                  <div className="flex items-center gap-1 font-semibold">
                    {item.label}
                    {item.key && sortConfig.key === item.key && (
                      <span className="text-blue-500">
                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tbl_head.length}
                  className="h-32 text-center"
                >
                  <div className="flex justify-center items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin" /> Loading data...
                  </div>
                </TableCell>
              </TableRow>
            ) : enrollment.length > 0 ? (
              enrollment.map((item, index) => (
                <TableRow
                  key={item.id || index}
                  className="hover:bg-slate-50/50"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {item?.student?.full_name}
                  </TableCell>
                  <TableCell>{item?.course?.title}</TableCell>
                  <TableCell className="text-xs">
                    {item?.schedule?.shift} | {item?.schedule?.days_of_week}
                  </TableCell>
                  <TableCell>{item?.enrollment_date}</TableCell>
                  <TableCell>${item?.total_price}</TableCell>
                  <TableCell>{item?.discount}%</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${item?.paid_amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item?.payment_status === "Paid"
                          ? "bg-green-500 hover:bg-green-600"
                          : item?.payment_status === "Partial"
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-red-500"
                      }
                    >
                      {item?.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item?.status ? "bg-slate-100" : "bg-black text-white"
                      }
                    >
                      {item?.status ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[10px]">
                    {formatDate(item?.created_at)}
                  </TableCell>
                  <TableCell className="text-[10px]">
                    {formatDate(item?.updated_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => onDelete(item)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tbl_head.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No enrollments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Modal */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent>
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

<!--  -->
