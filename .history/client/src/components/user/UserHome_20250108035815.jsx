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
        </>
    );
}