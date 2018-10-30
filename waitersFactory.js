module.exports = function (pool) {
    async function getWaiter(names) {
        let result = await pool.query('SELECT id FROM waiters WHERE waiter=$1', [names]);
        if (result.rowCount === 0) {
            await pool.query('INSERT into waiters (waiter) values ($1)', [names]);
            nameId = await pool.query('SELECT id FROM waiters WHERE waiter=$1', [names]);
        } else {
            nameId = await pool.query('SELECT id FROM waiters WHERE waiter=$1', [names]);
        }
        return nameId.rows[0];
    }
    //assigning shifts to waiters
    async function assignShift(names, listOfDays) {
        let waiter = await getWaiter(names);
      //  console.log('name ' + waiter.id)
        for (let i = 0; i < listOfDays.length; i++) {
            let day = listOfDays[i];
            let dayId = await pool.query('SELECT id FROM daysofweek WHERE day=$1', [day]);
            console.log(dayId.rows[0].id);
            await pool.query('INSERT INTO shifts (day_id, waiter_id) values ($1, $2)', [dayId.rows[0].id, waiter.id]);
        }
        let shifts = await pool.query('select * from shifts');
        return shifts.rows;
    }
    async function days() {
        let weekdays = await pool.query('SELECT DISTINCT waiter FROM shifts JOIN waiters ON waiters.id = shifts.waiter_id');
        return weekdays.rows;
    }
    return {
        getWaiter,
        assignShift,
        days
    }
}