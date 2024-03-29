import React, { useState } from "react";

import Portal from "@components/Portal";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

const DeletePost = ({ selectedPost, refetchPosts }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit: handleSubmitDeletePost } = useForm();

  const onSubmit = () => {
    setIsLoading(true);

    privateInstance
      .delete(`/api/posts/${selectedPost._id}`)
      .then(() => {
        refetchPosts();
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
        onSubmit={handleSubmitDeletePost(onSubmit)}
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
              <p className="fs-5">
                Are you sure you want to delete <b>"{selectedPost?.title}"</b>?
              </p>
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
