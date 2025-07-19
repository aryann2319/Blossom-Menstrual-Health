function setCycleLength(days) {
    document.getElementById('cycleLength').value = days;
}

function calculateFertility() {
    const startDate = document.getElementById('startDate').value;
    const cycleLength = parseInt(document.getElementById('cycleLength').value);

    if (!startDate || isNaN(cycleLength)) {
        alert('Please enter valid start date and cycle length');
        return;
    } 

    const periodStartDate = new Date(startDate);
    const ovulationDate = new Date(periodStartDate);
    ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14); 

    const fertileWindowStart = new Date(ovulationDate);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 3);
    const fertileWindowEnd = new Date(ovulationDate);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

    const nextPeriodDate = new Date(periodStartDate);
    nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);


    document.getElementById('fertile-window').innerHTML = `
        <h3>Fertile Window</h3>
        <div class="date">${fertileWindowStart.toDateString()} - ${fertileWindowEnd.toDateString()}</div>
        <p>The fertile window is the time period in which a woman is most likely to conceive, typically occurring around the time of ovulation.</p>
    `;

    document.getElementById('ovulation-date').innerHTML = `
        <h3>Ovulation Date</h3>          
        <div class="date">${ovulationDate.toDateString()}</div>
        <p>The ovulation date is the day when an egg is released from the ovary and can potentially be fertilized.</p>  
    `;

    document.getElementById('next-period').innerHTML = `
        <h3>Next Period Date</h3>  
        <div class="date">${nextPeriodDate.toDateString()}</div>
        <p>Your next period is expected to start around this date based on your cycle length.</p>
    `;

    document.getElementById('results').style.display = 'block';
}

