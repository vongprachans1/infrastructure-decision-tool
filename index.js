// Require the readline-sync package for user input
var readlineSync = require('readline-sync');

// Part A: Subnet Host Checker
function runSubnetHostChecker() {
  console.log('\n--- Subnet Host Checker ---');
  var vpc = parseInt(readlineSync.question('Enter VPC CIDR prefix (16-30): ').replace('/', ''), 10);
  var subnet = parseInt(readlineSync.question('Enter Subnet CIDR prefix (16-30): ').replace('/', ''), 10);
  var devices = readlineSync.questionInt('Enter number of devices required: ');

  console.log('\n--- Results ---');
  console.log('Consistency: ' + (subnet >= vpc ? 'VALID' : 'INVALID'));

  // Calculate usable IPs (Total IPs minus 5 AWS reserved)
  var usableIps = Math.max(0, (2 ** (32 - subnet)) - 5);
  console.log('Usable IPs: ' + usableIps + ' | Requested: ' + devices);
  console.log('Sufficiency: ' + (usableIps >= devices ? 'SUFFICIENT (Unused: ' + (usableIps - devices) + ')' : 'INSUFFICIENT (Needed: ' + (devices - usableIps) + ')'));
}

// Part B: Compute Environment Selector
function runComputeEnvironmentSelector() {
  console.log('\n--- Compute Environment Selector ---');
  var app = readlineSync.question('Enter application name: ');
  var users = readlineSync.questionInt('Enter monthly users: ');
  var budget = readlineSync.questionFloat('Enter monthly budget ($): ');
  var ha = readlineSync.question('High availability required? (yes/no): ').toLowerCase().startsWith('y');

  // Determine architecture tier based on monthly users and high availability
  var tier = (users > 10000 || ha) ? 3 : (users >= 1000 ? 2 : 1);
  var arches = { 1: 'Single EC2', 2: 'EC2 + Load Balancer', 3: 'EC2 + Load Balancer + Auto Scaling' };

  console.log('\n--- Architecture Recommendation for ' + app + ' ---');
  console.log('Recommended Architecture: ' + arches[tier]);

  // Check budget thresholds and display warnings if needed
  if (budget < 1000 && tier > 1) {
    console.log('WARNING: Budget under $1,000, but architecture requires more than a single EC2.');
  } else if (budget <= 3000 && tier === 3) {
    console.log('WARNING: Budget between $1,000 and $3,000, but architecture requires Auto Scaling.');
  }
}

// Main Menu Loop allowing multiple runs
console.log('====================================');
console.log('   Infrastructure Decision Tool     ');
console.log('====================================');

var running = true;
while (running) {
  var choice = readlineSync.question('\n1. Subnet Host Checker\n2. Compute Environment Selector\n3. Exit\nEnter choice: ').trim();
  
  if (choice === '1') {
    runSubnetHostChecker();
  } else if (choice === '2') {
    runComputeEnvironmentSelector();
  } else if (choice === '3') {
    console.log('Goodbye!');
    running = false;
  } else {
    console.log('Invalid choice.');
  }
}