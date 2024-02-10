import React, { useEffect, useState } from "react";

import Portal from "@components/Portal";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

const EditPost = ({ item, refetch }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);

    const { _id, ...newData } = data;

    privateInstance
      .patch(`/api/posts/${_id}`, newData)
      .then((res) => {
        refetch();
        toast.success("Successfully updated the post!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (item) {
      setValue("_id", item._id);
      setValue("title", item.title);
    }
  }, [item]);

  return (
    <Portal>
      <form
        className="modal fade"
        id="editPostModal"
        tabIndex="-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Post</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-2" hidden>
                <label>ID</label>
                <input
                  className="form-control"
                  type="text"
                  {...register("_id", { required: true })}
                />
              </div>
              <div className="mb-2">
                <label>Title</label>
                <input
                  className="form-control"
                  type="text"
                  {...register("title", { required: true })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </Portal>
  );
};

export default EditPost;
