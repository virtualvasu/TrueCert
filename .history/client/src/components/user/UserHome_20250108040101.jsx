import React from "react";
import { useState } from "react";

import UserActions from "./UserActions";
import UserProfile from "./UserProfile";

function UserHome() {

    const [activeComponent, setActiveComponent] = useState(null);

    return (
        <>
            <button onClick={() => setActiveComponent('UserActions')}>User Actions</button>

            <button onClick={() => setActiveComponent('UserProfile')}>User Profile</button>

            <div>
                {activeComponent === 'UserActions' ? (
                    <div>
                        <h2>User Actions</h2>
                        <UserActions />
                    </div>
                ) : activeComponent === 'UserProfile' ? (
                    <div>
                        <h2>User Profile</h2>
                        <UserProfile />
                    </div>
                ) : null}
            </div>
        </>
    );
}

export default UserHome;