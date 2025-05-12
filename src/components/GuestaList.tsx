import React, { useState, useEffect } from 'react';
import { firestore } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { useTranslation } from 'react-i18next';

// If `App.css` is in `src/styles`:
import "@/styles/App.css";

const GuestList: React.FC = () => {
  const { t } = useTranslation();

  const [guests, setGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState("");
  const [category, setCategory] = useState("");
  const [seating, setSeating] = useState("");
  const [phone, setPhone] = useState(""); // Added phone state
  const [rsvpStatus, setRsvpStatus] = useState("pending");
  const [file, setFile] = useState<any>(null);

  // Fetch guests from Firestore
  useEffect(() => {
    const fetchGuests = async () => {
      const guestCollection = collection(firestore, 'guests');
      const guestSnapshot = await getDocs(guestCollection);
      const guestList = guestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuests(guestList);
    };
    fetchGuests();
  }, []);

  // Add guest to Firestore
  const handleAddGuest = async () => {
    if (newGuest.trim() && category && seating && phone.trim()) { // Ensure phone is filled
      const guestCollection = collection(firestore, 'guests');
      await addDoc(guestCollection, { 
        name: newGuest, 
        category, 
        seating, 
        phone, // Store phone number
        rsvpStatus 
      });
      setNewGuest(""); 
      setCategory("");
      setSeating("");
      setPhone(""); // Reset phone input after adding
    }
  };

  // Delete guest from Firestore
  const handleDeleteGuest = async (id: string) => {
    const guestDoc = doc(firestore, 'guests', id);
    await deleteDoc(guestDoc);
    setGuests(guests.filter(guest => guest.id !== id)); 
  };

  // Update RSVP Status
  const handleRsvpStatusChange = async (id: string, status: string) => {
    const guestDoc = doc(firestore, 'guests', id);
    await updateDoc(guestDoc, { rsvpStatus: status });
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, rsvpStatus: status } : guest
    ));
  };

  // Handle file upload and parsing CSV/Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const binaryStr = event.target?.result;
        const wb = XLSX.read(binaryStr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        
        // Process and add guests to Firestore
        data.forEach(async (row: any) => {
          if (row.name && row.category && row.seating && row.phone) { // Ensure phone is present
            const guestCollection = collection(firestore, 'guests');
            await addDoc(guestCollection, { 
              name: row.name, 
              category: row.category, 
              seating: row.seating, 
              phone: row.phone, // Include phone number from file
              rsvpStatus: row.rsvpStatus || "pending" 
            });
          }
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      {/* File Upload */}
      <input 
        type="file" 
        accept=".csv, .xlsx" 
        onChange={handleFileUpload} 
      />
      
      <div className="form-container">
        <input
          type="text"
          value={newGuest}
          onChange={(e) => setNewGuest(e.target.value)}
          placeholder="Enter guest name"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter guest category"
        />
        <input
          type="text"
          value={seating}
          onChange={(e) => setSeating(e.target.value)}
          placeholder="Enter seating arrangement"
        />
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number" // Added phone input
        />
        <button className="guest-button" onClick={handleAddGuest}>Add Guest</button>
      </div>

      {/* Guest List */}
      <ul className="guest-list">
        {guests.map((guest) => (
          <li key={guest.id} className="guest-list-item">
            <p className="guest-name">Name: {guest.name}</p>
            <p>Category: {guest.category}</p>
            <p>Seating: {guest.seating}</p>
            <p>Phone: {guest.phone}</p> {/* Display phone number */}
            <p>RSVP Status: 
              <button onClick={() => handleRsvpStatusChange(guest.id, 'attending')}>
                Attending
              </button>
              <button onClick={() => handleRsvpStatusChange(guest.id, 'declined')}>
                Declined
              </button>
              <button onClick={() => handleRsvpStatusChange(guest.id, 'pending')}>
                Pending
              </button>
            </p>
            <button className="guest-button" onClick={() => handleDeleteGuest(guest.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuestList;
