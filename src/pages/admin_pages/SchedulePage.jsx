import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash, Loader2, Calendar, MapPin, Clock, User, BookOpen } from "lucide-react"; // Added icons for UI
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
import { getImageUrl } from "@/utils/helper/helpers";

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [instructor, setInstructor] = useState([]);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [form, setForm] = useState({
    id: "",
    schedule_id: "",
    instructor_id: "",
    group_name: "",
    room: "",
    shift: "",
    start_date: "",
    end_date: "",
    days_of_week: "",
    start_time: "",
    end_time: "",
    status: true,
  });

  const tbl_head = [
    "No",
    "Instructor",
    "Course",
    "Group & Room",
    "Shift",
    "Start Date",
    "End Date",
    "Day",
    "Time",
    "Status",
    "Action",
  ];

  // LOGIC UNTOUCHED
  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("schedule", "get");
      const instructor = await request("instructor", "get");
      const course = await request("course", "get");
      if (instructor?.data) {
        setInstructor(instructor?.data);
      }
      if (course) {
        setCourse(course?.data);
      }
      if (res) {
        setSchedule(res?.data);
      }
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  // LOGIC UNTOUCHED
  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("course_id", form?.course_id || "");
    formData.append("instructor_id", form?.instructor_id || "");
    formData.append("group_name", form?.group_name || "");
    formData.append("room", form?.room || "");
    formData.append("shift", form?.shift || "");
    formData.append("start_date", form?.start_date || "");
    formData.append("end_date", form?.end_date || "");
    formData.append("days_of_week", form?.days_of_week || "");
    formData.append("start_time", form?.start_time || "");
    formData.append("end_time", form?.end_time || "");
    formData.append("status", form?.status ? 1 : 0);

    try {
      let res;

      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`schedule/${form?.id}`, "post", formData);
        if (res) console.log("Updated schedule : ", res);
      } else {
        res = await request("schedule", "post", formData);
        if (res) console.log("Created schedule : ", res);
      }

      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        setForm({
          id: "",
          schedule_id: "",
          instructor_id: "",
          group_name: "",
          room: "",
          shift: "",
          start_date: "",
          end_date: "",
          days_of_week: "",
          start_time: "",
          end_time: "",
          status: true,
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // LOGIC UNTOUCHED
  const onEdit = (itemEdit) => {
    setIsOpen(true);
    setForm(itemEdit);
    setIsEdit(true);
  };

  // LOGIC UNTOUCHED
  const onDelete = (itemDelete) => {
    setIsDelete(true);
    setDeleteData(itemDelete);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#003868]" /> Class Schedules
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage course timing, rooms, and instructor assignments.
          </p>
        </div>

        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#003868] hover:bg-[#00284d] text-white shadow-sm w-full md:w-auto">
                <Plus className="mr-2 w-4 h-4" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-3xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#003868]">
                  {isEdit ? "Update Schedule" : "Create Schedule"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the schedule details below.
                </DialogDescription>
              </DialogHeader>
              
              {/* Form Layout Refactored to Responsive Grid */}
              <form onSubmit={onSubmit} className="mt-4">
                <div className="flex flex-col gap-5">
                  {/* Row 1: Group Name & Room */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Group Name</Label>
                      <Input
                        value={form?.group_name || ""}
                        onChange={(e) => setForm({ ...form, group_name: e.target.value })}
                        placeholder="e.g., Weekend-G1"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Room</Label>
                      <Input
                        value={form?.room || ""}
                        onChange={(e) => setForm({ ...form, room: e.target.value })}
                        placeholder="e.g., Lab 301"
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                  </div>

                  {/* Row 2: Course & Instructor */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Course</Label>
                      <Select
                        value={String(form?.course_id || "")}
                        onValueChange={(value) => setForm({ ...form, course_id: value })}
                      >
                        <SelectTrigger className="bg-slate-50 focus-visible:ring-[#003868]">
                          <SelectValue placeholder="Please select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {course?.map((item, index) => (
                            <SelectItem key={item?._id || index} value={String(item?.id || item?._id)}>
                              {item?.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Instructor</Label>
                      <Select
                        value={String(form?.instructor_id || "")}
                        onValueChange={(value) => setForm({ ...form, instructor_id: value })}
                      >
                        <SelectTrigger className="bg-slate-50 focus-visible:ring-[#003868]">
                          <SelectValue placeholder="Please select Instructor" />
                        </SelectTrigger>
                        <SelectContent>
                          {instructor?.map((item, index) => (
                            <SelectItem key={item?._id || index} value={String(item?._id || item?.id)}>
                              {item?.first_name} {item?.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 3: Dates & Shift */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Start Date</Label>
                      <Input
                        type="date"
                        value={form?.start_date || ""}
                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">End Date</Label>
                      <Input
                        type="date"
                        value={form?.end_date || ""}
                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Shift</Label>
                      <Select
                        value={form?.shift || ""}
                        onValueChange={(value) => setForm({ ...form, shift: value })}
                      >
                        <SelectTrigger className="bg-slate-50 focus-visible:ring-[#003868]">
                          <SelectValue placeholder="Select Shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Afternoon">Afternoon</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 4: Times & Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Start Time</Label>
                      <Input
                        type="time"
                        value={form?.start_time || ""}
                        onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">End Time</Label>
                      <Input
                        type="time"
                        value={form?.end_time || ""}
                        onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-semibold text-slate-700">Status</Label>
                      <Select
                        value={String(form?.status ?? true)}
                        onValueChange={(value) => setForm({ ...form, status: value === "true" })}
                      >
                        <SelectTrigger className="bg-slate-50 focus-visible:ring-[#003868]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 5: Days of the Week */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label className="font-semibold text-slate-700">Days of Week</Label>
                    <Select
                      value={form?.days_of_week || ""}
                      onValueChange={(value) => setForm({ ...form, days_of_week: value })}
                      required
                    >
                      <SelectTrigger className="bg-slate-50 focus-visible:ring-[#003868]">
                        <SelectValue placeholder="Select study days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday to Friday">Monday to Friday</SelectItem>
                        <SelectItem value="Monday, Wednesday, Friday">Monday, Wednesday, Friday</SelectItem>
                        <SelectItem value="Tuesday, Thursday">Tuesday, Thursday</SelectItem>
                        <SelectItem value="Saturday & Sunday">Saturday & Sunday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-4 border-t border-slate-100 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(false);
                      setForm({
                        id: "",
                        course_id: "",
                        instructor_id: "",
                        group_name: "",
                        room: "",
                        shift: "",
                        start_date: "",
                        end_date: "",
                        days_of_week: "",
                        start_time: "",
                        end_time: "",
                        status: true,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-8 bg-[#003868] hover:bg-[#00284d]">{isEdit ? "Update" : "Save"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* --- Responsive Content Section --- */}
      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 gap-3 text-[#003868]">
          <Loader2 className="w-10 h-10 animate-spin opacity-80" />
          <span className="font-medium animate-pulse text-sm">Syncing schedules...</span>
        </div>
      ) : schedule?.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
          <Calendar className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-medium">No schedules found in the database.</p>
        </div>
      ) : (
        <>
          {/* MOBILE & TABLET CARDS (Hidden on large screens) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:hidden gap-4">
            {schedule?.map((item, index) => (
              <div key={item._id || item.id || index} className="bg-white border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-none">
                      {item?.group_name}
                    </h3>
                    <p className="text-sm font-semibold text-[#003868] mt-1 line-clamp-1">
                      {item?.course?.title || "No Course"}
                    </p>
                  </div>
                  {item?.status ? (
                     <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  ) : (
                     <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-y-3 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="truncate">{item?.instructor ? `${item.instructor.first_name} ${item.instructor.last_name}` : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{item?.room || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 col-span-2">
                    <Clock className="w-4 h-4 text-slate-400 min-w-4" />
                    <span className="text-xs font-medium">{item?.days_of_week} • {item?.start_time}-{item?.end_time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 col-span-2">
                    <Calendar className="w-4 h-4 text-slate-400 min-w-4" />
                    <span className="text-xs font-medium">{item?.start_date} to {item?.end_date}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <Button variant="secondary" className="flex-1 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700" onClick={() => onEdit(item)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="outline" className="flex-1 h-9 text-rose-600 border-rose-100 hover:bg-rose-50" onClick={() => onDelete(item)}>
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE (Hidden on mobile/tablet) */}
          <div className="hidden lg:block border rounded-xl bg-white shadow-sm overflow-hidden border-slate-200">
            <Table>
              <TableHeader className="bg-[#003868]">
                <TableRow className="hover:bg-[#003868]">
                  {tbl_head?.map((item, index) => (
                    <TableHead key={index} className="text-white font-bold py-4 whitespace-nowrap">
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={item._id || item.id || index} className="hover:bg-blue-50/50 group transition-colors">
                    <TableCell className="font-medium text-slate-500">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      {item?.instructor ? `${item.instructor.first_name} ${item.instructor.last_name}` : "N/A"}
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#003868] text-xs font-bold border border-blue-100 whitespace-nowrap">
                        {item?.course?.title || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-bold text-slate-800">{item?.group_name}</div>
                      <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {item?.room || "No Room"}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">{item?.shift}</TableCell>
                    <TableCell className="text-slate-600 whitespace-nowrap text-sm">{item?.start_date}</TableCell>
                    <TableCell className="text-slate-600 whitespace-nowrap text-sm">{item?.end_date}</TableCell>
                    <TableCell className="text-slate-600 text-sm font-medium">{item?.days_of_week}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm font-bold text-slate-700">
                      {item?.start_time} - {item?.end_time}
                    </TableCell>
                    <TableCell>
                      {item?.status ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-700">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-semibold text-rose-700">Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700" onClick={() => onEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-600 hover:bg-rose-100 hover:text-rose-700" onClick={() => onDelete(item)}>
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

      {/* --- Delete Modal --- */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Delete Schedule</DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to delete the schedule for <strong className="text-rose-500">{deleteData?.group_name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setDeleteData(null); setIsDelete(false); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="px-6"
              onClick={async () => {
                try {
                  const res = await request(`schedule/${deleteData?.id || deleteData?._id}`, "delete");
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
        </DialogContent>
      </Dialog>
    </div>
  );
}