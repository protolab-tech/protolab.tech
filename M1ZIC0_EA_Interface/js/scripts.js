// getAPIKey.js
function getAPIKey() {
    return fetch('/json/api_keys.json')
        .then(response => response.json())
        .then(data => data.apiKey)
        .catch(error => {
            console.error('Error fetching API key:', error);
            throw error;
        });
}

// candlestick_chart.js
function initializeChart() {
    var assetCtx = document.getElementById('assetChart').getContext('2d');
    return new Chart(assetCtx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'Asset Price',
                data: [],
                borderColor: 'rgb(53, 162, 235)'
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    }
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// updateAssetTitle.js
function updateAssetTitle(assetName, assetValue) {
    const assetTitle = document.getElementById('assetTitle');
    assetTitle.textContent = `${assetName} - Loading...`;

    getAPIKey().then(apiKey => {
        const intradayUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${assetValue}&interval=1min&apikey=${apiKey}`;
        const dailyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${assetValue}&apikey=${apiKey}`;

        Promise.all([
            fetch(intradayUrl).then(response => response.json()),
            fetch(dailyUrl).then(response => response.json())
        ]).then(([intradayData, dailyData]) => {
            console.log('Intraday data loaded:', intradayData); // Log added
            console.log('Daily data loaded:', dailyData); // Log added

            const timeSeries = intradayData['Time Series (1min)'];
            if (!timeSeries) {
                throw new Error('Invalid Intraday API response: ' + JSON.stringify(intradayData));
            }

            const chartData = [];
            for (const time in timeSeries) {
                const ohlc = timeSeries[time];
                chartData.push({
                    t: new Date(time),
                    o: parseFloat(ohlc['1. open']),
                    h: parseFloat(ohlc['2. high']),
                    l: parseFloat(ohlc['3. low']),
                    c: parseFloat(ohlc['4. close'])
                });
            }

            // Sort the chart data by time
            chartData.sort((a, b) => a.t - b.t);

            // Update the chart data
            const price = chartData[chartData.length - 1].c;
            const change = price - chartData[chartData.length - 2].c;
            const changePercent = (change / chartData[chartData.length - 2].c) * 100;
            assetTitle.textContent = `${assetName} $${price.toFixed(2)} (${changePercent.toFixed(2)}%)`;

            const dayMin = Math.min(...chartData.map(d => d.l));
            const dayMax = Math.max(...chartData.map(d => d.h));

            // Process daily data to find the year's range
            const dailyTimeSeries = dailyData['Time Series (Daily)'];
            if (!dailyTimeSeries) {
                throw new Error('Invalid Daily API response: ' + JSON.stringify(dailyData));
            }

            const dailyPrices = Object.values(dailyTimeSeries).map(day => ({
                l: parseFloat(day['3. low']),
                h: parseFloat(day['2. high'])
            }));
            const yearMin = Math.min(...dailyPrices.map(d => d.l));
            const yearMax = Math.max(...dailyPrices.map(d => d.h));

            // Update range bars
            updateRangeBar('dayRange', dayMin, dayMax, price);
            updateRangeBar('yearRange', yearMin, yearMax, price);

            // Update the chart data
            updateChartData(chartData);
        }).catch(error => {
            assetTitle.textContent = `${assetName} - Error fetching data`;
            console.error('Error fetching real-time data:', error);
            alert('Error fetching real-time data: ' + error.message);
        });
    });
}

// updateChartData.js
function updateChartData(chartData) {
    console.log('Updating chart data...'); // Log added
    const assetChart = document.getElementById('assetChart').chart;
    assetChart.data.datasets[0].data = chartData;
    assetChart.update();
}

// updateRangeBar.js
function updateRangeBar(elementId, min, max, current) {
    console.log('Updating range bar:', elementId, min, max, current); // Log added
    const element = document.getElementById(elementId);
    const innerBar = element.querySelector('.range-bar-inner');
    const range = max - min;
    const position = ((current - min) / range) * 100;
    innerBar.style.width = `${position}%`;
}

// loadParameters.js
function loadParameters(ea) {
    console.log('Loading parameters for EA:', ea); // Log added
    fetch(`json/${ea}_parameters.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Parameters for ${ea} loaded:`, data); // Log added
            var form = document.getElementById('eaSettingsForm');
            form.innerHTML = ''; // Clear existing form fields
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var label = document.createElement('label');
                    label.htmlFor = key;
                    label.textContent = key + ':';
                    var input = document.createElement('input');
                    input.type = 'number';
                    input.id = key;
                    input.name = key;
                    input.value = data[key];
                    form.appendChild(label);
                    form.appendChild(input);
                    form.appendChild(document.createElement('br'));
                }
            }
            var submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Update Settings';
            form.appendChild(submitButton);
        })
        .catch(error => {
            console.error(`Error loading parameters for ${ea}:`, error);
            alert(`Error loading parameters for ${ea}: ` + error.message);
        });
}


