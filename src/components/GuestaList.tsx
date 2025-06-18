import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { firestore } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import "@/styles/App.css";

const allowedStatuses = ["attending", "declined", "pending"];

const isCsvFile = (file: File) => {
  return (
    file.type === "text/csv" ||
    file.type === "application/vnd.ms-excel" ||  // some browsers use this for CSV
    file.name.toLowerCase().endsWith(".csv")
  );
};

const isValidPhone = (phone: string) => /^[\d\s+\-()]+$/.test(phone);

const GuestList: React.FC = () => {
  const { t } = useTranslation();

  const [guests, setGuests] = useState<any[]>([]);
  const [newGuest, setNewGuest] = useState("");
  const [category, setCategory] = useState("");
  const [seating, setSeating] = useState("");
  const [phone, setPhone] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("pending");

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
    if (newGuest.trim() && category && seating && phone.trim()) {
      if (!isValidPhone(phone.trim())) {
        alert("Please enter a valid phone number.");
        return;
      }
      const guestCollection = collection(firestore, 'guests');
      await addDoc(guestCollection, {
        name: newGuest.trim(),
        category: category.trim(),
        seating: seating.trim(),
        phone: phone.trim(),
        rsvpStatus
      });
      setNewGuest("");
      setCategory("");
      setSeating("");
      setPhone("");
      // Optionally refresh list here or optimistically update state
      const guestSnapshot = await getDocs(guestCollection);
      const guestList = guestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuests(guestList);
    } else {
      alert("Please fill in all fields.");
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
    if (!allowedStatuses.includes(status)) {
      alert("Invalid RSVP status.");
      return;
    }
    const guestDoc = doc(firestore, 'guests', id);
    await updateDoc(guestDoc, { rsvpStatus: status });
    setGuests(guests.map(guest =>
      guest.id === id ? { ...guest, rsvpStatus: status } : guest
    ));
  };

  // Detect delimiter by analyzing the text content
  const detectDelimiter = (text: string) => {
    const delimiters = [",", ";", "\t"];
    let bestDelimiter = ",";
    let maxCount = 0;

    delimiters.forEach(delim => {
      const lines = text.split("\n").filter(l => l.trim() !== "");
      const counts = lines.map(line => line.split(delim).length);
      const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length;

      if (avgCount > maxCount) {
        maxCount = avgCount;
        bestDelimiter = delim;
      }
    });

    return bestDelimiter;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isCsvFile(file)) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result as string;
        const delimiter = detectDelimiter(text);

        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          delimiter,
          complete: async (results) => {
            const data = results.data as any[];
            const headerColumns = results.meta.fields?.map(h => h.trim().toLowerCase()) || [];

            const expectedCols = ["name", "category", "seating", "phone", "rsvpstatus"];
            const hasAllCols = expectedCols.every(col => headerColumns.includes(col));
            if (!hasAllCols) {
              alert(`CSV header must include columns: ${expectedCols.join(", ")}`);
              return;
            }

            const guestCollection = collection(firestore, 'guests');
            const errors: string[] = [];

            for (const [index, row] of data.entries()) {
              const guest = Object.fromEntries(
                Object.entries(row).map(([k, v]) => [k.trim().toLowerCase(), (v as string).trim()])
              );

              const { name, category, seating, phone, rsvpstatus } = guest;

              if (!name || !category || !seating || !phone) {
                errors.push(`Row ${index + 2}: Missing required field.`);
                continue;
              }

              if (!isValidPhone(phone)) {
                errors.push(`Row ${index + 2}: Invalid phone number "${phone}".`);
                continue;
              }

              let status = (rsvpstatus || "").toLowerCase();
              if (!allowedStatuses.includes(status)) status = "pending";

              await addDoc(guestCollection, {
                name,
                category,
                seating,
                phone,
                rsvpStatus: status,
              });
            }

            if (errors.length > 0) {
              alert("Import completed with some errors:\n" + errors.join("\n"));
            }

            // Refresh guest list after import
            const guestSnapshot = await getDocs(guestCollection);
            const guestList = guestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setGuests(guestList);
          },
          error: (error) => {
            alert("Error parsing CSV file: " + error.message);
          }
        });
      };

      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  return (
    <div>
      {/* File Upload */}
      <input
        type="file"
        accept=".csv"
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
          placeholder="Enter phone number"
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
            <p>Phone: {guest.phone}</p>
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
