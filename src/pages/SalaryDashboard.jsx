import React from 'react'
import EmployeeDashboard from './EmployeeDashboard'
import EmployeeSalary from '../components/EmployeeSalary'

const SalaryDashboard = () => {
  return (
    <div>
        <EmployeeDashboard />
        <div>
            <EmployeeSalary />
        </div>
    </div>
  )
}

export default SalaryDashboard