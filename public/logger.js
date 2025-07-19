function calculateFertility() {
  const startDate = document.getElementById("startDate").value;
  const cycleLength = parseInt(document.getElementById("cycleLength").value);
  const periodLength = parseInt(document.getElementById("periodLength").value);

  if (!startDate || isNaN(cycleLength) || isNaN(periodLength)) {
    alert("Please enter valid start date, cycle length, and period length");
    return;
  }

  const periodStartDate = new Date(startDate);
  const periodEndDate = new Date(periodStartDate); 
  periodEndDate.setDate(periodEndDate.getDate() + periodLength - 1);
  
//future date
  const currentDate = new Date();
  if (periodEndDate >= currentDate) {
    return;
  }

  const ovulationDate = new Date(periodStartDate);
  ovulationDate.setDate(ovulationDate.getDate() + cycleLength - 14);

  const fertileWindowStart = new Date(ovulationDate);
  fertileWindowStart.setDate(fertileWindowStart.getDate() - 4);
  const fertileWindowEnd = new Date(ovulationDate);
  fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

  const nextPeriodDate = new Date(periodStartDate);
  nextPeriodDate.setDate(nextPeriodDate.getDate() + cycleLength);

  document.getElementById("fertile-window").innerHTML = `
        <h3>Fertile Window</h3>
        <div class="date">${fertileWindowStart.toDateString()} - ${fertileWindowEnd.toDateString()}</div>
        <p>The fertile window is the time period in which a woman is most likely to conceive, typically occurring around the time of ovulation.</p>`;

  document.getElementById("ovulation-date").innerHTML = `<h3>Ovulation Date</h3>          
        <div class="date">${ovulationDate.toDateString()}</div>
        <p>The ovulation date is the day when an egg is released from the ovary and can potentially be fertilized.</p>  `;

  document.getElementById("next-period").innerHTML = `
        <h3>Next Period Date</h3>  
        <div class="date">${nextPeriodDate.toDateString()}</div>
        <p>Your next period is expected to start around this date based on your cycle length.</p>`;

  document.getElementById("period-dates").innerHTML = `
        <h3>Period Dates</h3>
        <div class="date">${periodStartDate.toDateString()} - ${periodEndDate.toDateString()}</div>
        <p>Your period started from ${periodStartDate.toDateString()} and ended on ${periodEndDate.toDateString()}.</p>`;

  document.getElementById("results").style.display = "block";

  const username = localStorage.getItem('username'); 
  updateDashboard(username);

}

async function updateDashboard(username) {
  try {
    const response = await fetch(`/last-logged-period/${username}`);
    const data = await response.json();

    if (data.message) {
      alert(data.message); 
      return;
    }
    document.getElementById("lastperiod-dash").innerHTML = `Last Period Started On: ${new Date(data.start_date).toDateString()}`;
    document.getElementById("periodlength-dash").innerHTML = `Period Lasted For: ${data.period_length} Days`;
    document.getElementById("nextperiod-dash").innerHTML = `Next Period Will Start From: ${new Date(new Date(data.start_date).setDate(new Date(data.start_date).getDate() + data.cycle_length)).toDateString()}`;
    //document.getElementById("ovulation-dash").innerHTML = `Expected Ovulation Date: ${new Date(new Date(data.start_date).setDate(new Date(data.start_date).getDate() + (data.cycle_length - 14))).toDateString()}`;
  } catch (error) {
    console.error("Error fetching last period data:", error);
    alert("There was an error fetching the last period data. Please try again.");
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const username = localStorage.getItem('username'); 
  if (username) {
    updateDashboard(username);
  }
});

