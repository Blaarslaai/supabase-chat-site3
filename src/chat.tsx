import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { supabase } from "./supabaseClient";
import { GlobalContext } from "./context";
import Avatar from "./avatar";

export default function Chat({ session }: any) {
  const context = useContext(GlobalContext);
  const bottomRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<any>([]);
  const { user } = session;
  const [updatesRan, setUpdatesRan] = useState(false);

  async function updateChatsSeen(data: any) {
    const modifyData = (updatedChats: any) => {
      return updatedChats.map((profile: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { profiles, ...rest } = profile;
        return {
          ...rest,
        };
      });
    };

    const updates = modifyData(data).map(async (chat: any) => {
      const { error } = await supabase
        .from("chats")
        .update({ chat_seen: true, chat_read: new Date() })
        .eq("id", chat.id)
        .eq("chat_seen", false)
        .neq("user_id", context.profile.id);

      if (error) {
        console.error("Error updating data:", error);
      }
    });

    await Promise.all(updates);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  async function getChats(ignore: boolean) {
    setLoading(true);

    const { data, error } = await supabase
      .from("chats")
      .select(
        `
  *,
  profiles:chats_user_id_fkey1!inner(*)
`
      )
      .or(`user_id.eq.${user.id},chat_user_id.eq.${user.id}`);

    if (!ignore) {
      if (error) {
        console.warn(error);
      } else if (data) {
        const filteredData = data.filter(
          (value) => value.chat_user_id === context.userID
        );

        setChats(filteredData);
        console.log(filteredData);

        if (!updatesRan) {
          updateChatsSeen(data);
          setUpdatesRan(true);
        }
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    let ignore = false;
    getChats(ignore);

    return () => {
      ignore = true;
    };
  }, [session]);

  const [formData, setFormData] = useState({
    inputText: "",
  });

  const addChat = (payload: any) => {
    console.log("New chat inserted:", payload.new);

    const payloadWithAvatarUrl = {
      ...payload.new,
      profiles: {
        avatar_url: context.profile.avatar_url,
        username: context.profile.username,
      },
    };

    setChats((prevChats: any) => [...prevChats, payloadWithAvatarUrl]);
  };

  const formatTime = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("default", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const channel = supabase
      .channel("chats")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chats" },
        addChat
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert("Form Data Submitted: " + formData.inputText);
    // You can send formData to a server here or do any other necessary actions
    const newChat = {
      user_id: user.id,
      chat_text: formData.inputText,
      chat_user_id: context.userID,
      chat_sent: new Date(),
    };

    const { error } = await supabase.from("chats").insert([newChat]);

    if (error) {
      console.log(error);
    } else {
      setFormData({ inputText: "" });
    }
  };

  if (loading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <>
      <h1>Chat</h1>
      <div className="collapse-open bg-base-200 rounded-lg pt-10">
        <div className="collapse-content">
          <div>
            {chats.map((chat: any) => (
              <div
                className={`chat ${
                  user.id === chat.user_id
                    ? "chat-start"
                    : user.id === chat.chat_user_id
                    ? "chat-end"
                    : null
                }`}
                key={chat.id}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <Avatar url={chat.profiles.avatar_url} showUpload={false} />
                  </div>
                </div>
                <div className="chat-header">
                  {chat.profiles.username}
                  <time className="text-xs opacity-50">
                    {" " + formatTime(chat.chat_sent)}
                  </time>
                </div>
                <div className="chat-bubble">{chat.chat_text}</div>
                <div className="chat-footer opacity-50 text-xs">
                  {chat.chat_seen
                    ? "Seen " + formatTime(chat.chat_read)
                    : "Delivered"}
                </div>
              </div>
            ))}

            {/* Typing Input */}
            <form onSubmit={handleSubmit} className="pt-16">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Type..."
                  name="inputText"
                  value={formData.inputText}
                  onChange={handleChange}
                />
                <div className="h-4 w-4 flex items-center justify-center">
                  <button className="btn btn-ghost" type="submit">
                    <FontAwesomeIcon icon={faComment} />
                  </button>
                </div>
              </label>
            </form>

            <div ref={bottomRef}></div>
          </div>
        </div>
      </div>
    </>
  );
}
