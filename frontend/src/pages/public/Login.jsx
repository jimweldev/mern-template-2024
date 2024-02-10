import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { publicInstance } from "@axios/interceptor";
import { toast } from "react-toastify";

// stores
import useAuthStore from "@store/authStore";

const Login = () => {
  const { setAuth } = useAuthStore((state) => ({
    setAuth: state.setAuth,
  }));

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    publicInstance
      .post("/api/auth/login", data)
      .then(function (response) {
        setAuth(response.data.user);
        localStorage.setItem("accessToken", response.data.accessToken);
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        className="card form login mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="card-body">
          <h3 className="text-center">{import.meta.env.VITE_APP_TITLE}</h3>

          <div className="mb-2">
            <label>Username</label>
            <input
              className="form-control"
              type="text"
              {...register("email", { required: true })}
            />
            <div className="form-text text-danger">
              {errors.email && "This field is required"}
            </div>
          </div>

          <div className="mb-2">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              {...register("password", { required: true })}
            />
            <div className="form-text text-danger">
              {errors.password && "This field is required"}
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner-grow spinner-grow-sm me-2"></div>
                <span>Loading...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
