import React, { useState } from "react";

import Portal from "@components/Portal";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

const DeletePost = ({ item, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit } = useForm();

  const onSubmit = () => {
    setIsLoading(true);

    privateInstance
      .delete(`/api/posts/${item._id}`)
      .then((res) => {
        refetch();
        toast.success("Successfully deleted the post!");

        // close modal
        document.getElementById("deletePostModalClose").click();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Portal>
      <form
        className="modal fade"
        id="deletePostModal"
        tabIndex="-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Delete Post</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <h4>Are you sure you want to delete "{item?.title}"?</h4>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                id="deletePostModalClose"
                type="button"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Portal>
  );
};

export default DeletePost;
