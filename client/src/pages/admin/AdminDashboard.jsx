import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://digitalstore-p5is.onrender.com/api/users/all");
        const userData = response.data.users || []; // Correctly access 'users'
        setUsers(userData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);
  

  console.log('Users data:', users);

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!users.length) return <div>No users found</div>

  return (
    <Table>
      <TableCaption>A list of all users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user._id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Button className="text-blue-600 hover:text-blue-800">
                Edit
              </Button>
              <Button className="text-blue-600 hover:text-blue-800 ml-2">
                delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default AdminDashboard;
