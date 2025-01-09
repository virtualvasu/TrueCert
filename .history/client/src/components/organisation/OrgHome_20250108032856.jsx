import React, { useState } from 'react';

function OrgHome() {
    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <>
            <div className="space-x-4 mb-6">
                <button
                    onClick={() => setActiveComponent('Actions')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Actions
                </button>
                <button
                    onClick={() => setActiveComponent('Profile')}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                >
                    Profile
                </button>
            </div>
            <div>
                {activeComponent === 'Actions' && (
                    <div>
                        <h2 className="text-2xl font-semibold">Actions</h2>
                        <p className="text-gray-600">Perform various actions related to certificates.</p>
                    </div>
                )}
                {activeComponent === 'Profile' && (
                    <div>
                        <h2 className="text-2xl font-semibold">Profile</h2>
                        <p className="text-gray-600">Manage your organisation profile here.</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default OrgHome;
