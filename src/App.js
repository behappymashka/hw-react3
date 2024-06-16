import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom';
import Contacts from './components/Contacts';
import ContactForm from './components/ContactForm';
import './index.css';

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const localData = localStorage.getItem('contacts');
    if (localData) {
      setContacts(JSON.parse(localData));
    } else {
      fetch('https://jsonplaceholder.typicode.com/users')
          .then(response => response.json())
          .then(data => {
            const formattedContacts = data.map(user => ({
              id: user.id,
              firstName: user.name.split(' ')[0],
              lastName: user.name.split(' ')[1] || '',
              phone: user.phone,
            }));
            setContacts(formattedContacts);
            localStorage.setItem('contacts', JSON.stringify(formattedContacts));
          })
          .catch(error => console.error('Error fetching data:', error));
    }
  }, []);

  const updateContacts = (newContacts) => {
    setContacts(newContacts);
    localStorage.setItem('contacts', JSON.stringify(newContacts));
  };

  const handleAddOrUpdateContact = (contact) => {
    const existingContactIndex = contacts.findIndex(c => c.id === contact.id);
    if (existingContactIndex >= 0) {
      const updatedContacts = [...contacts];
      updatedContacts[existingContactIndex] = contact;
      updateContacts(updatedContacts);
    } else {
      updateContacts([...contacts, contact]);
    }
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const newContacts = contacts.filter(contact => contact.id !== id);
      updateContacts(newContacts);
    }
  };

  return (
      <div>
        <h1>Phone Book</h1>
        <nav>
          <Link to="/" className="link">Contacts</Link>
          <Link to="/add" className="link">Add Contact</Link>
        </nav>
        <Routes>
          <Route path="/" element={
            <Contacts
                contacts={contacts}
                onDelete={handleDeleteContact}
            />
          } />
          <Route path="/add" element={
            <ContactForm
                onSave={handleAddOrUpdateContact}
                onCancel={() => window.history.back()}
            />
          } />
          <Route path="/edit/:id" element={
            <EditContactFormWrapper
                contacts={contacts}
                onSave={handleAddOrUpdateContact}
                onCancel={() => window.history.back()}
            />
          } />
        </Routes>
      </div>
  );
}

const EditContactFormWrapper = ({ contacts, onSave, onCancel }) => {
  const { id } = useParams();
  const contact = contacts.find(contact => contact.id === Number(id));
  return <ContactForm contact={contact} onSave={onSave} onCancel={onCancel} />;
};

export default App;