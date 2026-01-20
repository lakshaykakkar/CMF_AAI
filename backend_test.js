// Native fetch is available in Node 18+

// Helper to pause
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runTest() {
    const BASE_URL = 'http://localhost:5001/api';

    console.log('--- Starting Backend Test ---');

    // 1. Register User (Requester)
    console.log('1. Registering Requester...');
    const registerRes = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'testuser_' + Date.now(),
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            role: 'Requester',
            designation: 'Dev',
            department: 'IT'
        })
    });

    if (!registerRes.ok) {
        console.error('Registration failed:', registerRes.status, registerRes.statusText);
        console.error('Body:', await registerRes.text());
        return;
    }
    const registerData = await registerRes.json();
    console.log('✅ Registered:', registerData.user.username);
    const token = registerData.token;

    // 2. Create Change Request
    console.log('2. Creating Change Request...');
    const crRes = await fetch(`${BASE_URL}/requests`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            projectDepartment: 'IT Infra',
            description: 'Upgrade Server RAM',
            reason: 'Performance issues',
            priority: 'P2-Medium',
            usersAffected: 'All',
            plannedStart: new Date(),
            plannedEnd: new Date(Date.now() + 3600000),
            implementationPlan: 'Shut down, swap RAM, restart',
            rollbackPlan: 'Revert to old RAM'
        })
    });

    if (!crRes.ok) {
        console.error('Create CR failed:', await crRes.text());
        return;
    }
    const crData = await crRes.json();
    console.log('✅ CR Created:', crData._id);

    console.log('--- Test Passed ---');
}

runTest().catch(console.error);
