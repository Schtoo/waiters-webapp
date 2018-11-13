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

    async function removingShifts() {
        let shifts = await pool.query('DELETE FROM shifts');
        return shifts.rows;
    }

    //assigning shifts to waiters
    async function assignShift(waiterName, listOfDays) {
        // console.log(listOfDays)
        let waiter = await getWaiter(waiterName);
        // delete all the shifts for the current user
        await pool.query('delete from shifts where waiter_id = $1', [waiter.id]);
        //loop over the list of days 
        for (let i = 0; i < listOfDays.length; i++) {
            let day = listOfDays[i];
            let dayIdResults = await pool.query('SELECT id FROM daysofweek WHERE day=$1', [day]);
            let dayId = dayIdResults.rows[0].id;
            await pool.query('INSERT INTO shifts (day_id, waiter_id) values ($1, $2)', [dayId, waiter.id]);
        }
    }

    async function checkedDays(name) {
        let weekdays = await getDays();
        let waiterShifts = await getshifts(name);
        for (let i = 0; i < weekdays.length; i++) {
            let dayElement = weekdays[i].day;
            for (let getshifts of waiterShifts) {
                if (dayElement === getshifts.day) {
                    weekdays[i].checked = "checked";
                }
            }
        }
        return weekdays;
    }
    //getting shifts for the waiter
    async function getshifts(name) {
        let waiterDays = await pool.query(`SELECT DISTINCT waiters.waiter, daysofweek.day FROM waiters 
         JOIN shifts ON waiters.id = shifts.waiter_id
         JOIN daysofweek ON shifts.day_id = daysofweek.id WHERE waiter=$1`, [name]);
        return waiterDays.rows;
    }
    //getting all the days
    async function getDays() {
        let allDays = await pool.query('SELECT id, day FROM daysofweek');
        return allDays.rows;
    }

    //reset everything in database
    async function resetDb() {
        let resetDatabase = await pool.query('DELETE FROM shifts');
        return resetDatabase.rows;
    }
    async function adminCheck() {
        let getAllDays = await pool.query(`SELECT * from daysofweek left join shifts on shifts.day_id=daysofweek.id
            left join waiters on waiters.id=waiter_id`);
        return getAllDays.rows;
    }
    return {
        getWaiter,
        assignShift,
        getDays,
        checkedDays,
        resetDb,
        removingShifts,
        adminCheck
    }
}