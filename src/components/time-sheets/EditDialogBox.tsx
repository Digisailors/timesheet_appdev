import React, { useState } from 'react';

interface UpdatedEmployee {
  name: string;
  travelStart: string;
  travelEnd: string;
  signIn: string;
  breakStart: string;
  breakEnd: string;
  signOut: string;
  offsiteTravelStart: string;
  offsiteTravelEnd: string;
  remarks: string;
}

interface EditDialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  employee: UpdatedEmployee;
  onSave: (updatedEmployee: UpdatedEmployee) => void;
}

export const EditDialogBox: React.FC<EditDialogBoxProps> = ({ isOpen, onClose, employee, onSave }) => {
  const [editedEmployee, setEditedEmployee] = useState<UpdatedEmployee>(employee);

  React.useEffect(() => {
    setEditedEmployee(employee);
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedEmployee);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md text-gray-900 dark:text-white">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Edit Timesheet Details</h2>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-xl">
              &times;
            </button>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {editedEmployee.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-bold">{editedEmployee.name}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Travel Start</label>
              <input
                type="text"
                name="travelStart"
                value={editedEmployee.travelStart}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Travel End</label>
              <input
                type="text"
                name="travelEnd"
                value={editedEmployee.travelEnd}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Sign In</label>
              <input
                type="text"
                name="signIn"
                value={editedEmployee.signIn}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Break Start</label>
              <div className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700">
                {editedEmployee.breakStart}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Break End</label>
              <div className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700">
                {editedEmployee.breakEnd}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Sign Out</label>
              <input
                type="text"
                name="signOut"
                value={editedEmployee.signOut}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Offsite Travel Start</label>
              <input
                type="text"
                name="offsiteTravelStart"
                value={editedEmployee.offsiteTravelStart}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">Offsite Travel End</label>
              <input
                type="text"
                name="offsiteTravelEnd"
                value={editedEmployee.offsiteTravelEnd}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 dark:text-gray-400">Remarks</label>
            <input
              type="text"
              name="remarks"
              value={editedEmployee.remarks}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [employee] = useState({
    id: '', // Make sure to set an appropriate ID
    name: 'John Doe',
    travelStart: '06:00',
    travelEnd: '08:00',
    signIn: '08:00',
    breakStart: '12:00',
    breakEnd: '13:00',
    signOut: '20:00',
    offsiteTravelStart: '20:00',
    offsiteTravelEnd: '21:30',
    remarks: 'Normal day',
  });

  const handleSave = async (updatedEmployee: UpdatedEmployee) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timesheet/update/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onsiteTravelStart: updatedEmployee.travelStart,
          onsiteTravelEnd: updatedEmployee.travelEnd,
          onsiteSignIn: updatedEmployee.signIn,
          onsiteBreakStart: updatedEmployee.breakStart,
          onsiteBreakEnd: updatedEmployee.breakEnd,
          onsiteSignOut: updatedEmployee.signOut,
          offsiteTravelStart: updatedEmployee.offsiteTravelStart,
          offsiteTravelEnd: updatedEmployee.offsiteTravelEnd,
          isHoliday: false,
          remarks: updatedEmployee.remarks,
          status: 'draft',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>Open Dialog</button>
      <EditDialogBox
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        employee={employee}
        onSave={handleSave}
      />
    </div>
  );
};

export default App;
