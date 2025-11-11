import React, { useState, useEffect } from "react";
import { web3, freelancer } from "../web3Config";

function FreelancerDashboard({ user }) {
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFreelancerData();
    }
  }, [user]);

  const fetchFreelancerData = async () => {
    setLoading(true);
    try {
      const projectIds = await freelancer.methods.getUserProjects(user).call();
      const projectData = await Promise.all(
        projectIds.map(async (id) => {
          const projectId = id.toString();
          const project = await freelancer.methods.getProject(projectId).call();
          // Filter: only show projects where user is the freelancer
          if (project.freelancer.toLowerCase() !== user.toLowerCase()) {
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
      // Filter out null values (projects where user is not the freelancer)
      setProjects(projectData.filter(item => item !== null));
    } catch (error) {
      console.error("Error fetching freelancer data:", error);
    }
    setLoading(false);
  };

  const handleSubmitMilestone = async (milestoneId) => {
    try {
      // Validate before submitting
      const milestoneIdNum = milestoneId.toString();
      const milestone = await freelancer.methods.getMilestone(milestoneIdNum).call();
      const project = await freelancer.methods.getProject(milestone.projectId).call();
      
      // Check if user is the freelancer
      const projectFreelancer = project.freelancer.toLowerCase();
      const currentUser = user.toLowerCase();
      
      console.log("Submitting milestone - Validation:");
      console.log("  Milestone ID:", milestoneIdNum);
      console.log("  Project freelancer:", projectFreelancer);
      console.log("  Current user:", currentUser);
      console.log("  Match:", projectFreelancer === currentUser);
      console.log("  Milestone status:", {
        isSubmitted: milestone.isSubmitted,
        isApproved: milestone.isApproved,
        isPaid: milestone.isPaid
      });
      
      if (projectFreelancer !== currentUser) {
        alert(`Error: You are not the freelancer assigned to this project.\n\nExpected: ${project.freelancer}\nYour address: ${user}`);
        return;
      }
      
      if (milestone.isSubmitted) {
        alert("Error: This milestone has already been submitted.");
        return;
      }
      
      if (milestone.isApproved || milestone.isPaid) {
        alert(`Error: This milestone cannot be submitted.\n\nStatus:\n- Approved: ${milestone.isApproved}\n- Paid: ${milestone.isPaid}`);
        return;
      }
      
      // Estimate gas first to catch errors early
      try {
        const gasEstimate = await freelancer.methods.submitMilestone(milestoneIdNum, "").estimateGas({ from: user });
        console.log("Gas estimate successful:", gasEstimate.toString());
      } catch (estimateError) {
        console.error("Gas estimation failed:", estimateError);
        console.error("Estimate error details:", {
          message: estimateError.message,
          reason: estimateError.reason,
          data: estimateError.data,
          code: estimateError.code
        });
        
        let estimateMsg = estimateError.reason || estimateError.message || 'Unknown error';
        
        // Extract revert reason from various formats
        if (estimateError.data) {
          if (typeof estimateError.data === 'string' && estimateError.data.includes('revert')) {
            const revertMatch = estimateError.data.match(/revert\s+["']?([^"']+)["']?/i);
            if (revertMatch && revertMatch[1]) {
              estimateMsg = revertMatch[1].trim();
            }
          } else if (estimateError.data.message) {
            estimateMsg = estimateError.data.message;
          }
        }
        
        // Try to extract from message
        if (estimateMsg.includes('revert') || estimateMsg.includes('reverted')) {
          const patterns = [
            /revert\s+["']([^"']+)["']/i,
            /revert\s+([^\s]+)/i,
            /execution reverted[:\s]+["']?([^"']+)["']?/i,
            /execution reverted[:\s]+(.+?)(?:\n|$)/i
          ];
          
          for (const pattern of patterns) {
            const match = estimateMsg.match(pattern);
            if (match && match[1] && match[1] !== '0x') {
              estimateMsg = match[1].trim();
              break;
            }
          }
        }
        
        console.error("Extracted error message:", estimateMsg);
        throw new Error(estimateMsg);
      }
      
      // Submit milestone
      await freelancer.methods.submitMilestone(milestoneIdNum, "").send({ 
        from: user,
        gas: 200000
      });
      
      alert("Milestone submitted successfully! The client can now approve and release payment.");
      fetchFreelancerData(); // Refresh to show updated status
    } catch (error) {
      console.error("Error submitting milestone:", error);
      console.error("Error type:", typeof error);
      console.error("Error keys:", Object.keys(error));
      console.error("Full error object:", error);
      
      // Try to decode error from various sources
      let errorMsg = 'Unknown error';
      let decodedReason = null;
      
      // Check error.reason first (web3.js v4)
      if (error.reason) {
        errorMsg = error.reason;
        decodedReason = error.reason;
      }
      // Check error.data for encoded error
      else if (error.data) {
        console.error("Error data:", error.data);
        if (typeof error.data === 'string') {
          errorMsg = error.data;
        } else if (error.data.message) {
          errorMsg = error.data.message;
        } else if (error.data.reason) {
          errorMsg = error.data.reason;
        }
        
        // Try to decode if it's hex-encoded
        if (error.data.startsWith && error.data.startsWith('0x')) {
          try {
            // Try to decode as string
            const decoded = web3.utils.toUtf8(error.data);
            if (decoded && decoded.length > 0) {
              decodedReason = decoded;
            }
          } catch (e) {
            console.error("Could not decode error data:", e);
          }
        }
      }
      // Check error.message
      else if (error.message) {
        errorMsg = error.message;
        
        // Try to extract revert reason from message
        if (errorMsg.includes('revert') || errorMsg.includes('reverted')) {
          const patterns = [
            /revert\s+["']([^"']+)["']/i,
            /revert\s+([^\s]+)/i,
            /execution reverted[:\s]+["']?([^"']+)["']?/i,
            /execution reverted[:\s]+(.+?)(?:\n|$)/i,
            /VM Exception while processing transaction: revert\s+([^\s]+)/i
          ];
          
          for (const pattern of patterns) {
            const match = errorMsg.match(pattern);
            if (match && match[1] && match[1] !== '0x') {
              decodedReason = match[1].trim();
              errorMsg = decodedReason;
              break;
            }
          }
        }
      }
      
      // Use decoded reason if available
      if (decodedReason) {
        errorMsg = decodedReason;
      }
      
      console.error("Final error message:", errorMsg);
      
      // User-friendly error messages based on common revert reasons
      const lowerMsg = errorMsg.toLowerCase();
      if (lowerMsg.includes('only freelancer') || lowerMsg.includes('not the freelancer')) {
        errorMsg = 'Error: You are not the freelancer assigned to this project.';
      } else if (lowerMsg.includes('already submitted') || lowerMsg.includes('already submitted')) {
        errorMsg = 'Error: This milestone has already been submitted.';
      } else if (lowerMsg.includes('already approved')) {
        errorMsg = 'Error: This milestone has already been approved.';
      } else if (lowerMsg.includes('already paid')) {
        errorMsg = 'Error: This milestone has already been paid.';
      } else if (lowerMsg.includes('does not exist') || lowerMsg.includes('milestone does not exist')) {
        errorMsg = 'Error: This milestone does not exist.';
      } else if (lowerMsg.includes('execution reverted') && errorMsg.toLowerCase() === 'execution reverted') {
        errorMsg = 'Error: Transaction reverted. The milestone may already be submitted, approved, or paid. Check the console for validation details above.';
      }
      
      alert("Error submitting milestone: " + errorMsg + "\n\nCheck browser console (F12) for detailed logs.");
    }
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
        <h2 className="text-2xl font-bold mb-2 text-white">Freelancer Dashboard</h2>
        <p className="text-gray-400">Manage your projects and track milestone payments</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
          <p className="text-gray-400">You haven't been assigned to any projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map(({ project, milestones }, index) => (
            <div key={project.id.toString()} className="card-modern overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400">Client: {formatAddress(project.client)}</p>
                    <p className="text-gray-400">Total Amount: {formatEther(project.totalAmount)} ETH</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.isCompleted, milestones)}`}>
                    {getStatusText(project.isCompleted, milestones)}
                  </span>
                </div>

                {milestones.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Milestones</h4>
                    <div className="space-y-3">
                      {milestones.map((milestone, milestoneIndex) => (
                        <div key={milestone.id.toString()} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-white">{milestone.description}</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Amount: {formatEther(milestone.amount)} ETH
                              </p>
                              
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                milestone.isPaid 
                                  ? 'status-completed' 
                                  : milestone.isApproved 
                                    ? 'status-approved'
                                    : milestone.isSubmitted
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'status-pending'
                              }`}>
                                {milestone.isPaid 
                                  ? 'Paid' 
                                  : milestone.isApproved 
                                    ? 'Approved' 
                                    : milestone.isSubmitted
                                      ? 'Submitted'
                                      : 'Not Submitted'}
                              </span>
                              
                              {/* Submit button for unsubmitted milestones */}
                              {!milestone.isSubmitted && !milestone.isApproved && !milestone.isPaid && (
                                <button
                                  onClick={() => handleSubmitMilestone(milestone.id.toString())}
                                  className="btn-primary text-xs px-3 py-1"
                                >
                                  Submit Work
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

export default FreelancerDashboard;
