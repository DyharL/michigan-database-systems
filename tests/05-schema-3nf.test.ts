import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Relational3NFStore } from '../src/modules/05-schema-3nf.js';

describe('Module 05: 3NF Schema & Cascading Deletes', () => {
  it('enforces foreign key constraints and cascades department deletion to child tables', () => {
    const store = new Relational3NFStore();

    const dept = store.createDepartment('Distributed Infrastructure');
    const emp1 = store.createEmployee('System Architect', dept.id);
    const emp2 = store.createEmployee('Data Engineer', dept.id);

    store.assignProject(emp1.id, 'PostgreSQL Migration', 40);
    store.assignProject(emp2.id, 'GIN Index Benchmarks', 35);

    assert.equal(store.departments.size, 1);
    assert.equal(store.employees.size, 2);
    assert.equal(store.assignments.size, 2);

    // Attempting to create employee with invalid department ID throws constraint error
    assert.throws(() => {
      store.createEmployee('Rogue Agent', 9999);
    }, /Foreign key constraint failed/);

    // Cascading delete
    const result = store.deleteDepartmentCascade(dept.id);
    assert.equal(result.deletedEmployees, 2);
    assert.equal(result.deletedAssignments, 2);

    assert.equal(store.departments.size, 0);
    assert.equal(store.employees.size, 0);
    assert.equal(store.assignments.size, 0);
  });
});
