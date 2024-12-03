import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const letterBStyle = {
    fontSize: "80px",
    fontWeight: "bold",
    color: "#3498db",
    textAlign: "left",
  };

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen">
      {/* Left Section */}
      <div className="flex-1 hidden lg:flex items-center justify-start">
        <div style={letterBStyle}>B-Tweet</div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <h1 className="text-5xl font-extrabold text-white mb-8 text-center">
          B-Tweet, let's go.
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>

          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>

          <button
            type="submit"
            className="btn rounded-full btn-primary text-white w-full"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Login"}
          </button>

          {isError && <p className="text-red-500 text-center">{error.message}</p>}
        </form>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-white text-lg">Don't have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
