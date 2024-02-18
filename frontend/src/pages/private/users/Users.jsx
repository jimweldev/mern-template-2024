import React, { useState } from "react";
import { privateInstance } from "@axios/interceptor";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

// hooks
import useDebounce from "@hooks/useDebounce";

// components
import Table from "@components/Table";
import TableField from "@components/TableField";
import TableFallback from "@components/TableFallback";

import AddUser from "./AddUser";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";

import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("_id");
  const [page, setPage] = useState(1);

  const debouncedSearchTerm = useDebounce(search, 200);

  const {
    data: users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: [
      "users/paginate",
      { page, limit, sort, search: debouncedSearchTerm },
    ],
    queryFn: () =>
      privateInstance
        .get(
          `/api/users/paginate?page=${page}&limit=${limit}&sort=${sort}&search=${debouncedSearchTerm}`
        )
        .then((res) => res.data),
    keepPreviousData: true,
  });

  const handleSearch = (search) => {
    setPage(1);
    setSearch(search);
  };

  const handleLimit = (limit) => {
    setPage(1);
    setLimit(limit);
  };

  const handleSort = (field) => {
    field === sort ? setSort(`-${field}`) : setSort(field);
    setPage(1);
  };

  const handlePage = (page) => {
    setPage(page);
  };

  const handleAdminChange = (e, user) => {
    const isChecked = e.target.checked;

    privateInstance
      .patch(`/api/users/${user._id}`, { isAdmin: isChecked })
      .then(() => {
        refetchUsers();
        toast.success("Successfully updated the user!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Home</h1>
        <button
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#addUserModal"
        >
          Add
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <Table
            handleSearch={handleSearch}
            handleLimit={handleLimit}
            handlePage={handlePage}
            limit={limit}
            page={page}
            data={users}
          >
            <thead>
              <tr>
                <th onClick={() => handleSort("_id")}>
                  <TableField column="ID" field="_id" sort={sort} />
                </th>
                <th onClick={() => handleSort("name")}>
                  <TableField column="Name" field="name" sort={sort} />
                </th>
                <th onClick={() => handleSort("status")}>
                  <TableField column="Status" field="status" sort={sort} />
                </th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* has records */}
              {!isLoadingUsers &&
                !isErrorUsers &&
                users?.records.length !== 0 &&
                users?.records.map((user) => {
                  return (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>
                        {user.status === "enabled" ? (
                          <span className="badge bg-success">enabled</span>
                        ) : (
                          <span className="badge bg-danger">disabled</span>
                        )}
                      </td>
                      <td>
                        <div className="form-check form-switch mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={user.isAdmin}
                            onChange={(e) => {
                              handleAdminChange(e, user);
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            title="Edit"
                            className="btn btn-info btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#editUserModal"
                            onClick={() => {
                              setSelectedUser(user);
                            }}
                          >
                            <FaPenToSquare />
                          </button>
                          <button
                            title="Delete"
                            className="btn btn-danger btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#deleteUserModal"
                            onClick={() => {
                              setSelectedUser(user);
                            }}
                          >
                            <FaTrashCan />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

              <TableFallback
                isLoading={isLoadingUsers}
                isError={isErrorUsers}
                dataLength={users?.records.length}
              />
            </tbody>
          </Table>
        </div>
      </div>

      <AddUser refetchUsers={refetchUsers} />
      <EditUser selectedUser={selectedUser} refetchUsers={refetchUsers} />
      <DeleteUser selectedUser={selectedUser} refetchUsers={refetchUsers} />
    </>
  );
};

export default Users;