// loadAssets.js
function loadAssets(ea) {
    console.log('Loading assets for EA:', ea); // Log added
    fetch(`json/${ea}_assets.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Assets for ${ea} loaded:`, data); // Log added
            var grid = document.getElementById('assetGrid');
            grid.innerHTML = ''; // Clear existing items
            data.forEach(asset => {
                var item = document.createElement('div');
                item.className = 'asset-item' + (asset.enabled ? '' : ' disabled');
                item.textContent = asset.name;
                item.dataset.value = asset.value;
                if (asset.enabled) {
                    item.addEventListener('click', function () {
                        updateAssetTitle(asset.name, asset.value);
                        document.getElementById('assetPopup').style.display = 'none';
                        window.scrollTo({ top: document.getElementById('assetChart').offsetTop, behavior: 'smooth' });
                    });
                }
                grid.appendChild(item);
            });
        })
        .catch(error => {
            console.error(`Error loading assets for ${ea}:`, error);
            alert(`Error loading assets for ${ea}: ` + error.message);
        });
}

function loadEAs(loadParameters, loadAssets) {
    console.log('Loading EAs...'); // Log added
    fetch('json/enabled_eas.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('EAs loaded:', data); // Log added
            var eaSelect = document.getElementById('eaSelect');
            eaSelect.innerHTML = ''; // Clear existing items
            data.forEach(ea => {
                if (ea.enabled) {
                    var option = document.createElement('option');
                    option.value = ea.value;
                    option.textContent = ea.name;
                    eaSelect.appendChild(option);
                }
            });

            // Automatically select the first enabled EA
            var enabledEAs = data.filter(ea => ea.enabled);
            if (enabledEAs.length > 0) {
                var initialEA = enabledEAs[0].value;
                eaSelect.value = initialEA;
                loadParameters(initialEA);
                loadAssets(initialEA);
            }
        })
        .catch(error => {
            console.error('Error loading EAs:', error);
            alert('Error loading EAs: ' + error.message);
        });
}



// localEAManagement.js
function localEAManagement() {
    // Implement your logic for managing local EAs here
    console.log('Local EA Management started.');
    // Example: Show a message or interact with local files or services
    alert('Local EA Management activated! Managing real EAs.');
}

// selectDemoDefaults.js
function selectDemoDefaults() {
    console.log('Selecting demo defaults...'); // Log added
    const eaSelect = document.getElementById('eaSelect');
    eaSelect.value = 'ea1'; // Set the default EA
    loadParameters('ea1'); // Load default parameters for EA
    updateAssetTitle('XAUUSD', 'XAUUSD'); // Update the asset title with default asset
}

