import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { studentService } from "@/services/api/studentService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradeService } from "@/services/api/gradeService";
import { format } from "date-fns";

const Dashboard = () => {
  const { setSidebarOpen } = useOutletContext();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    activeStudents: 0,
    averageAttendance: 0,
    averageGrade: 0,
    recentActivities: [],
    todayAttendance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [students, attendance, grades] = await Promise.all([
        studentService.getAll(),
        attendanceService.getAll(),
        gradeService.getAll()
      ]);

      const activeStudents = students.filter(s => s.status === "active");
      const totalStudents = students.length;

      // Calculate attendance percentage
      const presentCount = attendance.filter(a => a.status === "present").length;
      const totalAttendance = attendance.length;
      const averageAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      // Calculate average grade
      const totalGrade = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0);
      const averageGrade = grades.length > 0 ? Math.round(totalGrade / grades.length) : 0;

      // Today's attendance
      const today = format(new Date(), "yyyy-MM-dd");
      const todayAttendance = attendance.filter(a => 
        format(new Date(a.date), "yyyy-MM-dd") === today && a.status === "present"
      ).length;

      // Recent activities
      const recentActivities = [
        { type: "student", message: "New student enrolled", time: "2 hours ago" },
        { type: "grade", message: "Grades updated for Math test", time: "4 hours ago" },
        { type: "attendance", message: "Attendance marked for today", time: "6 hours ago" }
      ];

      setDashboardData({
        totalStudents,
        activeStudents: activeStudents.length,
        averageAttendance,
        averageGrade,
        recentActivities,
        todayAttendance
      });
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Loading variant="cards" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col h-screen">
        <Header
          title="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 p-6">
          <Error message={error} onRetry={loadDashboardData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header
        title="Dashboard"
        onMenuClick={() => setSidebarOpen(true)}
      />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white"
          >
            <h1 className="text-2xl font-bold mb-2">Welcome back, Administrator!</h1>
            <p className="text-primary-100">
              Here's what's happening in your school today.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MetricCard
                title="Total Students"
                value={dashboardData.totalStudents}
                icon="Users"
                gradient="from-primary-500 to-primary-600"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MetricCard
                title="Active Students"
                value={dashboardData.activeStudents}
                icon="UserCheck"
                gradient="from-green-500 to-green-600"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MetricCard
                title="Attendance Rate"
                value={`${dashboardData.averageAttendance}%`}
                icon="Calendar"
                gradient="from-accent-500 to-accent-600"
                trend="up"
                trendValue="+5%"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <MetricCard
                title="Average Grade"
                value={`${dashboardData.averageGrade}%`}
                icon="GraduationCap"
                gradient="from-secondary-500 to-secondary-600"
                trend="up"
                trendValue="+3%"
              />
            </motion.div>
          </div>

          {/* Recent Activities and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-center">
                  <div className="text-primary-600 font-medium">Add Student</div>
                </button>
                <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
                  <div className="text-green-600 font-medium">Mark Attendance</div>
                </button>
                <button className="p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors text-center">
                  <div className="text-accent-600 font-medium">Add Grade</div>
                </button>
                <button className="p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors text-center">
                  <div className="text-secondary-600 font-medium">Generate Report</div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Today's Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{dashboardData.todayAttendance}</div>
                <div className="text-sm text-gray-600">Students Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">New Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-600">0</div>
                <div className="text-sm text-gray-600">Pending Tasks</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;