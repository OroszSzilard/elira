#!/usr/bin/env node

/**
 * ELIRA Security Verification Script
 * Validates all security configurations and identifies issues
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue.bold('\n🔐 ELIRA SECURITY VERIFICATION'));
console.log(chalk.blue('=' .repeat(50)));

let issues = [];
let warnings = [];
let successes = [];

function checkIssue(condition, message, type = 'error') {
  if (condition) {
    if (type === 'error') issues.push(message);
    else warnings.push(message);
  } else {
    successes.push(message.replace('Missing', 'Found').replace('Exposed', 'Secured'));
  }
}

// Check environment files
console.log(chalk.yellow('\n📋 Checking Environment Configuration...'));

const envLocalPath = '.env.local';
const functionsEnvPath = 'functions/.env';
const secureDir = '../secure';

checkIssue(
  !fs.existsSync(envLocalPath),
  'Missing .env.local file for frontend configuration'
);

checkIssue(
  !fs.existsSync(functionsEnvPath), 
  'Missing functions/.env file for Cloud Functions'
);

checkIssue(
  !fs.existsSync(secureDir),
  'Missing ../secure directory for sensitive files'
);

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  
  checkIssue(
    !envContent.includes('NEXT_PUBLIC_FIREBASE_API_KEY'),
    'Missing NEXT_PUBLIC_FIREBASE_API_KEY in .env.local'
  );
  
  checkIssue(
    envContent.includes('your-firebase-api-key-here'),
    'Default placeholder values still in .env.local - REPLACE WITH REAL VALUES',
    'warning'
  );
}

if (fs.existsSync(functionsEnvPath)) {
  const functionsEnvContent = fs.readFileSync(functionsEnvPath, 'utf8');
  
  checkIssue(
    !functionsEnvContent.includes('SENDGRID_API_KEY'),
    'Missing SENDGRID_API_KEY in functions/.env'
  );
  
  checkIssue(
    !functionsEnvContent.includes('STRIPE_SECRET_KEY'),
    'Missing STRIPE_SECRET_KEY in functions/.env'
  );
  
  checkIssue(
    functionsEnvContent.includes('your-sendgrid-api-key-here'),
    'Default placeholder values still in functions/.env - REPLACE WITH REAL VALUES',
    'warning'
  );
}

// Check for exposed Firebase admin keys
console.log(chalk.yellow('\n🔑 Checking Firebase Admin Keys...'));

const adminKeyPatterns = [
  'elira-67ab7-firebase-adminsdk-fbsvc-*.json',
  '*firebase-adminsdk*.json'
];

const exposedKeys = [];
function findFiles(dir, pattern) {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
        findFiles(path.join(dir, file.name), pattern);
      } else if (file.name.includes('firebase-adminsdk')) {
        exposedKeys.push(path.join(dir, file.name));
      }
    }
  } catch (e) {
    // Ignore permission errors
  }
}

findFiles('.', '*firebase-adminsdk*.json');

checkIssue(
  exposedKeys.length > 0,
  `Exposed Firebase admin keys found: ${exposedKeys.join(', ')}`
);

// Check .gitignore
console.log(chalk.yellow('\n📝 Checking .gitignore Configuration...'));

if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  
  checkIssue(
    !gitignoreContent.includes('.env.local'),
    'Missing .env.local in .gitignore'
  );
  
  checkIssue(
    !gitignoreContent.includes('*firebase-adminsdk*.json'),
    'Missing Firebase admin SDK pattern in .gitignore'
  );
  
  checkIssue(
    !gitignoreContent.includes('secure/'),
    'Missing secure/ directory in .gitignore'
  );
} else {
  issues.push('Missing .gitignore file');
}

// Check Firestore rules
console.log(chalk.yellow('\n🔒 Checking Firestore Security Rules...'));

if (fs.existsSync('firestore.rules')) {
  const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
  
  checkIssue(
    !rulesContent.includes('request.auth != null'),
    'No authentication checks found in Firestore rules'
  );
  
  checkIssue(
    rulesContent.includes('allow read, write: if true'),
    'Overly permissive rules found (allow read, write: if true)',
    'warning'
  );
} else {
  issues.push('Missing firestore.rules file');
}

// Check Storage rules  
console.log(chalk.yellow('\n📦 Checking Storage Security Rules...'));

if (fs.existsSync('storage.rules')) {
  const storageRulesContent = fs.readFileSync('storage.rules', 'utf8');
  
  checkIssue(
    storageRulesContent.includes('allow write: if request.auth != null;') && 
    !storageRulesContent.includes('&& resource.size < 10 * 1024 * 1024'),
    'No file size limits in storage rules',
    'warning'
  );
} else {
  issues.push('Missing storage.rules file');
}

// Print results
console.log(chalk.yellow('\n🎯 VERIFICATION RESULTS'));
console.log('=' .repeat(50));

if (successes.length > 0) {
  console.log(chalk.green.bold('\n✅ PASSED CHECKS:'));
  successes.forEach(success => {
    console.log(chalk.green('  ✅ ' + success));
  });
}

if (warnings.length > 0) {
  console.log(chalk.yellow.bold('\n⚠️  WARNINGS:'));
  warnings.forEach(warning => {
    console.log(chalk.yellow('  ⚠️  ' + warning));
  });
}

if (issues.length > 0) {
  console.log(chalk.red.bold('\n❌ CRITICAL ISSUES:'));
  issues.forEach(issue => {
    console.log(chalk.red('  ❌ ' + issue));
  });
}

// Summary
console.log(chalk.blue.bold('\n📊 SUMMARY:'));
console.log(`  ✅ Passed: ${chalk.green(successes.length)}`);
console.log(`  ⚠️  Warnings: ${chalk.yellow(warnings.length)}`);  
console.log(`  ❌ Critical: ${chalk.red(issues.length)}`);

if (issues.length === 0 && warnings.length === 0) {
  console.log(chalk.green.bold('\n🎉 All security checks passed!'));
  process.exit(0);
} else if (issues.length === 0) {
  console.log(chalk.yellow.bold('\n✨ Security setup complete, but please address warnings.'));
  process.exit(0);
} else {
  console.log(chalk.red.bold('\n🚨 Critical security issues found. Please fix immediately!'));
  console.log(chalk.blue('\nRefer to SECURITY_SETUP_GUIDE.md for detailed instructions.'));
  process.exit(1);
}