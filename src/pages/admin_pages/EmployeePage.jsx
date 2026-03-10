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
  Users,
  Mail,
  Phone,
  Calendar,
} from "lucide-react"; // ✅ Added icons for mobile cards
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

export default function EmployeePage() {
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const [form, setForm] = useState({
    id: "",
    full_name: "",
    address: "",
    email: "",
    gender: "",
    birthday: "",
    phone: "",
    position: "",
    status: true,
  });

  const tbl_head = [
    "No", // 1. Identifier
    "Full Name", // 2. Primary ID
    "Position", // 3. Role (Crucial context right next to the name)
    "Email", // 4. Primary Contact
    "Phone Number", // 5. Secondary Contact
    "Gender", // 6. Demographics
    "Birthday", // 7. Personal Details
    "Status", // 8. Administrative State (Active/Inactive)
    "Created At", // 9. System Logs
    "Updated At", // 10. System Logs
    "Action", // 11. Controls (Always last)
  ];

  // LOGIC UNTOUCHED
  const fetchingData = async () => {
    setLoading(true);
    try {
      const res = await request("employee", "get");
      if (res) {
        setEmployee(res?.data);
      }
    } catch (error) {
      console.error("Failed to fetch employees:", error);
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
    // ✅ Matches the MongoDB schema exactly
    formData.append("full_name", form?.full_name || "");
    formData.append("gender", form?.gender || "");
    formData.append("birthday", form?.birthday || "");
    formData.append("address", form?.address || "");
    formData.append("email", form?.email || "");
    formData.append("phone", form?.phone || "");
    formData.append("position", form?.position || "");

    // Status is perfect! Converts boolean true/false to 1 or 0
    formData.append("status", form?.status ? 1 : 0);
    try {
      let res;

      if (isEdit) {
        formData.append("_method", "PUT");
        res = await request(`employee/${form?.id}`, "post", formData);
        if (res) console.log("Updated employee : ", res);
      } else {
        res = await request("employee", "post", formData);
        if (res) console.log("Created employee : ", res);
      }

      if (res) {
        fetchingData();
        setIsOpen(false);
        setIsEdit(false);
        setForm({
          id: "",
          full_name: "",
          address: "",
          email: "",
          gender: "",
          birthday: "",
          phone: "",
          position: "",
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
            <Users className="w-6 h-6 text-[#003868]" /> employees
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your teaching staff, contact details, and specializations.
          </p>
        </div>

        <div className="flex justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#003868] hover:bg-[#00284d] text-white shadow-sm w-full md:w-auto">
                <Plus className="mr-2 w-4 h-4" />
                Add employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-[#003868]">
                  {isEdit ? "Update employee" : "Create employee"}
                </DialogTitle>
                <DialogDescription>
                  Fill in the employee details below.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmit} className="mt-4">
                <div className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        Full Name
                      </Label>
                      <Input
                        value={form?.full_name}
                        onChange={(e) =>
                          setForm({ ...form, full_name: e.target.value })
                        }
                        placeholder="e.g. John"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        Gender
                      </Label>
                      <Input
                        value={form?.gender}
                        onChange={(e) =>
                          setForm({ ...form, gender: e.target.value })
                        }
                        placeholder="e.g. Doe"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        type="number"
                        value={form?.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="e.g. 012345678"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={form?.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="john.doe@example.com"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                     Birthday
                      </Label>
                      <Input
                        type="birthday"
                        value={form?.birthday}
                        onChange={(e) =>
                          setForm({ ...form, birthday: e.target.value })
                        }
                        placeholder="e.g. 2022-01-28"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        Address
                      </Label>
                      <Input
                        type=""
                        value={form?.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="e.g. Phnom peng"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        position
                      </Label>
                      <Input
                        value={form?.position}
                        onChange={(e) =>
                          setForm({ ...form, position: e.target.value })
                        }
                        placeholder="e.g. Web Development"
                        required
                        className="bg-slate-50 focus-visible:ring-[#003868]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="text-slate-700 font-semibold">
                        Status
                      </Label>
                      <Select
                        value={String(form?.status)}
                        onValueChange={(value) =>
                          setForm({ ...form, status: value === "true" })
                        }
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
                        full_name: "",
                        address: "",
                        email: "",
                        gender: "",
                        birthday: "",
                        phone: "",
                        position: "",
                        status: true,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="px-8 bg-[#003868] hover:bg-[#00284d]"
                  >
                    {isEdit ? "Update" : "Save"}
                  </Button>
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
          <span className="font-medium animate-pulse text-sm">
            Syncing employees...
          </span>
        </div>
      ) : employee?.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
          <Users className="w-12 h-12 mb-3 text-slate-300" />
          <p className="font-medium">No employees found in the database.</p>
        </div>
      ) : (
        <>
          {/* MOBILE & TABLET CARDS (Hidden on large screens) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:hidden gap-4">
            {employee.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white border rounded-xl p-5 shadow-sm space-y-4 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-none">
                      {item?.full_name}
                    </h3>
                    <p className="text-sm font-semibold text-[#003868] mt-1 line-clamp-1">
                      {item?.position || "No Specialization"}
                    </p>
                  </div>
                  {item?.status ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
                  )}
                </div>

                <div className="flex flex-col gap-3 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="truncate font-medium">
                      {item?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="font-medium">{item?.phone || "N/A"}</span>
                  </div>
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
          <div className="hidden lg:block border rounded-xl bg-white shadow-sm overflow-hidden border-slate-200">
            <Table>
              <TableHeader className="bg-[#003868]">
                <TableRow className="hover:bg-[#003868]">
                  {tbl_head?.map((item, index) => (
                    <TableHead
                      key={index}
                      className="whitespace-nowrap text-white font-bold py-4"
                    >
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {employee.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"} hover:bg-blue-50/50 group transition-colors`}
                  >
                    <TableCell className="font-medium text-slate-500">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                      {item?.full_name}
                    </TableCell>
                    <TableCell>
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 text-[#003868] text-xs font-bold border border-blue-100 whitespace-nowrap">
                        {item?.position}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item?.email}
                    </TableCell>
                    <TableCell className="text-slate-600 whitespace-nowrap">
                      {item?.phone}
                    </TableCell>
                    <TableCell className="text-slate-600 whitespace-nowrap">
                      {item?.gender}
                    </TableCell>{" "}
                    <TableCell className="text-slate-600 whitespace-nowrap">
                      {item?.birthday}
                    </TableCell>
                    <TableCell>
                      {item?.status ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-semibold text-emerald-700">
                            Active
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                          <span className="text-xs font-semibold text-rose-700">
                            Inactive
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[11px] text-slate-400 font-medium">
                      {formatDate(item?.created_at)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-[11px] text-slate-400 font-medium">
                      {formatDate(item?.updated_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* --- CLASSIC EDIT BUTTON --- */}
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-none border-slate-300 text-[#003868] bg-white hover:bg-slate-50 hover:border-[#003868] transition-colors"
                          onClick={() => onEdit(item)}
                          title="Edit Employee"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        {/* --- CLASSIC DELETE BUTTON --- */}
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 rounded-none border-slate-300 text-red-600 bg-white hover:bg-red-50 hover:border-red-600 transition-colors"
                          onClick={() => onDelete(item)}
                          title="Delete Employee"
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

      {/* --- Delete Modal --- */}
      <Dialog open={isDelete} onOpenChange={setIsDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">
              Delete employee
            </DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to delete{" "}
              <strong className="text-rose-500">
                {deleteData?.first_name} {deleteData?.last_name}
              </strong>
              ? This action cannot be undone.
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
              className="px-6"
              onClick={async () => {
                try {
                  const res = await request(
                    `employee/${deleteData?.id || deleteData?._id}`,
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
    </div>
  );
}
