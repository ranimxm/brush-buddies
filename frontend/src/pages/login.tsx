import { Helmet } from "react-helmet-async";
import { TextField, Button } from "@mui/material";
import { SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pages } from "../util/pages";

export const Login = () => {
  const [nameInput, setNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const handleNameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setNameInput(e.target.value);
    if (e.target.value) {
      setError((prev) => ({ ...prev, name: "" }));
    }
  };

  const handlePasswordChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setPasswordInput(e.target.value);
    if (e.target.value) {
      setError((prev) => ({ ...prev, password: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: "", password: "" };

    if (!nameInput) {
      valid = false;
      errors.name = "Username is required";
    }
    if (!passwordInput) {
      valid = false;
      errors.password = "Password is required";
    }

    setError(errors);
    return valid;
  };

  const submitForm = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validateForm()) {
      navigate({ pathname: pages.HOME });
      console.log("form is submitted!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Log in</title>
      </Helmet>
      <section className="flex flex-col items-center min-h-screen py-10">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={submitForm}>
            <div className="flex flex-col items-center gap-4">
              <TextField
                fullWidth
                label="Username"
                variant="standard"
                onChange={handleNameChange}
                error={!!error.name}
                helperText={error.name}
                sx={{ height: "4em" }}
              />
              <TextField
                fullWidth
                label="Password"
                variant="standard"
                type="password"
                onChange={handlePasswordChange}
                error={!!error.password}
                helperText={error.password}
                sx={{ height: "4em" }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ color: "white" }}
              >
                Log in
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};
