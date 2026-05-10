import React from "react";
import NotFoundPage from "./components/sharedComponents/NotFoundPage/NotFoundPage";

export const metadata = {
  title: "404 - Page Not Found | ইসলামের ইতিহাস",
  description: "পেজটি পাওয়া যায়নি। অনুগ্রহ করে সঠিক লিংক ব্যবহার করুন।",
};

const NotFound = () => {
  return (
    <div>
      <NotFoundPage />
    </div>
  );
};

export default NotFound;
