import React, { useState } from "react";
import { privateInstance } from "@axios/interceptor";
import { useQuery } from "@tanstack/react-query";

// hooks
import useDebounce from "@hooks/useDebounce";

// components
import Table from "@components/Table";
import TableField from "@components/TableField";
import TableFallback from "@components/TableFallback";

import AddPost from "./AddPost";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

import { FaPenToSquare, FaTrashCan } from "react-icons/fa6";

const Home = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("_id");
  const [page, setPage] = useState(1);

  const debouncedSearchTerm = useDebounce(search, 200);

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: [
      "posts/paginate",
      { page, limit, sort, search: debouncedSearchTerm },
    ],
    queryFn: () =>
      privateInstance
        .get(
          `/api/posts/paginate?page=${page}&limit=${limit}&sort=${sort}&search=${debouncedSearchTerm}`
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
  const handlePage = (page) => setPage(page);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Home</h1>
        <button
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#addPostModal"
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
            data={posts}
          >
            <thead>
              <tr>
                <th onClick={() => handleSort("_id")}>
                  <TableField column="ID" field="_id" sort={sort} />
                </th>
                <th onClick={() => handleSort("title")}>
                  <TableField column="Title" field="title" sort={sort} />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* has records */}
              {!isLoadingPosts &&
                !isErrorPosts &&
                posts?.records.length !== 0 &&
                posts?.records.map((post) => {
                  return (
                    <tr key={post._id}>
                      <td>{post._id}</td>
                      <td>{post.title}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            title="Edit"
                            className="btn btn-info btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#editPostModal"
                            onClick={() => {
                              setSelectedPost(post);
                            }}
                          >
                            <FaPenToSquare />
                          </button>
                          <button
                            title="Delete"
                            className="btn btn-danger btn-sm"
                            data-bs-toggle="modal"
                            data-bs-target="#deletePostModal"
                            onClick={() => {
                              setSelectedPost(post);
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
                isLoading={isLoadingPosts}
                isError={isErrorPosts}
                dataLength={posts?.records.length}
              />
            </tbody>
          </Table>
        </div>
      </div>

      <AddPost refetchPosts={refetchPosts} />
      <EditPost selectedPost={selectedPost} refetchPosts={refetchPosts} />
      <DeletePost selectedPost={selectedPost} refetchPosts={refetchPosts} />
    </>
  );
};

export default Home;
