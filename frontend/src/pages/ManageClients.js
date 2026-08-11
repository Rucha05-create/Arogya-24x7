import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageClients.css";

function ManageClients() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);

  // ==========================
  // Fetch Clients
  // ==========================

  const fetchClients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setClients(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ==========================
  // Search Filter
  // ==========================

  const filteredClients = clients.filter((client) => {
    return (
      (client.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (client.email || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (client.phone || "").includes(search)
    );
  });

  return (
    <div className="manage-clients">

      {/* Hero Section */}

      <div className="client-hero">

        <div>

          <h1>👥 Client Management</h1>

          <p>
            View and monitor all registered clients from one
            centralized dashboard.
          </p>

        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Clients"
        />

      </div>

      {/* Statistics */}

      <div className="stats">

        <div className="stat-card">

          <h2>{clients.length}</h2>

          <p>Total Clients</p>

        </div>

        <div className="stat-card">

          <h2>100%</h2>

          <p>Verified Accounts</p>

        </div>

        <div className="stat-card">

          <h2>{clients.length}</h2>

          <p>Registered Users</p>

        </div>

      </div>

      {/* Search */}

      <input
        className="search-box"
        placeholder="🔍 Search by Name, Email or Phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2 className="client-count">
        Showing {filteredClients.length} of {clients.length} Clients
      </h2>

      {/* Client Cards */}

      <div className="client-list">

        {filteredClients.length > 0 ? (

          filteredClients.map((client) => (

            <div
              className="client-card"
              key={client._id}
            >

              {/* Avatar */}

              <div className="client-avatar">

                {(client.name || "U").charAt(0).toUpperCase()}

              </div>

              {/* Client Details */}

              <div className="client-info">

                <div className="client-header">

                  <h3>{client.name || "Unknown User"}</h3>

                  <span className="status active">
                    🟢 {client.status || "Active"}
                  </span>

                </div>

                <p>📧 {client.email || "N/A"}</p>

                <p>📱 {client.phone || "N/A"}</p>

                <p>🎂 {client.age || "N/A"} Years</p>

                <p>🩸 {client.bloodGroup || "N/A"}</p>

                <p>📍 {client.address || "N/A"}</p>

                <p>

                  🗓 Registered :

                  <strong>

                    {" "}

                    {client.createdAt
                      ? new Date(client.createdAt).toLocaleDateString()
                      : "N/A"}

                  </strong>

                </p>

              </div>

            </div>

          ))

        ) : (

          <div className="client-card">

            <div className="client-info">

              <h3>No Clients Found</h3>

              <p>
                No registered client matches your search.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default ManageClients;