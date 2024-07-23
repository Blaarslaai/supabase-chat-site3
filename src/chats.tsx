import { useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Avatar from "./avatar";
import { GlobalContext } from "./context";

export default function Chats({ session }: any) {
  const context = useContext(GlobalContext);

  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<any>([]);

  useEffect(() => {
    let ignore = false;
    async function getProfile() {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id);

      if (!ignore) {
        if (error) {
          console.warn(error);
        } else if (data) {
          setProfiles(data);
        }
      }

      setLoading(false);
    }

    getProfile();

    return () => {
      ignore = true;
    };
  }, [session]);

  if (loading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <div className="flex justify-center">
        {profiles.map((profile: any) => (
          <div className="m-5" key={profile.id}>
            <Avatar url={profile.avatar_url} size={100} showUpload={false} />
            <div>{profile.username}</div>
            <button
              onClick={() => {
                context.setCurrentPage("USER CHAT");
                context.setUserID(profile.id);
                context.setUserAvatarUrl(profile.avatar_url);
              }}
            >
              Chat
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
