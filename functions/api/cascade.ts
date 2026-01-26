import { Relational3NFStore } from '../_lib/modules/05-schema-3nf.ts';

export const onRequest: PagesFunction = async () => {
  const store = new Relational3NFStore();
  const dept = store.createDepartment('Engineering & Infrastructure');
  const emp1 = store.createEmployee('Distributed Systems Lead', dept.id);
  const emp2 = store.createEmployee('Database Architect', dept.id);
  store.assignProject(emp1.id, 'PostgreSQL 17 Migration', 35);
  store.assignProject(emp2.id, 'GIN Indexing Benchmarks', 40);

  const before = { departments: store.departments.size, employees: store.employees.size, assignments: store.assignments.size };
  const cascadeResult = store.deleteDepartmentCascade(dept.id);
  const after = { departments: store.departments.size, employees: store.employees.size, assignments: store.assignments.size };

  return new Response(JSON.stringify({ before, cascadeResult, after }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
};
