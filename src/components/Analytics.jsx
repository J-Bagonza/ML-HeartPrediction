import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import { useLocation } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Analytics = () => {
  const location = useLocation();
  const { formData, prediction } = location.state || {}; // Accessing passed formData and prediction

  const [riskEstimates, setRiskEstimates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define colors for pie chart
  const COLORS = ["#11c252", "#ed1a1a"]; // Green for No Failure, Red for Failure

  // Define heart risk data for pie chart
  const heartRiskData = [
    { name: "No Failure", value: 100 - prediction },
    { name: "Failure", value: prediction },
  ];

  // User input data for the bar chart
  const cholesterolData = [
    { name: "Total Cholesterol", value: formData?.totalCholesterol || 0 },
    { name: "HDL Cholesterol", value: formData?.hdlCholesterol || 0 },
    { name: "SBP", value: formData?.sbp || 0 },
    { name: "BMI", value: formData?.bmi || 0 },
    { name: "eGFR", value: formData?.egfr || 0 },
  ];

  // Function to fetch heart failure risk estimates from the backend (GPT model)
  const fetchRiskEstimates = async () => {
    try {
      // Call to the backend API (make sure to adjust the endpoint accordingly)
      const response = await fetch("https://your-backend-api.com/getRiskEstimates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setRiskEstimates(data.riskEstimates); // Assuming the response has an array of risk estimates for different years
      } else {
        console.error("Failed to fetch risk estimates");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Set loading to false after data is fetched or if an error occurs
    }
  };

  useEffect(() => {
    if (formData) {
      fetchRiskEstimates(); // Fetch the risk estimates once formData is available
    }
  }, [formData]);

  // Define recommended doctors based on high-risk levels (greater than 50% chance of failure)
  const recommendedDoctors = [
    { name: "Dr. John Doe", contact: "123-456-7890" },
    { name: "Dr. Jane Smith", contact: "987-654-3210" },
    { name: "Dr. Alan Brown", contact: "555-555-5555" },
  ];

  return (
    <div className="p-6 space-y-8 pt-24">
      <h2 className="text-lg font-semibold text-center mb-6">
        Heart Disease Analysis for {formData?.sex || "User"}
      </h2>

      {/* Bar Chart and Pie Chart - Mobile Responsive */}
      <div className="flex flex-col-reverse md:flex-row justify-center space-x-6">
        {/* Bar Chart (User Data) */}
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cholesterolData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart (Heart Failure vs No Heart Failure) */}
        <div className="w-full md:w-1/3">
          <ResponsiveContainer width={250} height={250}>
            <PieChart>
              <Pie data={heartRiskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {heartRiskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <PieTooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* Pie Chart Legend */}
          <div className="flex space-x-4 mt-4">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-red-600 rounded-full mr-2"></span>
              <span>Failure</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-600 rounded-full mr-2"></span>
              <span>No Failure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heart Failure Risk Estimations (Years-wise) */}
      <div className="flex justify-center">
        <div className="w-3/4">
          <h3 className="text-lg font-bold text-red-600 mb-2">Heart Failure Risk Estimations</h3>
          {loading ? (
            <p className="text-center">Loading risk estimates...</p>
          ) : (
            <table className="w-full border border-green-600">
              <tbody>
                {riskEstimates.map((risk, index) => (
                  <tr key={index} className="border-b border-green-600">
                    <td className="p-3 text-center">
                      Estimated risk of heart failure in {risk.years}-years: {risk.risk}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recommended Doctors if Risk is High */}
      {prediction > 50 && (
        <div className="w-3/4 mx-auto">
          <h3 className="text-lg font-bold text-red-600 mb-3">Recommended Doctors</h3>
          <table className="w-full bg-white border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Doctor</th>
                <th className="border px-4 py-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {recommendedDoctors.map((doctor, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{doctor.name}</td>
                  <td className="border px-4 py-2">{doctor.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Download Report Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            const report = {
              formData,
              prediction,
              riskEstimates,
              heartRiskData,
              cholesterolData,
            };
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "heart_disease_analysis.json";
            link.click();
          }}
          className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition duration-300"
        >
          Download Report
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white p-6 text-center mt-16">
        <div className="container mx-auto">
          <p className="font-sans text-sm md:text-base text-gray-700">&copy; {new Date().getFullYear()} Pulse Life. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-3">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-red-600 hover:text-green-700" size={26} />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-red-600 hover:text-green-700" size={26} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="text-red-600 hover:text-green-700" size={26} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Analytics;