/* eslint-disable global-require *//* eslint-env mocha */describe('Integration Tests', () => {
  describe('Terraform v0.11.x', () => {
    require('./0.11/destroy.test');
    require('./0.11/plan.test');
  });

  describe('Terraform v0.12.x', () => {
    require('./0.12/destroy.test');
    require('./0.12/plan.test');
  });

  describe('Terraform v0.13.x', () => {
    require('./0.13/destroy.test');
    require('./0.13/plan.test');
  });

  describe('Terraform v0.14.x', () => {
    require('./0.14/destroy.test');
    require('./0.14/plan.test');
  });

  describe('Terraform v0.15.x', () => {
    require('./0.15/init.test');
  });
});
