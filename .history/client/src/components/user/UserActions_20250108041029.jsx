import React from "react";
import { useState } from "react";
import CheckCertificate from "./actions/CheckCertificate";

function UserActions() {

    const [showComponent, setShowComponent] = useState(false);

    return(
        <>
            <button 
                onClick={() => setShowComponent(true)}
            >Check Certificate</button>
            <div>
                {showComponent && (

                        <CheckCertificate/>

                )}
            </div>
        </>
    );
}

export default UserActions;