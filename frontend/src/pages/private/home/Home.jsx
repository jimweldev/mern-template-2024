import React, { useState } from "react";
import { privateInstance } from "@axios/interceptor";

// components
import Table from "@/components/Table";
import TableField from "@/components/TableField";
import TableFallback from "@/components/TableFallback";

// hooks
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import AddPost from "./AddPost";
import EditPost from "./EditPost";
import DeletePost from "./DeletePost";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("_id");
  const [page, setPage] = useState(1);

  const debouncedSearchTerm = useDebounce(search, 200);

  const {
    data: posts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["posts", { page, limit, sort, search: debouncedSearchTerm }],
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

  const [content, setContent] = useState("");

  const handleContentChange = (data) => {
    setContent(data);
  };

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
              {!isLoading &&
                !isError &&
                posts?.records.length !== 0 &&
                posts?.records.map((post) => {
                  return (
                    <tr key={post._id}>
                      <td>{post._id}</td>
                      <td>{post.title}</td>
                      <td>
                        <button
                          className="btn btn-info btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#editPostModal"
                          onClick={() => {
                            setSelectedItem(post);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          data-bs-toggle="modal"
                          data-bs-target="#deletePostModal"
                          onClick={() => {
                            setSelectedItem(post);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}

              <TableFallback
                isLoading={isLoading}
                isError={isError}
                dataLength={posts?.records.length}
              />
            </tbody>
          </Table>
        </div>
      </div>

      <AddPost refetch={refetch} />
      <EditPost item={selectedItem} refetch={refetch} />
      <DeletePost item={selectedItem} refetch={refetch} />
    </>
  );
};

export default Home;
