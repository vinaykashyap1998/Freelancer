import React, { useEffect, useState } from "react";
import { freelancer } from "../web3Config";

function ProjectList({ user }) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    const projectIds = await freelancer.methods.getUserProjects(user).call();
    const data = await Promise.all(
      projectIds.map(async (id) => await freelancer.methods.getProject(id).call())
    );
    setProjects(data);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-center mb-4">Your Projects</h2>
      <div className="space-y-4">
        {projects.map((p, idx) => (
          <div key={idx} className="p-3 border rounded bg-gray-100">
            <p><strong>Title:</strong> {p[4]}</p>
            <p><strong>Freelancer:</strong> {p[2]}</p>
            <p><strong>Amount:</strong> {p[3] / 1e18} ETH</p>
            <p><strong>Completed:</strong> {p[5] ? "✅" : "❌"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectList;