function calculateDueDate() {
  const startDate = document.getElementById("startpDate").value;
  const cycleLength = parseInt(document.getElementById("cyclepLength").value);

  if ( !startDate || isNaN(cycleLength)){
    alert("Please enter valid start date and cycle length");
    return;
  }

  const periodStartDate = new Date(startDate);
  const currentDate = new Date();

  if (periodStartDate > currentDate) {
    alert("You cannot log a future date.");
    return;
  }

  const dueDate = new Date(periodStartDate);
  dueDate.setDate(dueDate.getDate() + 280 + (cycleLength - 28));

  // Calculate trimester dates
  const firstTrimesterEnd = new Date(periodStartDate);
  firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + 91); 

  const secondTrimesterEnd = new Date(periodStartDate);
  secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + 186);

  const timeDiff = currentDate - periodStartDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(daysDiff / 7);
  const days = daysDiff % 7;

  const fortyWeeks = new Date(periodStartDate);
  fortyWeeks.setDate(fortyWeeks.getDate() + 280);

  if (currentDate > fortyWeeks) {
    alert("Medical attention is required: Your due date has already passed (Post-term pregnancy).");
  }


  document.getElementById("period-dates").innerHTML = `
        <h3>Your Gestational Age is ${weeks} weeks and ${days} days. You are expexted to meet your baby on ${dueDate.toDateString()}.</h3>
        <p>Gestational age is the age of pregnancy and is counted from the first day of your last menstrual period. So technically it includes two weeks during which you weren't pregnant yet.</p>`;

        document.getElementById("fertile-window").innerHTML = `
        <h3>First Trimester</h3>
        <div class="date"> ${periodStartDate.toDateString()} - ${firstTrimesterEnd.toDateString()}</div>
        <p>In this trimester, the baby’s organs, spine, and nervous system begin to form. By the end of the first trimester, the baby has developed a heartbeat, and facial features start taking shape. Many women may experience morning sickness and fatigue.</p>`;

  document.getElementById("ovulation-date").innerHTML = `
        <h3>Second Trimester Ends On</h3>
        <div class="date">${secondTrimesterEnd.toDateString()}</div>
        <p>This is often called the "growth" phase. The baby’s organs mature, and movement, known as "quickening," may be felt. The baby starts developing bones and can hear sounds. Mothers may notice increased energy levels and a visible baby bump.</p>`; 

  document.getElementById("next-period").innerHTML = `
        <h3>Third Trimester Ends On</h3>
        <div class ="date">${dueDate.toDateString()}</div>
        <p>The baby gains weight rapidly, and organs like the lungs and brain prepare for life outside the womb. The baby also starts practicing movements like kicking and sucking. Mothers may experience physical discomfort as the baby grows and prepare for labor.</p>`;
  document.getElementById("results").style.display = "block";
}


document.getElementById('btn-logout').addEventListener('click', async () => {
      try {
          const response = await fetch('/logout', { method: 'POST' });
          if (response.ok) {
              window.location.href = '/home';
          }
      } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
      }
});


document.querySelector('.calculate-btn').addEventListener('click', async (e) => {
      e.preventDefault();
      const startDate = document.getElementById("startDate").value;
      const cycleLength = parseInt(document.getElementById("cycleLength").value);
      const periodLength = parseInt(document.getElementById("periodLength").value);
      const symptoms= document.getElementById("daily-symptoms").value;
      const username = localStorage.getItem('username');

    
      try {
        const response = await fetch('/logger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, startDate, cycleLength, periodLength,symptoms })
        });
        const result = await response.json();

        const periodEndDate = new Date(startDate); 
        periodEndDate.setDate(periodEndDate.getDate() + periodLength - 1);
        const currentDate = new Date();
        if (periodEndDate >= currentDate) {
          alert("Your period is still in progress, or you've selected a future date. Enter correct dates.");
          return;
        }
        alert(result.message);
      } catch (error) {
        alert('An error occurred while logging your cycle.');
      }
});




// ------------------------------------------------------------------------------

const historyButton = document.getElementById('historyButton');
const historyModal = document.getElementById('historyModal');
const closeModal = document.querySelector('.close');
const historyTableBody = document.querySelector('#historyTable tbody');

historyButton.addEventListener('click', async () => {
  historyModal.style.display = 'block';

  const username = localStorage.getItem('username');

  try {
      const response = await fetch(`/api/history?username=${username}`);
      const historyData = await response.json();

    historyTableBody.innerHTML = '';

    const formatDate = dateString => new Date(dateString).toLocaleDateString('en-GB');

      historyData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(entry.entry_date)}</td>
            <td>${formatDate(entry.start_date)}</td>
            <td>${entry.period_length}</td>
            <td>${entry.symptoms || 'None'}</td>
        `;
        historyTableBody.appendChild(row);
    });
  } catch (error) {
      console.error('Error fetching history data:', error);
  }
});


// Event listener to close modal
closeModal.addEventListener('click', () => {
    historyModal.style.display = 'none';
});


//-----------------------------------------------------------------------------------------