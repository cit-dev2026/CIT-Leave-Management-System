#!/usr/bin/env node

/**
 * scripts/seed-dev-data.mjs
 * 
 * Seeds development database with realistic master data.
 * Creates: Companies, Departments, Job Titles, Employees, Leave Types, Holidays, etc.
 * 
 * Usage: npm run seed (add to package.json scripts)
 * Or: node scripts/seed-dev-data.mjs
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const envPath = path.join(__dirname, '../.env')
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found')
  process.exit(1)
}

const envContent = fs.readFileSync(envPath, 'utf8')
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=')
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = value.join('=').trim()
  }
})

const supabaseUrl = process.env.VITE_SUPABASE_URL
let supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.log('\n⚠️  SUPABASE_SERVICE_KEY not found in .env')
  console.log('To add it:')
  console.log('1. Go to https://app.supabase.com/project/szqlrclavwrxcjkwbasd/settings/api')
  console.log('2. Copy the "service_role" key (NOT the anon key)')
  console.log('3. Add to .env: SUPABASE_SERVICE_KEY=<your-service-key>')
  console.log('4. Run: npm run seed\n')
  
  // Try to use anon key with RLS bypass if available
  console.log('Attempting to use anon key with RLS workaround...')
  supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseServiceKey) {
    console.error('❌ Could not find any usable key')
    process.exit(1)
  }
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper functions
async function insertData(table, data) {
  try {
    const { data: result, error } = await supabase.from(table).insert(data).select()
    if (error) throw error
    return result
  } catch (error) {
    console.error(`  ❌ Failed to insert into ${table}:`, error.message)
    throw error
  }
}

async function seedMasterData() {
  console.log('\n=== Seeding CIT HRMS Development Data ===\n')

  try {
    // 1. Companies
    console.log('📦 1. Inserting Companies...')
    const companies = await insertData('companies', [
      {
        code: 'CIT',
        name: 'CIT Global Solutions',
        is_active: true,
      },
      {
        code: 'CITTECH',
        name: 'CIT Technologies Division',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${companies.length} companies`)
    const companyId = companies[0].id
    const companyId2 = companies[1].id

    // 2. Departments
    console.log('📦 2. Inserting Departments...')
    const departments = await insertData('departments', [
      {
        company_id: companyId,
        code: 'HR',
        name: 'Human Resources',
        is_active: true,
      },
      {
        company_id: companyId,
        code: 'IT',
        name: 'Information Technology',
        is_active: true,
      },
      {
        company_id: companyId,
        code: 'SALES',
        name: 'Sales & Marketing',
        is_active: true,
      },
      {
        company_id: companyId,
        code: 'OPS',
        name: 'Operations',
        is_active: true,
      },
      {
        company_id: companyId2,
        code: 'DEV',
        name: 'Development',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${departments.length} departments`)
    const deptHR = departments[0].id
    const deptIT = departments[1].id
    const deptSales = departments[2].id
    const deptDev = departments[4].id

    // 3. Branches
    console.log('📦 3. Inserting Branches...')
    const branches = await insertData('branches', [
      {
        company_id: companyId,
        code: 'HQ',
        name: 'Head Quarter - Singapore',
        is_active: true,
      },
      {
        company_id: companyId,
        code: 'MALH',
        name: 'Malaysia - Kuala Lumpur',
        is_active: true,
      },
      {
        company_id: companyId2,
        code: 'BNG',
        name: 'Bangalore, India',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${branches.length} branches`)
    const branchHQ = branches[0].id
    const branchMal = branches[1].id
    const branchBng = branches[2].id

    // 4. Locations
    console.log('📦 4. Inserting Locations...')
    const locations = await insertData('locations', [
      {
        branch_id: branchHQ,
        code: 'SG-101',
        name: 'Level 1 - Main Office',
        address_line_1: '100 Merchant Road',
        city: 'Singapore',
        country: 'Singapore',
        is_active: true,
      },
      {
        branch_id: branchHQ,
        code: 'SG-102',
        name: 'Level 2 - Training Center',
        address_line_1: '100 Merchant Road',
        city: 'Singapore',
        country: 'Singapore',
        is_active: true,
      },
      {
        branch_id: branchMal,
        code: 'MY-101',
        name: 'Kuala Lumpur Office',
        address_line_1: 'Petronas Twin Towers',
        city: 'Kuala Lumpur',
        country: 'Malaysia',
        is_active: true,
      },
      {
        branch_id: branchBng,
        code: 'IN-101',
        name: 'Bangalore Tech Hub',
        address_line_1: 'IT Park, Whitefield',
        city: 'Bangalore',
        country: 'India',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${locations.length} locations`)

    // 5. Business Units
    console.log('📦 5. Inserting Business Units...')
    const businessUnits = await insertData('business_units', [
      {
        company_id: companyId,
        code: 'SERVICES',
        name: 'Professional Services',
        is_active: true,
      },
      {
        company_id: companyId,
        code: 'CONSULTING',
        name: 'Consulting',
        is_active: true,
      },
      {
        company_id: companyId2,
        code: 'PRODUCTS',
        name: 'Software Products',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${businessUnits.length} business units`)

    // 6. Job Titles
    console.log('📦 6. Inserting Job Titles...')
    const jobTitles = await insertData('job_titles', [
      {
        code: 'CEO',
        name: 'Chief Executive Officer',
        is_active: true,
      },
      {
        code: 'HRHEAD',
        name: 'HR Head',
        is_active: true,
      },
      {
        code: 'HRMGR',
        name: 'HR Manager',
        is_active: true,
      },
      {
        code: 'HROFC',
        name: 'HR Officer',
        is_active: true,
      },
      {
        code: 'ITHEAD',
        name: 'IT Director',
        is_active: true,
      },
      {
        code: 'ITMGR',
        name: 'IT Manager',
        is_active: true,
      },
      {
        code: 'SOFTENG',
        name: 'Software Engineer',
        is_active: true,
      },
      {
        code: 'SALES',
        name: 'Sales Executive',
        is_active: true,
      },
      {
        code: 'ACME',
        name: 'Finance Officer',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${jobTitles.length} job titles`)
    const jobHRHead = jobTitles[1].id
    const jobSoftEng = jobTitles[6].id
    const jobCEO = jobTitles[0].id

    // 7. Grades
    console.log('📦 7. Inserting Grades...')
    const grades = await insertData('grades', [
      { code: 'E1', name: 'Executive Level', rank_order: 1, is_active: true },
      { code: 'M1', name: 'Senior Manager', rank_order: 2, is_active: true },
      { code: 'M2', name: 'Manager', rank_order: 3, is_active: true },
      { code: 'S1', name: 'Senior Staff', rank_order: 4, is_active: true },
      { code: 'S2', name: 'Staff', rank_order: 5, is_active: true },
      { code: 'J1', name: 'Junior Staff', rank_order: 6, is_active: true },
    ])
    console.log(`   ✅ Created ${grades.length} grades`)
    const gradeE1 = grades[0].id
    const gradeS1 = grades[3].id

    // 8. Pay Scales
    console.log('📦 8. Inserting Pay Scales...')
    const payScales = await insertData('pay_scales', [
      {
        grade_id: gradeE1,
        min_amount: 120000,
        max_amount: 180000,
        currency_code: 'USD',
        is_active: true,
      },
      {
        grade_id: gradeS1,
        min_amount: 60000,
        max_amount: 90000,
        currency_code: 'USD',
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${payScales.length} pay scales`)

    // 9. Shifts
    console.log('📦 9. Inserting Shifts...')
    const shifts = await insertData('shifts', [
      { code: 'STD', name: 'Standard Shift', start_time: '09:00', end_time: '18:00', is_night_shift: false, is_active: true },
      { code: 'EARLY', name: 'Early Shift', start_time: '07:00', end_time: '16:00', is_night_shift: false, is_active: true },
      { code: 'LATE', name: 'Late Shift', start_time: '12:00', end_time: '21:00', is_night_shift: false, is_active: true },
      { code: 'NIGHT', name: 'Night Shift', start_time: '22:00', end_time: '06:00', is_night_shift: true, is_active: true },
    ])
    console.log(`   ✅ Created ${shifts.length} shifts`)
    const shiftStd = shifts[0].id

    // 10. Leave Types
    console.log('📦 10. Inserting Leave Types...')
    const leaveTypes = await insertData('leave_types', [
      {
        code: 'AL',
        name: 'Annual Leave',
        default_quota: 20,
        requires_attachment: false,
        is_paid: true,
        is_active: true,
      },
      {
        code: 'SL',
        name: 'Sick Leave',
        default_quota: 10,
        requires_attachment: true,
        is_paid: true,
        is_active: true,
      },
      {
        code: 'EL',
        name: 'Emergency Leave',
        default_quota: 3,
        requires_attachment: false,
        is_paid: true,
        is_active: true,
      },
      {
        code: 'UL',
        name: 'Unpaid Leave',
        default_quota: 5,
        requires_attachment: false,
        is_paid: false,
        is_active: true,
      },
      {
        code: 'ML',
        name: 'Maternity Leave',
        default_quota: 60,
        requires_attachment: false,
        is_paid: true,
        is_active: true,
      },
    ])
    console.log(`   ✅ Created ${leaveTypes.length} leave types`)

    // 11. Employment Types
    console.log('📦 11. Inserting Employment Types...')
    const empTypes = await insertData('employment_types', [
      { code: 'FT', name: 'Full Time', is_active: true },
      { code: 'PT', name: 'Part Time', is_active: true },
      { code: 'CTR', name: 'Contractor', is_active: true },
      { code: 'INTERN', name: 'Intern', is_active: true },
    ])
    console.log(`   ✅ Created ${empTypes.length} employment types`)
    const empFullTime = empTypes[0].id

    // 12. Employee Statuses
    console.log('📦 12. Inserting Employee Statuses...')
    const empStatuses = await insertData('employee_statuses', [
      { code: 'ACTIVE', name: 'Active', is_active: true },
      { code: 'INACTIVE', name: 'Inactive', is_active: true },
      { code: 'ONLEAVE', name: 'On Leave', is_active: true },
      { code: 'SUSPENDED', name: 'Suspended', is_active: true },
    ])
    console.log(`   ✅ Created ${empStatuses.length} employee statuses`)
    const statusActive = empStatuses[0].id

    // 13. Cost Centres
    console.log('📦 13. Inserting Cost Centres...')
    const costCentres = await insertData('cost_centres', [
      { company_id: companyId, code: 'CC-HR', name: 'HR Department', is_active: true },
      { company_id: companyId, code: 'CC-IT', name: 'IT Department', is_active: true },
      { company_id: companyId2, code: 'CC-DEV', name: 'Development', is_active: true },
    ])
    console.log(`   ✅ Created ${costCentres.length} cost centres`)

    // 14. Nationalities
    console.log('📦 14. Inserting Nationalities...')
    const nationalities = await insertData('nationalities', [
      { iso_code: 'SG', name: 'Singapore', is_active: true },
      { iso_code: 'MY', name: 'Malaysia', is_active: true },
      { iso_code: 'IN', name: 'India', is_active: true },
      { iso_code: 'US', name: 'United States', is_active: true },
      { iso_code: 'GB', name: 'United Kingdom', is_active: true },
    ])
    console.log(`   ✅ Created ${nationalities.length} nationalities`)

    // 15. Document Types
    console.log('📦 15. Inserting Document Types...')
    const docTypes = await insertData('document_types', [
      { code: 'PASSPORT', name: 'Passport', category: 'Identity', is_active: true },
      { code: 'IC', name: 'National ID', category: 'Identity', is_active: true },
      { code: 'VISA', name: 'Visa', category: 'Work Authorization', is_active: true },
      { code: 'CERT', name: 'Professional Certificate', category: 'Qualification', is_active: true },
    ])
    console.log(`   ✅ Created ${docTypes.length} document types`)

    // 16. Public Holidays
    console.log('📦 16. Inserting Public Holidays...')
    const currentYear = new Date().getFullYear()
    const holidays = await insertData('holiday_calendar', [
      { company_id: companyId, holiday_date: `${currentYear}-01-01`, holiday_name: 'New Year', is_national: true },
      { company_id: companyId, holiday_date: `${currentYear}-02-10`, holiday_name: 'Chinese New Year', is_national: true },
      { company_id: companyId, holiday_date: `${currentYear}-05-01`, holiday_name: 'Labour Day', is_national: true },
      { company_id: companyId, holiday_date: `${currentYear}-12-25`, holiday_name: 'Christmas', is_national: true },
    ])
    console.log(`   ✅ Created ${holidays.length} public holidays`)

    // 17. Employees
    console.log('📦 17. Inserting Employees (Test Data)...')
    const employees = await insertData('employees', [
      {
        employee_number: 'EMP-001',
        company_id: companyId,
        department_id: deptHR,
        branch_id: branchHQ,
        job_title_id: jobHRHead,
        grade_id: gradeE1,
        shift_id: shiftStd,
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah.johnson@cit.com',
        phone_number: '+65-9123-4567',
        gender: 'Female',
        hire_date: '2022-01-15',
        employment_type: 'Full Time',
        status: 'Active',
      },
      {
        employee_number: 'EMP-002',
        company_id: companyId,
        department_id: deptIT,
        branch_id: branchHQ,
        job_title_id: jobSoftEng,
        grade_id: gradeS1,
        shift_id: shiftStd,
        first_name: 'Alex',
        last_name: 'Chen',
        email: 'alex.chen@cit.com',
        phone_number: '+65-9876-5432',
        gender: 'Male',
        hire_date: '2023-06-01',
        employment_type: 'Full Time',
        status: 'Active',
      },
      {
        employee_number: 'EMP-003',
        company_id: companyId,
        department_id: deptSales,
        branch_id: branchMal,
        first_name: 'Maya',
        last_name: 'Patel',
        email: 'maya.patel@cit.com',
        phone_number: '+60-1234-5678',
        gender: 'Female',
        hire_date: '2023-03-10',
        employment_type: 'Full Time',
        status: 'Active',
      },
      {
        employee_number: 'EMP-004',
        company_id: companyId2,
        department_id: deptDev,
        branch_id: branchBng,
        job_title_id: jobSoftEng,
        first_name: 'Rajesh',
        last_name: 'Kumar',
        email: 'rajesh.kumar@cit.com',
        phone_number: '+91-98765-43210',
        gender: 'Male',
        hire_date: '2023-08-15',
        employment_type: 'Full Time',
        status: 'Active',
      },
    ])
    console.log(`   ✅ Created ${employees.length} employees`)

    // 18. Employee Salary (Link employees to pay scales)
    console.log('📦 18. Inserting Employee Salary Records...')
    const payScaleE1 = payScales[0].id
    const payScaleS1 = payScales[1].id

    const salaries = await insertData('employee_salary', [
      {
        employee_id: employees[0].id,
        pay_scale_id: payScaleE1,
        base_salary: 150000,
        currency_code: 'USD',
        effective_from: '2024-01-01',
      },
      {
        employee_id: employees[1].id,
        pay_scale_id: payScaleS1,
        base_salary: 75000,
        currency_code: 'USD',
        effective_from: '2023-06-01',
      },
      {
        employee_id: employees[2].id,
        base_salary: 55000,
        currency_code: 'USD',
        effective_from: '2023-03-10',
      },
      {
        employee_id: employees[3].id,
        base_salary: 70000,
        currency_code: 'USD',
        effective_from: '2023-08-15',
      },
    ])
    console.log(`   ✅ Created ${salaries.length} salary records`)

    // 19. Leave Balances (Initialize for current year)
    console.log('📦 19. Inserting Leave Balances...')
    const leaveAL = leaveTypes[0].id
    const leaveSL = leaveTypes[1].id

    const balances = await insertData('leave_balances', [
      {
        employee_id: employees[0].id,
        leave_type_id: leaveAL,
        balance_year: currentYear,
        opening_balance: 20,
        accrued: 0,
        used: 0,
        carried_forward: 0,
      },
      {
        employee_id: employees[0].id,
        leave_type_id: leaveSL,
        balance_year: currentYear,
        opening_balance: 10,
        accrued: 0,
        used: 0,
        carried_forward: 0,
      },
      {
        employee_id: employees[1].id,
        leave_type_id: leaveAL,
        balance_year: currentYear,
        opening_balance: 15,
        accrued: 5,
        used: 2,
        carried_forward: 0,
      },
    ])
    console.log(`   ✅ Created ${balances.length} leave balances`)

    console.log('\n=== ✅ Seed Complete! ===\n')
    console.log('Summary:')
    console.log(`  - ${companies.length} companies`)
    console.log(`  - ${departments.length} departments`)
    console.log(`  - ${branches.length} branches`)
    console.log(`  - ${locations.length} locations`)
    console.log(`  - ${jobTitles.length} job titles`)
    console.log(`  - ${leaveTypes.length} leave types`)
    console.log(`  - ${employees.length} employees`)
    console.log(`  - ${salaries.length} salary records`)
    console.log(`  - ${balances.length} leave balances\n`)

    process.exit(0)
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message)
    process.exit(1)
  }
}

seedMasterData()
