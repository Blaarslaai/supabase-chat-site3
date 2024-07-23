import { useContext, useState } from "react";
import { supabase } from "./supabaseClient";
import { GlobalContext } from "./context";

export default function SignUp() {
  const context = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: any) => {
    console.log(password);
    console.log(email);

    e.preventDefault();

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      alert(error.name || error.message);
    } else {
      console.log(data);
      context.setCurrentPage("HOME");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign up now!</h1>
            <p className="py-6">
              Enter your registered email and password to sign up to the system.
              <br />
              <br />
              Already have an account?{" "}
              <a
                className="link"
                onClick={() => context.setCurrentPage("LOGIN")}
              >
                Login
              </a>{" "}
              here!
            </p>
            <p className="float-right pt-10">
              <button
                className="btn btn-primary"
                onClick={() => context.setCurrentPage("HOME")}
              >
                Go back Home
              </button>
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form className="card-body" onSubmit={handleSignup}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  className="input input-bordered"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  className="input input-bordered"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button className="btn">
                  <span className={`${loading && "loading loading-spinner"}`} />
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
