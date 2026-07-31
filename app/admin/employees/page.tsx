'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'employee';
  department: string | null;
  created_at: string;
}

export default function EmployeeManagementPage() {
  const supabase = createClient();
  const [employees, setEmployees] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Profile | null>(null);

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch employees
  const fetchEmployees = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setEmployees(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle Add New Employee
  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          department: department || null,
          role: role,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setIsAddModalOpen(false);
    resetForm();
    fetchEmployees();
  };

  // Handle Update Employee Profile
  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName,
        department: department || null,
        role: role,
      })
      .eq('id', editingEmployee.id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setEditingEmployee(null);
    resetForm();
    fetchEmployees();
  };

  // Handle Delete Employee
  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee profile?')) return;

    const { error } = await supabase.from('profiles').delete().eq('id', id);

    if (error) {
      alert(error.message);
    } else {
      fetchEmployees();
    }
  };

  const openEditModal = (employee: Profile) => {
    setEditingEmployee(employee);
    setFullName(employee.full_name);
    setDepartment(employee.department || '');
    setRole(employee.role);
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setDepartment('');
    setRole('employee');
    setErrorMsg('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage user roles, departments, and access</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Employee
        </button>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading team members...</div>
        ) : employees.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No employees found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{emp.full_name}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{emp.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      emp.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {emp.department ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {emp.department}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(emp)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(emp.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Register New Employee</h2>
            
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="Engineering, HR, Marketing..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Employee Details</h2>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'employee' | 'admin')}
                  className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}