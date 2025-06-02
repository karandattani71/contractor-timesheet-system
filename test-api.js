const fs = require('fs');
const path = require('path');

console.log('🔍 Contractor Timesheet System - Project Structure Analysis\n');

// Check if all required files exist
const requiredFiles = [
  'src/app.module.ts',
  'src/main.ts',
  'src/modules/auth/auth.controller.ts',
  'src/modules/users/users.controller.ts',
  'src/modules/timesheets/timesheets.controller.ts',
  'src/modules/reports/reports.controller.ts',
  'src/database/entities/user.entity.ts',
  'src/database/entities/timesheet.entity.ts',
  'package.json',
  'Dockerfile',
  'docker-compose.yml'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json scripts
console.log('\n📦 Available npm scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  Object.keys(packageJson.scripts).forEach(script => {
    console.log(`✅ npm run ${script}`);
  });
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Check if build was successful
console.log('\n🔨 Build status:');
const distExists = fs.existsSync('dist');
console.log(`${distExists ? '✅' : '❌'} Build output (dist folder)`);

console.log('\n🚀 Next steps for testing:');
console.log('1. Set up PostgreSQL database (local or Docker)');
console.log('2. Configure .env file with database credentials');
console.log('3. Run: npm run start:dev');
console.log('4. Visit: http://localhost:3000/api/docs (Swagger UI)');
console.log('5. Run: npm run seed (to populate test data)');

console.log('\n📚 API Endpoints available:');
console.log('• POST /auth/login - User authentication');
console.log('• GET /users - List users (Admin/Recruiter)');
console.log('• POST /timesheets - Create timesheet (Contractor)');
console.log('• GET /timesheets - List timesheets (Role-based)');
console.log('• PATCH /timesheets/:id/approve - Approve (Recruiter)');
console.log('• PATCH /timesheets/:id/reject - Reject (Recruiter)');
console.log('• GET /reports/export - Export data (Admin)');

console.log('\n🔐 Test users (after seeding):');
console.log('• admin@example.com (Admin)');
console.log('• recruiter@example.com (Recruiter)');
console.log('• contractor1@example.com (Contractor)');
console.log('• contractor2@example.com (Contractor)'); 