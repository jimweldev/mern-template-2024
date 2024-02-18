import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

import Portal from "@components/Portal";

const AddUser = ({ refetchUsers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerAddUser,
    handleSubmit: handleSubmitAddUser,
    formState: { errors: errorsAddUser },
    reset: resetAddUser,
    setFocus: setFocusAddUser,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);

    privateInstance
      .post(`/api/users`, data)
      .then((res) => {
        resetAddUser();

        setTimeout(() => {
          setFocusAddUser("title");
        }, 0);

        refetchUsers();
        toast.success("Successfully created a user!");
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
        id="addUserModal"
        tabIndex="-1"
        onSubmit={handleSubmitAddUser(onSubmit)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Add User</h1>
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
                  {...registerAddUser("title", { required: true })}
                />
                <div>
                  {errorsAddUser.title && (
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

export default AddUser;
