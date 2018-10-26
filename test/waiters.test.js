const assert = require('assert');
const waitersAvailable = require('../waitersFactory');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/waiter_availability';

const pool = new Pool ({
    connectionString
});

describe('Waiters', async function(){
    beforeEach (async function(){
        await pool.query('delete from waiters');
     });
     it('should give you the waiter name entered', async function(){
        let currentWaiter = waitersAvailable(pool);
        await currentWaiter.getWaiter('Greg');
        let waiters = await currentWaiter.getWaiter('Greg');
        assert.deepEqual(waiters, [{waiter: 'Greg'}]);
     });
    //  it('should give you the days a waiter will be working on', async function(){
    //      let workDays = waitersAvailable(pool);
    //      await workDays.days('Monday, Tuesday, Wednesday');
    //      let daysWorking = await workDays.days('Monday, Tuesday, Wednesday');
    //      assert.deepEqual(daysWorking, [{day: 'Monday, Tuesday, Wednesday'}]);
    //  });
     it('should give you all the shifts', async function(){
        let workDays = waitersAvailable(pool);
        await workDays.getWaiter('Schtoo')
        // await workDays.getWaiter('Schtoo')
        let shifts = await workDays.assignShift('Schtoo', ['Monday', 'Tuesday']);
     // console.log(shifts);
       assert.equal(shifts, [{waiter_id: 'Schtoo', day_id: 'Monday Tuesday'}]);
     });
});
