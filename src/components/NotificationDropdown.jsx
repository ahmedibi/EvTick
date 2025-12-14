import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export default function NotificationDropdown() {
  const { currentUser } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "contactMessages"),
      where("userId", "==", currentUser.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const arr = [];
      let count = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        arr.push({ id: doc.id, ...data });
        if (data.status === "replied" && !data.isRead) count++;
      });

      setNotifications(arr);
      setUnreadCount(count);
    });

    return () => unsub();
  }, [currentUser]);

  // 🟦 Handle toggle + mark read
  const handleToggle = async () => {
    setOpen((prev) => !prev);

    if (!open) {
      // mark all as read
      const unread = notifications.filter(
        (n) => n.status === "replied" && !n.isRead
      );

      unread.forEach(async (item) => {
        await updateDoc(doc(db, "contactMessages", item.id), {
          isRead: true,
        });
      });

      setUnreadCount(0);
    }
  };

  // 🟦 Close when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={handleToggle} className="cursor-pointer relative">
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 mt-3 max-h-96 overflow-y-auto bg-white shadow-xl rounded-xl border p-4 z-50">
          

          {notifications.filter(n => n.status === "replied").length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications available.</p>
          ) : (
            <div className="space-y-3">
              {notifications
                .filter((n) => n.status === "replied")
                .map((item) => (
                  <div key={item.id} className="p-3 bg-gray-100 rounded-lg border">
                    <p className=" text-gray-700">Admin reply:</p>
                    <p className="text-gray-700">{item.adminReply}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {item.replyAt?.toDate().toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
