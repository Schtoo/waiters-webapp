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
        for (let i = 0; i < listOfDays.length; i++) {
            let day = listOfDays[i];
            let dayId = await pool.query('SELECT id FROM daysofweek WHERE day=$1', [day]);
            await pool.query('INSERT INTO shifts (day_id, waiter_id) values ($1, $2)', [dayId.rows[0].id, waiter.id]);
        }
        let waiterDays = await pool.query(`SELECT DISTINCT waiters.waiter, daysofweek.day FROM waiters 
         JOIN shifts ON waiters.id = shifts.waiter_id
         JOIN daysofweek ON shifts.day_id = daysofweek.id WHERE waiter=$1`, [names]);
        return waiterDays.rows;
    }

    async function getshifts(name){
        let waiterDays = await pool.query(`SELECT DISTINCT waiters.waiter, daysofweek.day FROM waiters 
         JOIN shifts ON waiters.id = shifts.waiter_id
         JOIN daysofweek ON shifts.day_id = daysofweek.id WHERE waiter=$1`, [name]);
        return waiterDays.rows;
    }
    async function getDays() {
        let allDays = await pool.query('SELECT day FROM daysofweek');
        return allDays.rows;
    }
    async function checkedDays(name){
        let weekdays = await getDays();
        let waiterShifts = await getshifts(name);
        if(waiterShifts.rowCount === 0){
            return {
                status: 'welcome',
                message: 'Please select your shifts for the week'
            }
        } else if(waiterShifts > 0){
            return {
                status: 'update',
                message: 'Below are your shifts for the week, you could update'
            }
        }
        for (let i = 0; i < weekdays.length; i++) {
            let dayElement = weekdays[i].day;
            for (let getshifts of waiterShifts) {
                if(dayElement === getshifts.day){
                    weekdays[i].checked = "checked";
                }
            }
        }
        console.log(weekdays);
        return weekdays;
    }
    return {
        getWaiter,
        assignShift,
        getDays,
        checkedDays
    }
}