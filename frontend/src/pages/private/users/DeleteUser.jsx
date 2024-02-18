import React, { useState } from "react";

import Portal from "@components/Portal";
import { useForm } from "react-hook-form";
import { privateInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

const DeleteUser = ({ selectedUser, refetchUsers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit: handleSubmitDeleteUser } = useForm();

  const onSubmit = () => {
    setIsLoading(true);

    privateInstance
      .delete(`/api/users/${selectedUser._id}`)
      .then(() => {
        refetchUsers();
        toast.success("Successfully deleted the user!");

        // close modal
        document.getElementById("deleteUserModalClose").click();
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
        id="deleteUserModal"
        tabIndex="-1"
        onSubmit={handleSubmitDeleteUser(onSubmit)}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Delete User</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <p className="fs-5">
                Are you sure you want to delete <b>"{selectedUser?.name}"</b>?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                id="deleteUserModalClose"
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

export default DeleteUser;
