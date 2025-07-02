import { useState } from "react";
import { Plus, Edit, Trash2, Search, Shield, User, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

// Mock user data - in a real app this would come from the API
const mockUsers = [
  {
    id: 1,
    email: "jusperkato@gmail.com",
    firstName: "Jusper",
    lastName: "Kato",
    username: "admin",
    role: "admin",
    isEmailVerified: true,
    isSubscribedToNewsletter: true,
    createdAt: new Date("2024-01-01"),
    lastLoginAt: new Date("2025-01-02"),
  },
  {
    id: 2,
    email: "editor@magalamedia.com",
    firstName: "Sarah",
    lastName: "Nakato",
    username: "editor1",
    role: "editor",
    isEmailVerified: true,
    isSubscribedToNewsletter: true,
    createdAt: new Date("2024-06-15"),
    lastLoginAt: new Date("2025-01-01"),
  },
  {
    id: 3,
    email: "user@example.com",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    role: "user",
    isEmailVerified: false,
    isSubscribedToNewsletter: false,
    createdAt: new Date("2024-12-01"),
    lastLoginAt: null,
  },
];

export default function UserManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    role: "user",
    isEmailVerified: false,
    isSubscribedToNewsletter: true,
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      username: "",
      role: "user",
      isEmailVerified: false,
      isSubscribedToNewsletter: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      toast({
        title: "Success",
        description: "User updated successfully!",
      });
      setIsEditModalOpen(false);
      setEditingUser(null);
    } else {
      toast({
        title: "Success",
        description: "User created successfully!",
      });
      setIsCreateModalOpen(false);
    }
    resetForm();
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isSubscribedToNewsletter: user.isSubscribedToNewsletter,
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    }
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case "editor":
        return <Badge className="bg-blue-100 text-blue-800">Editor</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">User</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <UserForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {user.firstName} {user.lastName}
                        </h3>
                        {getRoleBadge(user.role)}
                        {user.isEmailVerified && (
                          <Badge className="bg-green-100 text-green-800">Verified</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>Joined {formatDistanceToNow(user.createdAt, { addSuffix: true })}</span>
                        </div>
                        {user.lastLoginAt && (
                          <span>Last login {formatDistanceToNow(user.lastLoginAt, { addSuffix: true })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={user.role === "admin"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditingUser(null);
              resetForm();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface UserFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

function UserForm({ formData, setFormData, onSubmit, onCancel }: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            placeholder="username"
          />
        </div>

        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
          />
        </div>

        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="emailVerified"
              checked={formData.isEmailVerified}
              onCheckedChange={(checked) => setFormData({ ...formData, isEmailVerified: checked })}
            />
            <Label htmlFor="emailVerified">Email Verified</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="newsletter"
              checked={formData.isSubscribedToNewsletter}
              onCheckedChange={(checked) => setFormData({ ...formData, isSubscribedToNewsletter: checked })}
            />
            <Label htmlFor="newsletter">Newsletter Subscription</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save User
        </Button>
      </div>
    </form>
  );
}