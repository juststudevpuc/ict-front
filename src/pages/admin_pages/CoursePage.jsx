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
  SearchSlash, 
  X, 
  Clock, 
  DollarSign,
  BookOpen
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
import { getImageUrl } from "@/utils/helper/helpers";

export default function CoursePage() {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [query, setQuery] = useState("");

  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    duration_hours: "",
    status: true,
    image: null,
  });

  const tbl_head = [
    "No", "Course Details", "Level", "Time", "Price", "Status", "Timestamp", "Action",
  ];

  // --- LOGIC (UNTOUCHED) ---
  const fetchingData = async () => {
    setLoading(true); 
    try {
      const res = await request("course", "get");
      if (res) { setCourse(res?.data); }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => { fetchingData(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form?.title || "");
    formData.append("description", form?.description || "");
    formData.append("price", form?.price || 0);
    formData.append("duration_hours", form?.duration_hours || "");
    formData.append("status", form?.status ? 1 : 0);
    if (form?.image instanceof File) { formData.append("image", form?.image); }

    try {
      let res; 
      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`course/${form?.id}`, "post", formData);
      } else {
        res = await request("course", "post", formData);
      }
      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        setForm({ id: "", title: "", description: "", price: 0, duration_hours: "", status: true, image: null });
      }
    } catch (error) { console.error("Submission error:", error); }
  };

  const onEdit = (itemEdit) => { setIsOpen(true); setForm(itemEdit); setIsEdit(true); };
  const onDelete = (itemDelete) => { setIsDelete(true); setDeleteData(itemDelete); };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-slate-50 flex justify-center">
      <div className="w-full max-w-7xl">
        
        {/* --- HEADER & SEARCH SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#003868] flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" /> Courses
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
              Curriculum Management
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Bar Styled */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search course..."
                className="w-full sm:w-32 md:w-48 border-none bg-transparent focus-visible:ring-0 text-sm h-7"
                onKeyDown={(e) => {
                    if(e.key === "Enter") {
                        setLoading(true);
                        request(`course/search/?q=${query}`, "get").then(res => {
                            if(res) { setCourse(res?.data); setLoading(false); }
                        });
                    }
                }}
              />
              {query && <X className="w-4 h-4 text-slate-300 cursor-pointer hover:text-rose-500 shrink-0" onClick={() => { fetchingData(); setQuery(""); }} />}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#003868] hover:bg-[#002b50] h-10 px-4 rounded-xl shadow-lg shadow-blue-900/10 transition-transform active:scale-95 w-full sm:w-auto">
                  <Plus className="mr-2 w-4 h-4" /> Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] sm:max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-[#003868]">
                    {isEdit ? "Update Course" : "Create New Course"}
                  </DialogTitle>
                  <DialogDescription>Enter the syllabus and pricing details.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Course Title</Label>
                    <Input value={form?.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="focus-visible:ring-[#003868]" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Price ($)</Label>
                      <Input type="number" value={form?.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="focus-visible:ring-[#003868]" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Duration</Label>
                      <Input value={form?.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: e.target.value })} placeholder="e.g. 48h" required className="focus-visible:ring-[#003868]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Level / Tagline</Label>
                    <Input value={form?.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="focus-visible:ring-[#003868]" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div className="space-y-2 w-full">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Status</Label>
                        <Select value={String(form?.status)} onValueChange={(v) => setForm({ ...form, status: v === "true" })}>
                            <SelectTrigger className="focus-visible:ring-[#003868]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">Active</SelectItem>
                                <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 w-full">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Cover Image</Label>
                        <Input type="file" className="text-[10px] file:text-[#003868] file:font-bold focus-visible:ring-[#003868]" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />
                    </div>
                  </div>

                  {form?.image && (
                    <div className="flex justify-center pt-2">
                      <div className="w-full h-32 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 p-1">
                        <img className="w-full h-full object-cover rounded-lg" src={form?.image instanceof File ? URL.createObjectURL(form?.image) : getImageUrl(form?.image)} alt="Preview" />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <Button variant="ghost" type="button" onClick={() => { setIsOpen(false); setIsEdit(false); }}>Cancel</Button>
                    <Button type="submit" className="bg-[#003868] hover:bg-[#002b50] px-8">{isEdit ? "Update" : "Save Course"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* --- DELETE MODAL (UNTOUCHED LOGIC) --- */}
        <Dialog open={isDelete} onOpenChange={setIsDelete}>
          <DialogContent className="w-[90vw] sm:max-w-xs text-center rounded-2xl">
            <div className="flex justify-center mb-4 text-rose-500">
                <Trash className="w-12 h-12 p-3 bg-rose-50 rounded-full" />
            </div>
            <DialogTitle className="text-lg">Delete Course?</DialogTitle>
            <p className="text-sm text-slate-500 mt-2">This action cannot be undone for <br/><span className="font-bold text-slate-800">"{deleteData?.title}"</span></p>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setIsDelete(false)}>No</Button>
              <Button variant="destructive" className="flex-1" onClick={async () => {
                 const res = await request(`course/${deleteData?.id}`, "delete");
                 if (res) { fetchingData(); setIsDelete(false); }
              }}>Yes, Delete</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* --- RESPONSIVE CONTENT SECTION --- */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 gap-3 text-[#003868]">
            <Loader2 className="w-10 h-10 animate-spin opacity-80" />
            <span className="font-medium animate-pulse text-sm">Loading curriculum...</span>
          </div>
        ) : course?.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 bg-white shadow-sm">
            <BookOpen className="w-12 h-12 mb-3 text-slate-300" />
            <p className="font-medium">No courses found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* MOBILE & TABLET CARDS (Hidden on large screens) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5">
              {course.map((item, index) => (
                <div key={item.id || index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col relative group">
                  {/* Status Overlay */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${item?.status ? 'bg-emerald-500/90 text-white' : 'bg-slate-800/80 text-white'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full bg-white ${item?.status ? 'animate-pulse' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-wider">{item?.status ? 'Active' : 'Offline'}</span>
                    </div>
                  </div>

                  {/* Course Image */}
                  <div className="w-full h-40 bg-slate-100 overflow-hidden relative">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      src={getImageUrl(item?.image)} 
                      alt={item?.title} 
                      onError={(e) => (e.target.src = "https://placehold.co/400x200?text=No+Cover+Image")} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                       <h3 className="text-white font-black text-lg leading-tight line-clamp-2">{item?.title}</h3>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="p-4 flex-1 flex flex-col gap-4">
                    <div className="bg-slate-50 text-slate-600 text-xs font-medium px-3 py-2 rounded-lg border border-slate-100">
                      {item?.description || "No level description"}
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <Clock className="w-4 h-4 text-slate-400" /> {item?.duration_hours}
                      </div>
                      <div className="flex items-center text-lg font-black text-emerald-600">
                        <DollarSign className="w-5 h-5 -mr-0.5" />{item?.price}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-slate-100">
                      <Button variant="secondary" className="bg-blue-50 hover:bg-blue-100 text-blue-700 h-9" onClick={() => onEdit(item)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button variant="outline" className="border-rose-100 text-rose-600 hover:bg-rose-50 h-9" onClick={() => onDelete(item)}>
                        <Trash className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP TABLE (Hidden on mobile/tablet) */}
            <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                  <TableRow className="hover:bg-slate-50/80">
                    {tbl_head.map((head, i) => (
                      <TableHead key={i} className="text-[10px] font-black uppercase tracking-widest text-[#003868] py-4">{head}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {course.map((item, index) => (
                    <TableRow key={item.id || index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                      <TableCell className="text-[11px] font-bold text-slate-400 text-center">{index + 1}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-100">
                            <img 
                              className="w-full h-full object-cover" 
                              src={getImageUrl(item?.image)} 
                              alt={item?.title} 
                              onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Img")} 
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-extrabold text-slate-800 leading-tight">{item?.title}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[11px] font-medium text-slate-600 px-2 py-1 bg-slate-100 rounded-md whitespace-nowrap">{item?.description}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {item?.duration_hours}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-black text-emerald-600 flex items-center">
                          <DollarSign className="w-3.5 h-3.5" />{item?.price}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${item?.status ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-500 border border-slate-200'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${item?.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                          <span className="text-[10px] font-black uppercase tracking-wider">{item?.status ? 'Active' : 'Offline'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span>Add: {formatDate(item?.created_at)}</span>
                          <span>Upd: {formatDate(item?.updated_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => onEdit(item)}>
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500 hover:bg-rose-50" onClick={() => onDelete(item)}>
                            <Trash className="w-3.5 h-3.5" />
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