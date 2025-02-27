import React from "react";
import { useNavigate } from "react-router-dom";

function Explore() {
    const navigate = useNavigate();
  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">
          Monetize Your Hard Work: Sell Your Project
        </h1>
        <h3 className="text-xl mb-6">
          Submit Your Project Details for Evaluation Now!
        </h3>

        <img
          src="https://media2.dev.to/dynamic/image/width=1600,height=900,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fres.cloudinary.com%2Fdzynqn10l%2Fimage%2Fupload%2Fv1631854638%2FJS%2520Bits%2Fside_project_cover_oqd3qv.jpg"
          alt="Project Showcase"
          className="w-full rounded-lg shadow-lg mb-6"
        />

        <p className="text-lg mb-6">
          At <span className="font-semibold text-yellow-400">Digital Projects</span>,
          we provide a platform for college students to sell their innovative
          projects and transform their hard work into valuable compensation. Our
          experienced team evaluates the worth of your project, a process that
          typically takes up to 1 week for thorough review. To increase your
          chances of selling your project, consider attaching a demo video link
          that showcases the unique features and functionality of your creation.
          With Project Mart, you have the opportunity to monetize your efforts
          and gain recognition for your innovative work.
        </p>

        <h1 className="text-2xl font-bold mb-4">Key Points:</h1>
        <ul className="text-left text-lg mb-6 space-y-2">
          <li className="bg-gray-800 p-3 rounded-md">
            📌 The rate of your project is determined by the Project Mart Team.
          </li>
          <li className="bg-gray-800 p-3 rounded-md">
            ⏳ Reviewing your project can take up to 1 week.
          </li>
          <li className="bg-gray-800 p-3 rounded-md">
            🎥 Attaching a demo video link can increase your chances of selling
            your project.
          </li>
        </ul>

        <h1 className="text-2xl font-bold mb-4">Ready to Sell Your Project?</h1>
        <p className="mb-6 text-lg">
          You can also visit this link:{" "}
          <a
           
            className="text-blue-400 underline cursor-pointer"
             onClick={() => navigate("/user/login")}
          >
            Submit Your Project
          </a>
        </p>

        <p className="text-lg cursor-pointer">
          📩 Contact us at{" "}
          <span className="text-yellow-400">sonamkumari63928@gmail.com</span> for any
          queries!
        </p>
      </div>
    </div>
  );
}

export default Explore;
