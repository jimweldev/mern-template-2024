import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

import Portal from "@components/Portal";

const AddPost = ({ refetchPosts }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerAddPost,
    handleSubmit: handleSubmitAddPost,
    formState: { errors: errorsAddPost },
    reset: resetAddPost,
    setFocus: setFocusAddPost,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);

    privateInstance
      .post(`/api/posts`, data)
      .then((res) => {
        resetAddPost();

        setTimeout(() => {
          setFocusAddPost("title");
        }, 0);

        refetchPosts();
        toast.success("Successfully created a post!");
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
        id="addPostModal"
        tabIndex="-1"
        onSubmit={handleSubmitAddPost(onSubmit)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add Post</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label>Title</label>
                <input
                  className="form-control"
                  type="text"
                  {...registerAddPost("title", { required: true })}
                />
                <div>
                  {errorsAddPost.title && (
                    <div className="text-danger small">
                      This field is required
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Portal>
  );
};

export default AddPost;
