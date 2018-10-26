module.exports = function (pool) {
    async function getWaiter(name) {
        let names = name;
       if(names !== ''){
            let result = await pool.query('SELECT waiter FROM waiters WHERE waiter=$1', [names]);
          //  console.log(result.rowCount)
        if(result.rowCount === 0){
          //  console.log('I am in')
            await pool.query('INSERT into waiters (waiter) values ($1)', [names]);
          //  console.log('I have queried')

        }
      //  console.log(result.rows)
        return result.rows;
    }
}

//'greg', ['Monday','Tuesday']
async function assignShift(name, listOfDays) {
    let nameId = await pool.query('SELECT id FROM waiters WHERE waiter=$1', [name]);
   for(let i=0; i<listOfDays.length; i++){
        let dayIndex = listOfDays[i];
       console.log(dayIndex);        
        let dayId = await pool.query('SELECT id FROM daysofweek WHERE day=$1', [dayIndex]);
       // console.log(dayId.rows)
        await pool.query('INSERT INTO shifts (waiter_id, day_id) values ($1, $2)', [nameId.rows[0].id, dayId.rows[0].id]);
    }
        let shifts = await pool.query('select * from shifts');
        return shifts.rows;
}
    async function days(data){
        let weekdays = await pool.query('SELECT DISTINCT waiter FROM shifts JOIN waiters ON waiters.id = shifts.waiter_id');
        return weekdays.rows;
    }
    return {
        getWaiter,
        assignShift,
        days
    }
}
