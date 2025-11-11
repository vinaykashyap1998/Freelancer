import React, { useState } from "react";
import { web3, freelancer } from "../web3Config";

function CreateProject({ user }) {
  const [freelancerAddr, setFreelancerAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const createProject = async () => {
    if (!user) return alert("Please connect wallet first!");
    const value = web3.utils.toWei(amount, "ether");
    await freelancer.methods
      .createProject(freelancerAddr, value, title)
      .send({ from: user, value });
    alert("Project created successfully!");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-2">Create New Project</h2>
      <input
        type="text"
        placeholder="Freelancer Address"
        value={freelancerAddr}
        onChange={(e) => setFreelancerAddr(e.target.value)}
        className="border w-full p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Amount (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border w-full p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border w-full p-2 mb-2"
      />
      <button
        onClick={createProject}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create Project
      </button>
    </div>
  );
}

export default CreateProject;
