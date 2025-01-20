import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, UserCircle, LogOut, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function IssuerHome() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavigation = (component) => {
    setActiveComponent(component);
    if (component === 'Actions') {
      navigate('/user/issuer/actions');
    } else if (component === 'Profile') {
      navigate('/user/issuer/profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/user/issuer/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">TrueCert</h1>
              <p className="text-purple-100">
                Streamlining certificate management for issuers
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleLogout}
              className="gap-2 hover:bg-white/90 hover:text-purple-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Card className="border-none shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-slate-800">
              Issuer Dashboard
            </CardTitle>
            <CardDescription className="text-slate-500 text-lg">
              Manage your actions and profile seamlessly
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {/* Actions Card */}
              <Card
                className={`group cursor-pointer transition-all hover:shadow-lg ${activeComponent === 'Actions' ? 'border-purple-500 shadow-lg' : ''
                  }`}
                onClick={() => handleNavigation('Actions')}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Settings2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">Actions</h3>
                      <p className="text-slate-500">Manage certificates and operations</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </CardContent>
              </Card>

              {/* Profile Card */}
              <Card
                className={`group cursor-pointer transition-all hover:shadow-lg ${activeComponent === 'Profile' ? 'border-indigo-500 shadow-lg' : ''
                  }`}
                onClick={() => handleNavigation('Profile')}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">Profile</h3>
                      <p className="text-slate-500">Manage your account settings</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </CardContent>
              </Card>
            </div>

            {/* Dynamic Content Section */}
            <Card className="bg-slate-50 border-none">
              <CardContent className="p-6">
                {activeComponent === 'Actions' ? (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-purple-700">
                      Issuer Actions
                    </h2>
                    <p className="text-slate-600">
                      Manage your certificate issuance actions. Control certificates, view issuance history, and take necessary actions for your organization.
                    </p>
                  </div>
                ) : activeComponent === 'Profile' ? (
                  <div className="space-y-3">
                    <h2 className="text-2xl font-semibold text-indigo-700">
                      Issuer Profile
                    </h2>
                    <p className="text-slate-600">
                      Update your personal details, change settings, and manage account preferences in a few clicks.
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-slate-500 text-lg">
                    Select an option above to get started with managing your actions or profile.
                  </p>
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-4 absolute bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-purple-100">
            Made with ❤️ by <span className="font-bold text-white">Vasu</span>
          </p>
        </div>
      </footer>

    </div>
  );
}

export default IssuerHome;