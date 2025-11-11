import React, { useState, useEffect } from "react";
import { web3, freelancer } from "../web3Config";
import MilestoneManager from "./MilestoneManager";

function ClientDashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const projectIds = await freelancer.methods.getUserProjects(user).call();
      const projectData = await Promise.all(
        projectIds.map(async (id) => {
          const projectId = id.toString();
          const project = await freelancer.methods.getProject(projectId).call();
          // Filter: only show projects where user is the client
          if (project.client.toLowerCase() !== user.toLowerCase()) {
            return null;
          }
          const milestoneIds = await freelancer.methods.getProjectMilestones(projectId).call();
          const milestoneData = await Promise.all(
            milestoneIds.map(async (milestoneId) => {
              const mId = milestoneId.toString();
              const milestone = await freelancer.methods.getMilestone(mId).call();
              // Fetch submission hash if milestone is submitted
              let submissionHash = '';
              if (milestone.isSubmitted) {
                try {
                  submissionHash = await freelancer.methods.milestoneSubmissions(mId).call();
                } catch (error) {
                  console.error("Error fetching submission:", error);
                }
              }
              return { ...milestone, submissionHash };
            })
          );
          return { project, milestones: milestoneData };
        })
      );
      // Filter out null values (projects where user is not the client)
      setProjects(projectData.filter(item => item !== null));
    } catch (error) {
      console.error("Error fetching client data:", error);
    }
    setLoading(false);
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatEther = (wei) => {
    return web3.utils.fromWei(wei, 'ether');
  };

  const getStatusColor = (isCompleted, milestones) => {
    if (isCompleted) return "status-completed";
    if (milestones.length === 0) return "status-pending";
    return "status-approved";
  };

  const getStatusText = (isCompleted, milestones) => {
    if (isCompleted) return "Completed";
    if (milestones.length === 0) return "No Milestones";
    return "In Progress";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-accent">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-modern p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Client Dashboard</h2>
            <p className="text-gray-400">Create projects, manage milestones, and track payments</p>
          </div>
          <button
            onClick={() => setShowCreateProject(!showCreateProject)}
            className="btn-secondary"
          >
            {showCreateProject ? 'Cancel' : '+ New Project'}
          </button>
        </div>
      </div>

      {showCreateProject && (
        <div className="card-modern p-6">
          <CreateProjectForm user={user} onSuccess={() => {
            setShowCreateProject(false);
            fetchClientData();
          }} />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-400 mb-4">Create your first project to get started.</p>
          <button
            onClick={() => setShowCreateProject(true)}
            className="btn-primary"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map(({ project, milestones }, index) => (
            <div key={project.id.toString()} className="card-modern overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400">Freelancer: {formatAddress(project.freelancer)}</p>
                    <p className="text-gray-400">Total Amount: {formatEther(project.totalAmount)} ETH</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.isCompleted, milestones)}`}>
                    {getStatusText(project.isCompleted, milestones)}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-white">Milestones</h4>
                    {!project.isCompleted && (
                      <MilestoneManager 
                        projectId={project.id} 
                        user={user} 
                        onMilestoneCreated={fetchClientData}
                      />
                    )}
                  </div>
                  
                  {/* Milestone total summary */}
                  {milestones.length > 0 && (() => {
                    // Convert all amounts to ether (numbers) for calculation
                    const totalMilestoneAmountEther = milestones.reduce((sum, m) => {
                      return sum + parseFloat(formatEther(m.amount));
                    }, 0);
                    const projectTotalEther = parseFloat(formatEther(project.totalAmount));
                    const remainingEther = Math.max(0, projectTotalEther - totalMilestoneAmountEther);
                    
                    return (
                      <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Total Milestone Amount:</span>
                          <span className="text-white font-medium">
                            {totalMilestoneAmountEther.toFixed(6)} ETH
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-400">Project Total:</span>
                          <span className="text-white font-medium">{projectTotalEther.toFixed(6)} ETH</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-gray-400">Remaining:</span>
                          <span className={`font-medium ${
                            totalMilestoneAmountEther > projectTotalEther
                              ? 'text-red-400'
                              : 'text-green-400'
                          }`}>
                            {remainingEther.toFixed(6)} ETH
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {milestones.length > 0 ? (
                    <div className="space-y-3">
                      {milestones.map((milestone, milestoneIndex) => (
                        <div key={milestone.id.toString()} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-white">{milestone.description}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Amount: {formatEther(milestone.amount)} ETH
                              </p>
                              
                              {/* Show message for milestone status */}
                              {!milestone.isApproved && !milestone.isPaid && (
                                <div className="mt-2 text-sm text-gray-400">
                                  {milestone.isSubmitted 
                                    ? '✅ Milestone submitted - Ready for approval'
                                    : '⏳ Waiting for freelancer to mark as submitted...'}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                milestone.isPaid 
                                  ? 'status-completed' 
                                  : milestone.isApproved 
                                    ? 'status-approved'
                                    : milestone.isSubmitted
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                              }`}>
                                {milestone.isPaid 
                                  ? 'Paid' 
                                  : milestone.isApproved 
                                    ? 'Approved' 
                                    : milestone.isSubmitted
                                      ? 'Awaiting Review'
                                      : 'Not Submitted'}
                              </span>
                              
                              {/* Approve button - only show if milestone is submitted */}
                              {milestone.isSubmitted && !milestone.isApproved && !milestone.isPaid && (
                                <button
                                  onClick={async () => {
                                    try {
                                      // Approve and release payment
                                      await freelancer.methods.approveMilestone(milestone.id).send({ 
                                        from: user,
                                        gas: 200000  // Fixed gas limit
                                      });
                                      alert('Milestone approved and payment released!');
                                      fetchClientData();
                                    } catch (error) {
                                      console.error('Error approving milestone:', error);
                                      let errorMsg = error.message || 'Unknown error';
                                      
                                      // User-friendly error messages
                                      if (errorMsg.includes('not submitted')) {
                                        errorMsg = 'Error: The freelancer must submit this milestone before you can approve it.';
                                      } else if (errorMsg.includes('Only client')) {
                                        errorMsg = 'Error: Only the project client can approve milestones.';
                                      } else if (errorMsg.includes('already approved')) {
                                        errorMsg = 'Error: This milestone has already been approved.';
                                      } else if (errorMsg.includes('already paid')) {
                                        errorMsg = 'Error: This milestone has already been paid.';
                                      }
                                      
                                      alert('Error approving milestone: ' + errorMsg);
                                    }
                                  }}
                                  className="btn-primary text-xs px-3 py-1"
                                >
                                  Approve & Pay
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">📋</div>
                      <p>No milestones created yet</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Created: {new Date(Number(project.createdAt) * 1000).toLocaleDateString()}</span>
                    <span>Project ID: #{project.id.toString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CreateProjectForm component
function CreateProjectForm({ user, onSuccess }) {
  const [freelancerAddr, setFreelancerAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const createProject = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please connect wallet first!");
    
    setLoading(true);
    try {
      const value = web3.utils.toWei(amount, "ether");
      await freelancer.methods
        .createProject(freelancerAddr, value, title)
        .send({ from: user, value });
      
      alert("Project created successfully!");
      setFreelancerAddr("");
      setAmount("");
      setTitle("");
      onSuccess();
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project: " + error.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={createProject} className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Create New Project</h3>
      
      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Freelancer Address
        </label>
        <input
          type="text"
          placeholder="0x..."
          value={freelancerAddr}
          onChange={(e) => setFreelancerAddr(e.target.value)}
          className="w-full p-3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Project Title
        </label>
        <input
          type="text"
          placeholder="Enter project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">
          Total Amount (ETH)
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

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary py-3"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
        <button
          type="button"
          onClick={() => onSuccess()}
          className="px-6 py-3 btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ClientDashboard;