// updateEAControlButton.js
function updateEAControlButton(ea) {
    console.log('Updating EA control button for:', ea);
    fetch(`php/checkEAState.php?ea=${ea}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('EA state loaded:', data);
            const button = document.getElementById('eaControlButton');
            if (data.running) {
                button.textContent = 'Stop EA';
                button.style.backgroundColor = '#ff4d4d'; // Red
            } else {
                button.textContent = 'Start EA';
                button.style.backgroundColor = '#4CAF50'; // Green
            }

            button.onclick = function () {
                const enabled = !data.running;
                fetch(`php/updateEAState.php?ea=${ea}&enabled=${enabled}`, {
                    method: 'POST'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.json();
                })
                .then(updateResponse => {
                    console.log('EA state updated:', updateResponse);
                    updateEAControlButton(ea);
                    // Reload EAs to update the dropdown list
                    loadEAs(loadParameters, loadAssets);
                })
                .catch(error => {
                    console.error('Error updating EA state:', error);
                    alert('Error updating EA state: ' + error.message);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching EA state:', error);
            alert('Error fetching EA state: ' + error.message);
        });
}


// Main script
function initApp(configPath = './config/initApp_config.json') {
    console.log('Initializing app...'); // Log added
    fetch(configPath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(config => {
            console.log('Config loaded:', config); // Log added
            const assetChart = initializeChart();

            loadEAs(loadParameters, loadAssets); // Load EAs and select the first one

            document.getElementById('paramsForm').style.display = config.paramsFormInitialVisibility;

            document.getElementById('toggleParams').addEventListener('click', function () {
                var form = document.getElementById('paramsForm');
                if (form.style.opacity === "0" || form.style.display === "none") {
                    form.style.display = "block";
                    setTimeout(function () { form.style.opacity = "1"; }, 10); 
                } else {
                    form.style.opacity = "0";
                    setTimeout(function () { form.style.display = 'none'; }, 500); 
                }
            });

            document.getElementById('eaSelect').addEventListener('change', function () {
                var selectedEA = this.value;
                loadParameters(selectedEA);
                loadAssets(selectedEA);
            });

            document.getElementById('selectAssetButton').addEventListener('click', function () {
                var popup = document.getElementById('assetPopup');
                popup.style.display = 'block';
                popup.style.top = `${window.scrollY + window.innerHeight / 2 - popup.clientHeight / 2}px`;
            });

            document.getElementById('assetTimeframe').addEventListener('click', function () {
                var popup = document.getElementById('timeframePopup');
                popup.style.display = 'block';
                popup.style.top = `${window.scrollY + window.innerHeight / 2 - popup.clientHeight / 2}px`;
            });

            window.addEventListener('click', function (event) {
                var assetPopup = document.getElementById('assetPopup');
                var timeframePopup = document.getElementById('timeframePopup');
                if (event.target === assetPopup) {
                    assetPopup.style.display = 'none';
                } else if (event.target === timeframePopup) {
                    timeframePopup.style.display = 'none';
                } else if (!timeframePopup.contains(event.target) && !event.target.matches('#assetTimeframe')) {
                    timeframePopup.style.display = 'none';
                }
            });

            document.getElementById('timeframeGrid').addEventListener('click', function (event) {
                if (event.target.classList.contains('asset-item')) {
                    var timeframe = event.target.dataset.value;
                    var unit = 'minute';
                    switch (timeframe) {
                        case 'M1':
                        case 'M5':
                            unit = 'minute';
                            break;
                        case 'H1':
                        case 'H4':
                            unit = 'hour';
                            break;
                        case 'D1':
                            unit = 'day';
                            break;
                        case 'W1':
                            unit = 'week';
                            break;
                    }
                    assetChart.options.scales.x.time.unit = unit;
                    assetChart.update();
                    document.getElementById('timeframePopup').style.display = 'none';
                    document.getElementById('assetTimeframe').textContent = event.target.textContent;
                }
            });

            updateEAControlButton(config.eaSelectInitialValue);

            document.getElementById('eaSettingsForm').addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(event.target);
                const selectedEA = document.getElementById('eaSelect').value;
                formData.append('ea', selectedEA);

                fetch('php/updateSettings.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Settings updated:', data);
                    alert('Settings updated successfully');
                })
                .catch(error => {
                    console.error('Error updating settings:', error);
                    alert('Error updating settings: ' + error.message);
                });
            });

        })
        .catch(error => {
            console.error('Error loading config:', error);
            alert('Error loading config: ' + error.message);
        });
}
