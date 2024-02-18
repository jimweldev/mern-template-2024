import React, { useEffect, useState } from "react";

import Portal from "@components/Portal";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

const EditUser = ({ selectedUser, refetchUsers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerEditUser,
    handleSubmit: handleSubmitEditUser,
    formState: { errors: errorsEditUser },
    setValue: setValueEditUser,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);

    const { _id, ...newData } = data;

    privateInstance
      .patch(`/api/users/${_id}`, newData)
      .then(() => {
        refetchUsers();
        toast.success("Successfully updated the user!");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (selectedUser) {
      setValueEditUser("_id", selectedUser._id);
      setValueEditUser("name", selectedUser.name);
      setValueEditUser("status", selectedUser.status);
    }
  }, [selectedUser]);

  return (
    <Portal>
      <form
        className="modal fade"
        id="editUserModal"
        tabIndex="-1"
        onSubmit={handleSubmitEditUser(onSubmit)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit User</h1>
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
                  {...registerEditUser("_id", { required: true })}
                />
              </div>
              <div className="mb-2">
                <label>Name</label>
                <input
                  className="form-control"
                  type="text"
                  {...registerEditUser("name", { required: true })}
                />
                <div>
                  {errorsEditUser.name && (
                    <div className="text-danger small">
                      This field is required
                    </div>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <label>Status</label>
                <select
                  className="form-select"
                  {...registerEditUser("status", { required: true })}
                >
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
                <div>
                  {errorsEditUser.status && (
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

export default EditUser;
