const scriptURL = 'https://script.google.com/macros/s/AKfycbyFIjWTlqtHxcWi_5Ddq0Ubd3OsP_yQvEXk5-V-Al5pdPq1Zlt5OcnGwyZaDn6ih5b6hQ/exec'
const form = document.forms['survey-form']

var navLinks = document.getElementById("navLinks");
        
            function showMenu() {
                navLinks.style.right = "0";
            }
        
            function hideMenu() {
                navLinks.style.right = "-250px"; // Move it further to ensure it's off-screen
            }
        
            function gotoform() {
                document.getElementById("header").style.display = "none";
                document.getElementById("form").style.display = "block";
            }
        
            function backToHome() {
                document.getElementById("form").style.display = "none";
                document.getElementById("header").style.display = "block";
                document.getElementById("results").style.display = "none";
                document.getElementById("mission").style.display = "none";
                document.getElementById("vision").style.display = "none";
                document.getElementById("services").style.display = "none";
                document.getElementById("COREVALUES").style.display = "none";
            }
        
            function gotoRESULTS() {
                document.getElementById("results").style.display = "block";
                document.getElementById("header").style.display = "none";
            }

            function gotoMISSION() {
              document.getElementById("mission").style.display = "block";
              document.getElementById("header").style.display = "none";
              document.getElementById("vision").style.display = "none";
            document.getElementById("services").style.display = "none";
            document.getElementById("COREVALUES").style.display = "none";
          }

          function gotoVISION() {
            document.getElementById("vision").style.display = "block";
            document.getElementById("header").style.display = "none";
            document.getElementById("mission").style.display = "none";
            document.getElementById("services").style.display = "none";
            document.getElementById("COREVALUES").style.display = "none";
        }

        function gotoSERVICES() {
          document.getElementById("services").style.display = "block";
          document.getElementById("header").style.display = "none";
          document.getElementById("mission").style.display = "none";
            document.getElementById("vision").style.display = "none";
            document.getElementById("COREVALUES").style.display = "none";
            
      }

      function gotoCORE() {
        document.getElementById("COREVALUES").style.display = "block";
        document.getElementById("header").style.display = "none";
        document.getElementById("mission").style.display = "none";
          document.getElementById("vision").style.display = "none";
          document.getElementById("services").style.display = "none";
    }

            function gotonext() {
                var container1 = document.getElementById("container1");
                var inputs = container1.querySelectorAll("input[required], select[required]");
                var allFilled = true;

                for (var i = 0; i < inputs.length; i++) {
                if (!inputs[i].value) {
                allFilled = false;
                break; }}

                if (allFilled) {
                container1.style.display = "none";
                document.getElementById("container2").style.display = "block";
                } else {
                alert("Please fill all the required fields.");}
            }

            function gotopage1() {
                document.getElementById("home").style.display = "none";
                document.getElementById("header").style.display = "none";
                document.getElementById("container1").style.display = "block";
                document.getElementById("container2").style.display = "none";
            } 
            
            form.addEventListener('submit', e => {
                e.preventDefault();
                // Disable the submit button after one submit
                
                document.getElementById('submit').disabled = true;
                
                fetch(scriptURL, { method: 'POST', body: new FormData(form)})
                .then(response => {
                    alert("Thank you! Your form is submitted successfully.");
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    // Re-enable the submit button if there's an error
                    document.getElementById('submit').disabled = false;
                });
            });

            function OthersEnabler(selectElement){
                var Others = document.getElementById('Others');

                if (selectElement.value === 'Others') {
                    Others.style.display = 'block';
                    Others.required = true;}

                else {
                    Others.style.display = 'none';
                    Others.required = false;
                }}
            
                async function fetchSummary() {
                    try {
                      const response = await fetch(scriptURL + '?summary=true');
                      if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                      }
                      const summary = await response.json();
                  
                      // Display data
                      document.getElementById('totalResponses').textContent = summary.totalResponses;
                      document.getElementById('columns').textContent = summary.columns.join(', ');
                  
                      // Populate summary table
                      const summaryTableBody = document.getElementById('summary');
                      summaryTableBody.innerHTML = '';
                  
                      // Dropdown Fields
                      const dropdownFields = ['SERVICE AVAILED', 'AGE', 'CITIZEN TYPE', 'SEX', 'CC1', 'CC2', 'CC3', 'SQD1', 'SQD2', 'SQD3', 'SQD4', 'SQD5', 'SQD6', 'SQD7', 'SQD8']; // Add more fields as needed
                  
                      dropdownFields.forEach(field => {
                        const dropdownCounts = summary.summary[field]?.counts || {};
                        // Filter out blank or zero counts
                      const filteredCounts = Object.entries(dropdownCounts).filter(([option, count]) => option && count > 0);
                      
                      // Separate labels and data for Chart.js
                      const labels = filteredCounts.map(([option]) => option);
                      const data = filteredCounts.map(([, count]) => count);
                
                        // Update summary table
                        const row = document.createElement('tr');
                  
                        const fieldCell = document.createElement('td');
                        fieldCell.textContent = field;
                        row.appendChild(fieldCell);
                  
                        const countCell = document.createElement('td');
                        countCell.textContent = summary.summary[field]?.count || 'N/A';
                        row.appendChild(countCell);
                  
                        const uniqueCell = document.createElement('td');
                        uniqueCell.textContent = summary.summary[field]?.uniqueValues || 'N/A';
                        row.appendChild(uniqueCell);
                  
                        const averageLengthCell = document.createElement('td');
                        averageLengthCell.textContent = summary.summary[field]?.averageLength || 'N/A';
                        row.appendChild(averageLengthCell);
                  
                        const dropdownCountsCell = document.createElement('td');
                        const countsList = Object.entries(summary.summary[field]?.counts || {}).map(([option, count]) => `${option}: ${count}`).join(', ');
                        dropdownCountsCell.textContent = countsList || 'N/A';
                        row.appendChild(dropdownCountsCell);
                  
                        summaryTableBody.appendChild(row);
                  
                         // Display Pie Chart
            const ctx = field === 'SERVICE AVAILED' ? document.getElementById('ServiceAvailedPieChart').getContext('2d') :
                        field === 'AGE' ? document.getElementById('AgePieChart').getContext('2d') :
                        field === 'CITIZEN TYPE' ? document.getElementById('CitizenTypePieChart').getContext('2d') :
                        field === 'SEX' ? document.getElementById('SexPieChart').getContext('2d') :
                        field === 'CC1' ? document.getElementById('CC1PieChart').getContext('2d') :
                        field === 'CC2' ? document.getElementById('CC2PieChart').getContext('2d') :
                        field === 'CC3' ? document.getElementById('CC3PieChart').getContext('2d') :
                        field === 'SQD1' ? document.getElementById('SQD1PieChart').getContext('2d') :
                        field === 'SQD2' ? document.getElementById('SQD2PieChart').getContext('2d') :
                        field === 'SQD3' ? document.getElementById('SQD3PieChart').getContext('2d') :
                        field === 'SQD4' ? document.getElementById('SQD4PieChart').getContext('2d') :
                        field === 'SQD5' ? document.getElementById('SQD5PieChart').getContext('2d') :
                        field === 'SQD6' ? document.getElementById('SQD6PieChart').getContext('2d') :
                        field === 'SQD7' ? document.getElementById('SQD7PieChart').getContext('2d') :
                                          document.getElementById('SQD8PieChart').getContext('2d');
                  
                        new Chart(ctx, {
                          type: 'pie',
                          data: {
                            labels: labels,
                            datasets: [{
                              label: `Distribution of ${field}`,
                              data: data,
                              backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                              ],
                              borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                              ],
                              borderWidth: 1
                            }]
                          },
                          options: {
                            responsive: true,
                            plugins: {
                              legend: {
                                position: 'top',
                              },
                              title: {
                                display: true,
                                text: `Distribution of ${field}`
                              }
                            }
                          }
                        });
                      });
                      
                    } catch (error) {
                      console.error('Error fetching summary!', error.message);
                    }
                  }
                  
                  
                
                window.onload = fetchSummary;
                