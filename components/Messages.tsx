"use client";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import Message from "./Message";
import { MessageModelTypes } from "@/types/models-types";

const Messages = () => {
  const [messages, setMessages] = useState<MessageModelTypes[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch("/api/messages");
        if (res.status === 200) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (error) {
        console.log("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    getMessages();
  }, []);
  return loading ? (
    <Spinner loading={loading} />
  ) : (
    <section className="bg-blue-50 dark:bg-[#161c20]">
      <div className="container m-auto py-24 max-w-6xl">
        <div className="bg-white dark:bg-[#161c20] dark:shadow-[rgba(62,62,62,0.3)] px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 className="dark:text-zinc-400 text-3xl font-bold mb-4">
            Your Messages
          </h1>

          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="dark:text-zinc-400">You have no messages</p>
            ) : (
              messages.map((message) => (
                <Message key={message._id.toString()} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
