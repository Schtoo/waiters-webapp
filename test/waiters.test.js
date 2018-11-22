const assert = require('assert');
const waitersAvailable = require('../waitersFactory');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_availability';

const pool = new Pool ({
    connectionString
});

describe('Waiters Web-Tests', async function(){
   //  beforeEach (async function(){
   //      await pool.query('delete from waiters');
   //   });
     it('should give you the waiter name entered', async function(){
        let currentWaiter = waitersAvailable(pool);
        //await currentWaiter.getWaiter('Greg');
        let waiters = await currentWaiter.getWaiter('Greg');
        console.log('waiter id ' + waiters)
        let waiterName = await pool.query('select waiter from waiters where id = $1',[waiters])
        console.log(waiterName.rows)
        assert.equal(waiterName.rows, [{id: '36'}]);
     });
   //   beforeEach (async function(){
   //      await pool.query('delete from waiters');
   //   });
     it('should give you all the shifts', async function(){
        let workDays = waitersAvailable(pool);
        await workDays.getWaiter('Schtoo')
        // await workDays.getWaiter('Schtoo')
        let firstDay = await workDays.assignShift('Schtoo', ['Monday', 'Tuesday']);
        firstDay = await workDays.assignShift('Tsoman', ['Tuesday', 'Wednesday']);
       assert.equal(firstDay, [{waiter_id: 'Schtoo', day_id: 'Monday'}]);
     });
   //   beforeEach (async function(){
   //      await pool.query('delete from waiters');
   //   });
     it('should give you all the shifts', async function(){
        let workDays = waitersAvailable(pool);
        await workDays.getWaiter('Schtoo')
        // await workDays.getWaiter('Schtoo')
        let firstDay = await workDays.assignShift('Schtoo', ['Monday', 'Tuesday']);
        firstDay = await workDays.assignShift('Tsoman', ['Tuesday', 'Wednesday']);
       assert.equal(firstDay, [{waiter_id: 'Schtoo', day_id: 'Monday'}]);
     });
   //   beforeEach (async function(){
   //      await pool.query('delete from waiters');
   //   });
     it('should give you all the shifts the waiter will work on', async function(){
        let workDays = waitersAvailable(pool);
        await workDays.checkedDays('Monday', 'Tuesday', 'Wednesday');
        // await workDays.getWaiter('Schtoo')
        let firstDay = await workDays.assignShift('Schtoo', ['Monday', 'Tuesday', 'Wednesday']);
        //firstDay = await workDays.assignShift('Tsoman', ['Tuesday', 'Wednesday']);
       assert.deepEqual(firstDay, [{waiter_id: 'Schtoo', day_id: ['Monday', 'Tuesday', 'Wednseday']}]);
     });
   //   beforeEach (async function(){
   //      await pool.query('delete from waiters');
   //   });
   //   it('should give you all the shifts', async function(){
   //      let workDays = waitersAvailable(pool);
   //      await workDays.getWaiter('Schtoo')
   //      // await workDays.getWaiter('Schtoo')
   //      let firstDay = await workDays.assignShift('Schtoo', ['Monday', 'Tuesday']);
   //      firstDay = await workDays.assignShift('Tsoman', ['Tuesday', 'Wednesday']);
   //     assert.equal(firstDay, [{waiter_id: 'Schtoo', day_id: 'Monday'}]);
   //   });
});
