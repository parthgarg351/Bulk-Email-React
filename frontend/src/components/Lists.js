import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Lists = () => {
  const [lists, setLists] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    const userId = auth.currentUser.uid;
    const response = await axios.get(`https://bulk-email-backend-dx5l.onrender.com/api/lists/${userId}`);
    setLists(response.data);
  };

  const handleCreateList = async () => {
    if (newListName.trim()) {
      const userId = auth.currentUser.uid;
      await axios.post('https://bulk-email-backend-dx5l.onrender.com/api/lists', { userId, listName: newListName });
      fetchLists();
      setNewListName('');
    }
  };

  const handleAddEmail = async (listId, email) => {
    await axios.post(`https://bulk-email-backend-dx5l.onrender.com/api/lists/${listId}/emails`, { emails: [email] });
    fetchLists();
  };

  const handleRemoveEmail = async (listId, email) => {
    await axios.delete(`https://bulk-email-backend-dx5l.onrender.com/api/lists/${listId}/emails/${email}`);
    fetchLists();
  };

  const handleDeleteList = async (listId) => {
    await axios.delete(`https://bulk-email-backend-dx5l.onrender.com/api/lists/${listId}`);
    setShowDeleteModal(false);
    fetchLists();
  };

  const handleFileUpload = async (listId, file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const emails = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        .map(row => row[0])
        .filter(email => email);
      
      await axios.post(`/api/lists/${listId}/emails`, { emails });
      fetchLists();
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-6">
      {/* List Creation Section */}
      <div className="mb-8">
        {/* Existing list creation UI */}
      </div>

      {/* Lists Display Section */}
      <div className="space-y-4">
        {lists.map(list => (
          <div key={list._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{list.listName}</h3>
              <div className="space-x-2">
                <button onClick={() => setExpandedLists(prev => ({...prev, [list._id]: !prev[list._id]}))}>
                  {expandedLists[list._id] ? 'Collapse' : 'Expand'}
                </button>
                <button onClick={() => {
                  setSelectedList(list);
                  setShowDeleteModal(true);
                }}>
                  Delete List
                </button>
              </div>
            </div>

            {expandedLists[list._id] ? (
              <div className="mt-4">
                {/* Email list and controls */}
                {list.emails.map((email, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span>{email}</span>
                    <button onClick={() => handleRemoveEmail(list._id, email)}>Remove</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2">
                {list.emails.slice(0, 5).map((email, index) => (
                  <div key={index}>{email}</div>
                ))}
                {list.emails.length > 5 && <div className="text-gray-500">...and {list.emails.length - 5} more</div>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3>Delete List?</h3>
            <p>Are you sure you want to delete {selectedList?.listName}?</p>
            <div className="mt-4 space-x-2">
              <button onClick={() => handleDeleteList(selectedList._id)}>Yes, Delete</button>
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lists;