import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function NotificationDropdown() {
  const { currentUser } = useSelector((state) => state.auth);
   const navigate = useNavigate();
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
        <FaBell className="w-5 h-5 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </div>

  {open && (
  <div className="absolute right-0 mt-2 w-72 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[100]">

    {/* Header */}
    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-200">
      <h3 className="font-semibold text-gray-700">Notifications</h3>
    </div>

    {/* Body */}
    <div className="max-h-[400px] overflow-y-auto">
      {notifications.filter(n => n.status === "replied").length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">
          No notifications yet
        </div>
      ) : (
        notifications
          .filter(n => n.status === "replied")
          .map(item => (
            <div
              key={item.id}
               onClick={() => navigate(`/profile/messages/${item.id}`)}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3
                ${!item.isRead ? 'bg-blue-50/50' : ''}
              `}
            >
              {/* Status Dot */}
              <div className="mt-2 w-2 h-2 rounded-full bg-green-500 shrink-0" />

              {/* Content */}
              <div className="flex-1">
                <h4 className={`text-sm font-semibold mb-1 ${item.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                  Admin
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.adminReply}
                </p>

                <span className="text-[10px] text-gray-400 mt-2 block">
                  {item.replyAt?.toDate().toLocaleString()}
                </span>
              </div>
            </div>
          ))
      )}
    </div>
  </div>
)}

    </div>
  );
}
