import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Trash, Loader2, BookOpen, Calendar, Clock, List } from "lucide-react"; // Added a few icons for mobile UI
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🛠️ LOGIC UNTOUCHED: Handles the Expand/Collapse logic for long text!
const ExpandableText = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text)
    return (
      <span className="text-slate-400 italic text-sm">No curriculum added</span>
    );

  // Roughly guess if text is long enough to need a toggle (e.g., > 60 chars)
  const isLongText = text.length > 60;

  return (
    <div className="max-w-[200px] lg:max-w-[300px]">
      <div
        className={`text-sm text-slate-600 transition-all duration-300 ${
          isExpanded ? "whitespace-normal break-words" : "line-clamp-2"
        }`}
      >
        {text}
      </div>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-violet-600 hover:text-violet-800 text-xs font-semibold mt-1 hover:underline focus:outline-none"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default function CourseDetailAdmin() {
  const [courseDetail, setCourseDetail] = useState([]);
  const [course, setCourse] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [form, setForm] = useState({
    id: "",
    course_id: "",
    schedule_id: "",
    curriculum: "",
  });

  const tbl_head = [
    "No",
    "Course",
    "Schedule",
    "Curriculum",
    "Created At",
    "Updated At",
    "Actions",
  ];

  // LOGIC UNTOUCHED
  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("courseDetail", "get");
      const courseRes = await request("course", "get");
      const scheduleRes = await request("schedule", "get");

      if (res?.data) setCourseDetail(res.data);
      if (courseRes?.data) setCourse(courseRes.data);
      if (scheduleRes?.data) setSchedule(scheduleRes.data);
    } catch (error) {
      console.error("Failed to fetch courseDetails:", error);
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
    formData.append("schedule_id", form?.schedule_id || "");

    if (form?.curriculum) {
      const curriculumArray = form.curriculum
        .split(",")
        .map((item) => item.trim());
      // Append each item as an array element in FormData
      curriculumArray.forEach((item, index) => {
        formData.append(`curriculum[${index}]`, item);
      });
    }
    try {
      let res;
      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`courseDetail/${form?.id}`, "post", formData);
      } else {
        res = await request("courseDetail", "post", formData);
      }

      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        setForm({ id: "", course_id: "", schedule_id: "", curriculum: "" });
      }
    } catch (error) {
      console.error(
        "Validation Errors:",
        error.response?.data?.errors || error.message,
      );
    }
  };

  // LOGIC UNTOUCHED
  const onEdit = (itemEdit) => {
    setIsOpen(true);
    setForm({
      id: itemEdit.id || itemEdit._id,
      course_id:
        itemEdit.course_id || itemEdit.course?._id || itemEdit.course?.id || "",
      schedule_id:
        itemEdit.schedule_id ||
        itemEdit.schedule?._id ||
        itemEdit.schedule?.id ||
        "",
      curriculum: Array.isArray(itemEdit.curriculum)
        ? itemEdit.curriculum.join(", ")
        : itemEdit.curriculum || "",
    });
    setIsEdit(true);
  };

  // LOGIC UNTOUCHED
  const onDelete = (itemDelete) => {
    setIsDelete(true);
    setDeleteData(itemDelete);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Course Details Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Link courses to schedules and define curriculum data.
            </p>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-violet-900 text-white w-full sm:w-auto">
                <Plus className="mr-2 w-4 h-4" />
                Add Mapping
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {isEdit ? "Update Mapping" : "Create Mapping"}
                </DialogTitle>
                <DialogDescription>
                  Select the course, schedule, and enter the curriculum topics.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="mt-4">
                <div className="space-y-4">
                  {/* Course Select */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Course</Label>
                    <Select
                      value={String(form?.course_id)}
                      onValueChange={(value) =>
                        setForm({ ...form, course_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course..." />
                      </SelectTrigger>
                      <SelectContent>
                        {course?.map((item) => (
                          <SelectItem
                            key={item?._id || item?.id}
                            value={String(item?._id || item?.id)}
                          >
                            {item?.title || item?.full_name || "N/A"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Schedule Select */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Schedule</Label>
                    <Select
                      value={String(form?.schedule_id)}
                      onValueChange={(value) =>
                        setForm({ ...form, schedule_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a schedule..." />
                      </SelectTrigger>
                      <SelectContent>
                        {schedule?.map((item) => (
                          <SelectItem
                            key={item?._id || item?.id}
                            value={String(item?._id || item?.id)}
                          >
                            {item?.group_name ? `${item.group_name} - ` : ""}
                            {item?.days_of_week} | {item?.shift}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Curriculum Textarea */}
                  <div className="flex flex-col gap-2 w-full">
                    <Label>Curriculum Topics (Comma Separated)</Label>
                    <Textarea
                      placeholder="e.g. HTML, CSS, React, Laravel&#10;Type your topics here..."
                      value={form?.curriculum || ""}
                      onChange={(e) =>
                        setForm({ ...form, curriculum: e.target.value })
                      }
                      className="min-h-[120px] resize-y bg-slate-50 border-slate-200 focus-visible:ring-violet-500 text-sm leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8 gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsEdit(false);
                      setForm({
                        id: "",
                        course_id: "",
                        schedule_id: "",
                        curriculum: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    {isEdit ? "Update Mapping" : "Save Mapping"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* --- Delete Modal --- */}
        <Dialog open={isDelete} onOpenChange={setIsDelete}>
          <DialogContent className="sm:max-w-md w-[90vw]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this course mapping? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex justify-end gap-3">
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
                    const res = await request(
                      `courseDetail/${deleteData?.id || deleteData?._id}`,
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
          </DialogContent>
        </Dialog>

        {/* --- Responsive Content Section --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-violet-500 opacity-80" />
            <span className="text-sm text-slate-500 font-medium animate-pulse">
              Loading data...
            </span>
          </div>
        ) : courseDetail?.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 bg-white shadow-sm mt-6">
            <BookOpen className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium">No course mappings found.</p>
          </div>
        ) : (
          <>
            {/* MOBILE & TABLET CARDS (Hidden on large screens) */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:hidden gap-4 mt-6">
              {courseDetail.map((item, index) => (
                <div
                  key={item.id || item._id || index}
                  className="bg-white border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-slate-900 text-lg leading-tight">
                        {item?.course?.title || "Unknown Course"}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-600 font-normal flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3" />
                          {item?.schedule?.days_of_week || "N/A"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="text-xs bg-blue-50 text-blue-600 font-normal flex items-center gap-1"
                        >
                          <Clock className="w-3 h-3" />
                          {item?.schedule?.shift || "N/A"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                      <List className="w-3 h-3" /> Curriculum
                    </div>
                    {/* Reusing your ExpandableText component perfectly */}
                    <ExpandableText
                      text={
                        Array.isArray(item?.curriculum)
                          ? item.curriculum.join(" • ")
                          : item?.curriculum
                      }
                    />
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="secondary"
                      className="flex-1 h-9 bg-slate-100 hover:bg-slate-200 text-slate-700"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-9 text-rose-600 border-rose-100 hover:bg-rose-50"
                      onClick={() => onDelete(item)}
                    >
                      <Trash className="w-4 h-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE (Hidden on mobile/tablet) */}
            <div className="hidden lg:block bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mt-6">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    {tbl_head.map((item, index) => (
                      <TableHead
                        key={index}
                        className="font-semibold text-slate-700 whitespace-nowrap"
                      >
                        {item}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courseDetail.map((item, index) => (
                    <TableRow
                      key={item.id || item._id || index}
                      className="hover:bg-slate-50/50"
                    >
                      <TableCell className="text-slate-500">
                        {index + 1}
                      </TableCell>

                      <TableCell className="font-medium text-slate-900 whitespace-nowrap">
                        {item?.course?.title || "Unknown Course"}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1 min-w-[120px]">
                          <div className="flex gap-2">
                            <Badge
                              variant="secondary"
                              className="text-[13px] bg-slate-100 text-slate-600 font-normal whitespace-nowrap"
                            >
                              {item?.schedule?.days_of_week || "N/A"}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-[13px] bg-blue-50 text-blue-600 font-normal whitespace-nowrap"
                            >
                              {item?.schedule?.shift || "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <ExpandableText
                          text={
                            Array.isArray(item?.curriculum)
                              ? item.curriculum.join(" • ")
                              : item?.curriculum
                          }
                        />
                      </TableCell>

                      <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                        {formatDate(item?.created_at)}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm whitespace-nowrap">
                        {formatDate(item?.updated_at)}
                      </TableCell>

                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
      </div>
    </div>
  );
}