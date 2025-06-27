const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
                <p className="text-gray-700 dark:text-gray-300">
                    Welcome to the admin dashboard. Here you can manage users, events, and other administrative tasks
                </p>
            </div>
        </div>
    );
}

export default AdminDashboard;