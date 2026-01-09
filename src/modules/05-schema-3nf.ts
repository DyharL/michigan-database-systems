/**
 * Module 05: Third Normal Form (3NF) Relational Schema Architecture
 * Validates relational integrity, foreign key dependencies, and cascading deletions (ON DELETE CASCADE)
 * modeling an enterprise procurement and inventory hierarchy.
 */

export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number;
  name: string;
  departmentId: number;
}

export interface ProjectAssignment {
  id: number;
  employeeId: number;
  projectName: string;
  hoursAllocated: number;
}

export class Relational3NFStore {
  public departments: Map<number, Department> = new Map();
  public employees: Map<number, Employee> = new Map();
  public assignments: Map<number, ProjectAssignment> = new Map();

  private deptSeq = 1;
  private empSeq = 1;
  private assignSeq = 1;

  public createDepartment(name: string): Department {
    const dept: Department = { id: this.deptSeq++, name };
    this.departments.set(dept.id, dept);
    return dept;
  }

  public createEmployee(name: string, departmentId: number): Employee {
    if (!this.departments.has(departmentId)) {
      throw new Error(`Foreign key constraint failed: Department ID ${departmentId} does not exist`);
    }
    const emp: Employee = { id: this.empSeq++, name, departmentId };
    this.employees.set(emp.id, emp);
    return emp;
  }

  public assignProject(employeeId: number, projectName: string, hoursAllocated: number): ProjectAssignment {
    if (!this.employees.has(employeeId)) {
      throw new Error(`Foreign key constraint failed: Employee ID ${employeeId} does not exist`);
    }
    const assign: ProjectAssignment = {
      id: this.assignSeq++,
      employeeId,
      projectName,
      hoursAllocated
    };
    this.assignments.set(assign.id, assign);
    return assign;
  }

  /**
   * Simulates PostgreSQL ON DELETE CASCADE:
   * Deleting a department automatically deletes all its employees and their project assignments.
   */
  public deleteDepartmentCascade(departmentId: number): { deletedEmployees: number; deletedAssignments: number } {
    if (!this.departments.has(departmentId)) {
      throw new Error(`Department ${departmentId} does not exist`);
    }

    // 1. Find employees in this department
    const employeeIdsToDelete: number[] = [];
    for (const [id, emp] of this.employees.entries()) {
      if (emp.departmentId === departmentId) {
        employeeIdsToDelete.push(id);
      }
    }

    // 2. Find and delete cascading assignments
    let deletedAssignments = 0;
    for (const [id, assign] of this.assignments.entries()) {
      if (employeeIdsToDelete.includes(assign.employeeId)) {
        this.assignments.delete(id);
        deletedAssignments++;
      }
    }

    // 3. Delete employees
    for (const id of employeeIdsToDelete) {
      this.employees.delete(id);
    }

    // 4. Delete department
    this.departments.delete(departmentId);

    return {
      deletedEmployees: employeeIdsToDelete.length,
      deletedAssignments
    };
  }
}
