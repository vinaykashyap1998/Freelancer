import React, { useState } from "react";
import { web3, freelancer } from "../web3Config";

function MilestoneManager({ projectId, user, onMilestoneCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const createMilestone = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please connect wallet first!");
    
    setLoading(true);
    try {
      const amountWei = web3.utils.toWei(amount, "ether");
      await freelancer.methods
        .createMilestone(projectId, description, amountWei)
        .send({ from: user });
      
      alert("Milestone created successfully!");
      setDescription("");
      setAmount("");
      setShowForm(false);
      onMilestoneCreated();
    } catch (error) {
      console.error("Error creating milestone:", error);
      alert("Error creating milestone: " + error.message);
    }
    setLoading(false);
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="btn-primary"
      >
        + Add Milestone
      </button>
    );
  }

  return (
    <div className="card-modern p-4">
      <h4 className="text-lg font-semibold text-white mb-4">Create New Milestone</h4>
      <form onSubmit={createMilestone} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Milestone Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be completed for this milestone..."
            className="w-full p-3"
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3"
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-2"
          >
            {loading ? "Creating..." : "Create Milestone"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="btn-secondary py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default MilestoneManager;
