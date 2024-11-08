"use client";
import { useEffect, useState } from "react";
import { User } from "../types/User";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api");
      if (res.ok) {
        const data: User[] = await res.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}){user.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
}
