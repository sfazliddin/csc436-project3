"use client";

import { registerUser } from "csc-start/utils/data";
import { useReducer } from "react";
import { useRouter } from "next/navigation";
import useUserMustBeLogged from "csc-start/hooks/useUserMustBeLogged";
import useUser from "csc-start/hooks/useUser";

const Register = () => {
  const { user } = useUser();
  useUserMustBeLogged(user, "out", "/profile");
  const router = useRouter();

  function reducer(state, action) {
    switch (action.type) {
      case "email":
      case "name":
      case "password":
        return { ...state, [action.type]: action.value };
      case "loading":
        return { ...state, loading: action.loading };
      case "response":
        return { ...state, response: action.response };
    }

    throw Error("Unknown action." + action.type);
  }

  const initialState = {
    email: "",
    name: "",
    password: "",
    response: "",
    loading: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, name, password, response, loading } = state;

  const register = async (e) => {
    dispatch({ type: "loading", loading: true });
    e.preventDefault();

    const response = await registerUser(email, password, name);
    dispatch({ type: "response", response });
    dispatch({ type: "loading", loading: false });
    if (!!response?.success) {
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  return (
    <div className="barge">
      {response && (
        <div
          className={`${
            response.success
              ? "bg-green-200 border-2 border-green-800 text-green-800"
              : "bg-red-200 border-2 border-red-800 text-red-800"
          } py-2 px-5 my-10 text-center`}
        >
          <span className="font-bold">
            {response.success
              ? `Success ${response.message}`
              : `Failure: ${response.error.message}`}
          </span>
        </div>
      )}
      <h2 className="my-10 h1 text-center">Register</h2>
      <form
        onSubmit={register}
        className={loading ? "opacity-[10%] pointer-events-none" : ""}
      >
        {/* ["email", "name", "slug", "password", "response", "loading"] */}
        {Object.keys(initialState)
          .filter((k) => !["response", "loading"].includes(k))
          .map((key) => {
            let type = "text";
            if (key === "password") {
              type = "password";
            } else if (key === "email") {
              type = "email";
            }

            return (
              <p key={key} className="mb-5">
                <label className="h3 capitalize w-[75px] inline-block">
                  {key}*
                </label>
                <input
                  className="h3 border-2 border-black ml-5 inline-block w-[220px] px-2"
                  required
                  name={key}
                  onChange={(e) => {
                    dispatch({ type: e.target.name, value: e.target.value });
                  }}
                  value={state[key]}
                  type={type}
                />
              </p>
            );
          })}
        <div className="flex justify-center my-10">
          <input className="button small" type="submit"></input>
        </div>
      </form>
    </div>
  );
};

export default Register;
