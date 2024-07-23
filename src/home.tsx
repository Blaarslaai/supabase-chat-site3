import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./context";
import { supabase } from "./supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import bg from "./assets/hero.jpg";

export default function Home({ session }: any) {
  const context = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          context.setProfile(data);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  if (session && loading) {
    return (
      <>
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg pt-24" />
        </div>
      </>
    );
  } else if (!session) {
    return (
      <>
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-5xl">
              <h1 className="mb-5 text-5xl font-bold">
                You are not currently logged in
              </h1>
              <p className="mb-5 pt-10">
                Please{" "}
                <button
                  className="btn"
                  onClick={() => context.setCurrentPage("LOGIN")}
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  Login
                </button>{" "}
                or{" "}
                <button
                  className="btn"
                  onClick={() => context.setCurrentPage("SIGN UP")}
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  Sign Up
                </button>{" "}
                to continue.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-5xl">
            <h1 className="mb-5 text-5xl font-bold">
              Welcome to your homepage
            </h1>
            <p className="mb-5 pt-10">
              Please continue reading for a complete understanding of this
              website.
            </p>
            <p>TEST</p>
          </div>
        </div>
      </div>
    </>
  );
}
