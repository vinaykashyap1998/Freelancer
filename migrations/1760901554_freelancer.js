const Freelancer = artifacts.require("Freelancer");

module.exports = async function (deployer) {
  // Deploy the Freelancer contract
  await deployer.deploy(Freelancer);
};
