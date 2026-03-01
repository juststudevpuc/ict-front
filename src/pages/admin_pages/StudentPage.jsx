import { useEffect, useState } from "react";
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
  X,
  Monitor,
  Tablet as TabletIcon,
  Smartphone,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { request } from "@/utils/request/request";
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

export default function StudentPage() {
  const [student, setStudent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [query, setQuery] = useState("");

  // Responsive State: 'desktop' | 'tablet' | 'mobile'
  const [viewMode, setViewMode] = useState("desktop");

  const [form, setForm] = useState({
    id: "",
    full_name: "",
    gender: "",
    date_of_birth: "",
    email: "",
    phone: "",
    address: "",
    status: true,
  });

  const tbl_head = [
    "No",
    "Student Name",
    "Gender",
    "DOB",
    "Email and Phone",
    "Address",
    "Status",
    "Joined",
    "Action",
  ];

  // Automatic Screen Detection
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setViewMode("mobile");
      else if (window.innerWidth < 1280) setViewMode("tablet");
      else setViewMode("desktop");
    };
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("student", "get");
      if (res) setStudent(res?.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchingData();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", form?.full_name || "");
    formData.append("gender", form?.gender || "");
    formData.append("email", form?.email || "");
    formData.append("phone", form?.phone || "");
    formData.append("address", form?.address || "");
    formData.append("date_of_birth", form?.date_of_birth || "");
    formData.append("status", form?.status ? 1 : 0);

    try {
      let res;
      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`student/${form?.id}`, "post", formData);
      } else {
        res = await request("student", "post", formData);
      }

      if (res) {
        fetchingData();
        closeDialog();
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const closeDialog = () => {
    setIsOpen(false);
    setIsEdit(false);
    setForm({
      id: "",
      full_name: "",
      gender: "",
      date_of_birth: "",
      email: "",
      phone: "",
      address: "",
      status: true,
    });
  };

  const onEdit = (itemEdit) => {
    setIsEdit(true);
    setForm(itemEdit);
    setIsOpen(true);
  };

  const onDelete = (itemDelete) => {
    setDeleteData(itemDelete);
    setIsDelete(true);
  };

  const handleSearch = async () => {
    setLoading(true);
    const res = await request(`student/search/?q=${query}`, "get");
    if (res) {
      setStudent(res?.data);
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50/30">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#003868]">
            Students
          </h1>
          <p className="text-slate-500 font-medium text-sm">
            Directory and Management System
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* RESPONSIVE SWITCHER BUTTONS */}
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm mr-2">
            <Button
              variant={viewMode === "mobile" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("mobile")}
              className="h-8 w-8"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "tablet" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("tablet")}
              className="h-8 w-8"
            >
              <TabletIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "desktop" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("desktop")}
              className="h-8 w-8"
            >
              <Monitor className="w-4 h-4" />
            </Button>
          </div>

          {/* SEARCH TOOLBAR */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex-1 md:flex-none">
            <div className="relative group flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 w-full md:w-[200px] border-none bg-transparent focus-visible:ring-0 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button
              size="sm"
              className="bg-[#003868] hover:bg-[#002b50]"
              onClick={handleSearch}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400"
              onClick={() => {
                fetchingData();
                setQuery("");
              }}
            >
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#003868] hover:bg-[#002b50] h-11 px-6 rounded-xl shadow-lg active:scale-95">
                <Plus className="mr-2 w-4 h-4 stroke-[3px]" />
                <span className="font-bold">Add Student</span>
              </Button>
            </DialogTrigger>
            {/* ... Form Content (remains same as your code) ... */}
            <DialogContent className="max-w-2xl rounded-2xl border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-[#003868] p-6 text-white">
                <DialogTitle className="text-2xl font-black">
                  {isEdit ? "Update Profile" : "New Student"}
                </DialogTitle>
                <DialogDescription className="text-blue-100">
                  Fill in the required fields below.
                </DialogDescription>
              </div>
              <form onSubmit={onSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">
                      Full Name
                    </Label>
                    <Input
                      value={form?.full_name}
                      onChange={(e) =>
                        setForm({ ...form, full_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">
                      Gender
                    </Label>
                    <Select
                      value={form?.gender?.toLowerCase()}
                      onValueChange={(v) => setForm({ ...form, gender: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={form?.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">
                      Phone
                    </Label>
                    <Input
                      value={form?.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">
                      DOB
                    </Label>
                    <Input
                      type="date"
                      value={form?.date_of_birth || ""}
                      onChange={(e) =>
                        setForm({ ...form, date_of_birth: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">
                      Account Status
                    </Label>
                    <Select
                      value={String(form?.status)}
                      onValueChange={(v) =>
                        setForm({ ...form, status: v === "true" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400">
                    Address
                  </Label>
                  <Input
                    value={form?.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="ghost" type="button" onClick={closeDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#003868] px-8">
                    {isEdit ? "Update Student" : "Save Student"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* DELETE MODAL (Remains same) */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-2xl">
          <div className="bg-rose-50 p-8 flex justify-center">
            <Trash className="w-12 h-12 text-rose-500 animate-bounce" />
          </div>
          <div className="p-6 text-center">
            <DialogTitle className="text-xl font-bold">
              Remove Student?
            </DialogTitle>
            <p className="text-slate-500 mt-2 text-sm">
              Deleting{" "}
              <span className="font-bold text-slate-800">
                {deleteData?.full_name}
              </span>{" "}
              is permanent.
            </p>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsDelete(false)}
              >
                Keep Record
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-rose-600 shadow-lg shadow-rose-200"
                onClick={async () => {
                  const res = await request(
                    `student/${deleteData?.id}`,
                    "delete",
                  );
                  if (res) {
                    fetchingData();
                    setIsDelete(false);
                  }
                }}
              >
                Delete Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONTENT SWITCHER */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#003868] mb-4" />
          <p className="text-xl font-bold text-slate-400">
            Loading Student Data...
          </p>
        </div>
      ) : (
        <>
          {/* 1. MOBILE VIEW (Cards) */}
          {viewMode === "mobile" && (
            <div className="grid grid-cols-2 gap-4">
              {student.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-3xl border-2 border-slate-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#003868] text-white flex items-center justify-center font-bold">
                        {item.full_name?.charAt(0)}
                      </div>
                      <div className="font-extrabold text-slate-900">
                        {item.full_name}
                      </div>
                    </div>
                    <div
                      className={
                        item.status ? "text-emerald-500" : "text-slate-300"
                      }
                    >
                      ●
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" /> {item.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3" /> {item.email}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4 border-t border-slate-50">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl h-10"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 rounded-xl h-10"
                      onClick={() => onDelete(item)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. TABLET VIEW (Simplified Table) */}
          {viewMode === "tablet" && (
            <div className="overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-black text-[#003868]">
                      Name
                    </TableHead>
                    <TableHead className="font-black text-[#003868]">
                      Contact
                    </TableHead>
                    <TableHead className="font-black text-[#003868] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">
                        {item.full_name}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        <div>{item.phone}</div>
                        <div className="text-blue-500">{item.email}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(item)}
                        >
                          <Trash className="w-4 h-4 text-rose-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* 3. DESKTOP VIEW (Your Original Table - Exact Code) */}
          {viewMode === "desktop" && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    {tbl_head.map((head, i) => (
                      <TableHead
                        key={i}
                        className="h-10 text-[11px] font-black uppercase tracking-widest text-[#003868]"
                      >
                        {head}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      className="group border-b border-slate-50 transition-all hover:bg-slate-50/50"
                    >
                      <TableCell className="w-8 text-center text-[11px] font-bold text-slate-300">
                        {index + 1}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#003868] text-sm font-black text-white shadow-md shadow-blue-900/10">
                            {item?.full_name?.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-extrabold text-slate-900 leading-tight">
                              {item?.full_name}
                            </span>
                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">
                              Verified
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${item?.gender?.toLowerCase() === "male" ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-rose-50 text-rose-700 border-rose-100"}`}
                        >
                          {item?.gender}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400">📅</span>
                          {item?.date_of_birth}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-bold text-blue-600 hover:underline cursor-pointer">
                          {item?.email}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {item?.phone}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[180px]">
                        <p className="text-xs text-slate-500 font-medium truncate italic">
                          {item?.address}
                        </p>
                      </TableCell>
                      <TableCell>
                        {item?.status ? (
                          <div className="flex w-fit items-center gap-1.5 rounded-lg bg-emerald-500 px-2.5 py-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-black text-white">
                              ACTIVE
                            </span>
                          </div>
                        ) : (
                          <div className="flex w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 border border-slate-200">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                            <span className="text-[10px] font-black text-slate-400">
                              OFFLINE
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span>Add: {formatDate(item?.created_at)}</span>
                          <span>Upd: {formatDate(item?.updated_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                            onClick={() => onEdit(item)}
                          >
                            <Edit className="h-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                            onClick={() => onDelete(item)}
                          >
                            <Trash className="h-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
