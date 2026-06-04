import React, { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('attacheeEmail'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('attacheeEmail') || '' );
  const [fullName, setFullName] = useState(localStorage.getItem('attacheeFullname') || '');
  const [category, setCategory] = useState('attachee');
  
  const [attendanceStatus, setAttendanceStatus] = useState('Not Clocked In');
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState({ text: '', isError: false });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!userEmail || !fullName) {
      setMessage({ text: 'Please fill in all profile fields.', isError: true });
      return;
    }
localStorage.setItem('attacheeEmail', userEmail);
localStorage.setItem('attacheeName', fullName);

setIsLoggedIn(true);
setMessage({ text: `Welcome back, ${fullName}!`, isError: false });
    setIsLoggedIn(true);
    setMessage({ text: `Welcome back, ${fullName}!`, isError: false });
  };

  const handleClockIn = async () => {
    try {
      setMessage({ text: 'Verifying network presence...', isError: false });
      const response = await fetch('https://attachee-attendance-forms.vercel.app/api/attendance/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setAttendanceStatus('Clocked In');
        setMessage({ text: data.message, isError: false });
        const newLog = {
          date: new Date().toISOString().split('T')[0],
          timeIn: new Date().toLocaleTimeString(),
          timeOut: 'Active',
          status: 'Verified (Hub Wi-Fi)'
        };
        setLogs([newLog, ...logs]);
      } else {
        setMessage({ text: data.message, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Cannot connect to backend server. Ensure backend is running.', isError: true });
    }
  };

  const handleClockOut = async () => {
    try {
      const response = await fetch('https://attachee-attendance-forms.vercel.app/api/attendance/clock-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await response.json();
      if (data.success) {
        setAttendanceStatus('Clocked Out');
        setMessage({ text: data.message, isError: false });
        if (logs.length > 0) {
          const updatedLogs = [...logs];
          updatedLogs[0].timeOut = new Date().toLocaleTimeString();
          setLogs(updatedLogs);
        }
      } else {
        setMessage({ text: data.message, isError: true });
      }
    } catch (error) {
      setMessage({ text: 'Error contacting backend server.', isError: true });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">AATS Access Portal</h2>
          <p className="text-sm text-center text-gray-500 mb-6">Enter pre-registered credentials to sign in</p>
          {message.text && (
            <div className={`p-3 rounded-lg text-sm mb-4 ${message.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Jane Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="name@domain.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Category</label>
              <select className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="attachee">Attachee</option>
                <option value="employer">Employer / Supervisor</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-2.5 rounded-lg transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance Dashboard</h1>
          <p className="text-xs text-gray-500">Logged in: <span className="font-semibold">{userEmail}</span></p>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="text-sm font-medium text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors">
          Log Out
        </button>
      </header>
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{fullName}</h2>
            <p className="text-sm text-gray-500 capitalize">Role Type: {category}</p>
            <button 
  onClick={() => {
    localStorage.clear();
    window.location.reload();
  }}
  className="mt-2 text-xs text-red-500 hover:underline"
>
  Log Out / Switch Account
</button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Status Today:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              attendanceStatus === 'Clocked In' ? 'bg-green-100 text-green-800' :
              attendanceStatus === 'Clocked Out' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {attendanceStatus}
            </span>
          </div>
        </div>
        {message.text && (
          <div className={`p-4 rounded-xl text-sm border font-medium ${message.isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={handleClockIn} disabled={attendanceStatus === 'Clocked In'} className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md hover:border-green-300 disabled:opacity-50 disabled:pointer-events-none group transition-all text-left">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition-colors">🚀 Secure Clock-In</h3>
            <p className="text-xs text-gray-500 mt-1">Verifies current Hub network routing and checks arrival time.</p>
          </button>
          <button onClick={handleClockOut} disabled={attendanceStatus !== 'Clocked In'} className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md hover:border-amber-300 disabled:opacity-50 disabled:pointer-events-none group transition-all text-left">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">🏁 Secure Clock-Out</h3>
            <p className="text-xs text-gray-500 mt-1">Updates daily record entry row with an immediate departure log stamp.</p>
          </button>
        </div>
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-bold text-gray-900">Personal Attendance Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-600 font-medium uppercase text-xs border-b">
                  <th className="p-3">Log Date</th>
                  <th className="p-3">Time In</th>
                  <th className="p-3">Time Out</th>
                  <th className="p-3">Verification Route</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 font-medium">
                      No automated system activity logged for this session yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-900">{log.date}</td>
                      <td className="p-3 text-green-600 font-medium">{log.timeIn}</td>
                      <td className="p-3 text-amber-600 font-medium">{log.timeOut}</td>
                      <td className="p-3"><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{log.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
