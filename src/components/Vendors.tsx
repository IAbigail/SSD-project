import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Vendors = () => {
    const { t } = useTranslation();

    const [vendors, setVendors] = useState([
        { name: 'Vendor 1', contact: 'vendor1@example.com', contract: '', invoice: '' },
        { name: 'Vendor 2', contact: 'vendor2@example.com', contract: '', invoice: '' },
    ]);

    const [newVendor, setNewVendor] = useState({
        name: '',
        contact: '',
        contract: '',
        invoice: '',
    });

    const handleAddVendor = () => {
        if (!newVendor.name || !newVendor.contact) {
            alert(t("pleaseFillAllDetails"));
            return;
        }

        setVendors([...vendors, newVendor]);
        setNewVendor({ name: '', contact: '', contract: '', invoice: '' });
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setNewVendor((prevVendor) => ({ ...prevVendor, [name]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = event.target;
        if (files && files[0]) {
            setNewVendor((prevVendor) => ({ ...prevVendor, [name]: URL.createObjectURL(files[0]) }));
        }
    };

    const handleDeleteVendor = (index: number) => {
        setVendors((prevVendors) => prevVendors.filter((_, i) => i !== index));
    };

    return (
        <div>
            <h1>{t('vendors')}</h1>

            <div>
                <h2>{t('addNewVendor')}</h2>
                <input
                    type="text"
                    name="name"
                    placeholder={t('vendorName')}
                    value={newVendor.name}
                    onChange={handleTextChange}
                />
                <input
                    type="email"
                    name="contact"
                    placeholder={t('vendorContact')}
                    value={newVendor.contact}
                    onChange={handleTextChange}
                />
                <input
                    type="file"
                    name="contract"
                    onChange={handleFileChange}
                />
                <input
                    type="file"
                    name="invoice"
                    onChange={handleFileChange}
                />
                <button onClick={handleAddVendor}>{t('addVendor')}</button>
            </div>

            <h2>{t('vendorList')}</h2>
            <ul>
                {vendors.map((vendor, index) => (
                    <li key={index}>
                        <strong>{vendor.name}</strong> - {t('contact')}: {vendor.contact}
                        <br />
                        {vendor.contract && (
                            <a href={vendor.contract} target="_blank" rel="noopener noreferrer">
                                {t('viewContract')}
                            </a>
                        )}
                        <br />
                        {vendor.invoice && (
                            <a href={vendor.invoice} target="_blank" rel="noopener noreferrer">
                                {t('viewInvoice')}
                            </a>
                        )}
                        <br />
                        <button onClick={() => handleDeleteVendor(index)}>{t('deleteVendor')}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Vendors;
