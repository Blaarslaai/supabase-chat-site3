import { useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient";
import Account from "./account";
import { Session } from "@supabase/supabase-js";
import Login from "./login";
import SignUp from "./signUp";
import Home from "./home";
import { GlobalContext } from "./context";
import Chats from "./chats";
import Chat from "./chat";
import Avatar from "./avatar";

export default function App() {
  const context = useContext(GlobalContext);

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <div className="navbar bg-base-100 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={() => context.setCurrentPage("HOME")}>Homepage</a>
              </li>
              {session && (
                <li>
                  <a onClick={() => context.setCurrentPage("ACCOUNT")}>
                    Account
                  </a>
                </li>
              )}
              {session && (
                <li>
                  <a onClick={() => context.setCurrentPage("CHAT")}>Chat</a>
                </li>
              )}
              {!session &&
                (context.currentPage === "SIGN UP" ||
                  context.currentPage === "HOME") && (
                  <li>
                    <a onClick={() => context.setCurrentPage("LOGIN")}>Login</a>
                  </li>
                )}
              {!session &&
                (context.currentPage === "LOGIN" ||
                  context.currentPage === "HOME") && (
                  <li>
                    <a onClick={() => context.setCurrentPage("SIGN UP")}>
                      Sign Up
                    </a>
                  </li>
                )}
              {session && (
                <li>
                  <a
                    onClick={() => (
                      context.setCurrentPage("HOME"), supabase.auth.signOut()
                    )}
                  >
                    Sign Out
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="navbar-center">
          <span className="text-xl">Chat / Authentication Application</span>
        </div>
        <div className="navbar-end">
          {session && context.profile && context.profile.avatar_url && (
            <Avatar
              url={context.profile.avatar_url}
              size={35}
              showUpload={false}
            />
          )}
        </div>
      </div>

      <div>
        {context.currentPage === "LOGIN" && <Login />}
        {context.currentPage === "SIGN UP" && <SignUp />}
        {context.currentPage === "HOME" && (
          <Home key={session?.user.id} session={session} />
        )}
        {context.currentPage === "USER CHAT" && (
          <Chat key={session?.user.id} session={session} />
        )}
        {context.currentPage === "CHAT" && (
          <Chats key={session?.user.id} session={session} />
        )}
        {context.currentPage === "ACCOUNT" && (
          <Account key={session?.user.id} session={session} />
        )}
      </div>

      <footer className="footer footer-center bg-base-100 text-base-content p-4 sticky bottom-0">
        <aside>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
      </footer>
    </>
  );
}
