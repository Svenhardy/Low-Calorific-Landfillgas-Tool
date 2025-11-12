
        // CSV Data URLs - UPDATED with SFR and CHP CSV files
        const CSV_URLS = {
            CSV1: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV1.csv",
            CSV2: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV2.csv",
            CSV3: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV3%20.csv",
            CSV4: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV4.csv",
            CSV5: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV5%20.csv",
            CSV6: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV6%20.csv",
            CSV7: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV7%20.csv",
            CSV8: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV8%20.csv",
            CSV9: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV9.csv",
            CSV10: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV10.csv",
            CSV11: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV11.csv",
            CSV12: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV12.csv",
            // OEC CSV files
            CSV13: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV13.csv",
            CSV14: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV14.csv",
            CSV15: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV15.csv",
            CSV16: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV16%20.csv",
            // NEW: SFR and CHP CSV files
            CSV17: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV17.csv",
            CSV18: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV18%20.csv",
            CSV19: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV19.csv",
            CSV20: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV20%20.csv",
            CSV21: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV21.csv",
            CSV22: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV22.csv",
            CSV23: "https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV23.csv"
        };

        // App State - UPDATED with SFR results
        const appState = {
            csvData: {},
            calculationResults: {},
            inputs: {},
            dfeResults: {},
            oecResults: {},
            sfrResults: {}, // NEW: SFR results storage
            charts: {
                methaneChart: null,
                volumeChart: null,
                generalEcoBar: null,
                generalEcoLine: null,
                ecoDetailBar: null,
                ecoDetailLine: null,
                econPie: null
            }
        };

        // DOM Elements
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        const calculateBtn = document.getElementById('calculate-btn');
        const countrySelect = document.getElementById('D');
        const considerationPeriodInput = document.getElementById('C');
        
        // Subtabs and results selectors
        const subtabs = document.querySelectorAll('.subtab');
        const subtabContents = document.querySelectorAll('.subtab-content');
        const dfeResultsSelect = document.getElementById('dfe-results-select');
        const oecResultsSelect = document.getElementById('oec-results-select');
        const sfrResultsSelect = document.getElementById('sfr-results-select'); // NEW: SFR selector
        const flareResultsSelect = document.getElementById('flare-results-select'); // NEW: Flare selector
        const interimDfeResults = document.getElementById('interim-dfe-results');
        const interimOecResults = document.getElementById('interim-oec-results');
        const interimSfrResults = document.getElementById('interim-sfr-results'); // NEW: SFR results container
        const interimFlareResults = document.getElementById('interim-flare-results'); // NEW: Flare results container
        const interimGasDevelopmentResults = document.getElementById('interim-gas-development-results');
        
        // Graph controls
        const technologySelect = document.getElementById('technology-select');
        const selectedEngineSize = document.getElementById('selected-engine-size');
        const totalGasProcessed = document.getElementById('total-gas-processed');

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeEventListeners();
            loadCSVData();
            updateManualInputFields();
            
            // Initialize result event listeners after all functions are loaded
            initializeResultEventListeners();
        });

// Update General Results displays
        function updateGeneralResults() {
            if (!appState.dfeResults || !appState.oecResults || !appState.sfrResults || !appState.flareResults) {
                console.log("Not all results available yet");
                return;
            }
            
            updateGeneralEcologicalCharts();
            updateGeneralEconomicDisplay();
        }

        // Update General Ecological Charts
function updateGeneralEcologicalCharts() {
    const impactCategory = document.getElementById('general-impact-category').value;
    
    if (!impactCategory) return;
    
    // Get summed data for all technologies
    const dfeData = sumEcologicalImpacts('dfe', impactCategory);
    const oecData = sumEcologicalImpacts('oec', impactCategory);
    const sfrData = sumEcologicalImpacts('sfr', impactCategory);
    const flareData = sumEcologicalImpacts('flare', impactCategory);
    
    // ✓ KORRIGIERT: years Variable definieren
    const years = Array.from({length: appState.inputs.C}, (_, i) => i + 1);
    
    // Update Bar Chart - IMPROVED
    appState.charts.generalEcoBar = safeCreateChart('general-eco-bar-chart', {
        type: 'bar',
        data: {
            labels: ['DFE', 'OEC', 'SFR', 'Flare'],
            datasets: [{
                label: impactCategory,
                data: [dfeData.total, oecData.total, sfrData.total, flareData.total],
                backgroundColor: ['#2196F3', '#4CAF50', '#FF9800', '#f44336'],
                borderColor: ['#1976D2', '#388E3C', '#F57C00', '#d32f2f'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: `Total Environmental Impacts - ${impactCategory}`
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: getUnitForCategory(impactCategory)
                    }
                }
            }
        }
    }, 'generalEcoBar');
    
    // Update Line Chart - IMPROVED
    appState.charts.generalEcoLine = safeCreateChart('general-eco-line-chart', {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'DFE',
                    data: dfeData.yearly,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'OEC',
                    data: oecData.yearly,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'SFR',
                    data: sfrData.yearly,
                    borderColor: '#FF9800',
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Flare',
                    data: flareData.yearly,
                    borderColor: '#f44336',
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                title: {
                    display: true,
                    text: `Environmental Impact Development - ${impactCategory}`
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: getUnitForCategory(impactCategory)
                    }
                }
            }
        }
    }, 'generalEcoLine');
}

        // Sum ecological impacts for a technology
        function sumEcologicalImpacts(technology, impactCategory) {
            let ecologicalResults;
            let impactFields;
            
            switch(technology) {
                case 'dfe':
                    ecologicalResults = appState.dfeResults.ecologicalResults;
                    impactFields = ['O2', 'O3', 'O4', 'O5', 'O6', 'O7', 'O8', 'O9', 'O10', 'O11'];
                    break;
                case 'oec':
                    ecologicalResults = appState.oecResults.ecologicalResults;
                    impactFields = ['OO2', 'OO3', 'OO4', 'OO5', 'OO6', 'OO7', 'OO8', 'OO9', 'OO10', 'OO11'];
                    break;
                case 'sfr':
                    ecologicalResults = appState.sfrResults.ecologicalResults;
                    impactFields = ['OS3', 'OS4', 'OS5', 'OS6', 'OS8', 'OS9', 'OS10', 'OS11', 'OS12', 'OS13', 'OS14', 'OS15', 'OS16'];
                    break;
                case 'flare':
                    ecologicalResults = appState.flareResults.ecologicalResults;
                    impactFields = ['OF1', 'OF2', 'OF3'];
                    break;
                default:
                    return { total: 0, yearly: [] };
            }
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults) {
                return { total: 0, yearly: [] };
            }
            
            let total = 0;
            const yearly = [];
            
            ecologicalResults.yearlyResults.forEach(yearResult => {
                let yearSum = 0;
                impactFields.forEach(field => {
                    if (yearResult[field] && yearResult[field][impactCategory] !== undefined) {
                        yearSum += yearResult[field][impactCategory];
                    }
                });
                yearly.push(yearSum);
                total += yearSum;
            });
            
            return { total, yearly };
        }

        // Update General Economic Display (NPV Icons)
        function updateGeneralEconomicDisplay() {
            const container = document.getElementById('npv-icons-container');
            if (!container) return;
            
            const technologies = [
                { 
                    name: 'DFE', 
                    icon: '⛽', 
                    npv: appState.dfeResults.economicResults?.O30 || 0,
                    color: '#2196F3'
                },
                { 
                    name: 'OEC', 
                    icon: '🧪', 
                    npv: appState.oecResults.economicResults?.OO30 || 0,
                    color: '#4CAF50'
                },
                { 
                    name: 'SFR', 
                    icon: '🔄', 
                    npv: appState.sfrResults.economicResults?.OS40 || 0,
                    color: '#FF9800'
                },
                { 
                    name: 'Flare', 
                    icon: '🔥', 
                    npv: appState.flareResults.economicResults?.OF8 || 0,
                    color: '#f44336'
                }
            ];
            
            let html = '';
            technologies.forEach(tech => {
                const npvClass = tech.npv >= 0 ? 'npv-positive' : 'npv-negative';
                html += `
                    <div class="npv-icon-card" style="border-top: 4px solid ${tech.color}">
                        <div class="npv-icon">${tech.icon}</div>
                        <div class="npv-tech-name">${tech.name}</div>
                        <div class="npv-value ${npvClass}">€${tech.npv.toFixed(2)}</div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

// Update Ecological Results displays
        function updateEcologicalResults() {
            const technology = document.getElementById('eco-technology-select').value;
            const year = document.getElementById('eco-year-select').value;
            const impactCategory = document.getElementById('eco-impact-select').value;
            const lifeStage = document.getElementById('eco-lifestage-select').value;
            
            if (!impactCategory) return;
            
            updateEcologicalBarChart(technology, year, impactCategory, lifeStage);
            updateEcologicalLineChart(technology, impactCategory, lifeStage);
        }

        // Update Ecological Bar Chart
        function updateEcologicalBarChart(technology, year, impactCategory, lifeStage) {
            const barCtx = document.getElementById('eco-detail-bar-chart').getContext('2d');
            if (appState.charts.ecoDetailBar) {
                appState.charts.ecoDetailBar.destroy();
            }
            
            const chartData = getEcologicalBarData(technology, year, impactCategory, lifeStage);
            
appState.charts.ecoDetailBar = safeCreateChart('eco-detail-bar-chart', {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: impactCategory,
                        data: chartData.values,
                        backgroundColor: chartData.colors,
                        borderColor: chartData.borderColors,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `${technology.toUpperCase()} - ${lifeStage} - ${year === 'total' ? 'Total Time Horizon' : 'Year ' + year}`
                        },
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: getUnitForCategory(impactCategory)
                            }
                        }
                    }
                }
            }, 'ecoDetailBar');
        }

        // Get Ecological Bar Chart Data
        function getEcologicalBarData(technology, year, impactCategory, lifeStage) {
            let ecologicalResults;
            let labels = [];
            let values = [];
            let colors = [];
            let borderColors = [];
            
            // Get ecological results based on technology
            switch(technology) {
                case 'dfe':
                    ecologicalResults = appState.dfeResults.ecologicalResults;
                    break;
                case 'oec':
                    ecologicalResults = appState.oecResults.ecologicalResults;
                    break;
                case 'sfr':
                    ecologicalResults = appState.sfrResults.ecologicalResults;
                    break;
                case 'flare':
                    ecologicalResults = appState.flareResults.ecologicalResults;
                    break;
            }
            
            if (!ecologicalResults) return { labels: [], values: [], colors: [], borderColors: [] };
            
            if (lifeStage === 'general') {
                // General view - show main categories
                const categoryData = getGeneralCategories(technology, year, impactCategory, ecologicalResults);
                labels = categoryData.labels;
                values = categoryData.values;
                colors = categoryData.colors;
                borderColors = categoryData.borderColors;
            } else {
                // Specific life stage - show detailed breakdown
                const detailData = getDetailedCategories(technology, year, impactCategory, lifeStage, ecologicalResults);
                labels = detailData.labels;
                values = detailData.values;
                colors = detailData.colors;
                borderColors = detailData.borderColors;
            }
            
            return { labels, values, colors, borderColors };
        }

        // Get General Categories for Bar Chart
        function getGeneralCategories(technology, year, impactCategory, ecologicalResults) {
            const labels = [];
            const values = [];
            const colors = [];
            const borderColors = [];
            
            let categories = [];
            
            switch(technology) {
                case 'dfe':
                    categories = [
                        { label: 'Engine Production', field: 'O2', color: '#2196F3' },
                        { label: 'Fuel Production', field: 'O3', color: '#4CAF50' },
                        { label: 'Operating Resources', field: 'O12', color: '#FF9800' },
                        { label: 'Emission Impacts', field: 'O7', color: '#9C27B0' },
                        { label: 'Flare Impact', field: 'O13', color: '#f44336' }
                    ];
                    break;
                case 'oec':
                    categories = [
                        { label: 'Engine Production', field: 'OO2', color: '#2196F3' },
                        { label: 'Oxygen Production', field: 'OO3', color: '#00BCD4' },
                        { label: 'Operating Resources', field: 'OO12', color: '#FF9800' },
                        { label: 'Emission Impacts', field: 'OO7', color: '#9C27B0' },
                        { label: 'Flare Impact', field: 'OO13', color: '#f44336' }
                    ];
                    break;
                case 'sfr':
                    categories = [
                        { label: 'Unit Production', field: 'OS3', color: '#2196F3' },
                        { label: 'Chemical Production', field: 'OS4', color: '#00BCD4' },
                        { label: 'Operating Resources', field: 'OS7', color: '#FF9800' },
                        { label: 'CHP Production', field: 'OS8', color: '#4CAF50' },
                        { label: 'CHP Operating Resources', field: 'OS17', color: '#FFC107' },
                        { label: 'CHP Emission', field: 'OS16', color: '#9C27B0' },
                        { label: 'Flare Impact', field: 'OS18', color: '#f44336' }
                    ];
                    break;
                case 'flare':
                    categories = [
                        { label: 'Flare Energy Impact', field: 'OF1', color: '#2196F3' },
                        { label: 'Flare Maintenance Impact', field: 'OF2', color: '#FF9800' },
                        { label: 'Flare Emission Impact', field: 'OF3', color: '#f44336' }
                    ];
                    break;
            }
            
            categories.forEach(cat => {
                labels.push(cat.label);
                colors.push(cat.color);
                borderColors.push(cat.color);
                
                let value = 0;
                if (year === 'total') {
                    // Sum over all years
                    ecologicalResults.yearlyResults.forEach(yearResult => {
                        if (yearResult[cat.field] && yearResult[cat.field][impactCategory] !== undefined) {
                            value += yearResult[cat.field][impactCategory];
                        }
                    });
                } else {
                    // Get specific year
                    const yearIndex = parseInt(year) - 1;
                    if (ecologicalResults.yearlyResults[yearIndex]) {
                        const yearResult = ecologicalResults.yearlyResults[yearIndex];
                        if (yearResult[cat.field] && yearResult[cat.field][impactCategory] !== undefined) {
                            value = yearResult[cat.field][impactCategory];
                        }
                    }
                }
                values.push(value);
            });
            
            return { labels, values, colors, borderColors };
        }

            // Get Detailed Categories for Bar Chart
            function getDetailedCategories(technology, year, impactCategory, lifeStage, ecologicalResults) {
                const labels = [];
                const values = [];
                const colors = [];
                const borderColors = [];
                
                let categories = [];
                const baseColor = '#2196F3';
                
                switch(technology) {
                    case 'dfe':
                        if (lifeStage === 'operating-resources') {
                            categories = [
                                { label: 'Maintenance', field: 'O4' },
                                { label: 'Oil', field: 'O5' },
                                { label: 'Coolant', field: 'O6' },
                                { label: 'Electricity', field: 'O8' }
                            ];
                        } else if (lifeStage === 'emission-impacts') {
                            // Get emission types from O7_detailed
                            const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
                            emissionTypes.forEach(emission => {
                                categories.push({ 
                                    label: formatEmissionName(emission), 
                                    field: 'O7_detailed',
                                    subfield: emission
                                });
                            });
                        } else if (lifeStage === 'flare-impact') {
                            categories = [
                                { label: 'Electricity', field: 'O9' },
                                { label: 'Maintenance', field: 'O10' },
                                { label: 'Emissions', field: 'O11' }
                            ];
                        }
                        break;
                        
                    case 'oec':
                        if (lifeStage === 'operating-resources') {
                            categories = [
                                { label: 'Maintenance', field: 'OO4' },
                                { label: 'Oil', field: 'OO5' },
                                { label: 'Coolant', field: 'OO6' },
                                { label: 'Electricity', field: 'OO8' }
                            ];
                        } else if (lifeStage === 'emission-impacts') {
                            const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
                            emissionTypes.forEach(emission => {
                                categories.push({ 
                                    label: formatEmissionName(emission), 
                                    field: 'OO7_detailed',
                                    subfield: emission
                                });
                            });
                        } else if (lifeStage === 'flare-impact') {
                            categories = [
                                { label: 'Electricity', field: 'OO9' },
                                { label: 'Maintenance', field: 'OO10' },
                                { label: 'Emissions', field: 'OO11' }
                            ];
                        }
                        break;
                        
case 'sfr':
    if (lifeStage === 'operating-resources') {
        categories = [
            { label: 'Maintenance', field: 'OS5' },
            { label: 'Electricity', field: 'OS6' }
        ];
    } else if (lifeStage === 'chp-operating-resources') {
        // NEU: CHP Operating Resources
        categories = [
            { label: 'Maintenance', field: 'OS9' },
            { label: 'Oil', field: 'OS10' },
            { label: 'Coolant', field: 'OS11' },
            { label: 'Energy', field: 'OS12' }
        ];
    } else if (lifeStage === 'emission-impacts') {
        const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
        emissionTypes.forEach(emission => {
            categories.push({ 
                label: formatEmissionName(emission), 
                field: 'OS16_detailed',
                subfield: emission
            });
        });
    } else if (lifeStage === 'flare-impact') {
        categories = [
            { label: 'Electricity', field: 'OS13' },
            { label: 'Maintenance', field: 'OS14' },
            { label: 'Emissions', field: 'OS15' }
        ];
    }
    break;
                        
case 'flare':
    if (lifeStage === 'operating-resources') {
        // NEU: Operating Resources für Flare - KORRIGIERT
        categories = [
            { label: 'Maintenance', field: 'OF2' },
            { label: 'Electricity', field: 'OF1' }
        ];
    } else if (lifeStage === 'emission-impacts') {
        const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
        emissionTypes.forEach(emission => {
            categories.push({ 
                label: formatEmissionName(emission), 
                field: 'OF3_detailed',
                subfield: emission
            });
        });
    }
    break;
                }
                
                // Generate colors
                const colorPalette = ['#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#f44336', '#00BCD4', '#FFC107'];
                
                categories.forEach((cat, index) => {
                    labels.push(cat.label);
                    colors.push(colorPalette[index % colorPalette.length]);
                    borderColors.push(colorPalette[index % colorPalette.length]);
                    
                    let value = 0;
                    if (year === 'total') {
                        // Sum over all years
                        ecologicalResults.yearlyResults.forEach(yearResult => {
                            if (cat.subfield) {
                                // For detailed emissions
                                if (yearResult[cat.field] && yearResult[cat.field][impactCategory] && yearResult[cat.field][impactCategory][cat.subfield] !== undefined) {
                                    value += yearResult[cat.field][impactCategory][cat.subfield];
                                }
                            } else {
                                // For regular fields
                                if (yearResult[cat.field] && yearResult[cat.field][impactCategory] !== undefined) {
                                    value += yearResult[cat.field][impactCategory];
                                }
                            }
                        });
                    } else {
                        // Get specific year
                        const yearIndex = parseInt(year) - 1;
                        if (ecologicalResults.yearlyResults[yearIndex]) {
                            const yearResult = ecologicalResults.yearlyResults[yearIndex];
                            if (cat.subfield) {
                                // For detailed emissions
                                if (yearResult[cat.field] && yearResult[cat.field][impactCategory] && yearResult[cat.field][impactCategory][cat.subfield] !== undefined) {
                                    value = yearResult[cat.field][impactCategory][cat.subfield];
                                }
                            } else {
                                // For regular fields
                                if (yearResult[cat.field] && yearResult[cat.field][impactCategory] !== undefined) {
                                    value = yearResult[cat.field][impactCategory];
                                }
                            }
                        }
                    }
                    values.push(value);
                });
                
                return { labels, values, colors, borderColors };
            }

        // Format emission name for display
        function formatEmissionName(emission) {
            const names = {
                'carbonMonoxide': 'Carbon Monoxide',
                'nitrogenOxides': 'Nitrogen Oxides',
                'formaldehyde': 'Formaldehyde',
                'methaneSlop': 'Methane Slip',
                'particulateMatter': 'Particulate Matter',
                'sulfurDioxide': 'Sulfur Dioxide',
                'ammonia': 'Ammonia'
            };
            return names[emission] || emission;
        }

        // Update Ecological Line Chart
        function updateEcologicalLineChart(technology, impactCategory, lifeStage) {
            const lineCtx = document.getElementById('eco-detail-line-chart').getContext('2d');
            if (appState.charts.ecoDetailLine) {
                appState.charts.ecoDetailLine.destroy();
            }
            
            const chartData = getEcologicalLineData(technology, impactCategory, lifeStage);
            
            appState.charts.ecoDetailLine = safeCreateChart('eco-detail-line-chart', {
                type: 'line',
                data: {
                    labels: chartData.years,
                    datasets: chartData.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `${technology.toUpperCase()} - Impact Development Over Time`
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: getUnitForCategory(impactCategory)
                            }
                        }
                    }
                }
            }, 'ecoDetailLine');
        }

        // Get Ecological Line Chart Data
        function getEcologicalLineData(technology, impactCategory, lifeStage) {
            let ecologicalResults;
            
            switch(technology) {
                case 'dfe':
                    ecologicalResults = appState.dfeResults.ecologicalResults;
                    break;
                case 'oec':
                    ecologicalResults = appState.oecResults.ecologicalResults;
                    break;
                case 'sfr':
                    ecologicalResults = appState.sfrResults.ecologicalResults;
                    break;
                case 'flare':
                    ecologicalResults = appState.flareResults.ecologicalResults;
                    break;
            }
            
            if (!ecologicalResults) return { years: [], datasets: [] };
            
            const years = ecologicalResults.yearlyResults.map(yr => yr.year);
            const datasets = [];
            
            // Get categories based on life stage (same as bar chart)
            const barData = getEcologicalBarData(technology, 'total', impactCategory, lifeStage);
            
            // For each category, create a dataset with yearly values
            barData.labels.forEach((label, index) => {
                const data = [];
                
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    // Extract value for this category and year
                    let value = 0;
                    
                    if (lifeStage === 'general') {
                        // General categories
                        const fieldMap = getFieldMapForCategory(technology, label);
                        if (fieldMap && yearResult[fieldMap] && yearResult[fieldMap][impactCategory] !== undefined) {
                            value = yearResult[fieldMap][impactCategory];
                        }
                    } else {
                        // Detailed categories
                        const fieldInfo = getDetailedFieldInfo(technology, lifeStage, label);
                        if (fieldInfo) {
                            if (fieldInfo.subfield) {
                                if (yearResult[fieldInfo.field] && yearResult[fieldInfo.field][impactCategory] && 
                                    yearResult[fieldInfo.field][impactCategory][fieldInfo.subfield] !== undefined) {
                                    value = yearResult[fieldInfo.field][impactCategory][fieldInfo.subfield];
                                }
                            } else {
                                if (yearResult[fieldInfo.field] && yearResult[fieldInfo.field][impactCategory] !== undefined) {
                                    value = yearResult[fieldInfo.field][impactCategory];
                                }
                            }
                        }
                    }
                    
                    data.push(value);
                });
                
                datasets.push({
                    label: label,
                    data: data,
                    borderColor: barData.colors[index],
                    backgroundColor: barData.colors[index] + '20',
                    tension: 0.4
                });
            });
            
            return { years, datasets };
        }

        // Helper function to get field map for general category
        function getFieldMapForCategory(technology, label) {
            const maps = {
                'dfe': {
                    'Engine Production': 'O2',
                    'Fuel Production': 'O3',
                    'Operating Resources': 'O12',
                    'Emission Impacts': 'O7',
                    'Flare Impact': 'O13'
                },
                'oec': {
                    'Engine Production': 'OO2',
                    'Oxygen Production': 'OO3',
                    'Operating Resources': 'OO12',
                    'Emission Impacts': 'OO7',
                    'Flare Impact': 'OO13'
                },
                'sfr': {
                    'Unit Production': 'OS3',
                    'Chemical Production': 'OS4',
                    'Operating Resources': 'OS7',
                    'CHP Production': 'OS8',
                    'CHP Operating Resources': 'OS17',
                    'CHP Emission': 'OS16',
                    'Flare Impact': 'OS18'
                },
                'flare': {
                    'Flare Energy Impact': 'OF1',
                    'Flare Maintenance Impact': 'OF2',
                    'Flare Emission Impact': 'OF3'
                }
            };
            
            return maps[technology]?.[label];
        }

            // Helper function to get detailed field info
            function getDetailedFieldInfo(technology, lifeStage, label) {
                // Map label back to field info
                const fieldMaps = {
                    'dfe': {
                        'operating-resources': {
                            'Maintenance': { field: 'O4' },
                            'Oil': { field: 'O5' },
                            'Coolant': { field: 'O6' },
                            'Electricity': { field: 'O8' }
                        },
                        'flare-impact': {
                            'Electricity': { field: 'O9' },
                            'Maintenance': { field: 'O10' },
                            'Emissions': { field: 'O11' }
                        }
                    },
                    'oec': {
                        'operating-resources': {
                            'Maintenance': { field: 'OO4' },
                            'Oil': { field: 'OO5' },
                            'Coolant': { field: 'OO6' },
                            'Electricity': { field: 'OO8' }
                        },
                        'flare-impact': {
                            'Electricity': { field: 'OO9' },
                            'Maintenance': { field: 'OO10' },
                            'Emissions': { field: 'OO11' }
                        }
                    },
'sfr': {
    'operating-resources': {
        'Maintenance': { field: 'OS5' },
        'Electricity': { field: 'OS6' }
    },
    'chp-operating-resources': {
        'Maintenance': { field: 'OS9' },
        'Oil': { field: 'OS10' },
        'Coolant': { field: 'OS11' },
        'Energy': { field: 'OS12' }
    },
    'flare-impact': {
        'Electricity': { field: 'OS13' },
        'Maintenance': { field: 'OS14' },
        'Emissions': { field: 'OS15' }
    }
},
'flare': {
    'operating-resources': {
        'Maintenance': { field: 'OF2' },
        'Electricity': { field: 'OF1' }
    }
}
                };
                
                // Check if it's an emission
                const emissionMap = {
                    'Carbon Monoxide': 'carbonMonoxide',
                    'Nitrogen Oxides': 'nitrogenOxides',
                    'Formaldehyde': 'formaldehyde',
                    'Methane Slip': 'methaneSlop',
                    'Particulate Matter': 'particulateMatter',
                    'Sulfur Dioxide': 'sulfurDioxide',
                    'Ammonia': 'ammonia'
                };
                
                if (emissionMap[label]) {
                    const fieldPrefix = {
                        'dfe': 'O7_detailed',
                        'oec': 'OO7_detailed',
                        'sfr': 'OS16_detailed',
                        'flare': 'OF3_detailed'
                    };
                    return { 
                        field: fieldPrefix[technology], 
                        subfield: emissionMap[label] 
                    };
                }
                
                return fieldMaps[technology]?.[lifeStage]?.[label];
            }
        
// Update Economic Results displays
        function updateEconomicResults() {
            const technology = document.getElementById('econ-technology-select').value;
            const year = document.getElementById('econ-year-select').value;
            
            updateEconomicPieChart(technology, year);
            updateEconomicRevenuesDisplay(technology, year);
            updateEconomicSummaryDisplay(technology);
        }

// Initialize event listeners for result tabs (called after all functions are defined)
        function initializeResultEventListeners() {
            // General Results event listeners
            const generalImpactSelect = document.getElementById('general-impact-category');
            if (generalImpactSelect) {
                generalImpactSelect.addEventListener('change', updateGeneralResults);
            }
            
            // Ecological Results event listeners
            const ecoTechSelect = document.getElementById('eco-technology-select');
            if (ecoTechSelect) {
                ecoTechSelect.addEventListener('change', function() {
                    updateEcoLifeStageOptions();
                    updateEcologicalResults();
                });
            }
            
            const ecoYearSelect = document.getElementById('eco-year-select');
            if (ecoYearSelect) {
                ecoYearSelect.addEventListener('change', updateEcologicalResults);
            }
            
            const ecoImpactSelect = document.getElementById('eco-impact-select');
            if (ecoImpactSelect) {
                ecoImpactSelect.addEventListener('change', updateEcologicalResults);
            }
            
            const ecoLifestageSelect = document.getElementById('eco-lifestage-select');
            if (ecoLifestageSelect) {
                ecoLifestageSelect.addEventListener('change', updateEcologicalResults);
            }
            
            // Economic Results event listeners
            const econTechSelect = document.getElementById('econ-technology-select');
            if (econTechSelect) {
                econTechSelect.addEventListener('change', updateEconomicResults);
            }
            
            const econYearSelect = document.getElementById('econ-year-select');
            if (econYearSelect) {
                econYearSelect.addEventListener('change', updateEconomicResults);
            }
            
            console.log('Result event listeners initialized');
        }

        // Update Economic Pie Chart
        function updateEconomicPieChart(technology, year) {
            const pieCtx = document.getElementById('econ-pie-chart').getContext('2d');
            if (appState.charts.econPie) {
                appState.charts.econPie.destroy();
            }
            
            const chartData = getEconomicPieData(technology, year);
            
appState.charts.econPie = safeCreateChart('econ-pie-chart', {
                type: 'pie',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        data: chartData.values,
                        backgroundColor: chartData.colors,
                        borderColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `${technology.toUpperCase()} - Cost Distribution ${year === 'total' ? '(Total)' : '(Year ' + year + ')'}`
                        },
                        legend: {
                            position: 'bottom'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    return `${label}: €${value.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            }, 'econPie');
        }

        // Get Economic Pie Chart Data
        function getEconomicPieData(technology, year) {
            let economicResults;
            let categories = [];
            
            switch(technology) {
                case 'dfe':
                    economicResults = appState.dfeResults.economicResults;
                    categories = [
                        { label: 'Electricity costs', field: 'O18', color: '#2196F3' },
                        { label: 'Maintenance costs', field: 'O19', color: '#4CAF50' },
                        { label: 'Engine Oil costs', field: 'O20', color: '#FF9800' },
                        { label: 'Coolant costs', field: 'O21', color: '#9C27B0' },
                        { label: 'Fuel costs', field: 'O22', color: '#00BCD4' },
                        { label: 'Flare maintenance', field: 'O16', color: '#FFC107' },
                        { label: 'Flare electricity', field: 'O17', color: '#E91E63' },
                        { label: 'Taxes', field: 'O28', color: '#f44336' }
                    ];
                    break;
                case 'oec':
                    economicResults = appState.oecResults.economicResults;
                    categories = [
                        { label: 'Electricity costs', field: 'OO18', color: '#2196F3' },
                        { label: 'Maintenance costs', field: 'OO19', color: '#4CAF50' },
                        { label: 'Engine Oil costs', field: 'OO20', color: '#FF9800' },
                        { label: 'Coolant costs', field: 'OO21', color: '#9C27B0' },
                        { label: 'Oxygen costs', field: 'OO22', color: '#00BCD4' },
                        { label: 'Flare maintenance', field: 'OO16', color: '#FFC107' },
                        { label: 'Flare electricity', field: 'OO17', color: '#E91E63' },
                        { label: 'Taxes', field: 'OO28', color: '#f44336' }
                    ];
                    break;
                case 'sfr':
                    economicResults = appState.sfrResults.economicResults;
                    categories = [
                        { label: 'SFR Electricity', field: 'OS19', color: '#2196F3' },
                        { label: 'SFR Chemical', field: 'OS21', color: '#00BCD4' },
                        { label: 'SFR Maintenance', field: 'OS20', color: '#4CAF50' },
                        { label: 'CHP Electricity', field: 'OS28', color: '#1976D2' },
                        { label: 'CHP Maintenance', field: 'OS29', color: '#388E3C' },
                        { label: 'CHP Engine Oil', field: 'OS30', color: '#FF9800' },
                        { label: 'CHP Coolant', field: 'OS31', color: '#9C27B0' },
                        { label: 'Flare maintenance', field: 'OS26', color: '#FFC107' },
                        { label: 'Flare electricity', field: 'OS27', color: '#E91E63' },
                        { label: 'Taxes', field: 'OS38', color: '#f44336' }
                    ];
                    break;
                case 'flare':
                    economicResults = appState.flareResults.economicResults;
                    categories = [
                        { label: 'Flare Maintenance Costs', field: 'OF4', color: '#FFC107' },
                        { label: 'Flare Electricity costs', field: 'OF5', color: '#2196F3' }
                    ];
                    break;
            }
            
            if (!economicResults || !economicResults.yearlyResults) {
                return { labels: [], values: [], colors: [] };
            }
            
            const labels = [];
            const values = [];
            const colors = [];
            
            categories.forEach(cat => {
                let value = 0;
                
                if (year === 'total') {
                    // Sum over all years
                    economicResults.yearlyResults.forEach(yearResult => {
                        if (yearResult[cat.field] !== undefined) {
                            value += Math.abs(yearResult[cat.field]); // Use absolute values for costs
                        }
                    });
                } else {
                    // Get specific year
                    const yearIndex = parseInt(year) - 1;
                    if (economicResults.yearlyResults[yearIndex]) {
                        const yearResult = economicResults.yearlyResults[yearIndex];
                        if (yearResult[cat.field] !== undefined) {
                            value = Math.abs(yearResult[cat.field]); // Use absolute values for costs
                        }
                    }
                }
                
                // Only add if value > 0
                if (value > 0) {
                    labels.push(cat.label);
                    values.push(value);
                    colors.push(cat.color);
                }
            });
            
            return { labels, values, colors };
        }

        // Update Economic Revenues Display
        function updateEconomicRevenuesDisplay(technology, year) {
            const container = document.getElementById('econ-revenues-display');
            if (!container) return;
            
            let economicResults;
            let electricField, thermalField, cashflowField;
            
            switch(technology) {
                case 'dfe':
                    economicResults = appState.dfeResults.economicResults;
                    electricField = 'O14';
                    thermalField = 'O15';
                    cashflowField = 'O29';
                    break;
                case 'oec':
                    economicResults = appState.oecResults.economicResults;
                    electricField = 'OO14';
                    thermalField = 'OO15';
                    cashflowField = 'OO29';
                    break;
                case 'sfr':
                    economicResults = appState.sfrResults.economicResults;
                    electricField = 'OS24';
                    thermalField = 'OS25';
                    cashflowField = 'OS39';
                    break;
                case 'flare':
                    // Flare has no revenues, only costs
                    container.innerHTML = `
                        <h4 style="margin-bottom: 15px;">Annual Results</h4>
                        <div class="econ-revenue-item">
                            <span class="econ-revenue-label">Total Costs:</span>
                            <span class="econ-revenue-value" style="color: #f44336;">-€${getFlareValue(year, 'OF6').toFixed(2)}</span>
                        </div>
                    `;
                    return;
            }
            
            if (!economicResults || !economicResults.yearlyResults) {
                container.innerHTML = '<div class="loading">No economic results available</div>';
                return;
            }
            
            let electricValue = 0;
            let thermalValue = 0;
            let cashflowValue = 0;
            
            if (year === 'total') {
                // Sum over all years
                economicResults.yearlyResults.forEach(yearResult => {
                    electricValue += yearResult[electricField] || 0;
                    thermalValue += yearResult[thermalField] || 0;
                    cashflowValue += yearResult[cashflowField] || 0;
                });
            } else {
                // Get specific year
                const yearIndex = parseInt(year) - 1;
                if (economicResults.yearlyResults[yearIndex]) {
                    const yearResult = economicResults.yearlyResults[yearIndex];
                    electricValue = yearResult[electricField] || 0;
                    thermalValue = yearResult[thermalField] || 0;
                    cashflowValue = yearResult[cashflowField] || 0;
                }
            }
            
            const cashflowClass = cashflowValue >= 0 ? 'npv-positive' : 'npv-negative';
            
            container.innerHTML = `
                <h4 style="margin-bottom: 15px;">${year === 'total' ? 'Total' : 'Year ' + year} Results</h4>
                <div class="econ-revenue-item">
                    <span class="econ-revenue-label">Electrical Energy Revenue:</span>
                    <span class="econ-revenue-value">€${electricValue.toFixed(2)}</span>
                </div>
                <div class="econ-revenue-item">
                    <span class="econ-revenue-label">Thermal Energy Revenue:</span>
                    <span class="econ-revenue-value">€${thermalValue.toFixed(2)}</span>
                </div>
                <div class="econ-revenue-item" style="background: ${cashflowValue >= 0 ? '#e8f5e9' : '#ffebee'};">
                    <span class="econ-revenue-label"><strong>Cashflow:</strong></span>
                    <span class="econ-revenue-value ${cashflowClass}"><strong>€${cashflowValue.toFixed(2)}</strong></span>
                </div>
            `;
        }

        // Helper function to get Flare values
        function getFlareValue(year, field) {
            const economicResults = appState.flareResults.economicResults;
            if (!economicResults || !economicResults.yearlyResults) return 0;
            
            let value = 0;
            if (year === 'total') {
                economicResults.yearlyResults.forEach(yearResult => {
                    value += yearResult[field] || 0;
                });
            } else {
                const yearIndex = parseInt(year) - 1;
                if (economicResults.yearlyResults[yearIndex]) {
                    value = economicResults.yearlyResults[yearIndex][field] || 0;
                }
            }
            return value;
        }

        // Update Economic Summary Display (right side)
        function updateEconomicSummaryDisplay(technology) {
            const container = document.getElementById('econ-summary-display');
            if (!container) return;
            
            let economicResults;
            let revenueField, investmentField, taxField, npvField;
            let hasThermalEnergy = true;
            
            switch(technology) {
                case 'dfe':
                    economicResults = appState.dfeResults.economicResults;
                    revenueField = 'O24';
                    investmentField = 'O23';
                    taxField = 'O28';
                    npvField = 'O30';
                    break;
                case 'oec':
                    economicResults = appState.oecResults.economicResults;
                    revenueField = 'OO24';
                    investmentField = 'OO23';
                    taxField = 'OO28';
                    npvField = 'OO30';
                    break;
                case 'sfr':
                    economicResults = appState.sfrResults.economicResults;
                    revenueField = 'OS33';
                    investmentField = 'OS37';
                    taxField = 'OS38';
                    npvField = 'OS40';
                    break;
                case 'flare':
                    economicResults = appState.flareResults.economicResults;
                    hasThermalEnergy = false;
                    investmentField = null;
                    taxField = null;
                    npvField = 'OF8';
                    break;
            }
            
            if (!economicResults || !economicResults.yearlyResults) {
                container.innerHTML = '<div class="loading">No economic results available</div>';
                return;
            }
            
            let html = '<h3 style="margin-bottom: 20px;">Total Summary (Time Horizon)</h3>';
            
            if (hasThermalEnergy) {
                // Calculate total revenue from energy
                let totalRevenue = 0;
                economicResults.yearlyResults.forEach(yearResult => {
                    totalRevenue += yearResult[revenueField] || 0;
                });
                
                html += `
                    <div class="econ-summary-card">
                        <div class="econ-summary-label">Revenue from Energy</div>
                        <div class="econ-summary-value" style="color: ${totalRevenue >= 0 ? 'var(--green)' : 'var(--red)'};">€${totalRevenue.toFixed(2)}</div>
                    </div>
                `;
                
                // Investment cost
                const investmentCost = economicResults[investmentField] || 0;
                html += `
                    <div class="econ-summary-card">
                        <div class="econ-summary-label">Investment Cost</div>
                        <div class="econ-summary-value" style="color: var(--red);">€${investmentCost.toFixed(2)}</div>
                    </div>
                `;
                
                // Total taxes paid
                let totalTaxes = 0;
                economicResults.yearlyResults.forEach(yearResult => {
                    totalTaxes += yearResult[taxField] || 0;
                });
                
                html += `
                    <div class="econ-summary-card">
                        <div class="econ-summary-label">Total Taxes Paid</div>
                        <div class="econ-summary-value" style="color: var(--red);">€${totalTaxes.toFixed(2)}</div>
                    </div>
                `;
            }
            
            // NPV
            const npv = economicResults[npvField] || 0;
            const npvClass = npv >= 0 ? 'npv-positive' : 'npv-negative';
            
            html += `
                <div class="econ-summary-card" style="background: ${npv >= 0 ? '#e8f5e9' : '#ffebee'}; border-left-color: ${npv >= 0 ? 'var(--green)' : 'var(--red)'};">
                    <div class="econ-summary-label"><strong>Net Present Value (NPV)</strong></div>
                    <div class="econ-summary-value ${npvClass}" style="font-size: 2.2rem;">€${npv.toFixed(2)}</div>
                </div>
            `;
            
            container.innerHTML = html;
        }




        // Set up event listeners - UPDATED with SFR navigation
        function initializeEventListeners() {
            // Tab navigation
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabId = tab.getAttribute('data-tab');
                    activateTab(tabId);
                });
            });

            // Subtab navigation
            subtabs.forEach(subtab => {
                subtab.addEventListener('click', () => {
                    const subtabId = subtab.getAttribute('data-subtab');
                    activateSubtab(subtabId);
                });
            });

            // DFE results selector
            dfeResultsSelect.addEventListener('change', function() {
                displayInterimDFEResults(this.value);
            });

            // OEC results selector
            oecResultsSelect.addEventListener('change', function() {
                displayInterimOECResults(this.value);
            });

            // NEW: SFR results selector
            sfrResultsSelect.addEventListener('change', function() {
                displayInterimSFRResults(this.value);
            });

            // NEW: Flare results selector
            flareResultsSelect.addEventListener('change', function() {
                displayInterimFlareResults(this.value);
            });

            // Technology selector for graphs
            technologySelect.addEventListener('change', function() {
                updateGraphs();
            });

            // Calculate button
            calculateBtn.addEventListener('click', performCalculations);

            // Country change - update dependent fields
            countrySelect.addEventListener('change', updateCountrySpecificFields);

            // Manual input checkboxes
            document.getElementById('manual-A').addEventListener('change', function() {
                toggleManualInput('A', this.checked);
            });
            
            document.getElementById('manual-B').addEventListener('change', function() {
                toggleManualInput('B', this.checked);
            });
            
            document.getElementById('manual-E').addEventListener('change', function() {
                toggleFieldManualInput('E', this.checked);
            });
            
            document.getElementById('manual-F').addEventListener('change', function() {
                toggleFieldManualInput('F', this.checked);
            });
            
            document.getElementById('manual-G').addEventListener('change', function() {
                toggleFieldManualInput('G', this.checked);
            });
            
            document.getElementById('manual-H').addEventListener('change', function() {
                toggleFieldManualInput('H', this.checked);
            });
            
            document.getElementById('manual-I').addEventListener('change', function() {
                toggleFieldManualInput('I', this.checked);
            });

            // Consideration period change - update manual input fields
            considerationPeriodInput.addEventListener('change', updateManualInputFields);
        }

        // Activate a specific subtab
        function activateSubtab(subtabId) {
            // Deactivate all subtabs
            subtabs.forEach(subtab => subtab.classList.remove('active'));
            subtabContents.forEach(content => content.classList.remove('active'));
            
            // Activate selected subtab
            document.querySelector(`[data-subtab="${subtabId}"]`).classList.add('active');
            document.getElementById(subtabId).classList.add('active');
            
            // Show default results for selected subtab
            if (subtabId === 'dual-fuel-engine') {
                displayInterimDFEResults(dfeResultsSelect.value);
            } else if (subtabId === 'oxygen-enrichment') {
                displayInterimOECResults(oecResultsSelect.value);
            } else if (subtabId === 'spinning-fluids-reactor') {
                displayInterimSFRResults(sfrResultsSelect.value); // NEW: SFR results
            } else if (subtabId === 'flare') {
                displayInterimFlareResults(flareResultsSelect.value); // NEW: Flare results    
            } else if (subtabId === 'gas-development-table') {
                displayInterimGasDevelopmentResults();
            }
        }

        // NEW: Display SFR results in the interim results tab
        function displayInterimSFRResults(resultType) {
            if (!appState.sfrResults || Object.keys(appState.sfrResults).length === 0) {
                interimSfrResults.innerHTML = '<div class="loading">SFR results not available yet. Please perform calculations first.</div>';
                return;
            }

            // Create temporary containers to generate the HTML
            const tempSFRResultsContainer = document.createElement('div');
            const tempCHPResultsContainer = document.createElement('div');
            const tempSFRDetailedResultsContainer = document.createElement('div');
            const tempCHPDetailedResultsContainer = document.createElement('div');
            const tempSFREcologicalResultsContainer = document.createElement('div');
            const tempCHPEcologicalResultsContainer = document.createElement('div');
            const tempCHPEmissionResultsContainer = document.createElement('div');
            const tempSFREconomicResultsContainer = document.createElement('div');
            
            // Temporarily replace containers to generate HTML
            document.body.appendChild(tempSFRResultsContainer);
            document.body.appendChild(tempCHPResultsContainer);
            document.body.appendChild(tempSFRDetailedResultsContainer);
            document.body.appendChild(tempCHPDetailedResultsContainer);
            document.body.appendChild(tempSFREcologicalResultsContainer);
            document.body.appendChild(tempCHPEcologicalResultsContainer);
            document.body.appendChild(tempCHPEmissionResultsContainer);
            document.body.appendChild(tempSFREconomicResultsContainer);
            
            // Set temporary containers as targets for display functions
            window.tempSFRResultsContainer = tempSFRResultsContainer;
            window.tempCHPResultsContainer = tempCHPResultsContainer;
            window.tempSFRDetailedResultsContainer = tempSFRDetailedResultsContainer;
            window.tempCHPDetailedResultsContainer = tempCHPDetailedResultsContainer;
            window.tempSFREcologicalResultsContainer = tempSFREcologicalResultsContainer;
            window.tempCHPEcologicalResultsContainer = tempCHPEcologicalResultsContainer;
            window.tempCHPEmissionResultsContainer = tempCHPEmissionResultsContainer;
            window.tempSFREconomicResultsContainer = tempSFREconomicResultsContainer;
            
            // Generate the HTML content
            switch(resultType) {
                case 'sfr-results':
                    displaySFRResults();
                    interimSfrResults.innerHTML = tempSFRResultsContainer.innerHTML;
                    break;
                case 'chp-results':
                    displayCHPResults();
                    interimSfrResults.innerHTML = tempCHPResultsContainer.innerHTML;
                    break;
                case 'sfr-detailed-results':
                    displaySFRDetailedResults();
                    interimSfrResults.innerHTML = tempSFRDetailedResultsContainer.innerHTML;
                    break;
                case 'chp-detailed-results':
                    displayCHPDetailedResults();
                    interimSfrResults.innerHTML = tempCHPDetailedResultsContainer.innerHTML;
                    break;
                case 'sfr-ecological-results':
                    // Create ecological results if not already displayed
                    if (!appState.sfrResults.ecologicalResults) {
                        calculateSFREcologicalResults();
                    }
                    displaySFREcologicalResults();
                    interimSfrResults.innerHTML = tempSFREcologicalResultsContainer.innerHTML;
                    break;
                case 'chp-ecological-results':
                    // Create ecological results if not already displayed
                    if (!appState.sfrResults.ecologicalResults) {
                        calculateSFREcologicalResults();
                    }
                    displayCHPEcologicalResults();
                    interimSfrResults.innerHTML = tempCHPEcologicalResultsContainer.innerHTML;
                    break;
                case 'chp-emission-results':
                    // Create emission results if not already displayed
                    if (!appState.sfrResults.ecologicalResults) {
                        calculateSFREcologicalResults();
                    }
                    displayCHPEmissionResults();
                    interimSfrResults.innerHTML = tempCHPEmissionResultsContainer.innerHTML;
                    break;
                case 'economic-results':
                    // Create economic results if not already displayed
                    if (!appState.sfrResults.economicResults) {
                        calculateSFREconomicResults();
                    }
                    displaySFREconomicResults();
                    interimSfrResults.innerHTML = tempSFREconomicResultsContainer.innerHTML;
                    break;
                default:
                    interimSfrResults.innerHTML = '<div class="error">Unknown results type selected</div>';
            }
            
            // Clean up temporary containers
            document.body.removeChild(tempSFRResultsContainer);
            document.body.removeChild(tempCHPResultsContainer);
            document.body.removeChild(tempSFRDetailedResultsContainer);
            document.body.removeChild(tempCHPDetailedResultsContainer);
            document.body.removeChild(tempSFREcologicalResultsContainer);
            document.body.removeChild(tempCHPEcologicalResultsContainer);
            document.body.removeChild(tempCHPEmissionResultsContainer);
            document.body.removeChild(tempSFREconomicResultsContainer);
            
            // Restore original containers
            delete window.tempSFRResultsContainer;
            delete window.tempCHPResultsContainer;
            delete window.tempSFRDetailedResultsContainer;
            delete window.tempCHPDetailedResultsContainer;
            delete window.tempSFREcologicalResultsContainer;
            delete window.tempCHPEcologicalResultsContainer;
            delete window.tempCHPEmissionResultsContainer;
            delete window.tempSFREconomicResultsContainer;
        }

        // NEW: Display DFE results in the interim results tab
        function displayInterimDFEResults(resultType) {
            if (!appState.dfeResults || Object.keys(appState.dfeResults).length === 0) {
                interimDfeResults.innerHTML = '<div class="loading">DFE results not available yet. Please perform calculations first.</div>';
                return;
            }

            // Create temporary containers to generate the HTML
            const tempDFEResultsContainer = document.createElement('div');
            const tempDFEDetailedResultsContainer = document.createElement('div');
            const tempDFEEcologicalResultsContainer = document.createElement('div');
            const tempDFEEmissionImpactsContainer = document.createElement('div');
            const tempDFEEconomicResultsContainer = document.createElement('div');
            
            // Store original containers
            const originalDFEResultsContainer = document.getElementById('dfe-results-container');
            const originalDFEDetailedResultsContainer = document.getElementById('dfe-detailed-results-container');
            const originalDFEEcologicalResultsContainer = document.getElementById('dfe-ecological-results-container');
            const originalDFEEmissionImpactsContainer = document.getElementById('dfe-emission-impacts-container');
            const originalDFEEconomicResultsContainer = document.getElementById('dfe-economic-results-container');
            
            // Temporarily replace containers to generate HTML
            document.body.appendChild(tempDFEResultsContainer);
            document.body.appendChild(tempDFEDetailedResultsContainer);
            document.body.appendChild(tempDFEEcologicalResultsContainer);
            document.body.appendChild(tempDFEEmissionImpactsContainer);
            document.body.appendChild(tempDFEEconomicResultsContainer);
            
            // Set temporary containers as targets for display functions
            window.tempDFEResultsContainer = tempDFEResultsContainer;
            window.tempDFEDetailedResultsContainer = tempDFEDetailedResultsContainer;
            window.tempDFEEcologicalResultsContainer = tempDFEEcologicalResultsContainer;
            window.tempDFEEmissionImpactsContainer = tempDFEEmissionImpactsContainer;
            window.tempDFEEconomicResultsContainer = tempDFEEconomicResultsContainer;
            
            // Generate the HTML content
            switch(resultType) {
                case 'dfe-results':
                    displayDFEResults();
                    interimDfeResults.innerHTML = tempDFEResultsContainer.innerHTML;
                    break;
                case 'dfe-detailed-results':
                    displayDFEDetailedResults();
                    interimDfeResults.innerHTML = tempDFEDetailedResultsContainer.innerHTML;
                    break;
                case 'dfe-ecological-results':
                    // Create ecological results if not already displayed
                    if (!appState.dfeResults.ecologicalResults) {
                        calculateDFEEcologicalResults();
                    }
                    displayDFEEcologicalResults();
                    interimDfeResults.innerHTML = tempDFEEcologicalResultsContainer.innerHTML;
                    break;
                case 'dfe-emission-impacts':
                    // Create emission impacts if not already displayed
                    if (!appState.dfeResults.ecologicalResults) {
                        calculateDFEEcologicalResults();
                    }
                    displayDFEEmissionImpacts();
                    interimDfeResults.innerHTML = tempDFEEmissionImpactsContainer.innerHTML;
                    break;
                case 'dfe-economic-results':
                    // Create economic results if not already displayed
                    if (!appState.dfeResults.economicResults) {
                        calculateDFEEconomicResults();
                    }
                    displayDFEEconomicResults();
                    interimDfeResults.innerHTML = tempDFEEconomicResultsContainer.innerHTML;
                    break;
                default:
                    interimDfeResults.innerHTML = '<div class="error">Unknown results type selected</div>';
            }
            
            // Clean up temporary containers
            document.body.removeChild(tempDFEResultsContainer);
            document.body.removeChild(tempDFEDetailedResultsContainer);
            document.body.removeChild(tempDFEEcologicalResultsContainer);
            document.body.removeChild(tempDFEEmissionImpactsContainer);
            document.body.removeChild(tempDFEEconomicResultsContainer);
            
            // Restore original containers
            delete window.tempDFEResultsContainer;
            delete window.tempDFEDetailedResultsContainer;
            delete window.tempDFEEcologicalResultsContainer;
            delete window.tempDFEEmissionImpactsContainer;
            delete window.tempDFEEconomicResultsContainer;
        }

        // Display OEC results in the interim results tab
        function displayInterimOECResults(resultType) {
            if (!appState.oecResults || Object.keys(appState.oecResults).length === 0) {
                interimOecResults.innerHTML = '<div class="loading">OEC results not available yet. Please perform calculations first.</div>';
                return;
            }

            // Create temporary containers to generate the HTML
            const tempOECResultsContainer = document.createElement('div');
            const tempOECDetailedResultsContainer = document.createElement('div');
            const tempOECEcologicalResultsContainer = document.createElement('div');
            const tempOECEmissionImpactsContainer = document.createElement('div');
            const tempOECEconomicResultsContainer = document.createElement('div');
            
            // Temporarily replace containers to generate HTML
            document.body.appendChild(tempOECResultsContainer);
            document.body.appendChild(tempOECDetailedResultsContainer);
            document.body.appendChild(tempOECEcologicalResultsContainer);
            document.body.appendChild(tempOECEmissionImpactsContainer);
            document.body.appendChild(tempOECEconomicResultsContainer);
            
            // Set temporary containers as targets for display functions
            window.tempOECResultsContainer = tempOECResultsContainer;
            window.tempOECDetailedResultsContainer = tempOECDetailedResultsContainer;
            window.tempOECEcologicalResultsContainer = tempOECEcologicalResultsContainer;
            window.tempOECEmissionImpactsContainer = tempOECEmissionImpactsContainer;
            window.tempOECEconomicResultsContainer = tempOECEconomicResultsContainer;
            
            // Generate the HTML content
            switch(resultType) {
                case 'oec-results':
                    displayOECResults();
                    interimOecResults.innerHTML = tempOECResultsContainer.innerHTML;
                    break;
                case 'oec-detailed-results':
                    displayOECDetailedResults();
                    interimOecResults.innerHTML = tempOECDetailedResultsContainer.innerHTML;
                    break;
                case 'oec-ecological-results':
                    // Create ecological results if not already displayed
                    if (!appState.oecResults.ecologicalResults) {
                        calculateOECEcologicalResults();
                    }
                    displayOECEcologicalResults();
                    interimOecResults.innerHTML = tempOECEcologicalResultsContainer.innerHTML;
                    break;
                case 'oec-emission-impacts':
                    // Create emission impacts if not already displayed
                    if (!appState.oecResults.ecologicalResults) {
                        calculateOECEcologicalResults();
                    }
                    displayOECEmissionImpacts();
                    interimOecResults.innerHTML = tempOECEmissionImpactsContainer.innerHTML;
                    break;
                case 'oec-economic-results':
                    // Create economic results if not already displayed
                    if (!appState.oecResults.economicResults) {
                        calculateOECEconomicResults();
                    }
                    displayOECEconomicResults();
                    interimOecResults.innerHTML = tempOECEconomicResultsContainer.innerHTML;
                    break;
                default:
                    interimOecResults.innerHTML = '<div class="error">Unknown results type selected</div>';
            }
            
            // Clean up temporary containers
            document.body.removeChild(tempOECResultsContainer);
            document.body.removeChild(tempOECDetailedResultsContainer);
            document.body.removeChild(tempOECEcologicalResultsContainer);
            document.body.removeChild(tempOECEmissionImpactsContainer);
            document.body.removeChild(tempOECEconomicResultsContainer);
            
            // Restore original containers
            delete window.tempOECResultsContainer;
            delete window.tempOECDetailedResultsContainer;
            delete window.tempOECEcologicalResultsContainer;
            delete window.tempOECEmissionImpactsContainer;
            delete window.tempOECEconomicResultsContainer;
        }

        // Display gas development results in interim results tab
        function displayInterimGasDevelopmentResults() {
            const results = appState.calculationResults.gasDevelopment;
            
            if (!results || results.length === 0) {
                interimGasDevelopmentResults.innerHTML = '<div class="loading">Gas development results not available yet. Please perform calculations first.</div>';
                return;
            }
            
            let html = `
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>IR1: Methane content [%]</th>
                            <th>IR2: Volume flow [m³/h]</th>
                            <th>IR3: Energy content [kWh]</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            results.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.methaneContent.toFixed(2)}</td>
                        <td>${result.gasVolume.toFixed(2)}</td>
                        <td>${result.energyContent.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                    </tbody>
                </table>
            `;
            
            interimGasDevelopmentResults.innerHTML = html;
        }

        // Update graphs based on selected technology
        function updateGraphs() {
            const gasDevelopment = appState.calculationResults.gasDevelopment;
            if (!gasDevelopment || gasDevelopment.length === 0) return;
            
            const selectedTechnology = technologySelect.value;
            
            // Prepare data for charts
            const years = gasDevelopment.map(item => item.year);
            const methaneData = gasDevelopment.map(item => item.methaneContent);
            const volumeData = gasDevelopment.map(item => item.gasVolume);
            
            // Get operational years for selected technology
            let operationalYears = [];
            let engineSize = '-';
            let totalGas = '-';
            
            if (selectedTechnology === 'dual-fuel-engine' && appState.dfeResults.DFE_O1) {
                // For DFE, use IR7 to determine operational years
                const DFE_O1 = appState.dfeResults.DFE_O1;
                const DFE_yearlyResults = appState.dfeResults.DFE_results[DFE_O1].yearlyResults;
                
                operationalYears = DFE_yearlyResults
                    .filter(yearResult => yearResult.DFE_IR7 === 1)
                    .map(yearResult => yearResult.year);
                
                engineSize = `${DFE_O1} kWel`;
                totalGas = `${appState.dfeResults.DFE_maxTotalGas.toFixed(2)} m³`;
            } else if (selectedTechnology === 'oxygen-enrichment' && appState.oecResults.OO1) {
                // For OEC, use IRO6 to determine operational years
                const OO1 = appState.oecResults.OO1;
                const OEC_yearlyResults = appState.oecResults.OEC_results[OO1].yearlyResults;
                
                operationalYears = OEC_yearlyResults
                    .filter(yearResult => yearResult.IRO6 === 1)
                    .map(yearResult => yearResult.year);
                
                engineSize = `${OO1} kWel`;
                totalGas = `${appState.oecResults.OEC_maxTotalGas.toFixed(2)} m³`;
            } else if (selectedTechnology === 'spinning-fluids-reactor' && appState.sfrResults.OS1) {
                // For SFR, use IRS5 to determine operational years
                const OS1 = appState.sfrResults.OS1;
                const SFR_yearlyResults = appState.sfrResults.SFR_results[OS1].yearlyResults;
                
                operationalYears = SFR_yearlyResults
                    .filter(yearResult => yearResult.IRS5 === 1)
                    .map(yearResult => yearResult.year);
                
                engineSize = `Unit ${OS1}`;
                totalGas = `${appState.sfrResults.SFR_maxTotalGas.toFixed(2)} m³`;
            } else if (selectedTechnology === 'flare') {
                // For Flare, all years are operational
                operationalYears = years;
                engineSize = 'Flare';
                totalGas = 'All gas flared';
            }
            
            // Update display fields
            selectedEngineSize.textContent = engineSize;
            totalGasProcessed.textContent = totalGas;
            
            // Create or update methane chart
            const methaneCtx = document.getElementById('methane-chart').getContext('2d');
            if (appState.charts.methaneChart) {
                appState.charts.methaneChart.destroy();
            }
            
            appState.charts.methaneChart = new Chart(methaneCtx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [
                        {
                            label: 'Methane Content (%)',
                            data: methaneData,
                            borderColor: '#2196F3',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Operational Period',
                            data: methaneData.map((value, index) => {
                                return operationalYears.includes(index + 1) ? value : null;
                            }),
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.3)',
                            borderWidth: 3,
                            pointRadius: 6,
                            pointBackgroundColor: '#4CAF50',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Methane Content Over Time'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Methane Content (%)'
                            },
                            min: 0,
                            max: 100
                        }
                    }
                }
            });
            
            // Create or update volume chart
            const volumeCtx = document.getElementById('volume-chart').getContext('2d');
            if (appState.charts.volumeChart) {
                appState.charts.volumeChart.destroy();
            }
            
            appState.charts.volumeChart = new Chart(volumeCtx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [
                        {
                            label: 'Gas Volume Flow (m³/h)',
                            data: volumeData,
                            borderColor: '#FF9800',
                            backgroundColor: 'rgba(255, 152, 0, 0.1)',
                            borderWidth: 2,
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Operational Period',
                            data: volumeData.map((value, index) => {
                                return operationalYears.includes(index + 1) ? value : null;
                            }),
                            borderColor: '#4CAF50',
                            backgroundColor: 'rgba(76, 175, 80, 0.3)',
                            borderWidth: 3,
                            pointRadius: 6,
                            pointBackgroundColor: '#4CAF50',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Gas Volume Flow Over Time'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Year'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Volume Flow (m³/h)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        }

        // Load CSV data from GitHub including SFR and CHP CSVs
        async function loadCSVData() {
            try {
                console.log("Starting CSV data loading...");
                
                const promises = Object.keys(CSV_URLS).map(key => 
                    fetch(CSV_URLS[key])
                        .then(response => {
                            if (!response.ok) throw new Error(`Failed to load ${key}: ${response.status}`);
                            return response.text();
                        })
                        .then(csvText => {
                            console.log(`${key} loaded successfully`);
                            appState.csvData[key] = parseCSV(csvText);
                            console.log(`${key} data:`, appState.csvData[key]);
                        })
                        .catch(error => {
                            console.error(`Error loading ${key}:`, error);
                            throw error;
                        })
                );

                await Promise.all(promises);
                console.log('All CSV data loaded successfully', appState.csvData);
                
                // Update country-specific fields with loaded data
                updateCountrySpecificFields();
                
            } catch (error) {
                console.error('Error loading CSV data:', error);
                showError('Error loading background data. Please try again later.');
            }
        }

        // Parse CSV text to object
        function parseCSV(csvText) {
            console.log("Raw CSV Text:", csvText);
            
            const lines = csvText.trim().split('\n');
            console.log("CSV Lines:", lines);
            
            if (lines.length === 0) return [];
            
            const headers = lines[0].split(';').map(header => header.trim());
            console.log("CSV Headers:", headers);
            
            const result = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(';').map(value => value.trim());
                const row = {};
                
                headers.forEach((header, index) => {
                    // Try to convert to number if possible
                    const numValue = parseFloat(values[index]);
                    row[header] = isNaN(numValue) ? values[index] : numValue;
                });
                
                result.push(row);
            }
            
            console.log("Parsed CSV Result:", result);
            return result;
        }

       
// Activate a specific tab
        function activateTab(tabId) {
            // Deactivate all tabs
            tabs.forEach(tab => tab.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activate selected tab
            document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Tab-specific actions
            if (tabId === 'interim-results') {
                displayInterimDFEResults(dfeResultsSelect.value);
            } else if (tabId === 'gas-development') {
                // Update graphs when gas development tab is activated
                setTimeout(updateGraphs, 100);
            } else if (tabId === 'general-results') {
                // Update general results when tab is activated
                if (appState.dfeResults && appState.oecResults && appState.sfrResults && appState.flareResults) {
                    setTimeout(updateGeneralResults, 100);
                }
            } else if (tabId === 'ecological-results') {
                // Update ecological results when tab is activated
                updateEcoLifeStageOptions(); // NEU: Life Stage Optionen aktualisieren
                if (appState.dfeResults && appState.dfeResults.ecologicalResults) {
                    setTimeout(updateEcologicalResults, 100);
                }
            } else if (tabId === 'economic-results') {
                // Update economic results when tab is activated
                if (appState.dfeResults && appState.dfeResults.economicResults) {
                    setTimeout(updateEconomicResults, 100);
                }
            }
        }

        // Update country-specific input fields
        function updateCountrySpecificFields() {
            if (!appState.csvData.CSV1) return;
            
            const selectedCountry = countrySelect.value;
            const countryData = appState.csvData.CSV1.find(row => row.Country === selectedCountry);
            
            if (countryData) {
                // Update fields only if manual input is not selected
                if (!document.getElementById('manual-E').checked) {
                    document.getElementById('E').value = countryData['Energy Price [€/kWh]'] || 0.2;
                }
                
                if (!document.getElementById('manual-F').checked) {
                    document.getElementById('F').value = countryData['Energy Price th. [€/kWh]'] || 0.3;
                }
                
                if (!document.getElementById('manual-G').checked) {
                    document.getElementById('G').value = countryData['Depreciation [a]'] || 3;
                }
                
                if (!document.getElementById('manual-H').checked) {
                    document.getElementById('H').value = countryData['Tax rate [%]'] || 20;
                }
            }
        }

        // Toggle manual input for gas volume and methane content
        function toggleManualInput(field, isManual) {
            const manualInputs = document.getElementById(`manual-${field}-inputs`);
            const mainInput = document.getElementById(field);
            
            if (isManual) {
                manualInputs.classList.add('active');
                mainInput.disabled = true;
                updateManualInputFields();
            } else {
                manualInputs.classList.remove('active');
                mainInput.disabled = false;
            }
                }

        // Toggle manual input for other fields
        function toggleFieldManualInput(field, isManual) {
            const inputElement = document.getElementById(field);
            
            if (isManual) {
                inputElement.disabled = false;
            } else {
                inputElement.disabled = true;
                
                // Reset to country-specific values if applicable
                if (field === 'E' || field === 'F' || field === 'G' || field === 'H') {
                    updateCountrySpecificFields();
                } else if (field === 'I') {
                    inputElement.value = 4; // Default discount rate
                }
            }
        }

        // Update manual input fields based on consideration period
        function updateManualInputFields() {
            const years = parseInt(considerationPeriodInput.value) || 10;
            
            // Update manual inputs for gas volume (A)
            const manualAYears = document.getElementById('manual-A-years');
            manualAYears.innerHTML = '';
            
            for (let i = 1; i <= years; i++) {
                const yearInput = document.createElement('div');
                yearInput.className = 'year-input';
                yearInput.innerHTML = `
                    <label for="manual-A-year-${i}">Year ${i}</label>
                    <input type="number" id="manual-A-year-${i}" min="0" step="1" value="${1000 * Math.pow(0.95, i-1)}">
                `;
                manualAYears.appendChild(yearInput);
            }
            
            // Update manual inputs for methane content (B)
            const manualBYears = document.getElementById('manual-B-years');
            manualBYears.innerHTML = '';
            
            for (let i = 1; i <= years; i++) {
                const yearInput = document.createElement('div');
                yearInput.className = 'year-input';
                yearInput.innerHTML = `
                    <label for="manual-B-year-${i}">Year ${i}</label>
                    <input type="number" id="manual-B-year-${i}" min="0" max="100" step="0.1" value="${50 * Math.pow(0.95, i-1)}">
                `;
                manualBYears.appendChild(yearInput);
            }
        }

        // Collect all input values
        function collectInputs() {
            const inputs = {};
            
            // Basic inputs
            inputs.A = parseFloat(document.getElementById('A').value);
            inputs.B = parseFloat(document.getElementById('B').value);
            inputs.C = parseInt(document.getElementById('C').value);
            inputs.D = document.getElementById('D').value;
            inputs.E = parseFloat(document.getElementById('E').value);
            inputs.F = parseFloat(document.getElementById('F').value);
            inputs.G = parseInt(document.getElementById('G').value);
            inputs.H = parseFloat(document.getElementById('H').value) / 100; // Convert to decimal
            inputs.I = parseFloat(document.getElementById('I').value) / 100; // Convert to decimal
            inputs.J = document.getElementById('J').value;
            inputs.K = parseInt(document.getElementById('K').value);
            inputs.L = document.getElementById('L').value;
            inputs.M = document.getElementById('M').value;
            inputs.kValue = parseFloat(document.getElementById('k-value').value);
            
            // Manual inputs for gas volume and methane content
            inputs.manualA = document.getElementById('manual-A').checked;
            inputs.manualB = document.getElementById('manual-B').checked;
            
            if (inputs.manualA) {
                inputs.manualAYears = [];
                for (let i = 1; i <= inputs.C; i++) {
                    inputs.manualAYears.push(parseFloat(document.getElementById(`manual-A-year-${i}`).value));
                }
            }
            
            if (inputs.manualB) {
                inputs.manualBYears = [];
                for (let i = 1; i <= inputs.C; i++) {
                    inputs.manualBYears.push(parseFloat(document.getElementById(`manual-B-year-${i}`).value));
                }
            }
            
            return inputs;
        }

// Perform all calculations - UPDATED with new results population
        function performCalculations() {
            try {
                // Collect inputs
                appState.inputs = collectInputs();
                
                // Calculate gas development
                calculateGasDevelopment();
                
                // Calculate DFE results
                calculateDFE();
                calculateDFEDetailedResults();
                calculateDFEEcologicalResults();
                calculateDFEEconomicResults();
                
                // Calculate OEC results
                calculateOEC();
                calculateOECDetailedResults();
                calculateOECEcologicalResults();
                calculateOECEconomicResults();
                
                // Calculate SFR results
                calculateSFR();
                calculateSFRDetailedResults();
                calculateSFREcologicalResults();
                calculateSFREconomicResults();

                // Calculate Flare results
                calculateFlare();
                
                // Populate dropdowns for new result tabs
                populateResultDropdowns();
                
                // Update all result displays
                updateGraphs();
                updateGeneralResults();
                updateEcologicalResults();
                updateEconomicResults();
                updateEcoLifeStageOptions();
                
                // Update interim results
                displayInterimGasDevelopmentResults();
                
                // Show success message
                showSuccess('Calculations completed successfully!');
                
                // Switch to general results tab
                activateTab('general-results');
            } catch (error) {
                console.error('Error during calculation:', error);
                showError('An error occurred during calculation: ' + error.message);
            }
        }

// Improved error handling for charts
        function safeDestroyChart(chartName) {
            try {
                if (appState.charts && appState.charts[chartName]) {
                    appState.charts[chartName].destroy();
                    appState.charts[chartName] = null;
                }
            } catch (error) {
                console.warn(`Error destroying chart ${chartName}:`, error);
            }
        }
        
        // Safe chart creation wrapper
        function safeCreateChart(canvasId, config, chartName) {
            try {
                const canvas = document.getElementById(canvasId);
                if (!canvas) {
                    console.error(`Canvas ${canvasId} not found`);
                    return null;
                }
                
                const ctx = canvas.getContext('2d');
                safeDestroyChart(chartName);
                
                const chart = new Chart(ctx, config);
                if (appState.charts) {
                    appState.charts[chartName] = chart;
                }
                return chart;
            } catch (error) {
                console.error(`Error creating chart ${chartName}:`, error);
                return null;
            }
        }        

        // Show success message
        function showSuccess(message) {
            // You can implement a better notification system here
            console.log('Success:', message);
        }

function updateEcoLifeStageOptions() {
    const technology = document.getElementById('eco-technology-select').value;
    const lifeStageSelect = document.getElementById('eco-lifestage-select');
    
    if (!lifeStageSelect) return;
    
    // Clear existing options
    lifeStageSelect.innerHTML = '<option value="general">General</option>';
    
    // Add technology-specific options
    let options = [];
    
    switch(technology) {
        case 'dfe':
            options = [
                { value: 'operating-resources', label: 'Operating Resources' },
                { value: 'emission-impacts', label: 'Emission Impacts' },
                { value: 'flare-impact', label: 'Flare Impact' }
            ];
            break;
        case 'oec':
            options = [
                { value: 'operating-resources', label: 'Operating Resources' },
                { value: 'emission-impacts', label: 'Emission Impacts' },
                { value: 'flare-impact', label: 'Flare Impact' }
            ];
            break;
        case 'sfr':
            options = [
                { value: 'operating-resources', label: 'SFR Operating Resources' },
                { value: 'chp-operating-resources', label: 'CHP Operating Resources' }, // NEU
                { value: 'emission-impacts', label: 'CHP Emission Impacts' },
                { value: 'flare-impact', label: 'Flare Impact' }
            ];
            break;
        case 'flare':
            options = [
                { value: 'operating-resources', label: 'Operating Resources' }, // NEU
                { value: 'emission-impacts', label: 'Emission Impacts' }
            ];
            // "Flare Impact" wird NICHT hinzugefügt für Flare Technology
            break;
    }
    
    // Add options to select
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        lifeStageSelect.appendChild(option);
    });
}

// Populate dropdowns for result tabs
        function populateResultDropdowns() {
            const years = appState.inputs.C;
            
            // Get impact categories from ecological results
            let impactCategories = [];
            if (appState.dfeResults.ecologicalResults) {
                impactCategories = appState.dfeResults.ecologicalResults.impactCategories;
            }


            
            // Populate General Results impact category dropdown
            const generalImpactSelect = document.getElementById('general-impact-category');
            if (generalImpactSelect && impactCategories.length > 0) {
                generalImpactSelect.innerHTML = '';
                impactCategories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    generalImpactSelect.appendChild(option);
                });
                // Set first as default and trigger update
                generalImpactSelect.selectedIndex = 0;
            }
            
            // Populate Ecological Results dropdowns
            const ecoYearSelect = document.getElementById('eco-year-select');
            if (ecoYearSelect) {
                ecoYearSelect.innerHTML = '<option value="total">Total Time Horizon</option>';
                for (let i = 1; i <= years; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Year ${i}`;
                    ecoYearSelect.appendChild(option);
                }
            }
            
            const ecoImpactSelect = document.getElementById('eco-impact-select');
            if (ecoImpactSelect && impactCategories.length > 0) {
                ecoImpactSelect.innerHTML = '';
                impactCategories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    ecoImpactSelect.appendChild(option);
                });
                ecoImpactSelect.selectedIndex = 0;
            }
            
            // Update life stage options based on default technology (DFE)
            updateEcoLifeStageOptions();
            
            // Populate Economic Results year dropdown
            const econYearSelect = document.getElementById('econ-year-select');
            if (econYearSelect) {
                econYearSelect.innerHTML = '<option value="total">Total Time Horizon</option>';
                for (let i = 1; i <= years; i++) {
                    const option = document.createElement('option');
                    option.value = i;
                    option.textContent = `Year ${i}`;
                    econYearSelect.appendChild(option);
                }
            }
        }


        // Calculate gas development (IR1, IR2, IR3)
        function calculateGasDevelopment() {
            const years = appState.inputs.C;
            const results = [];
            
            // Get calorific value from CSV2
            const calorificValue = getCalorificValueCH4();
            console.log("Calorific Value CH4:", calorificValue);
            
// Calculate for each year
for (let i = 0; i < years; i++) {
    const year = i + 1;
    const n = year;
    let methaneContent, gasVolume;
    
    // Check if manual inputs are being used
    if (appState.inputs.manualA && appState.inputs.manualAYears) {
        gasVolume = appState.inputs.manualAYears[i];
    }
    
    if (appState.inputs.manualB && appState.inputs.manualBYears) {
        methaneContent = appState.inputs.manualBYears[i];
    }
    
            // If not using manual inputs, calculate with formulas
            if (!appState.inputs.manualA || !appState.inputs.manualB) {
                if (year === 1) {
                    // Year 1: Use input parameters A and B directly
                    if (!appState.inputs.manualB) {
                        methaneContent = appState.inputs.B;
                    }
                    if (!appState.inputs.manualA) {
                        gasVolume = appState.inputs.A;
                    }
                } else {
                    // Year 2 and onwards: Use formulas with previous year values
                    const k = appState.inputs.kValue;
                    
                    if (!appState.inputs.manualB) {
                        const prevMethaneContent = results[i-1].methaneContent;
                        const prevMethaneFraction = prevMethaneContent / 100;
                        
                        // IR1: Methane content in year n [%]
                        const numerator = prevMethaneFraction * Math.exp(-k * n);
                        const denominator = (prevMethaneFraction * Math.exp(-k * n)) + (1 - prevMethaneFraction);
                        const methaneFraction = numerator / denominator;
                        methaneContent = methaneFraction * 100;
                    }
                    
                    if (!appState.inputs.manualA) {
                        const prevGasVolume = results[i-1].gasVolume;
                        
                        // IR2: Volume flow in year n [m³/h]
                        gasVolume = prevGasVolume * Math.exp(-k * n);
                    }
                }
            }
            
            // Calculate energy content (IR3)
            const methaneFraction = methaneContent / 100;
            const energyContent = methaneFraction * gasVolume * calorificValue * appState.inputs.K;
            
            results.push({
                year: year,
                methaneContent: methaneContent,
                gasVolume: gasVolume,
                energyContent: energyContent
            });
        }
            
            appState.calculationResults.gasDevelopment = results;
            // Don't display here anymore - will be shown in graphs and interim results
        }

        // Get calorific value for CH4 from CSV2
        function getCalorificValueCH4() {
            if (!appState.csvData.CSV2 || appState.csvData.CSV2.length === 0) {
                return 9.97;
            }
            
            for (let row of appState.csvData.CSV2) {
                for (let key in row) {
                    if (key.includes('Calorific Value CH4')) {
                        const value = row[key];
                        return parseFloat(value) || 9.97;
                    }
                }
            }
            
            return 9.97;
        }

        // Get calorific value for diesel or pilot fuel from CSV2
        function getDFEFuelCalorificValue() {
            if (!appState.csvData.CSV2 || appState.csvData.CSV2.length === 0) {
                return 9.8;
            }
            
            const fuelType = appState.inputs.L;
            let searchKey = '';
            
            if (fuelType === 'Diesel') {
                searchKey = 'Calorific Value Diesel';
            } else if (fuelType === 'Pilot Fuel') {
                searchKey = 'Calorific Value Pilot Fuel';
            }
            
            for (let row of appState.csvData.CSV2) {
                for (let key in row) {
                    if (key.includes(searchKey)) {
                        const value = row[key];
                        return parseFloat(value) || 9.8;
                    }
                }
            }
            
            return 9.8;
        }

        // Calculate DFE results (DFE_IR4-DFE_IR9, DFE_O1)
        function calculateDFE() {
            console.log("Starting DFE calculation...");
            
            if (!appState.csvData.CSV3 || appState.csvData.CSV3.length === 0) {
                console.error("CSV3 data not available", appState.csvData.CSV3);
                showError("DFE Engine data (CSV3) could not be loaded.");
                return;
            }
            
            const gasDevelopment = appState.calculationResults.gasDevelopment;
            const years = appState.inputs.C;
            const DFE_fuelCalorificValue = getDFEFuelCalorificValue();
            const DFE_engineSizes = appState.csvData.CSV3;
            
            console.log("DFE Engine Sizes:", DFE_engineSizes);
            
            const DFE_results = {};
            let DFE_maxTotalGas = 0;
            let DFE_selectedEngine = null;
            
            // Calculate for each engine size
            DFE_engineSizes.forEach(engine => {
                console.log("Processing Engine:", engine);
                
                // Use exact column names from CSV3 - UPDATED with corrected efficiency column names
                const DFE_engineSize = parseFloat(engine['Engine Size [kWel]']) || 0;
                const DFE_fuelConsumption = parseFloat(engine['Fuel Consumption [L/h]']) || 0;
                const DFE_engineEfficiencyEl = parseFloat(engine['Engine efficiency el. [%]']) || 0;
                const DFE_engineEfficiencyTh = parseFloat(engine['Engine efficiency th. [%]']) || 0;
                const DFE_maxVolumeFlow = parseFloat(engine['Max. volume flow [m^3/h]']) || 0;
                const DFE_minVolumeFlow = parseFloat(engine['Min. volume flow [m^3/h]']) || 0;
                const DFE_minEngineLoad = parseFloat(engine['Min Engine Load [%]']) || 0;
                
                console.log(`Engine ${DFE_engineSize} kW - values:`, {
                    fuelConsumption: DFE_fuelConsumption,
                    efficiencyEl: DFE_engineEfficiencyEl,
                    efficiencyTh: DFE_engineEfficiencyTh,
                    maxFlow: DFE_maxVolumeFlow,
                    minFlow: DFE_minVolumeFlow,
                    minLoad: DFE_minEngineLoad
                });
                
                // Skip if engine size is not valid
                if (!DFE_engineSize) {
                    console.warn("Skipping engine due to invalid size:", DFE_engineSize);
                    return;
                }
                
                DFE_results[DFE_engineSize] = {
                    engineData: engine,
                    yearlyResults: [],
                    DFE_IR8: 0
                };
                
                // Calculate for each year
                for (let i = 0; i < years; i++) {
                    const yearData = gasDevelopment[i];
                    const year = i + 1;
                    
                    // DFE_IR4: Energy content of landfill gas and diesel/pilot fuel
                    const DFE_IR4 = yearData.energyContent + (DFE_fuelCalorificValue * appState.inputs.K * DFE_fuelConsumption);
                    
                    // DFE_IR5: Energetic utilization (electrical)
                    const DFE_IR5 = (DFE_engineEfficiencyEl / 100) * (DFE_IR4 / appState.inputs.K);
                    
                    // DFE_IR6: Relative utilization [%]
                    const DFE_IR6 = DFE_IR5 > 0 ? (DFE_IR5 / DFE_engineSize) * 100 : 0;
                    
                    // DFE_IR7: Can the engine be used? (0 or 1)
                    const volumeInRange = (yearData.gasVolume >= DFE_minVolumeFlow && yearData.gasVolume <= DFE_maxVolumeFlow);
                    const loadInRange = (DFE_IR6 >= DFE_minEngineLoad && DFE_IR6 <= 100);
                    
                    const DFE_IR7 = (volumeInRange && loadInRange) ? 1 : 0;
                    
                    // DFE_IR9: Amount of gas flared
                    const DFE_IR9 = DFE_IR7 === 0 ? yearData.gasVolume * appState.inputs.K : 0;
                    
                    // Add to total gas processed for this engine (DFE_IR8)
                    if (DFE_IR7 === 1) {
                        DFE_results[DFE_engineSize].DFE_IR8 += yearData.gasVolume * appState.inputs.K;
                    }
                    
                    DFE_results[DFE_engineSize].yearlyResults.push({
                        year: year,
                        DFE_IR4: DFE_IR4,
                        DFE_IR5: DFE_IR5,
                        DFE_IR6: DFE_IR6,
                        DFE_IR7: DFE_IR7,
                        DFE_IR9: DFE_IR9
                    });
                }
                
                // Check if this engine has the highest total gas processed
                if (DFE_results[DFE_engineSize].DFE_IR8 > DFE_maxTotalGas) {
                    DFE_maxTotalGas = DFE_results[DFE_engineSize].DFE_IR8;
                    DFE_selectedEngine = DFE_engineSize;
                }
            });
            
            // DFE_O1: Selected engine size
            const DFE_O1 = DFE_maxTotalGas > 0 ? DFE_selectedEngine : null;
            
            appState.dfeResults = {
                DFE_results: DFE_results,
                DFE_O1: DFE_O1,
                DFE_maxTotalGas: DFE_maxTotalGas
            };
            
            console.log("DFE results:", appState.dfeResults);
        }

        // CORRECTED: Calculate detailed DFE results (IR10-IR21) - FIXED EMISSIONS CALCULATION
        function calculateDFEDetailedResults() {
            console.log("Starting detailed DFE calculations...");
            
            const DFE_O1 = appState.dfeResults.DFE_O1;
            if (!DFE_O1) {
                console.error("No selected engine size available");
                return;
            }

            // Get selected engine data
            const selectedEngine = appState.csvData.CSV3.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === DFE_O1
            );
            
            if (!selectedEngine) {
                console.error("Selected engine not found in CSV3:", DFE_O1);
                return;
            }

            // Get load dependent data from CSV4
            const loadData = appState.csvData.CSV4;
            if (!loadData) {
                console.error("CSV4 data not available");
                return;
            }

            // CORRECTION: Use CSV5 for engine emissions (not CSV7)
            const emissionData = appState.csvData.CSV5;
            if (!emissionData) {
                console.error("CSV5 data not available");
                return;
            }

            // Get flare data from CSV6 and CSV7
            const flareData = appState.csvData.CSV6;
            const flareEmissionData = appState.csvData.CSV7;
            if (!flareData || !flareEmissionData) {
                console.error("Flare data not available");
                return;
            }

            const years = appState.inputs.C;
            const K = appState.inputs.K;
            const gasDevelopment = appState.calculationResults.gasDevelopment;
            const DFE_yearlyResults = appState.dfeResults.DFE_results[DFE_O1].yearlyResults;

            const detailedResults = [];

            // Calculate for each year
            for (let i = 0; i < years; i++) {
                const year = i + 1;
                const yearData = gasDevelopment[i];
                const DFE_yearData = DFE_yearlyResults[i];
                
                // Get engine load for this year
                const engineLoad = DFE_yearData.DFE_IR6;
                
                // 7.21: Find closest matching load data from CSV4
                const closestLoadRow = findClosestLoadRow(loadData, engineLoad, 'Engine Load[%]');
                
                // Extract V1-V5 values
                const V1 = closestLoadRow['Fuel Consumption Factor'] || 1;
                const V2 = closestLoadRow['Electricity Consumption factor'] || 1;
                const V3 = closestLoadRow['Maintenance Period [opr. h]'] || 1;
                const V4 = closestLoadRow['Coolant change [opr. H]'] || 1;
                const V5 = closestLoadRow['Oil change [opr. h]'] || 1;

                // 7.22: Calculate load-dependent values (multiply with IR7)
                const IR10 = V1 * K * (selectedEngine['Fuel Consumption [L/h]'] || 0) * DFE_yearData.DFE_IR7; // Diesel consumption
                const IR11 = V2 * K * (selectedEngine['Electricity consumption [kW]'] || 0) * DFE_yearData.DFE_IR7; // Electricity consumption
                const IR12 = (K / V3) * DFE_yearData.DFE_IR7; // Maintenance frequency
                const IR13 = (K / V4) * (selectedEngine['Coolant Volume [L]'] || 0) * DFE_yearData.DFE_IR7; // Coolant consumption
                const IR14 = (K / V5) * (selectedEngine['Oil tank volume [L]'] || 0) * DFE_yearData.DFE_IR7; // Oil consumption

                // CORRECTION: 7.3: Calculate emissions (IR15) - Use CSV5 for engine emissions (NOT CSV7)
                const closestEmissionRow = findClosestLoadRow(emissionData, engineLoad, 'Engine Range (% of Load)');
                console.log("CSV5 emission data for load level", engineLoad, ":", closestEmissionRow);
                
                // CORRECTED: Use IR2 (gasVolume) and IR7 for engine emissions calculation
                const IR2 = yearData.gasVolume;
                const IR7 = DFE_yearData.DFE_IR7;
                
                const emissionsIR15 = {
                    carbonMonoxide: (closestEmissionRow['Carbon Monoxide [kg CO/m^3]'] || 0) * IR2 * IR7 * K,
                    nitrogenOxides: (closestEmissionRow['Nitrogene Oxydes [kg NOx/m^3]'] || 0) * IR2 * IR7 * K,
                    formaldehyde: (closestEmissionRow['Formldehyd [kg CH2O/m^3]'] || 0) * IR2 * IR7 * K,
                    methaneSlop: (closestEmissionRow['Methane Slop [kg CH4/m^3]'] || 0) * IR2 * IR7 * K,
                    particulateMatter: (closestEmissionRow['Particulate Matter [kg/m^3]'] || 0) * IR2 * IR7 * K,
                    sulfurDioxide: (closestEmissionRow['Sulfur Dioxide [kg SO2/m^3]'] || 0) * IR2 * IR7 * K,
                    ammonia: (closestEmissionRow['Ammonia [kg NH3/m^3]'] || 0) * IR2 * IR7 * K
                };

                // 7.41: Calculate energy production - UPDATED with corrected efficiency column names
                const DFE_engineEffTh = (selectedEngine['Engine efficiency th. [%]'] || 0) / 100;
                const DFE_engineEffEl = (selectedEngine['Engine efficiency el. [%]'] || 0) / 100;
                const IR16 = DFE_engineEffTh * DFE_yearData.DFE_IR4 * DFE_yearData.DFE_IR7; // Thermal energy
                const IR17 = DFE_engineEffEl * DFE_yearData.DFE_IR4 * DFE_yearData.DFE_IR7; // Electrical energy

                // 7.42: Calculate flare impacts
                const IR18 = DFE_yearData.DFE_IR7 === 0 ? K : 0; // Flare operating hours
                const IR19 = IR18 / (flareData[0]['Maintenance Period [opr. h]'] || 1); // Flare maintenance frequency
                const IR20 = IR18 * (flareData[0]['Electricity Consumption [kW]'] || 0); // Flare electricity use

                // CORRECTED: Flare emissions (IR21) - Use CSV7 for flare emissions and IR2 when IR7=0
                const flareEmissionsIR21 = {
                    carbonMonoxide: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Carbon Monoxide [kg CO/m^3]'] || 0) * IR2 * K : 0,
                    nitrogenOxides: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Nitrogene Oxydes [kg NOx/m^3]'] || 0) * IR2 * K : 0,
                    formaldehyde: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Formldehyd [kg CH2O/m^3]'] || 0) * IR2 * K : 0,
                    methaneSlop: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Methane Slop [kg CH4/m^3]'] || 0) * IR2 * K : 0,
                    particulateMatter: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Particulate Matter [kg/m^3]'] || 0) * IR2 * K : 0,
                    sulfurDioxide: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Sulfur Dioxide [kg SO2/m^3]'] || 0) * IR2 * K : 0,
                    ammonia: DFE_yearData.DFE_IR7 === 0 ? 
                        (flareEmissionData[0]['Ammonia [kg NH3/m^3]'] || 0) * IR2 * K : 0
                };

                detailedResults.push({
                    year: year,
                    IR10: IR10,
                    IR11: IR11,
                    IR12: IR12,
                    IR13: IR13,
                    IR14: IR14,
                    IR16: IR16,
                    IR17: IR17,
                    IR18: IR18,
                    IR19: IR19,
                    IR20: IR20,
                    emissionsIR15: emissionsIR15,
                    flareEmissionsIR21: flareEmissionsIR21,
                    DFE_IR7: DFE_yearData.DFE_IR7, // Store for economic calculations
                    IR2: IR2 // Store gas volume for reference
                });
            }

            appState.dfeResults.detailedResults = detailedResults;
        }

// Calculate OEC results (IRO4-IRO8, OO1)
        function calculateOEC() {
            console.log("Starting OEC calculation...");
            
            if (!appState.csvData.CSV13 || appState.csvData.CSV13.length === 0) {
                console.error("CSV13 data not available", appState.csvData.CSV13);
                showError("OEC Engine data (CSV13) could not be loaded.");
                return;
            }
            
            const gasDevelopment = appState.calculationResults.gasDevelopment;
            const years = appState.inputs.C;
            const OEC_engineSizes = appState.csvData.CSV13;
            
            console.log("OEC Engine Sizes:", OEC_engineSizes);
            
            const OEC_results = {};
            let OEC_maxTotalGas = 0;
            let OEC_selectedEngine = null;
            
            // Calculate for each engine size
            OEC_engineSizes.forEach(engine => {
                console.log("Processing OEC Engine:", engine);
                
                // Use exact column names from CSV13
                const OEC_engineSize = parseFloat(engine['Engine Size [kWel]']) || 0;
                const OEC_engineEfficiencyEl = parseFloat(engine['Engine efficiency el. [%]']) || 0;
                const OEC_maxVolumeFlow = parseFloat(engine['Max. volume flow [m^3/h]']) || 0;
                const OEC_minVolumeFlow = parseFloat(engine['Min. volume flow [m^3/h]']) || 0;
                const OEC_minEngineLoad = parseFloat(engine['Minimum Engine Load [%]']) || 0;
                
                console.log(`OEC Engine ${OEC_engineSize} kW - values:`, {
                    efficiencyEl: OEC_engineEfficiencyEl,
                    maxFlow: OEC_maxVolumeFlow,
                    minFlow: OEC_minVolumeFlow,
                    minLoad: OEC_minEngineLoad
                });
                
                // Skip if engine size is not valid
                if (!OEC_engineSize) {
                    console.warn("Skipping OEC engine due to invalid size:", OEC_engineSize);
                    return;
                }
                
                OEC_results[OEC_engineSize] = {
                    engineData: engine,
                    yearlyResults: [],
                    IRO7: 0
                };
                
                // Calculate for each year
                for (let i = 0; i < years; i++) {
                    const yearData = gasDevelopment[i];
                    const year = i + 1;
                    
                    // IRO4: Energetic utilization (electrical)
                    const IRO4 = (OEC_engineEfficiencyEl / 100) * (yearData.energyContent / appState.inputs.K );
                    
                    // IRO5: Relative utilization [%]
                    const IRO5 = IRO4 > 0 ? (IRO4 / OEC_engineSize) * 100 : 0;
                    
                    // IRO6: Can the engine be used? (0 or 1)
                    const volumeInRange = (yearData.gasVolume >= OEC_minVolumeFlow && yearData.gasVolume <= OEC_maxVolumeFlow);
                    const loadInRange = (IRO5 >= OEC_minEngineLoad && IRO5 <= 100);
                    
                    const IRO6 = (volumeInRange && loadInRange) ? 1 : 0;
                    
                    // IRO8: Amount of gas flared
                    const IRO8 = IRO6 === 0 ? yearData.gasVolume * appState.inputs.K : 0;
                    
                    // Add to total gas processed for this engine (IRO7)
                    if (IRO6 === 1) {
                        OEC_results[OEC_engineSize].IRO7 += yearData.gasVolume * appState.inputs.K;
                    }
                    
                    OEC_results[OEC_engineSize].yearlyResults.push({
                        year: year,
                        IRO4: IRO4,
                        IRO5: IRO5,
                        IRO6: IRO6,
                        IRO8: IRO8
                    });
                }
                
                // Check if this engine has the highest total gas processed
                if (OEC_results[OEC_engineSize].IRO7 > OEC_maxTotalGas) {
                    OEC_maxTotalGas = OEC_results[OEC_engineSize].IRO7;
                    OEC_selectedEngine = OEC_engineSize;
                }
            });
            
            // OO1: Selected engine size
            const OO1 = OEC_maxTotalGas > 0 ? OEC_selectedEngine : null;
            
            appState.oecResults = {
                OEC_results: OEC_results,
                OO1: OO1,
                OEC_maxTotalGas: OEC_maxTotalGas
            };
            
            console.log("OEC results:", appState.oecResults);
        }

        // Calculate detailed OEC results (IRO9-IRO20)
        function calculateOECDetailedResults() {
            console.log("Starting detailed OEC calculations...");
            
            const OO1 = appState.oecResults.OO1;
            if (!OO1) {
                console.error("No selected OEC engine size available");
                return;
            }

            // Get selected engine data
            const selectedEngine = appState.csvData.CSV13.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === OO1
            );
            
            if (!selectedEngine) {
                console.error("Selected OEC engine not found in CSV13:", OO1);
                return;
            }

            // Get load dependent data from CSV14
            const loadData = appState.csvData.CSV14;
            if (!loadData) {
                console.error("CSV14 data not available");
                return;
            }

            // Get emission data from CSV15
            const emissionData = appState.csvData.CSV15;
            if (!emissionData) {
                console.error("CSV15 data not available");
                return;
            }

            // Get flare data from CSV6 and CSV7
            const flareData = appState.csvData.CSV6;
            const flareEmissionData = appState.csvData.CSV7;
            if (!flareData || !flareEmissionData) {
                console.error("Flare data not available");
                return;
            }

            const years = appState.inputs.C;
            const K = appState.inputs.K;
            const gasDevelopment = appState.calculationResults.gasDevelopment;
            const OEC_yearlyResults = appState.oecResults.OEC_results[OO1].yearlyResults;

            const detailedResults = [];

            // Calculate for each year
            for (let i = 0; i < years; i++) {
                const year = i + 1;
                const yearData = gasDevelopment[i];
                const OEC_yearData = OEC_yearlyResults[i];
                
                // Get engine load for this year
                const engineLoad = OEC_yearData.IRO5;
                
                // Find closest matching load data from CSV14
                const closestLoadRow = findClosestLoadRow(loadData, engineLoad, 'Engine Load[%]');
                
                // Extract VO1-VO5 values
                const VO1 = closestLoadRow['Oxygen Consumption [m^3]'] || 1;
                const VO2 = closestLoadRow['Electricity Consumption factor'] || 1;
                const VO3 = closestLoadRow['Maintenance Period [opr. h]'] || 1;
                const VO4 = closestLoadRow['Coolant change [opr. H]'] || 1;
                const VO5 = closestLoadRow['Oil change [opr. h]'] || 1;

                // Calculate load-dependent values (multiply with IRO6)
                const IRO9 = VO1 * K * (selectedEngine['Oxygen consumption factor'] || 0) * OEC_yearData.IRO6; // Oxygen consumption
                const IRO10 = VO2 * K * (selectedEngine['Electricity consumption [kW]'] || 0) * OEC_yearData.IRO6; // Electricity consumption
                const IRO11 = (K / VO3) * OEC_yearData.IRO6; // Maintenance frequency
                const IRO12 = (K / VO4) * (selectedEngine['Coolant Volume [L]'] || 0) * OEC_yearData.IRO6; // Coolant consumption
                const IRO13 = (K / VO5) * (selectedEngine['Oil tank volume [L]'] || 0) * OEC_yearData.IRO6; // Oil consumption

                // Calculate emissions (IRO14)
                const closestEmissionRow = findClosestLoadRow(emissionData, engineLoad, 'Engine Range [% of Load]');
                console.log("CSV15 emission data for load level", engineLoad, ":", closestEmissionRow);
                
                const IR2 = yearData.gasVolume;
                const IRO6 = OEC_yearData.IRO6;
                
                const emissionsIRO14 = {
                    carbonMonoxide: (closestEmissionRow['Carbon Monoxide [kg CO/m^3]'] || 0) * IR2 * IRO6 * K,
                    nitrogenOxides: (closestEmissionRow['Nitrogene Oxydes [kg NOx/m^3]'] || 0) * IR2 * IRO6 * K,
                    formaldehyde: (closestEmissionRow['Formldehyd [kg CH2O/m^3]'] || 0) * IR2 * IRO6 * K,
                    methaneSlop: (closestEmissionRow['Methane Slop [kg CH4/m^3]'] || 0) * IR2 * IRO6 * K,
                    particulateMatter: (closestEmissionRow['Particulate Matter [kg/m^3]'] || 0) * IR2 * IRO6 * K,
                    sulfurDioxide: (closestEmissionRow['Sulfur Dioxide [kg SO2/m^3]'] || 0) * IR2 * IRO6 * K,
                    ammonia: (closestEmissionRow['Ammonia [kg NH3/m^3]'] || 0) * IR2 * IRO6 * K
                };

                // Calculate OEC energy production
                const OEC_engineEffTh = (selectedEngine['Engine efficiency th. [%]'] || 0) / 100;
                const OEC_engineEffEl = (selectedEngine['Engine efficiency el. [%]'] || 0) / 100;
                const IRO15 = yearData.energyContent * OEC_engineEffTh * OEC_yearData.IRO6; // Thermal energy
                const IRO16 = yearData.energyContent * OEC_engineEffEl * OEC_yearData.IRO6; // Electrical energy

                // Calculate OEC flare impacts
                const IRO17 = OEC_yearData.IRO6 === 0 ? K : 0; // Flare operating hours
                const IRO18 = IRO17 / (flareData[0]['Maintenance Period [opr. h]'] || 1); // Flare maintenance frequency
                const IRO19 = IRO17 * (flareData[0]['Electricity Consumption [kW]'] || 0); // Flare electricity use

                // OEC Flare emissions (IRO20)
                const flareEmissionsIRO20 = {
                    carbonMonoxide: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Carbon Monoxide [kg CO/m^3]'] || 0) * IR2 * K : 0,
                    nitrogenOxides: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Nitrogene Oxydes [kg NOx/m^3]'] || 0) * IR2 * K : 0,
                    formaldehyde: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Formldehyd [kg CH2O/m^3]'] || 0) * IR2 * K : 0,
                    methaneSlop: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Methane Slop [kg CH4/m^3]'] || 0) * IR2 * K : 0,
                    particulateMatter: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Particulate Matter [kg/m^3]'] || 0) * IR2 * K : 0,
                    sulfurDioxide: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Sulfur Dioxide [kg SO2/m^3]'] || 0) * IR2 * K : 0,
                    ammonia: OEC_yearData.IRO6 === 0 ? 
                        (flareEmissionData[0]['Ammonia [kg NH3/m^3]'] || 0) * IR2 * K : 0
                };

                detailedResults.push({
                    year: year,
                    IRO9: IRO9,
                    IRO10: IRO10,
                    IRO11: IRO11,
                    IRO12: IRO12,
                    IRO13: IRO13,
                    IRO15: IRO15,
                    IRO16: IRO16,
                    IRO17: IRO17,
                    IRO18: IRO18,
                    IRO19: IRO19,
                    emissionsIRO14: emissionsIRO14,
                    flareEmissionsIRO20: flareEmissionsIRO20,
                    IRO6: OEC_yearData.IRO6, // Store for economic calculations
                    IR2: IR2 // Store gas volume for reference
                });
            }

            appState.oecResults.detailedResults = detailedResults;
        }

        // NEW: Calculate OEC ecological results (OO2-OO13)
        function calculateOECEcologicalResults() {
            console.log("Starting ecological OEC calculations...");
            
            if (!appState.csvData.CSV16 || !appState.csvData.CSV9 || !appState.csvData.CSV10 || !appState.csvData.CSV11) {
                console.error("Ecological CSV data not available");
                showError("Ecological background data could not be loaded.");
                return;
            }

            const OO1 = appState.oecResults.OO1;
            if (!OO1) {
                console.error("No selected OEC engine size available");
                return;
            }

            // Get selected engine data
            const selectedEngine = appState.csvData.CSV13.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === OO1
            );
            
            if (!selectedEngine) {
                console.error("Selected OEC engine not found in CSV13:", OO1);
                return;
            }

            const detailedResults = appState.oecResults.detailedResults;
            if (!detailedResults) {
                console.error("No detailed OEC results available");
                return;
            }

            // Get impact categories from CSV16 (first row)
            const impactCategories = Object.keys(appState.csvData.CSV16[0] || {});
            impactCategories.shift(); // Remove "Impact Category" column
            
            console.log("OEC Impact categories:", impactCategories);

            const ecologicalResults = {
                impactCategories: impactCategories,
                yearlyResults: []
            };

            // Get production factor from selected engine
            const productionFactor = selectedEngine['Production Factor'] || 1;

            // Properly select energy source data from CSV10
            let energySourceData;
            if (appState.inputs.J === 'Renewable') {
                // Find the row for Renewable
                energySourceData = appState.csvData.CSV10.find(row => {
                    // Check the first column value (not the header name)
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === 'Renewable';
                });
            } else {
                // Find the row for the selected country
                energySourceData = appState.csvData.CSV10.find(row => {
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === appState.inputs.D;
                });
            }

            console.log("OEC Energy source data:", energySourceData);

            // OO2 calculated only once (in the first year)
            const engineProductionData = appState.csvData.CSV16.find(row => 
                row['Impact Category'] && row['Impact Category'].includes('Engine Production')
            );
            
            const OO2_total = {};
            if (engineProductionData) {
                impactCategories.forEach(category => {
                    OO2_total[category] = productionFactor * (engineProductionData[category] || 0);
                });
            }

            // Calculate for each year
            detailedResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEcologicalResults = {
                    year: year,
                    OO2: {}, // Engine Production Impact (only in first year)
                    OO3: {}, // Oxygen Production Impact  
                    OO4: {}, // Maintenance Impact
                    OO5: {}, // Oil Impact
                    OO6: {}, // Coolant Impact
                    OO7: {}, // Emission Impact (sum of all emissions)
                    OO8: {}, // Engine Energy Impact
                    OO9: {}, // Flare Energy Impact
                    OO10: {}, // Flare Maintenance Impact
                    OO11: {}, // Flare Emission Impact (sum of all emissions)
                    OO12: {}, // Operating materials total
                    OO13: {}, // Flare total
                    // New fields for detailed emission calculations
                    OO7_detailed: {}, // Detailed engine emissions per emission type
                    OO11_detailed: {} // Detailed flare emissions per emission type
                };

                // OO2 only set in first year
                if (year === 1) {
                    yearEcologicalResults.OO2 = {...OO2_total};
                }

                // Calculate for each impact category
                impactCategories.forEach(category => {
                    // OO3 - Oxygen Production Impact
                    const oxygenProductionData = appState.csvData.CSV16.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Oxygen Production')
                    );
                    if (oxygenProductionData) {
                        yearEcologicalResults.OO3[category] = yearData.IRO9 * (oxygenProductionData[category] || 0);
                    }

                    // OO4, OO5, OO6 - Maintenance, Oil, Coolant Impacts
                    const maintenanceData = appState.csvData.CSV16.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    const oilData = appState.csvData.CSV16.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Oil Production')
                    );
                    const coolantData = appState.csvData.CSV16.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Coolant Production')
                    );

                    if (maintenanceData) {
                        yearEcologicalResults.OO4[category] = yearData.IRO11 * (maintenanceData[category] || 0);
                    }
                    if (oilData) {
                        yearEcologicalResults.OO5[category] = yearData.IRO13 * (oilData[category] || 0);
                    }
                    if (coolantData) {
                        yearEcologicalResults.OO6[category] = yearData.IRO12 * (coolantData[category] || 0);
                    }

                    // OO7 - Emission Impact (sum of all emissions)
                    let emissionImpact = 0;
                    yearEcologicalResults.OO7_detailed[category] = {};
                    
                    Object.keys(yearData.emissionsIRO14).forEach(emissionType => {
                        // Find emission data in CSV9
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            const emissionValue = yearData.emissionsIRO14[emissionType] * (emissionData[category] || 0);
                            emissionImpact += emissionValue;
                            yearEcologicalResults.OO7_detailed[category][emissionType] = emissionValue;
                        } else {
                            console.warn(`No emission data found for ${emissionType} in category ${category}`);
                            yearEcologicalResults.OO7_detailed[category][emissionType] = 0;
                        }
                    });
                    yearEcologicalResults.OO7[category] = emissionImpact;

                    // OO8, OO9 - Energy Impacts
                    if (energySourceData) {
                        yearEcologicalResults.OO8[category] = yearData.IRO10 * (energySourceData[category] || 0);
                        yearEcologicalResults.OO9[category] = yearData.IRO19 * (energySourceData[category] || 0);
                    } else {
                        console.warn("No energy source data found for OEC:", appState.inputs.J, appState.inputs.D);
                        yearEcologicalResults.OO8[category] = 0;
                        yearEcologicalResults.OO9[category] = 0;
                    }

                    // OO10 - Flare Maintenance Impact
                    const flareMaintenanceData = appState.csvData.CSV11.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    if (flareMaintenanceData) {
                        yearEcologicalResults.OO10[category] = yearData.IRO18 * (flareMaintenanceData[category] || 0);
                    }

                    // OO11 - Flare Emission Impact (sum of all emissions)
                    let flareEmissionImpact = 0;
                    yearEcologicalResults.OO11_detailed[category] = {};
                    
                    Object.keys(yearData.flareEmissionsIRO20).forEach(emissionType => {
                        // Find emission data in CSV9
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            const emissionValue = yearData.flareEmissionsIRO20[emissionType] * (emissionData[category] || 0);
                            flareEmissionImpact += emissionValue;
                            yearEcologicalResults.OO11_detailed[category][emissionType] = emissionValue;
                        } else {
                            console.warn(`No emission data found for ${emissionType} in category ${category}`);
                            yearEcologicalResults.OO11_detailed[category][emissionType] = 0;
                        }
                    });
                    yearEcologicalResults.OO11[category] = flareEmissionImpact;

                    // OO12, OO13 - Summaries
                    yearEcologicalResults.OO12[category] = 
                        (yearEcologicalResults.OO8[category] || 0) + 
                        (yearEcologicalResults.OO6[category] || 0) + 
                        (yearEcologicalResults.OO5[category] || 0);
                    
                    yearEcologicalResults.OO13[category] = 
                        (yearEcologicalResults.OO9[category] || 0) + 
                        (yearEcologicalResults.OO10[category] || 0) + 
                        (yearEcologicalResults.OO11[category] || 0);
                });

                ecologicalResults.yearlyResults.push(yearEcologicalResults);
            });

            appState.oecResults.ecologicalResults = ecologicalResults;
        }

        // NEW: Calculate OEC economic results (OO14-OO30)
        function calculateOECEconomicResults() {
            console.log("Starting economic OEC calculations...");
            
            if (!appState.csvData.CSV1 || !appState.csvData.CSV12) {
                console.error("Economic CSV data not available");
                showError("Economic background data could not be loaded.");
                return;
            }

            const OO1 = appState.oecResults.OO1;
            if (!OO1) {
                console.error("No selected OEC engine size available");
                return;
            }

            // Get selected engine data
            const selectedEngine = appState.csvData.CSV13.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === OO1
            );
            
            if (!selectedEngine) {
                console.error("Selected OEC engine not found in CSV13:", OO1);
                return;
            }

            const detailedResults = appState.oecResults.detailedResults;
            if (!detailedResults) {
                console.error("No detailed OEC results available");
                return;
            }

            const years = appState.inputs.C;
            const economicResults = {
                yearlyResults: [],
                OO23: 0, // Investment costs
                OO30: 0  // NPV
            };

            // Get country-specific maintenance costs from CSV1
            const countryData = appState.csvData.CSV1.find(row => row.Country === appState.inputs.D);
            const maintenanceFlare = countryData['Maintenance Flare [€/maintenance mix]'] || 250;
            const maintenanceOE = countryData['Maintenance OE [€/maintenance mix]'] || 250;
            const depreciationYears = countryData['Depreciation [a]'] || appState.inputs.G;

            // Get prices from CSV12
            const engineOilPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Engine oil')
            )?.['Price'] || 2;
            
            const coolantPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Coolant')
            )?.['Price'] || 2;
            
            const oxygenPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Oxygen price')
            )?.['Price'] || 3;
            
            const oxygenEnrichmentEnginePrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Oxygen Enrichment Engine')
            )?.['Price'] || 50000;

            // Calculate investment costs
            const priceFactor = selectedEngine['Price Factor'] || 1;
            economicResults.OO23 = oxygenEnrichmentEnginePrice * priceFactor;

            // Find first year with engine operation (IRO6=1) for depreciation start
            let firstOperationYear = null;
            for (let i = 0; i < years; i++) {
                if (detailedResults[i].IRO6 === 1) {
                    firstOperationYear = i + 1;
                    break;
                }
            }

            // Tax compensation logic
            let previousOO27_1 = 0;

            // Calculate for each year
            detailedResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEconomicResults = {
                    year: year,
                    // Revenues
                    OO14: 0, // Electric energy revenue
                    OO15: 0, // Thermal energy revenue
                    // Flare costs
                    OO16: 0, // Flare maintenance costs
                    OO17: 0, // Flare electricity costs
                    // OEC costs
                    OO18: 0, // OEC electricity costs
                    OO19: 0, // OEC maintenance costs
                    OO20: 0, // OEC oil costs
                    OO21: 0, // OEC coolant costs
                    OO22: 0, // OEC oxygen costs
                    // Summaries
                    OO24: 0, // Total OEC Energy Revenue
                    OO25: 0, // Total Flare costs
                    OO26: 0, // Total OEC Operating Costs
                    OO27: 0, // Total OEC Revenue
                    // NEW: Tax compensation
                    OO27_1: 0, // Tax compensation
                    // NPV calculations
                    IRO21: 0, // Depreciation costs
                    IRO22: 0, // Profit before taxes
                    OO28: 0, // Taxes
                    OO29: 0  // Profit after taxes
                };

                // Calculate revenues
                yearEconomicResults.OO14 = yearData.IRO16 * appState.inputs.E;
                yearEconomicResults.OO15 = yearData.IRO15 * appState.inputs.F;

                // Calculate flare costs
                yearEconomicResults.OO16 = yearData.IRO18 * maintenanceFlare;
                yearEconomicResults.OO17 = yearData.IRO19 * appState.inputs.E;

                // Calculate OEC operating costs
                yearEconomicResults.OO18 = yearData.IRO10 * appState.inputs.E;
                yearEconomicResults.OO19 = yearData.IRO11 * maintenanceOE;
                yearEconomicResults.OO20 = yearData.IRO13 * engineOilPrice;
                yearEconomicResults.OO21 = yearData.IRO12 * coolantPrice;

                // Calculate oxygen costs
                yearEconomicResults.OO22 = yearData.IRO9 * oxygenPrice;

                // Cost summaries
                yearEconomicResults.OO24 = yearEconomicResults.OO14 + yearEconomicResults.OO15;
                yearEconomicResults.OO25 = yearEconomicResults.OO16 + yearEconomicResults.OO17;
                yearEconomicResults.OO26 = yearEconomicResults.OO18 + yearEconomicResults.OO19 + 
                                          yearEconomicResults.OO20 + yearEconomicResults.OO21;
                yearEconomicResults.OO27 = yearEconomicResults.OO24 - yearEconomicResults.OO25 - 
                                          yearEconomicResults.OO26 - yearEconomicResults.OO22;

                // Calculate depreciation - starts from first operation year and lasts for G years
                if (firstOperationYear && year >= firstOperationYear && year < firstOperationYear + depreciationYears) {
                    yearEconomicResults.IRO21 = economicResults.OO23 / depreciationYears;
                } else {
                    yearEconomicResults.IRO21 = 0;
                }

                // Calculate OO27_1 - Tax compensation
                if (yearEconomicResults.OO27 < 0) {
                    yearEconomicResults.OO27_1 = yearEconomicResults.OO27 + previousOO27_1;
                } else {
                    yearEconomicResults.OO27_1 = 0;
                }

                // Calculate profit before taxes with tax compensation
                yearEconomicResults.IRO22 = yearEconomicResults.OO27 - yearEconomicResults.IRO21 + previousOO27_1;

                // Calculate taxes - only if profit is positive
                if (yearEconomicResults.IRO22 > 0) {
                    yearEconomicResults.OO28 = yearEconomicResults.IRO22 * appState.inputs.H;
                } else {
                    yearEconomicResults.OO28 = 0;
                }

                // Calculate profit after taxes
                yearEconomicResults.OO29 = yearEconomicResults.OO27 - yearEconomicResults.OO28;

                // Update previous OO27_1 for next iteration
                previousOO27_1 = yearEconomicResults.OO27_1;

                economicResults.yearlyResults.push(yearEconomicResults);
            });

            // Calculate NPV
            let npvSum = 0;
            economicResults.yearlyResults.forEach((yearResult, index) => {
                const n = index + 1;
                npvSum += yearResult.OO29 / Math.pow((1 + appState.inputs.I), n);
            });
            economicResults.OO30 = -economicResults.OO23 + npvSum;

            appState.oecResults.economicResults = economicResults;
        }        


        // NEW: Calculate SFR results (IRS4-IRS13, OS1)
        function calculateSFR() {
            console.log("Starting SFR calculation...");

            
            // Holen Sie den Wert am Anfang der Funktion
            const calorificValue = getCalorificValueCH4();
            console.log("Calorific Value CH4:", calorificValue);
            
             // Get calorific value for CH4 from CSV2
                function getCalorificValueCH4() {
                    if (!appState.csvData.CSV2 || appState.csvData.CSV2.length === 0) {
                    return 9.97;
                                }
                    for (let row of appState.csvData.CSV2) {
                    for (let key in row) {
                    if (key.includes('Calorific Value CH4')) {
                    const value = row[key];
                    return parseFloat(value) || 9.97;
                                        }
                                    }
                                }
                return 9.97;
            }

            
            if (!appState.csvData.CSV17 || appState.csvData.CSV17.length === 0) {
                console.error("CSV17 data not available", appState.csvData.CSV17);
                showError("SFR Unit data (CSV17) could not be loaded.");
                return;
            }
            
            const gasDevelopment = appState.calculationResults.gasDevelopment;
            const years = appState.inputs.C;
            const SFR_units = appState.csvData.CSV17;
            
            console.log("SFR Units:", SFR_units);
            
            const SFR_results = {};
            let SFR_maxTotalGas = 0;
            let SFR_selectedUnit = null;
            
            // Calculate for each unit size
            SFR_units.forEach(unit => {
                console.log("Processing SFR Unit:", unit);
                
                // Use exact column names from CSV17
                const unitNumber = parseFloat(unit['Unit']) || 0;
                const maxEnergeticInput = parseFloat(unit['max. energetic input value [kW]']) || 0;
                const maxVolumeFlow = parseFloat(unit['max. volume flow[ m^3/h]']) || 0;
                const minVolumeFlow = parseFloat(unit['min. volume flow [m^3/h]']) || 0;
                const minEnergeticInput = parseFloat(unit['min. energetic input value [kW]']) || 0;
                const outputGasQuality = parseFloat(unit['Output Gas quality [% CH4]']) || 0;
                
                console.log(`SFR Unit ${unitNumber} - values:`, {
                    maxEnergeticInput: maxEnergeticInput,
                    maxVolumeFlow: maxVolumeFlow,
                    minVolumeFlow: minVolumeFlow,
                    minEnergeticInput: minEnergeticInput,
                    outputGasQuality: outputGasQuality
                });
                
                // Skip if unit number is not valid
                if (!unitNumber) {
                    console.warn("Skipping unit due to invalid number:", unitNumber);
                    return;
                }
                
                SFR_results[unitNumber] = {
                    unitData: unit,
                    yearlyResults: [],
                    IRS6: 0
                };
                
                // Calculate for each year
                for (let i = 0; i < years; i++) {
                    const yearData = gasDevelopment[i];
                    const year = i + 1;
                    
                    // IRS4: Engine Load in year n [%]
                    const IRS4 = maxEnergeticInput > 0 ? (yearData.energyContent / appState.inputs.K) / maxEnergeticInput * 100 : 0;
                    
                    // IRS5: Can the unit be used? (0 or 1)
                    const volumeInRange = (yearData.gasVolume >= minVolumeFlow && yearData.gasVolume <= maxVolumeFlow);
                    const energyInRange = (((yearData.energyContent / appState.inputs.K )) >= minEnergeticInput && (yearData.energyContent/appState.inputs.K) <= maxEnergeticInput);
                    
                    const IRS5 = (volumeInRange && energyInRange) ? 1 : 0;
                    
                    // IRS7: Gas processed with CHP in year n [m³/h]
                    const IRS7 = IRS5 === 1 ? ((yearData.gasVolume * (yearData.methaneContent / 100)) / (outputGasQuality / 100)) : 0;
                    
                    // IRS8: SFR Output Gas Energy Content in year n [kW]
                    const IRS8 = IRS5 === 1 ? IRS7 * appState.inputs.K * calorificValue * (outputGasQuality / 100)  : 0;
                    
                    // IRS13: Amount of gas flared in year n [m³]
                    let IRS13 = 0;
                    if (IRS5 === 0) {
                        IRS13 = yearData.gasVolume * appState.inputs.K;
                    }
                    // Note: IRS13 calculation for when IRS5=1 and CHP cannot be used is handled in CHP calculations
                    
                    // Add to total gas processed for this unit (IRS6)
                    if (IRS5 === 1) {
                        SFR_results[unitNumber].IRS6 += yearData.gasVolume * appState.inputs.K;
                    }
                    
                    SFR_results[unitNumber].yearlyResults.push({
                        year: year,
                        IRS4: IRS4,
                        IRS5: IRS5,
                        IRS7: IRS7,
                        IRS8: IRS8,
                        IRS13: IRS13
                    });
                }
                
                // Check if this unit has the highest total gas processed
                if (SFR_results[unitNumber].IRS6 > SFR_maxTotalGas) {
                    SFR_maxTotalGas = SFR_results[unitNumber].IRS6;
                    SFR_selectedUnit = unitNumber;
                }
            });
            
            // OS1: Selected unit size
            const OS1 = SFR_maxTotalGas > 0 ? SFR_selectedUnit : null;
            
            // Now calculate CHP results for the selected SFR unit
            let CHP_results = {};
            let CHP_maxTotalGas = 0;
            let CHP_selectedEngine = null;
            
if (OS1 && appState.csvData.CSV18) {
    const selectedSFRUnit = SFR_results[OS1];
    const CHP_engines = appState.csvData.CSV18;
    
    CHP_engines.forEach(engine => {
        const engineSize = parseFloat(engine['Engine Size [kWel]']) || 0;
        const engineEfficiencyEl = parseFloat(engine['Engine efficiency el. [%]']) || 0;
        const maxVolumeFlow = parseFloat(engine['Max. volume flow [m^3/h]']) || 0;
        const minVolumeFlow = parseFloat(engine['Min. volume flow [m^3/h]']) || 0;
        const minEngineLoad = parseFloat(engine['Minimum Engine Load [%]']) || 0;
        
        CHP_results[engineSize] = {
            engineData: engine,
            yearlyResults: [],
            IRS12: 0
        };
        
        for (let i = 0; i < years; i++) {
            const year = i + 1;
            const yearData = gasDevelopment[i];  // ← WICHTIG: Hinzugefügt!
            const SFR_yearData = selectedSFRUnit.yearlyResults[i];
            
            // IRS9: Energetic Load CHP in year n [KW el.]
            const IRS9 = (SFR_yearData.IRS8 / appState.inputs.K) * (engineEfficiencyEl / 100);
            
            // IRS10: Relative load CHP in year n [%]
            const IRS10 = engineSize > 0 ? (IRS9 / engineSize) * 100 : 0;
            
            // IRS11: Can the CHP engine be used? (0 or 1)
            const volumeInRange = (SFR_yearData.IRS7 >= minVolumeFlow && SFR_yearData.IRS7 <= maxVolumeFlow);
            const loadInRange = (IRS10 >= minEngineLoad && IRS10 <= 100);
            
            const IRS11 = (SFR_yearData.IRS5 === 1 && volumeInRange && loadInRange) ? 1 : 0;
            
            // Update IRS13: Amount of gas flared considering CHP availability
            let IRS13 = SFR_yearData.IRS13;
            if (SFR_yearData.IRS5 === 1 && IRS11 === 0) {
                IRS13 = yearData.gasVolume * appState.inputs.K;  // ← Now it works
            }
            
            // Add to total gas processed for this CHP engine (IRS12)
            if (IRS11 === 1) {
                CHP_results[engineSize].IRS12 += SFR_yearData.IRS7 * appState.inputs.K;
            }
            
            CHP_results[engineSize].yearlyResults.push({
                year: year,
                IRS9: IRS9,
                IRS10: IRS10,
                IRS11: IRS11,
                IRS13: IRS13
            });
        }
        
        // Check if this CHP engine has the highest total gas processed
        if (CHP_results[engineSize].IRS12 > CHP_maxTotalGas) {
            CHP_maxTotalGas = CHP_results[engineSize].IRS12;
            CHP_selectedEngine = engineSize;
        }
    });
}
            
            // OS2: Selected CHP engine size
            const OS2 = CHP_maxTotalGas > 0 ? CHP_selectedEngine : null;
            
            appState.sfrResults = {
                SFR_results: SFR_results,
                OS1: OS1,
                SFR_maxTotalGas: SFR_maxTotalGas,
                CHP_results: CHP_results,
                OS2: OS2,
                CHP_maxTotalGas: CHP_maxTotalGas
            };
            
            console.log("SFR results:", appState.sfrResults);
        }

        // NEW: Calculate detailed SFR results (IRS14-IRS27)
        function calculateSFRDetailedResults() {
            console.log("Starting detailed SFR calculations...");
            
            const OS1 = appState.sfrResults.OS1;
            const OS2 = appState.sfrResults.OS2;
            
            if (!OS1 || !OS2) {
                console.error("No selected SFR unit or CHP engine available");
                return;
            }

            // Get selected SFR unit data
            const selectedSFRUnit = appState.csvData.CSV17.find(unit => 
                parseFloat(unit['Unit']) === OS1
            );
            
            if (!selectedSFRUnit) {
                console.error("Selected SFR unit not found in CSV17:", OS1);
                return;
            }

            // Get selected CHP engine data
            const selectedCHPEngine = appState.csvData.CSV18.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === OS2
            );
            
            if (!selectedCHPEngine) {
                console.error("Selected CHP engine not found in CSV18:", OS2);
                return;
            }

            // Get load dependent data
            const sfrLoadData = appState.csvData.CSV19;
            const chpLoadData = appState.csvData.CSV20;
            const chpEmissionData = appState.csvData.CSV21;
            
            if (!sfrLoadData || !chpLoadData || !chpEmissionData) {
                console.error("Load dependent data not available");
                return;
            }

            // Get flare data
            const flareData = appState.csvData.CSV6;
            const flareEmissionData = appState.csvData.CSV7;
            if (!flareData || !flareEmissionData) {
                console.error("Flare data not available");
                return;
            }

            const years = appState.inputs.C;
            const K = appState.inputs.K;
            const SFR_yearlyResults = appState.sfrResults.SFR_results[OS1].yearlyResults;
            const CHP_yearlyResults = appState.sfrResults.CHP_results[OS2].yearlyResults;

            const detailedResults = [];

            // Calculate for each year
            for (let i = 0; i < years; i++) {
                const year = i + 1;
                const SFR_yearData = SFR_yearlyResults[i];
                const CHP_yearData = CHP_yearlyResults[i];
                
                // SFR detailed calculations (IRS14-IRS16)
                const sfrLoad = SFR_yearData.IRS4;
                const closestSFRLoadRow = findClosestLoadRow(sfrLoadData, sfrLoad, 'Engine Load [%]');
                
                const VS1 = closestSFRLoadRow['Electricity Factor'] || 1;
                const VS2 = closestSFRLoadRow['maintenance period [opr. H]'] || 1;
                const VS3 = closestSFRLoadRow['Chemical [L/h]'] || 1;
                
                const IRS14 = VS3 * K * (selectedSFRUnit['Chemical Consumption factor'] || 0) * SFR_yearData.IRS5 * CHP_yearData.IRS11; // Chemical consumption
                const IRS15 = VS1 * K * (selectedSFRUnit['Electricity Consumption [kW]'] || 0) * SFR_yearData.IRS5 * CHP_yearData.IRS11; // Electricity consumption
                const IRS16 = (K / VS2) * SFR_yearData.IRS5 * CHP_yearData.IRS11; // Maintenance frequency
                
                // CHP detailed calculations (IRS17-IRS20)
                const chpLoad = CHP_yearData.IRS10;
                const closestCHPLoadRow = findClosestLoadRow(chpLoadData, chpLoad, 'Engine Load[%]');
                
                const VS4 = closestCHPLoadRow['Electricity Consumption factor'] || 1;
                const VS5 = closestCHPLoadRow['Maintenance Period [opr. h]'] || 1;
                const VS6 = closestCHPLoadRow['Coolant change [opr. H]'] || 1;
                const VS7 = closestCHPLoadRow['Oil change [opr. h]'] || 1;
                
                const IRS17 = VS4 * K * (selectedCHPEngine['Electricity consumption [kW]'] || 0) * CHP_yearData.IRS11; // Electricity consumption
                const IRS18 = (K / VS5) * CHP_yearData.IRS11; // Maintenance frequency
                const IRS19 = (K / VS6) * (selectedCHPEngine['Coolant Volume [L]'] || 0) * CHP_yearData.IRS11; // Coolant consumption
                const IRS20 = (K / VS7) * (selectedCHPEngine['Oil tank volume [L]'] || 0) * CHP_yearData.IRS11; // Oil consumption
                
                // CHP emissions (IRS21)
                const closestCHPEmissionRow = findClosestLoadRow(chpEmissionData, chpLoad, 'Engine Range [% of Load]');
                
                const emissionsIRS21 = {
                    carbonMonoxide: (closestCHPEmissionRow['Carbon Monoxide [kg CO/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K,
                    nitrogenOxides: (closestCHPEmissionRow['Nitrogene Oxydes [kg NOx/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K,
                    formaldehyde: (closestCHPEmissionRow['Formldehyd [kg CH2O/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K,
                    methaneSlop: (closestCHPEmissionRow['Methane Slop [kg CH4/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K,
                    particulateMatter: (closestCHPEmissionRow['Particulate Matter [kg/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K,
                    sulfurDioxide: (closestCHPEmissionRow['Sulfur Dioxide [kg SO2/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K,
                    ammonia: (closestCHPEmissionRow['Ammonia [kg NH3/m^3]'] || 0) * SFR_yearData.IRS7 * CHP_yearData.IRS11 * K
                };
                
                // Energy production (IRS22-IRS23)
                const chpEngineEffTh = (selectedCHPEngine['Engine efficiency th. [%]'] || 0) / 100;
                const chpEngineEffEl = (selectedCHPEngine['Engine efficiency el. [%]'] || 0) / 100;
                const IRS22 = chpEngineEffTh * SFR_yearData.IRS8 * CHP_yearData.IRS11; // Thermal energy
                const IRS23 = chpEngineEffEl * SFR_yearData.IRS8 * CHP_yearData.IRS11; // Electrical energy
                
                // Flare impacts (IRS24-IRS27)
                const IRS24 = (SFR_yearData.IRS5 === 0 || CHP_yearData.IRS11 === 0) ? K : 0; // Flare operating hours
                const IRS25 = IRS24 / (flareData[0]['Maintenance Period [opr. h]'] || 1); // Flare maintenance frequency
                const IRS26 = IRS24 * (flareData[0]['Electricity Consumption [kW]'] || 0); // Flare electricity use
                
                // Flare emissions (IRS27)
                let gasVolumeForFlare = 0;
                if (SFR_yearData.IRS5 === 0) {
                    const gasDevelopment = appState.calculationResults.gasDevelopment[i];
                    gasVolumeForFlare = gasDevelopment.gasVolume;
                } else if (CHP_yearData.IRS11 === 0) {
                    gasVolumeForFlare = SFR_yearData.IRS7;
                }
                
                const flareEmissionsIRS27 = {
                    carbonMonoxide: (flareEmissionData[0]['Carbon Monoxide [kg CO/m^3]'] || 0) * gasVolumeForFlare * K,
                    nitrogenOxides: (flareEmissionData[0]['Nitrogene Oxydes [kg NOx/m^3]'] || 0) * gasVolumeForFlare * K,
                    formaldehyde: (flareEmissionData[0]['Formldehyd [kg CH2O/m^3]'] || 0) * gasVolumeForFlare * K,
                    methaneSlop: (flareEmissionData[0]['Methane Slop [kg CH4/m^3]'] || 0) * gasVolumeForFlare * K,
                    particulateMatter: (flareEmissionData[0]['Particulate Matter [kg/m^3]'] || 0) * gasVolumeForFlare * K,
                    sulfurDioxide: (flareEmissionData[0]['Sulfur Dioxide [kg SO2/m^3]'] || 0) * gasVolumeForFlare * K,
                    ammonia: (flareEmissionData[0]['Ammonia [kg NH3/m^3]'] || 0) * gasVolumeForFlare * K
                };

                detailedResults.push({
                    year: year,
                    // SFR specific
                    IRS14: IRS14,
                    IRS15: IRS15,
                    IRS16: IRS16,
                    // CHP specific
                    IRS17: IRS17,
                    IRS18: IRS18,
                    IRS19: IRS19,
                    IRS20: IRS20,
                    IRS22: IRS22,
                    IRS23: IRS23,
                    // Emissions
                    emissionsIRS21: emissionsIRS21,
                    // Flare
                    IRS24: IRS24,
                    IRS25: IRS25,
                    IRS26: IRS26,
                    flareEmissionsIRS27: flareEmissionsIRS27,
                    // Reference values
                    IRS5: SFR_yearData.IRS5,
                    IRS11: CHP_yearData.IRS11,
                    IRS7: SFR_yearData.IRS7
                });
            }

            appState.sfrResults.detailedResults = detailedResults;
        }

        // NEW: Calculate SFR ecological results (OS3-OS18)
        function calculateSFREcologicalResults() {
            console.log("Starting ecological SFR calculations...");
            
            if (!appState.csvData.CSV23 || !appState.csvData.CSV22 || !appState.csvData.CSV10 || !appState.csvData.CSV11 || !appState.csvData.CSV9) {
                console.error("Ecological CSV data not available");
                showError("Ecological background data could not be loaded.");
                return;
            }

            const OS1 = appState.sfrResults.OS1;
            const OS2 = appState.sfrResults.OS2;
            
            if (!OS1 || !OS2) {
                console.error("No selected SFR unit or CHP engine available");
                return;
            }

            // Get selected unit and engine data
            const selectedSFRUnit = appState.csvData.CSV17.find(unit => 
                parseFloat(unit['Unit']) === OS1
            );
            
            const selectedCHPEngine = appState.csvData.CSV18.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === OS2
            );
            
            if (!selectedSFRUnit || !selectedCHPEngine) {
                console.error("Selected SFR unit or CHP engine not found");
                return;
            }

            const detailedResults = appState.sfrResults.detailedResults;
            if (!detailedResults) {
                console.error("No detailed SFR results available");
                return;
            }

            // Get impact categories from CSV23 (first row)
            const impactCategories = Object.keys(appState.csvData.CSV23[0] || {});
            impactCategories.shift(); // Remove "Impact Category" column
            
            console.log("SFR Impact categories:", impactCategories);

            const ecologicalResults = {
                impactCategories: impactCategories,
                yearlyResults: []
            };

            // Get production factors
            const sfrProductionFactor = selectedSFRUnit['Production Factor'] || 1;
            const chpProductionFactor = selectedCHPEngine['CHP Production Factor'] || 1;

            // Properly select energy source data from CSV10
            let energySourceData;
            if (appState.inputs.J === 'Renewable') {
                energySourceData = appState.csvData.CSV10.find(row => {
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === 'Renewable';
                });
            } else {
                energySourceData = appState.csvData.CSV10.find(row => {
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === appState.inputs.D;
                });
            }

            console.log("SFR Energy source data:", energySourceData);

            // Calculate for each year
            detailedResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEcologicalResults = {
                    year: year,
                    // SFR ecological results
                    OS3: {}, // Unit Production Impact
                    OS4: {}, // Chemical Production Impact
                    OS5: {}, // Maintenance Impact
                    OS6: {}, // SFR Electricity Impact
                    OS7: {}, // SFR operating resources Impact (summary)
                    // CHP ecological results
                    OS8: {}, // CHP Engine Production Impact
                    OS9: {}, // Maintenance Impact
                    OS10: {}, // Oil Impact
                    OS11: {}, // Coolant Impact
                    OS12: {}, // CHP Energy Impact
                    OS13: {}, // Flare Energy Impact
                    OS14: {}, // Flare Maintenance Impact
                    OS15: {}, // Flare Emission Impact
                    OS16: {}, // CHP Emission Impact
                    OS17: {}, // Operating materials total
                    OS18: {}  // Flare total
                };

                // Calculate for each impact category
                impactCategories.forEach(category => {
                    // OS3: SFR Unit Production Impact (only in first year)
                    if (year === 1) {
                        const unitProductionData = appState.csvData.CSV23.find(row => 
                            row['Impact Category'] && row['Impact Category'].includes('Unit Production')
                        );
                        if (unitProductionData) {
                            yearEcologicalResults.OS3[category] = sfrProductionFactor * (unitProductionData[category] || 0);
                        }
                    }

                    // OS4: Chemical Production Impact
                    const chemicalProductionData = appState.csvData.CSV23.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Chemical Production [1 L]')
                    );
                    if (chemicalProductionData) {
                        yearEcologicalResults.OS4[category] = yearData.IRS14 * (chemicalProductionData[category] || 0);
                    }

                    // OS5: Maintenance Impact
                    const maintenanceData = appState.csvData.CSV23.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    if (maintenanceData) {
                        yearEcologicalResults.OS5[category] = yearData.IRS16 * (maintenanceData[category] || 0);
                    }

                    // OS6: SFR Electricity Impact
                    if (energySourceData) {
                        yearEcologicalResults.OS6[category] = yearData.IRS15 * (energySourceData[category] || 0);
                    }

                    // OS7: SFR operating resources Impact (summary)
                    yearEcologicalResults.OS7[category] = 
                        (yearEcologicalResults.OS5[category] || 0) + 
                        (yearEcologicalResults.OS6[category] || 0);

                    // OS8: CHP Engine Production Impact (only in first year and if CHP available)
                    if (year === 1 && appState.inputs.M === 'No') {
                        const engineProductionData = appState.csvData.CSV22.find(row => 
                            row['Impact Category'] && row['Impact Category'].includes('Engine Production')
                        );
                        if (engineProductionData) {
                            yearEcologicalResults.OS8[category] = chpProductionFactor * (engineProductionData[category] || 0);
                        }
                    }

                    // OS9: Maintenance Impact
                    const chpMaintenanceData = appState.csvData.CSV22.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    if (chpMaintenanceData) {
                        yearEcologicalResults.OS9[category] = yearData.IRS18 * (chpMaintenanceData[category] || 0);
                    }

                    // OS10: Oil Impact
                    const oilData = appState.csvData.CSV22.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Oil Production')
                    );
                    if (oilData) {
                        yearEcologicalResults.OS10[category] = yearData.IRS20 * (oilData[category] || 0);
                    }

                    // OS11: Coolant Impact
                    const coolantData = appState.csvData.CSV22.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Coolant Production')
                    );
                    if (coolantData) {
                        yearEcologicalResults.OS11[category] = yearData.IRS19 * (coolantData[category] || 0);
                    }

                    // OS12: CHP Energy Impact
                    if (energySourceData) {
                        yearEcologicalResults.OS12[category] = yearData.IRS17 * (energySourceData[category] || 0);
                    }

                    // OS13: Flare Energy Impact
                    if (energySourceData) {
                        yearEcologicalResults.OS13[category] = yearData.IRS26 * (energySourceData[category] || 0);
                    }

                    // OS14: Flare Maintenance Impact
                    const flareMaintenanceData = appState.csvData.CSV11.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    if (flareMaintenanceData) {
                        yearEcologicalResults.OS14[category] = yearData.IRS25 * (flareMaintenanceData[category] || 0);
                    }

                    // OS15: Flare Emission Impact
                    let flareEmissionImpact = 0;
                    Object.keys(yearData.flareEmissionsIRS27).forEach(emissionType => {
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            flareEmissionImpact += yearData.flareEmissionsIRS27[emissionType] * (emissionData[category] || 0);
                        }
                    });
                    yearEcologicalResults.OS15[category] = flareEmissionImpact;

                    // OS16: CHP Emission Impact
                    let chpEmissionImpact = 0;
                    Object.keys(yearData.emissionsIRS21).forEach(emissionType => {
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            chpEmissionImpact += yearData.emissionsIRS21[emissionType] * (emissionData[category] || 0);
                        }
                    });
                    yearEcologicalResults.OS16[category] = chpEmissionImpact;

                    // In calculateSFREcologicalResults(), innerhalb der yearlyResults forEach-Schleife:

                    // Calculate for each impact category
                    impactCategories.forEach(category => {
                        // ... existing OS3-OS18 calculations ...
                        
                        // HINZUFÜGEN: OS16_detailed - CHP Emission Impact (detailed per emission type)
                        if (!yearEcologicalResults.OS16_detailed) {
                            yearEcologicalResults.OS16_detailed = {};
                        }
                        if (!yearEcologicalResults.OS16_detailed[category]) {
                            yearEcologicalResults.OS16_detailed[category] = {};
                        }
                        
                        Object.keys(yearData.emissionsIRS21).forEach(emissionType => {
                            const emissionData = findEmissionData(emissionType);
                            if (emissionData) {
                                yearEcologicalResults.OS16_detailed[category][emissionType] = 
                                    yearData.emissionsIRS21[emissionType] * (emissionData[category] || 0);
                            }
                        });
                        
                        // HINZUFÜGEN: OS15_detailed - Flare Emission Impact (detailed per emission type)
                        if (!yearEcologicalResults.OS15_detailed) {
                            yearEcologicalResults.OS15_detailed = {};
                        }
                        if (!yearEcologicalResults.OS15_detailed[category]) {
                            yearEcologicalResults.OS15_detailed[category] = {};
                        }
                        
                        Object.keys(yearData.flareEmissionsIRS27).forEach(emissionType => {
                            const emissionData = findEmissionData(emissionType);
                            if (emissionData) {
                                yearEcologicalResults.OS15_detailed[category][emissionType] = 
                                    yearData.flareEmissionsIRS27[emissionType] * (emissionData[category] || 0);
                            }
                        });
                    });    

                    // OS17: Operating materials total
                    yearEcologicalResults.OS17[category] = 
                        (yearEcologicalResults.OS9[category] || 0) + 
                        (yearEcologicalResults.OS10[category] || 0) + 
                        (yearEcologicalResults.OS11[category] || 0) + 
                        (yearEcologicalResults.OS12[category] || 0);

                    // OS18: Flare total
                    yearEcologicalResults.OS18[category] = 
                        (yearEcologicalResults.OS13[category] || 0) + 
                        (yearEcologicalResults.OS14[category] || 0) + 
                        (yearEcologicalResults.OS15[category] || 0);
                });

                ecologicalResults.yearlyResults.push(yearEcologicalResults);
            });

            appState.sfrResults.ecologicalResults = ecologicalResults;
        }

function calculateSFREconomicResults() {
    console.log("Starting economic SFR calculations...");
    
    if (!appState.csvData.CSV1 || !appState.csvData.CSV12) {
        console.error("Economic CSV data not available");
        showError("Economic background data could not be loaded.");
        return;
    }

    const OS1 = appState.sfrResults.OS1;
    const OS2 = appState.sfrResults.OS2;
    
    if (!OS1 || !OS2) {
        console.error("No selected SFR unit or CHP engine available");
        return;
    }

    // Get selected unit and engine data
    const selectedSFRUnit = appState.csvData.CSV17.find(unit => 
        parseFloat(unit['Unit']) === OS1
    );
    
    const selectedCHPEngine = appState.csvData.CSV18.find(engine => 
        parseFloat(engine['Engine Size [kWel]']) === OS2
    );
    
    if (!selectedSFRUnit || !selectedCHPEngine) {
        console.error("Selected SFR unit or CHP engine not found");
        return;
    }

    const detailedResults = appState.sfrResults.detailedResults;
    if (!detailedResults) {
        console.error("No detailed SFR results available");
        return;
    }

    const years = appState.inputs.C;
    const economicResults = {
        yearlyResults: [],
        OS22: 0,
        OS32: 0,
        OS37: 0,  // ✓ Initialisieren
        OS40: 0
    };

    // Get country-specific maintenance costs from CSV1
    const countryData = appState.csvData.CSV1.find(row => row.Country === appState.inputs.D);
    const maintenanceFlare = parseFloat(countryData?.['Maintenance Flare [€/maintenance mix]']) || 250;
    const maintenanceSFR = parseFloat(countryData?.['Maintenance SFR [€/maintenance mix]']) || 300;
    const maintenanceCHP = parseFloat(countryData?.['Maintenance CHP [€/maintenance mix]']) || 225;
    const depreciationYears = parseFloat(countryData?.['Depreciation [a]']) || parseFloat(appState.inputs.G) || 10;

    // Get prices from CSV12
    const engineOilPrice = parseFloat(appState.csvData.CSV12.find(row => 
        row['Category'] && row['Category'].includes('Engine oil')
    )?.['Price']) || 2;
    
    const coolantPrice = parseFloat(appState.csvData.CSV12.find(row => 
        row['Category'] && row['Category'].includes('Coolant')
    )?.['Price']) || 2;
    
    const chemicalSFRPrice = parseFloat(appState.csvData.CSV12.find(row => 
        row['Category'] && row['Category'].includes('Chemical SFR')
    )?.['Price']) || 5;
    
    const sfrUnitPrice = parseFloat(appState.csvData.CSV12.find(row => 
        row['Category'] && row['Category'].includes('SFR')
    )?.['Price']) || 50000;
    
    const chpUnitPrice = parseFloat(appState.csvData.CSV12.find(row => 
        row['Category'] && row['Category'].includes('CHP')
    )?.['Price']) || 50000;

    // Calculate investment costs
    const sfrPriceFactor = parseFloat(selectedSFRUnit['Price Factor']) || 1;
    economicResults.OS22 = sfrUnitPrice * sfrPriceFactor;
    
    const chpPriceFactor = parseFloat(selectedCHPEngine['CHP Production Factor']) || 1;
    economicResults.OS32 = appState.inputs.M === 'No' ? chpUnitPrice * chpPriceFactor : 0;
    
    // ✓ WICHTIG: Total investment costs VOR der Schleife berechnen
    economicResults.OS37 = economicResults.OS22 + economicResults.OS32;

    console.log("Investment costs:", {
        OS22: economicResults.OS22,
        OS32: economicResults.OS32,
        OS37: economicResults.OS37
    });

    // ✓ KORRIGIERT: Find first year with SFR operation (IRS5=1) for depreciation start
    let firstOperationYear = null;
    for (let i = 0; i < years; i++) {
        if (detailedResults[i].IRS5 === 1) {  // ✓ IRS5 statt IRS11!
            firstOperationYear = i + 1;
            break;
        }
    }

    console.log("First operation year:", firstOperationYear);

    // Tax compensation logic
    let previousOS37_1 = 0;

    // Calculate for each year
    detailedResults.forEach((yearData, index) => {
        const year = index + 1;
        const yearEconomicResults = {
            year: year,
            OS19: 0, OS20: 0, OS21: 0,
            OS24: 0, OS25: 0,
            OS26: 0, OS27: 0,
            OS28: 0, OS29: 0, OS30: 0, OS31: 0,
            OS33: 0, OS34: 0, OS35: 0, OS36: 0,
            OS37: economicResults.OS37,  // ✓ Aus pre-calculated value
            OS37_1: 0,
            IRS28: 0, IRS29: 0, OS38: 0, OS39: 0
        };

        // Calculate SFR costs
        yearEconomicResults.OS19 = (yearData.IRS15 || 0) * parseFloat(appState.inputs.E || 0);
        yearEconomicResults.OS20 = (yearData.IRS16 || 0) * maintenanceSFR;
        yearEconomicResults.OS21 = (yearData.IRS14 || 0) * chemicalSFRPrice;

        // Calculate CHP revenues
        yearEconomicResults.OS24 = (yearData.IRS23 || 0) * parseFloat(appState.inputs.E || 0);
        yearEconomicResults.OS25 = (yearData.IRS22 || 0) * parseFloat(appState.inputs.F || 0);

        // Calculate flare costs
        yearEconomicResults.OS26 = (yearData.IRS25 || 0) * maintenanceFlare;
        yearEconomicResults.OS27 = (yearData.IRS26 || 0) * parseFloat(appState.inputs.E || 0);

        // Calculate CHP operating costs
        yearEconomicResults.OS28 = (yearData.IRS17 || 0) * parseFloat(appState.inputs.E || 0);
        yearEconomicResults.OS29 = (yearData.IRS18 || 0) * maintenanceCHP;
        yearEconomicResults.OS30 = (yearData.IRS20 || 0) * engineOilPrice;
        yearEconomicResults.OS31 = (yearData.IRS19 || 0) * coolantPrice;

        // Calculate summaries
        yearEconomicResults.OS33 = yearEconomicResults.OS24 + yearEconomicResults.OS25;
        yearEconomicResults.OS34 = yearEconomicResults.OS26 + yearEconomicResults.OS27;
        yearEconomicResults.OS35 = yearEconomicResults.OS28 + yearEconomicResults.OS29 + 
                                  yearEconomicResults.OS30 + yearEconomicResults.OS31;
        yearEconomicResults.OS36 = yearEconomicResults.OS33 - yearEconomicResults.OS34 - 
                                  yearEconomicResults.OS35 - yearEconomicResults.OS19 - 
                                  yearEconomicResults.OS20 - yearEconomicResults.OS21;

        // Calculate depreciation
        if (firstOperationYear && year >= firstOperationYear && year < firstOperationYear + depreciationYears) {
            yearEconomicResults.IRS28 = yearEconomicResults.OS37 / depreciationYears;
        } else {
            yearEconomicResults.IRS28 = 0;
        }

        // Calculate OS37_1 - Tax compensation
        if (yearEconomicResults.OS36 < 0) {
            yearEconomicResults.OS37_1 = yearEconomicResults.OS36 + previousOS37_1;
        } else {
            yearEconomicResults.OS37_1 = 0;
        }

        // Calculate profit before taxes
        yearEconomicResults.IRS29 = yearEconomicResults.OS36 - yearEconomicResults.IRS28 + previousOS37_1;

        // Calculate taxes
        if (yearEconomicResults.IRS29 > 0) {
            yearEconomicResults.OS38 = yearEconomicResults.IRS29 * parseFloat(appState.inputs.H || 0);
        } else {
            yearEconomicResults.OS38 = 0;
        }

        // Calculate profit after taxes
        yearEconomicResults.OS39 = yearEconomicResults.OS36 - yearEconomicResults.OS38;

        // Update for next iteration
        previousOS37_1 = yearEconomicResults.OS37_1;

        economicResults.yearlyResults.push(yearEconomicResults);
    });

    // Calculate NPV
    const discountRate = parseFloat(appState.inputs.I);
    
    console.log("=== NPV Calculation ===");
    console.log("Discount rate:", discountRate);
    console.log("Total investment (OS37):", economicResults.OS37);
    
    if (isNaN(discountRate)) {
        console.error("Invalid discount rate!");
        economicResults.OS40 = NaN;
    } else {
        let npvSum = 0;
        economicResults.yearlyResults.forEach((yearResult, index) => {
            const n = index + 1;
            const discountedValue = yearResult.OS39 / Math.pow((1 + discountRate), n);
            console.log(`Year ${n}: OS39=${yearResult.OS39}, Discounted=${discountedValue}`);
            npvSum += discountedValue;
        });
        
        economicResults.OS40 = -economicResults.OS37 + npvSum;
        console.log("NPV Sum:", npvSum);
        console.log("Final NPV (OS40):", economicResults.OS40);
    }

    appState.sfrResults.economicResults = economicResults;
}



        // NEW: Display SFR results
        function displaySFRResults() {
            const container = window.tempSFRResultsContainer || document.getElementById('sfr-results-container');
            const SFR_results = appState.sfrResults.SFR_results;
            const OS1 = appState.sfrResults.OS1;
            const SFR_maxTotalGas = appState.sfrResults.SFR_maxTotalGas;
            
            if (!SFR_results || Object.keys(SFR_results).length === 0) {
                container.innerHTML = '<div class="error">No SFR results available</div>';
                return;
            }
            
            let html = '';
            
            // Display selected unit
            if (OS1) {
                html += `
                    <div class="selected-engine">
                        <div class="engine-summary">Selected SFR unit size (OS1): Unit ${OS1}</div>
                        <div>Total gas processed (IRS6): ${SFR_maxTotalGas.toFixed(2)} m³</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="error">
                        E1: No suitable SFR unit size available. Please adjust input values A and B.
                    </div>
                `;
            }
            
            // Display results for each unit size
            Object.keys(SFR_results).forEach(unitNumber => {
                const unitData = SFR_results[unitNumber];
                const isSelected = OS1 === parseFloat(unitNumber);
                
                html += `
                    <div class="engine-results ${isSelected ? 'selected-engine' : ''}">
                        <div class="engine-title">SFR Unit: ${unitNumber} ${isSelected ? '(SELECTED)' : ''}</div>
                        <div class="engine-summary">Total gas processed (IRS6): ${unitData.IRS6.toFixed(2)} m³</div>
                        
                        <div class="section-subtitle">Annual Results</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>IRS4: Engine Load [%]</th>
                                    <th>IRS5: Unit usable</th>
                                    <th>IRS7: Gas processed with CHP [m³/h]</th>
                                    <th>IRS8: SFR Output Gas Energy [kW]</th>
                                    <th>IRS13: Gas flared [m³]</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                unitData.yearlyResults.forEach(yearResult => {
                    html += `
                        <tr>
                            <td>${yearResult.year}</td>
                            <td>${yearResult.IRS4.toFixed(2)}</td>
                            <td>${yearResult.IRS5 === 1 ? 'Yes' : 'No'}</td>
                            <td>${yearResult.IRS7.toFixed(2)}</td>
                            <td>${yearResult.IRS8.toFixed(2)}</td>
                            <td>${yearResult.IRS13.toFixed(2)}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // NEW: Display CHP results
        function displayCHPResults() {
            const container = window.tempCHPResultsContainer || document.getElementById('chp-results-container');
            const CHP_results = appState.sfrResults.CHP_results;
            const OS2 = appState.sfrResults.OS2;
            const CHP_maxTotalGas = appState.sfrResults.CHP_maxTotalGas;
            
            if (!CHP_results || Object.keys(CHP_results).length === 0) {
                container.innerHTML = '<div class="error">No CHP results available</div>';
                return;
            }
            
            let html = '';
            
            // Display selected engine
            if (OS2) {
                html += `
                    <div class="selected-engine">
                        <div class="engine-summary">Selected CHP engine size (OS2): ${OS2} kWel</div>
                        <div>Total gas processed (IRS12): ${CHP_maxTotalGas.toFixed(2)} m³</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="error">
                        E1: No suitable CHP engine size available. Please adjust input values A and B.
                    </div>
                `;
            }
            
            // Display results for each engine size
            Object.keys(CHP_results).forEach(engineSize => {
                const engineData = CHP_results[engineSize];
                const isSelected = OS2 === parseFloat(engineSize);
                
                html += `
                    <div class="engine-results ${isSelected ? 'selected-engine' : ''}">
                        <div class="engine-title">CHP Engine: ${engineSize} kWel ${isSelected ? '(SELECTED)' : ''}</div>
                        <div class="engine-summary">Total gas processed (IRS12): ${engineData.IRS12.toFixed(2)} m³</div>
                        
                        <div class="section-subtitle">Annual Results</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>IRS9: Energetic Load [KW el.]</th>
                                    <th>IRS10: Relative Load [%]</th>
                                    <th>IRS11: Engine usable</th>
                                    <th>IRS13: Gas flared [m³]</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                engineData.yearlyResults.forEach(yearResult => {
                    html += `
                        <tr>
                            <td>${yearResult.year}</td>
                            <td>${yearResult.IRS9.toFixed(2)}</td>
                            <td>${yearResult.IRS10.toFixed(2)}</td>
                            <td>${yearResult.IRS11 === 1 ? 'Yes' : 'No'}</td>
                            <td>${yearResult.IRS13.toFixed(2)}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // NEW: Display SFR detailed results
        function displaySFRDetailedResults() {
            const container = window.tempSFRDetailedResultsContainer || document.getElementById('sfr-detailed-results-container');
            const detailedResults = appState.sfrResults.detailedResults;
            
            if (!detailedResults || detailedResults.length === 0) {
                container.innerHTML = '<div class="error">No detailed SFR results available</div>';
                return;
            }

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed results for SFR Unit: ${appState.sfrResults.OS1}</div>
                </div>
                
                <div class="results-section">
                    <div class="section-subtitle">SFR Operating Parameters (IRS14-IRS16)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IRS14: Chemical consumption [L]</th>
                                <th>IRS15: Electricity consumption [kWh]</th>
                                <th>IRS16: Maintenance frequency</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IRS14.toFixed(2)}</td>
                        <td>${result.IRS15.toFixed(2)}</td>
                        <td>${result.IRS16.toFixed(4)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
        }

        // NEW: Display CHP detailed results
        function displayCHPDetailedResults() {
            const container = window.tempCHPDetailedResultsContainer || document.getElementById('chp-detailed-results-container');
            const detailedResults = appState.sfrResults.detailedResults;
            
            if (!detailedResults || detailedResults.length === 0) {
                container.innerHTML = '<div class="error">No detailed CHP results available</div>';
                return;
            }

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed results for CHP Engine: ${appState.sfrResults.OS2} kWel</div>
                </div>
                
                <div class="results-section">
                    <div class="section-subtitle">Table 1: CHP Operating Parameters (IRS17-IRS20, IRS22-IRS23)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IRS17: Electricity consumption [kWh]</th>
                                <th>IRS18: Maintenance frequency</th>
                                <th>IRS19: Coolant consumption [L]</th>
                                <th>IRS20: Oil consumption [L]</th>
                                <th>IRS22: Thermal energy [kWh]</th>
                                <th>IRS23: Electrical energy [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IRS17.toFixed(2)}</td>
                        <td>${result.IRS18.toFixed(4)}</td>
                        <td>${result.IRS19.toFixed(2)}</td>
                        <td>${result.IRS20.toFixed(2)}</td>
                        <td>${result.IRS22.toFixed(2)}</td>
                        <td>${result.IRS23.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 2: CHP Emissions (IRS21) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.emissionsIRS21.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.emissionsIRS21.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.emissionsIRS21.formaldehyde.toFixed(6)}</td>
                        <td>${result.emissionsIRS21.methaneSlop.toFixed(6)}</td>
                        <td>${result.emissionsIRS21.particulateMatter.toFixed(6)}</td>
                        <td>${result.emissionsIRS21.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.emissionsIRS21.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 3: Flare Operation (IRS24-IRS26)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IRS24: Flare operating hours [h]</th>
                                <th>IRS25: Flare maintenance frequency</th>
                                <th>IRS26: Flare electricity consumption [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IRS24.toFixed(0)}</td>
                        <td>${result.IRS25.toFixed(4)}</td>
                        <td>${result.IRS26.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 4: Flare Emissions (IRS27) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.flareEmissionsIRS27.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRS27.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRS27.formaldehyde.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRS27.methaneSlop.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRS27.particulateMatter.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRS27.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRS27.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
        }

        // NEW: Display SFR ecological results
        function displaySFREcologicalResults() {
            const container = window.tempSFREcologicalResultsContainer || document.getElementById('sfr-ecological-results-container');
            const ecologicalResults = appState.sfrResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No ecological SFR results available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            let html = '';

            // OS3: SFR Unit Production Impact - Show overall result at the top (only once)
            const firstYearOS3 = ecologicalResults.yearlyResults[0].OS3;
            
            html += `
                <div class="impact-summary">
                    <div class="engine-summary">OS3: SFR Unit Production Impact (one-time in first year)</div>
                    <div class="impact-category-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Impact category</th>
                                    <th>Value</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Show OS3 for each impact category (first year only)
            impactCategories.forEach(category => {
                const value = firstYearOS3[category] || 0;
                html += `
                    <tr>
                        <td>${category}</td>
                        <td class="impact-value">${value.toExponential(4)}</td>
                        <td>${getUnitForCategory(category)}</td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Tables for OS4 to OS7
            const resultTypes = [
                { id: 'OS4', title: 'OS4: Chemical Production Impact' },
                { id: 'OS5', title: 'OS5: Maintenance Impact' },
                { id: 'OS6', title: 'OS6: SFR Electricity Impact' },
                { id: 'OS7', title: 'OS7: SFR Operating Resources Impact (Summary)' }
            ];

            resultTypes.forEach(resultType => {
                html += `
                    <div class="results-section">
                        <div class="section-subtitle">${resultType.title}</div>
                        <div class="impact-category-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                `;

                // Column headers for impact categories
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                    </tr>
                                </thead>
                                <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        // For OS3 only show values in first year
                        if (resultType.id === 'OS3' && yearResult.year > 1) {
                            html += `<td>-</td>`;
                        } else {
                            const value = yearResult[resultType.id][category] || 0;
                            html += `<td>${value.toExponential(4)}</td>`;
                        }
                    });
                    
                    html += `</tr>`;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // NEW: Display CHP ecological results
        function displayCHPEcologicalResults() {
            const container = window.tempCHPEcologicalResultsContainer || document.getElementById('chp-ecological-results-container');
            const ecologicalResults = appState.sfrResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No ecological CHP results available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            let html = '';

            // OS8: CHP Engine Production Impact - Show overall result at the top (only once)
            const firstYearOS8 = ecologicalResults.yearlyResults[0].OS8;
            
            html += `
                <div class="impact-summary">
                    <div class="engine-summary">OS8: CHP Engine Production Impact (one-time in first year, only if CHP not available)</div>
                    <div class="impact-category-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Impact category</th>
                                    <th>Value</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Show OS8 for each impact category (first year only)
            impactCategories.forEach(category => {
                const value = firstYearOS8[category] || 0;
                html += `
                    <tr>
                        <td>${category}</td>
                        <td class="impact-value">${value.toExponential(4)}</td>
                        <td>${getUnitForCategory(category)}</td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Tables for OS9 to OS18
            const resultTypes = [
                { id: 'OS9', title: 'OS9: Maintenance Impact' },
                { id: 'OS10', title: 'OS10: Oil Impact' },
                { id: 'OS11', title: 'OS11: Coolant Impact' },
                { id: 'OS12', title: 'OS12: CHP Energy Impact' },
                { id: 'OS13', title: 'OS13: Flare Energy Impact' },
                { id: 'OS14', title: 'OS14: Flare Maintenance Impact' },
                { id: 'OS15', title: 'OS15: Flare Emission Impact' },
                { id: 'OS16', title: 'OS16: CHP Emission Impact' },
                { id: 'OS17', title: 'OS17: Operating Materials Total' },
                { id: 'OS18', title: 'OS18: Flare Total' }
            ];

            resultTypes.forEach(resultType => {
                html += `
                    <div class="results-section">
                        <div class="section-subtitle">${resultType.title}</div>
                        <div class="impact-category-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                `;

                // Column headers for impact categories
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                    </tr>
                                </thead>
                                <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        // For OS8 only show values in first year
                        if (resultType.id === 'OS8' && yearResult.year > 1) {
                            html += `<td>-</td>`;
                        } else {
                            const value = yearResult[resultType.id][category] || 0;
                            html += `<td>${value.toExponential(4)}</td>`;
                        }
                    });
                    
                    html += `</tr>`;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // NEW: Display CHP emission results
            function displayCHPEmissionResults() {
                const container = window.tempCHPEmissionResultsContainer || document.getElementById('chp-emission-results-container');
                const ecologicalResults = appState.sfrResults.ecologicalResults;
                
                if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                    container.innerHTML = '<div class="error">No emission impact data available</div>';
                    return;
                }

                const impactCategories = ecologicalResults.impactCategories;
                const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
                const emissionLabels = {
                    'carbonMonoxide': 'Carbon Monoxide',
                    'nitrogenOxides': 'Nitrogen Oxides', 
                    'formaldehyde': 'Formaldehyde',
                    'methaneSlop': 'Methane Slip',
                    'particulateMatter': 'Particulate Matter',
                    'sulfurDioxide': 'Sulfur Dioxide',
                    'ammonia': 'Ammonia'
                };

                let html = `
                    <div class="selected-engine">
                        <div class="engine-summary">Detailed Emission Impacts for CHP Engine: ${appState.sfrResults.OS2} kWel</div>
                    </div>
                `;

                // Table for CHP Engine Emissions (OS16_detailed) - One table per emission type with years as rows
                html += `
                    <div class="results-section">
                        <div class="section-subtitle">CHP Engine Emissions - Detailed Impacts per Emission Type (OS16_detailed)</div>
                `;

                emissionTypes.forEach(emissionType => {
                    html += `
                        <div class="impact-category-table">
                            <h4>Emission: ${emissionLabels[emissionType]}</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                    `;

                    // Columns for each impact category
                    impactCategories.forEach(category => {
                        html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                    });

                    html += `
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    // Rows for each year
                    ecologicalResults.yearlyResults.forEach(yearResult => {
                        html += `<tr><td>${yearResult.year}</td>`;
                        
                        impactCategories.forEach(category => {
                            const value = yearResult.OS16_detailed[category][emissionType] || 0;
                            html += `<td>${value.toExponential(4)}</td>`;
                        });
                        
                        html += `</tr>`;
                    });

                    html += `
                                </tbody>
                            </table>
                        </div>
                    `;
                });

                html += `</div>`; // Close CHP emissions section

    // Table for Flare Emissions (OS15_detailed) - One table per emission type with years as rows
    html += `
        <div class="results-section">
            <div class="section-subtitle">Flare Emissions - Detailed Impacts per Emission Type (OS15_detailed)</div>
    `;

    emissionTypes.forEach(emissionType => {
        html += `
            <div class="impact-category-table">
                <h4>Emission: ${emissionLabels[emissionType]}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
        `;

        // Columns for each impact category
        impactCategories.forEach(category => {
            html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
        });

        html += `
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Rows for each year
        ecologicalResults.yearlyResults.forEach(yearResult => {
            html += `<tr><td>${yearResult.year}</td>`;
            
            impactCategories.forEach(category => {
                const value = yearResult.OS15_detailed[category][emissionType] || 0;
                html += `<td>${value.toExponential(4)}</td>`;
            });
            
            html += `</tr>`;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
    });

    html += `</div>`; // Close Flare emissions section

    container.innerHTML = html;
}

        // NEW: Display SFR economic results
        function displaySFREconomicResults() {
            const container = window.tempSFREconomicResultsContainer || document.getElementById('sfr-economic-results-container');
            const economicResults = appState.sfrResults.economicResults;
            
            if (!economicResults || !economicResults.yearlyResults || economicResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No economic SFR results available</div>';
                return;
            }

            let html = '';

            // Display NPV at the top
            html += `
                <div class="economic-highlight ${economicResults.OS40 >= 0 ? 'highlight-green' : 'highlight-red'} npv-result">
                    <div>OS40: Net Present Value (NPV): €${economicResults.OS40.toFixed(2)}</div>
                </div>
            `;

            // Display investment costs
            html += `
                <div class="economic-highlight highlight-red">
                    <div>OS22: SFR Investment Costs: €${economicResults.OS22.toFixed(2)}</div>
                    <div>OS32: CHP Investment Costs: €${economicResults.OS32.toFixed(2)}</div>
                    <div>OS37: Total Investment Costs: €${(economicResults.OS22 + economicResults.OS32).toFixed(2)}</div>
                </div>
            `;

            // Table 1: SFR Operating costs
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual SFR Operating Costs (OS19-OS21)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>OS19: SFR Electricity Costs [€]</th>
                                <th>OS20: SFR Maintenance Costs [€]</th>
                                <th>OS21: SFR Chemical Costs [€]</th>
                                <th>OS23: Total SFR Operating Costs [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                const totalSFRCosts = yearResult.OS19 + yearResult.OS20 + yearResult.OS21;
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td>${yearResult.OS19.toFixed(2)}</td>
                        <td>${yearResult.OS20.toFixed(2)}</td>
                        <td>${yearResult.OS21.toFixed(2)}</td>
                        <td>${totalSFRCosts.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            // Table 2: CHP and Flare costs and revenues
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual CHP Revenues and Costs (OS24-OS31)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th class="revenue-cell">OS24: Electric Energy Revenue [€]</th>
                                <th class="revenue-cell">OS25: Thermal Energy Revenue [€]</th>
                                <th>OS26: Flare Maintenance Costs [€]</th>
                                <th>OS27: Flare Electricity Costs [€]</th>
                                <th>OS28: CHP Electricity Costs [€]</th>
                                <th>OS29: CHP Maintenance Costs [€]</th>
                                <th>OS30: CHP Oil Costs [€]</th>
                                <th>OS31: CHP Coolant Costs [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td class="revenue-cell">${yearResult.OS24.toFixed(2)}</td>
                        <td class="revenue-cell">${yearResult.OS25.toFixed(2)}</td>
                        <td>${yearResult.OS26.toFixed(2)}</td>
                        <td>${yearResult.OS27.toFixed(2)}</td>
                        <td>${yearResult.OS28.toFixed(2)}</td>
                        <td>${yearResult.OS29.toFixed(2)}</td>
                        <td>${yearResult.OS30.toFixed(2)}</td>
                        <td>${yearResult.OS31.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            // Table 3: Cost summaries and new economic parameters
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual Cost Summaries and Economic Parameters (OS33-OS39, IRS28-IRS29)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>OS33: Total Energy Revenue [€]</th>
                                <th>OS34: Total Flare Costs [€]</th>
                                <th>OS35: Total CHP Operating Costs [€]</th>
                                <th>OS36: Total SFR Revenue [€]</th>
                                <th>OS37.1: Tax Compensation [€]</th>
                                <th>IRS28: Depreciation Costs [€]</th>
                                <th>IRS29: Profit Before Taxes [€]</th>
                                <th>OS38: Taxes [€]</th>
                                <th>OS39: Profit After Taxes [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td>${yearResult.OS33.toFixed(2)}</td>
                        <td>${yearResult.OS34.toFixed(2)}</td>
                        <td>${yearResult.OS35.toFixed(2)}</td>
                        <td>${yearResult.OS36.toFixed(2)}</td>
                        <td>${yearResult.OS37_1.toFixed(2)}</td>
                        <td>${yearResult.IRS28.toFixed(2)}</td>
                        <td>${yearResult.IRS29.toFixed(2)}</td>
                        <td>${yearResult.OS38.toFixed(2)}</td>
                        <td>${yearResult.OS39.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            container.innerHTML = html;
        }

        // The remaining functions (DFE and OEC display functions, helper functions) remain unchanged
        // [Previous DFE and OEC display functions remain exactly the same...]



// NEW: Display OEC results
        function displayOECResults() {
            const container = window.tempOECResultsContainer || document.getElementById('oec-results-container');
            const OEC_results = appState.oecResults.OEC_results;
            const OO1 = appState.oecResults.OO1;
            const OEC_maxTotalGas = appState.oecResults.OEC_maxTotalGas;
            
            if (!OEC_results || Object.keys(OEC_results).length === 0) {
                container.innerHTML = '<div class="error">No OEC results available</div>';
                return;
            }
            
            let html = '';
            
            // Display selected engine
            if (OO1) {
                html += `
                    <div class="selected-engine">
                        <div class="engine-summary">Selected engine size (OO1): ${OO1} kWel</div>
                        <div>Total gas processed (IRO7): ${OEC_maxTotalGas.toFixed(2)} m³</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="error">
                        E1: No suitable engine size available for one or more utilization technologies. 
                        Please adjust input values A and B.
                    </div>
                `;
            }
            
            // Display results for each engine size
            Object.keys(OEC_results).forEach(engineSize => {
                const engineData = OEC_results[engineSize];
                const isSelected = OO1 === parseFloat(engineSize);
                
                html += `
                    <div class="engine-results ${isSelected ? 'selected-engine' : ''}">
                        <div class="engine-title">Engine size: ${engineSize} kWel ${isSelected ? '(SELECTED)' : ''}</div>
                        <div class="engine-summary">Total gas processed (IRO7): ${engineData.IRO7.toFixed(2)} m³</div>
                        
                        <div class="section-subtitle">Annual Results</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>IRO4: Energetic utilization [kW el.]</th>
                                    <th>IRO5: Relative utilization [%]</th>
                                    <th>IRO6: Engine usable</th>
                                    <th>IRO8: Gas flared [m³]</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                engineData.yearlyResults.forEach(yearResult => {
                    html += `
                        <tr>
                            <td>${yearResult.year}</td>
                            <td>${yearResult.IRO4.toFixed(2)}</td>
                            <td>${yearResult.IRO5.toFixed(2)}</td>
                            <td>${yearResult.IRO6 === 1 ? 'Yes' : 'No'}</td>
                            <td>${yearResult.IRO8.toFixed(2)}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // NEW: Display detailed OEC results
        function displayOECDetailedResults() {
            const container = window.tempOECDetailedResultsContainer || document.getElementById('oec-detailed-results-container');
            const detailedResults = appState.oecResults.detailedResults;
            
            if (!detailedResults || detailedResults.length === 0) {
                container.innerHTML = '<div class="error">No detailed OEC results available</div>';
                return;
            }

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed results for engine size: ${appState.oecResults.OO1} kWel</div>
                </div>
                
                <div class="results-section">
                    <div class="section-subtitle">Table 1: Engine-specific operating parameters (IRO9-IRO13, IRO15-IRO16)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IRO9: Oxygen consumption [m³]</th>
                                <th>IRO10: Electricity consumption [kWh]</th>
                                <th>IRO11: Maintenance frequency</th>
                                <th>IRO12: Coolant consumption [L]</th>
                                <th>IRO13: Oil consumption [L]</th>
                                <th>IRO15: Thermal energy [kWh]</th>
                                <th>IRO16: Electrical energy [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IRO9.toFixed(2)}</td>
                        <td>${result.IRO10.toFixed(2)}</td>
                        <td>${result.IRO11.toFixed(4)}</td>
                        <td>${result.IRO12.toFixed(2)}</td>
                        <td>${result.IRO13.toFixed(2)}</td>
                        <td>${result.IRO15.toFixed(2)}</td>
                        <td>${result.IRO16.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 2: Flare operation (IRO17-IRO19)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IRO17: Flare operating hours [h]</th>
                                <th>IRO18: Flare maintenance frequency</th>
                                <th>IRO19: Flare electricity consumption [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IRO17.toFixed(0)}</td>
                        <td>${result.IRO18.toFixed(4)}</td>
                        <td>${result.IRO19.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 3: Engine emissions (IRO14) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.emissionsIRO14.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.emissionsIRO14.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.emissionsIRO14.formaldehyde.toFixed(6)}</td>
                        <td>${result.emissionsIRO14.methaneSlop.toFixed(6)}</td>
                        <td>${result.emissionsIRO14.particulateMatter.toFixed(6)}</td>
                        <td>${result.emissionsIRO14.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.emissionsIRO14.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 4: Flare emissions (IRO20) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.flareEmissionsIRO20.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRO20.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRO20.formaldehyde.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRO20.methaneSlop.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRO20.particulateMatter.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRO20.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.flareEmissionsIRO20.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
        }

        // NEW: Display OEC ecological results
        function displayOECEcologicalResults() {
            const container = window.tempOECEcologicalResultsContainer || document.getElementById('oec-ecological-results-container');
            const ecologicalResults = appState.oecResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No ecological OEC results available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            let html = '';

            // OO2: Engine Production Impact - Show overall result at the top (only once)
            const firstYearOO2 = ecologicalResults.yearlyResults[0].OO2;
            
            html += `
                <div class="impact-summary">
                    <div class="engine-summary">OO2: Engine Production Impact (one-time in first year)</div>
                    <div class="impact-category-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Impact category</th>
                                    <th>Value</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Show OO2 for each impact category (first year only)
            impactCategories.forEach(category => {
                const value = firstYearOO2[category] || 0;
                html += `
                    <tr>
                        <td>${category}</td>
                        <td class="impact-value">${value.toExponential(4)}</td>
                        <td>${getUnitForCategory(category)}</td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Tables for OO3 to OO13
            const resultTypes = [
                { id: 'OO3', title: 'OO3: Oxygen Production Impact' },
                { id: 'OO4', title: 'OO4: Maintenance Impact' },
                { id: 'OO5', title: 'OO5: Oil Impact' },
                { id: 'OO6', title: 'OO6: Coolant Impact' },
                { id: 'OO7', title: 'OO7: Emission Impact (Sum)' },
                { id: 'OO8', title: 'OO8: Engine Energy Impact' },
                { id: 'OO9', title: 'OO9: Flare Energy Impact' },
                { id: 'OO10', title: 'OO10: Flare Maintenance Impact' },
                { id: 'OO11', title: 'OO11: Flare Emission Impact (Sum)' },
                { id: 'OO12', title: 'OO12: Environmental impacts from operating materials' },
                { id: 'OO13', title: 'OO13: Environmental impacts from flare' }
            ];

            resultTypes.forEach(resultType => {
                html += `
                    <div class="results-section">
                        <div class="section-subtitle">${resultType.title}</div>
                        <div class="impact-category-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                `;

                // Column headers for impact categories
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                    </tr>
                                </thead>
                                <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        // For OO2 only show values in first year
                        if (resultType.id === 'OO2' && yearResult.year > 1) {
                            html += `<td>-</td>`;
                        } else {
                            const value = yearResult[resultType.id][category] || 0;
                            html += `<td>${value.toExponential(4)}</td>`;
                        }
                    });
                    
                    html += `</tr>`;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // NEW: Display OEC emission impacts
        function displayOECEmissionImpacts() {
            const container = window.tempOECEmissionImpactsContainer || document.getElementById('oec-emission-impacts-container');
            const ecologicalResults = appState.oecResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No emission impact data available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
            const emissionLabels = {
                'carbonMonoxide': 'Carbon Monoxide',
                'nitrogenOxides': 'Nitrogen Oxides', 
                'formaldehyde': 'Formaldehyde',
                'methaneSlop': 'Methane Slip',
                'particulateMatter': 'Particulate Matter',
                'sulfurDioxide': 'Sulfur Dioxide',
                'ammonia': 'Ammonia'
            };

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed Emission Impacts for engine size: ${appState.oecResults.OO1} kWel</div>
                </div>
            `;

            // Table for Engine Emissions (OO7_detailed) - One table per emission type with years as rows
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Engine Emissions - Detailed Impacts per Emission Type (OO7_detailed)</div>
            `;

            emissionTypes.forEach(emissionType => {
                html += `
                    <div class="impact-category-table">
                        <h4>Emission: ${emissionLabels[emissionType]}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                `;

                // Columns for each impact category
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                </tr>
                            </thead>
                            <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        const value = yearResult.OO7_detailed[category][emissionType] || 0;
                        html += `<td>${value.toExponential(4)}</td>`;
                    });
                    
                    html += `</tr>`;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            // Table for Flare Emissions (OO11_detailed) - One table per emission type with years as rows
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Flare Emissions - Detailed Impacts per Emission Type (OO11_detailed)</div>
            `;

            emissionTypes.forEach(emissionType => {
                html += `
                    <div class="impact-category-table">
                        <h4>Emission: ${emissionLabels[emissionType]}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                `;

                // Columns for each impact category
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                </tr>
                            </thead>
                            <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        const value = yearResult.OO11_detailed[category][emissionType] || 0;
                        html += `<td>${value.toExponential(4)}</td>`;
                    });
                    
                    html += `</tr>`;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // NEW: Display OEC economic results
        function displayOECEconomicResults() {
            const container = window.tempOECEconomicResultsContainer || document.getElementById('oec-economic-results-container');
            const economicResults = appState.oecResults.economicResults;
            
            if (!economicResults || !economicResults.yearlyResults || economicResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No economic OEC results available</div>';
                return;
            }

            let html = '';

            // Display NPV at the top
            html += `
                <div class="economic-highlight ${economicResults.OO30 >= 0 ? 'highlight-green' : 'highlight-red'} npv-result">
                    <div>OO30: Net Present Value (NPV): €${economicResults.OO30.toFixed(2)}</div>
                </div>
            `;

            // Display investment costs
            html += `
                <div class="economic-highlight highlight-red">
                    <div>OO23: OEC Investment Costs: €${economicResults.OO23.toFixed(2)}</div>
                </div>
            `;

            // Table 1: Operating costs and revenues
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual Operating Costs and Revenues</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th class="revenue-cell">OO14: Electric Energy Revenue [€]</th>
                                <th class="revenue-cell">OO15: Thermal Energy Revenue [€]</th>
                                <th>OO16: Flare Maintenance Costs [€]</th>
                                <th>OO17: Flare Electricity Costs [€]</th>
                                <th>OO18: OEC Electricity Costs [€]</th>
                                <th>OO19: OEC Maintenance Costs [€]</th>
                                <th>OO20: OEC Oil Costs [€]</th>
                                <th>OO21: OEC Coolant Costs [€]</th>
                                <th>OO22: OEC Oxygen Costs [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td class="revenue-cell">${yearResult.OO14.toFixed(2)}</td>
                        <td class="revenue-cell">${yearResult.OO15.toFixed(2)}</td>
                        <td>${yearResult.OO16.toFixed(2)}</td>
                        <td>${yearResult.OO17.toFixed(2)}</td>
                        <td>${yearResult.OO18.toFixed(2)}</td>
                        <td>${yearResult.OO19.toFixed(2)}</td>
                        <td>${yearResult.OO20.toFixed(2)}</td>
                        <td>${yearResult.OO21.toFixed(2)}</td>
                        <td>${yearResult.OO22.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            // Table 2: Cost summaries and new economic parameters
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual Cost Summaries and New Economic Parameters</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>OO24: Total OEC Energy Revenue [€]</th>
                                <th>OO25: Total Flare Costs [€]</th>
                                <th>OO26: Total OEC Operating Costs [€]</th>
                                <th>OO27: Total OEC Revenue [€]</th>
                                <th>OO27.1: Tax Compensation [€]</th>
                                <th>IRO21: Depreciation Costs [€]</th>
                                <th>IRO22: Profit Before Taxes [€]</th>
                                <th>OO28: Taxes [€]</th>
                                <th>OO29: Profit After Taxes [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td>${yearResult.OO24.toFixed(2)}</td>
                        <td>${yearResult.OO25.toFixed(2)}</td>
                        <td>${yearResult.OO26.toFixed(2)}</td>
                        <td>${yearResult.OO27.toFixed(2)}</td>
                        <td>${yearResult.OO27_1.toFixed(2)}</td>
                        <td>${yearResult.IRO21.toFixed(2)}</td>
                        <td>${yearResult.IRO22.toFixed(2)}</td>
                        <td>${yearResult.OO28.toFixed(2)}</td>
                        <td>${yearResult.OO29.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            container.innerHTML = html;
        }

        // Calculate DFE ecological results (O2-O13) - FIXED VERSION
        function calculateDFEEcologicalResults() {
            console.log("Starting ecological DFE calculations...");
            
            if (!appState.csvData.CSV8 || !appState.csvData.CSV9 || !appState.csvData.CSV10 || !appState.csvData.CSV11) {
                console.error("Ecological CSV data not available");
                showError("Ecological background data could not be loaded.");
                return;
            }

            const DFE_O1 = appState.dfeResults.DFE_O1;
            if (!DFE_O1) {
                console.error("No selected engine size available");
                return;
            }

            // Get selected engine data
            const selectedEngine = appState.csvData.CSV3.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === DFE_O1
            );
            
            if (!selectedEngine) {
                console.error("Selected engine not found in CSV3:", DFE_O1);
                return;
            }

            const detailedResults = appState.dfeResults.detailedResults;
            if (!detailedResults) {
                console.error("No detailed results available");
                return;
            }

            // Get impact categories from CSV8 (first row)
            const impactCategories = Object.keys(appState.csvData.CSV8[0] || {});
            impactCategories.shift(); // Remove "Impact Category" column
            
            console.log("Impact categories:", impactCategories);

            const ecologicalResults = {
                impactCategories: impactCategories,
                yearlyResults: []
            };

            // Get production factor from selected engine
            const productionFactor = selectedEngine['Production Factor'] || 1;

            // FIXED: Properly select energy source data from CSV10
            let energySourceData;
            if (appState.inputs.J === 'Renewable') {
                // Find the row for Renewable
                energySourceData = appState.csvData.CSV10.find(row => {
                    // Check the first column value (not the header name)
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === 'Renewable';
                });
            } else {
                // Find the row for the selected country
                energySourceData = appState.csvData.CSV10.find(row => {
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === appState.inputs.D;
                });
            }

            console.log("Energy source data:", energySourceData);
            console.log("Selected energy source:", appState.inputs.J);
            console.log("Selected country:", appState.inputs.D);

            // CORRECTION: O2 calculated only once (in the first year)
            const engineProductionData = appState.csvData.CSV8.find(row => 
                row['Impact Category'] && row['Impact Category'].includes('Engine Production')
            );
            
            const O2_total = {};
            if (engineProductionData) {
                impactCategories.forEach(category => {
                    O2_total[category] = productionFactor * (engineProductionData[category] || 0);
                });
            }

            // Calculate for each year
            detailedResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEcologicalResults = {
                    year: year,
                    O2: {}, // Engine Production Impact (only in first year)
                    O3: {}, // Fuel Production Impact  
                    O4: {}, // Maintenance Impact
                    O5: {}, // Oil Impact
                    O6: {}, // Coolant Impact
                    O7: {}, // Emission Impact (sum of all emissions)
                    O8: {}, // Engine Energy Impact
                    O9: {}, // Flare Energy Impact
                    O10: {}, // Flare Maintenance Impact
                    O11: {}, // Flare Emission Impact (sum of all emissions)
                    O12: {}, // Operating materials total
                    O13: {}, // Flare total
                    // New fields for detailed emission calculations
                    O7_detailed: {}, // Detailed engine emissions per emission type
                    O11_detailed: {} // Detailed flare emissions per emission type
                };

                // CORRECTION: O2 only set in first year
                if (year === 1) {
                    yearEcologicalResults.O2 = {...O2_total};
                }

                // Calculate for each impact category
                impactCategories.forEach(category => {
                    // 7.52: O3 - Fuel Production Impact
                    let fuelProductionData;
                    if (appState.inputs.L === 'Diesel') {
                        fuelProductionData = appState.csvData.CSV8.find(row => 
                            row['Impact Category'] && row['Impact Category'].includes('Diesel Production')
                        );
                    } else {
                        fuelProductionData = appState.csvData.CSV8.find(row => 
                            row['Impact Category'] && row['Impact Category'].includes('Pilot Fuel Production')
                        );
                    }
                    if (fuelProductionData) {
                        yearEcologicalResults.O3[category] = yearData.IR10 * (fuelProductionData[category] || 0);
                    }

                    // 7.53: O4, O5, O6 - Maintenance, Oil, Coolant Impacts
                    const maintenanceData = appState.csvData.CSV8.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    const oilData = appState.csvData.CSV8.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Oil Production')
                    );
                    const coolantData = appState.csvData.CSV8.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Coolant Production')
                    );

                    if (maintenanceData) {
                        yearEcologicalResults.O4[category] = yearData.IR12 * (maintenanceData[category] || 0);
                    }
                    if (oilData) {
                        yearEcologicalResults.O5[category] = yearData.IR14 * (oilData[category] || 0);
                    }
                    if (coolantData) {
                        yearEcologicalResults.O6[category] = yearData.IR13 * (coolantData[category] || 0);
                    }

                    // FIXED: 7.54: O7 - Emission Impact (sum of all emissions)
                    let emissionImpact = 0;
                    yearEcologicalResults.O7_detailed[category] = {};
                    
                    Object.keys(yearData.emissionsIR15).forEach(emissionType => {
                        // Find emission data in CSV9
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            const emissionValue = yearData.emissionsIR15[emissionType] * (emissionData[category] || 0);
                            emissionImpact += emissionValue;
                            yearEcologicalResults.O7_detailed[category][emissionType] = emissionValue;
                        } else {
                            console.warn(`No emission data found for ${emissionType} in category ${category}`);
                            yearEcologicalResults.O7_detailed[category][emissionType] = 0;
                        }
                    });
                    yearEcologicalResults.O7[category] = emissionImpact;

                    // FIXED: 7.55: O8, O9 - Energy Impacts
                    if (energySourceData) {
                        yearEcologicalResults.O8[category] = yearData.IR11 * (energySourceData[category] || 0);
                        yearEcologicalResults.O9[category] = yearData.IR20 * (energySourceData[category] || 0);
                    } else {
                        console.warn("No energy source data found for:", appState.inputs.J, appState.inputs.D);
                        yearEcologicalResults.O8[category] = 0;
                        yearEcologicalResults.O9[category] = 0;
                    }

                    // 7.56: O10 - Flare Maintenance Impact
                    const flareMaintenanceData = appState.csvData.CSV11.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    if (flareMaintenanceData) {
                        yearEcologicalResults.O10[category] = yearData.IR19 * (flareMaintenanceData[category] || 0);
                    }

                    // FIXED: 7.57: O11 - Flare Emission Impact (sum of all emissions)
                    let flareEmissionImpact = 0;
                    yearEcologicalResults.O11_detailed[category] = {};
                    
                    Object.keys(yearData.flareEmissionsIR21).forEach(emissionType => {
                        // Find emission data in CSV9
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            const emissionValue = yearData.flareEmissionsIR21[emissionType] * (emissionData[category] || 0);
                            flareEmissionImpact += emissionValue;
                            yearEcologicalResults.O11_detailed[category][emissionType] = emissionValue;
                        } else {
                            console.warn(`No emission data found for ${emissionType} in category ${category}`);
                            yearEcologicalResults.O11_detailed[category][emissionType] = 0;
                        }
                    });
                    yearEcologicalResults.O11[category] = flareEmissionImpact;

                    // 7.58: O12, O13 - Summaries
                    yearEcologicalResults.O12[category] = 
                        (yearEcologicalResults.O8[category] || 0) + 
                        (yearEcologicalResults.O6[category] || 0) + 
                        (yearEcologicalResults.O5[category] || 0);
                    
                    yearEcologicalResults.O13[category] = 
                        (yearEcologicalResults.O9[category] || 0) + 
                        (yearEcologicalResults.O10[category] || 0) + 
                        (yearEcologicalResults.O11[category] || 0);
                });

                ecologicalResults.yearlyResults.push(yearEcologicalResults);
            });

            appState.dfeResults.ecologicalResults = ecologicalResults;
        }

        // CORRECTED: Calculate DFE economic results (O14-O30) with new logic
        function calculateDFEEconomicResults() {
            console.log("Starting economic DFE calculations...");
            
            if (!appState.csvData.CSV1 || !appState.csvData.CSV12) {
                console.error("Economic CSV data not available");
                showError("Economic background data could not be loaded.");
                return;
            }

            const DFE_O1 = appState.dfeResults.DFE_O1;
            if (!DFE_O1) {
                console.error("No selected engine size available");
                return;
            }

            // Get selected engine data
            const selectedEngine = appState.csvData.CSV3.find(engine => 
                parseFloat(engine['Engine Size [kWel]']) === DFE_O1
            );
            
            if (!selectedEngine) {
                console.error("Selected engine not found in CSV3:", DFE_O1);
                return;
            }

            const detailedResults = appState.dfeResults.detailedResults;
            if (!detailedResults) {
                console.error("No detailed results available");
                return;
            }

            const years = appState.inputs.C;
            const economicResults = {
                yearlyResults: [],
                O23: 0, // Investment costs
                O30: 0  // NPV
            };

            // Get country-specific maintenance costs from CSV1
            const countryData = appState.csvData.CSV1.find(row => row.Country === appState.inputs.D);
            const maintenanceFlare = countryData['Maintenance Flare [€/maintenance mix]'] || 250;
            const maintenanceDFE = countryData['Maintenance DFE [€/maintenance mix]'] || 350;
            const depreciationYears = countryData['Depreciation [a]'] || appState.inputs.G;

            // Get prices from CSV12
            const engineOilPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Engine oil')
            )?.['Price'] || 2;
            
            const coolantPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Coolant')
            )?.['Price'] || 2;
            
            const dieselPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Diesel')
            )?.['Price'] || 2;
            
            const pilotFuelPrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Pilot Fuel')
            )?.['Price'] || 4;
            
            const dualFuelEnginePrice = appState.csvData.CSV12.find(row => 
                row['Category'] && row['Category'].includes('Dual Fuel Engine')
            )?.['Price'] || 50000;

            // 7.63: Calculate investment costs
            const priceFactor = selectedEngine['Price Factor'] || 1;
            economicResults.O23 = dualFuelEnginePrice * priceFactor;

            // NEW: Find first year with engine operation (IR7=1) for depreciation start
            let firstOperationYear = null;
            for (let i = 0; i < years; i++) {
                if (detailedResults[i].DFE_IR7 === 1) {
                    firstOperationYear = i + 1;
                    break;
                }
            }

            // CORRECTED: Tax compensation logic
            let previousO27_1 = 0;

            // Calculate for each year
            detailedResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEconomicResults = {
                    year: year,
                    // Revenues
                    O14: 0, // Electric energy revenue
                    O15: 0, // Thermal energy revenue
                    // Flare costs
                    O16: 0, // Flare maintenance costs
                    O17: 0, // Flare electricity costs
                    // DFE costs
                    O18: 0, // DFE electricity costs
                    O19: 0, // DFE maintenance costs
                    O20: 0, // DFE oil costs
                    O21: 0, // DFE coolant costs
                    O22: 0, // DFE fuel costs
                    // Summaries
                    O24: 0, // Total DFE Energy Revenue
                    O25: 0, // Total Flare costs
                    O26: 0, // Total DFE Operating Costs
                    O27: 0, // Total DFE Revenue
                    // NEW: Tax compensation
                    O27_1: 0, // Tax compensation
                    // NPV calculations
                    IR22: 0, // Depreciation costs
                    IR23: 0, // Profit before taxes
                    O28: 0, // Taxes
                    O29: 0  // Profit after taxes
                };

                // 7.61: Calculate revenues
                yearEconomicResults.O14 = yearData.IR17 * appState.inputs.E;
                yearEconomicResults.O15 = yearData.IR16 * appState.inputs.F;

                // 7.61: Calculate flare costs
                yearEconomicResults.O16 = yearData.IR19 * maintenanceFlare;
                yearEconomicResults.O17 = yearData.IR20 * appState.inputs.E;

                // 7.61: Calculate DFE operating costs
                yearEconomicResults.O18 = yearData.IR11 * appState.inputs.E;
                yearEconomicResults.O19 = yearData.IR12 * maintenanceDFE;
                yearEconomicResults.O20 = yearData.IR14 * engineOilPrice;
                yearEconomicResults.O21 = yearData.IR13 * coolantPrice;

                // 7.62: Calculate fuel costs
                if (appState.inputs.L === 'Diesel') {
                    yearEconomicResults.O22 = yearData.IR10 * dieselPrice;
                } else {
                    yearEconomicResults.O22 = yearData.IR10 * pilotFuelPrice;
                }

                // 7.64: Cost summaries
                yearEconomicResults.O24 = yearEconomicResults.O14 + yearEconomicResults.O15;
                yearEconomicResults.O25 = yearEconomicResults.O16 + yearEconomicResults.O17;
                yearEconomicResults.O26 = yearEconomicResults.O18 + yearEconomicResults.O19 + 
                                          yearEconomicResults.O20 + yearEconomicResults.O21;
                yearEconomicResults.O27 = yearEconomicResults.O24 - yearEconomicResults.O25 - 
                                          yearEconomicResults.O26 - yearEconomicResults.O22;

                // NEW: 7.71: Calculate depreciation - CORRECTED LOGIC
                // Depreciation starts from first operation year and lasts for G years
                if (firstOperationYear && year >= firstOperationYear && year < firstOperationYear + depreciationYears) {
                    yearEconomicResults.IR22 = economicResults.O23 / depreciationYears;
                } else {
                    yearEconomicResults.IR22 = 0;
                }

                // CORRECTED: Calculate O27_1 - Tax compensation
                if (yearEconomicResults.O27 < 0) {
                    yearEconomicResults.O27_1 = yearEconomicResults.O27 + previousO27_1;
                } else {
                    yearEconomicResults.O27_1 = 0;
                }

                // CORRECTED: Calculate profit before taxes with tax compensation
                yearEconomicResults.IR23 = yearEconomicResults.O27 - yearEconomicResults.IR22 + previousO27_1;

                // 7.72: Calculate taxes - only if profit is positive
                if (yearEconomicResults.IR23 > 0) {
                    yearEconomicResults.O28 = yearEconomicResults.IR23 * appState.inputs.H;
                } else {
                    yearEconomicResults.O28 = 0;
                }

                // CORRECTED: Calculate profit after taxes
                yearEconomicResults.O29 = yearEconomicResults.O27 - yearEconomicResults.O28;

                // Update previous O27_1 for next iteration
                previousO27_1 = yearEconomicResults.O27_1;

                economicResults.yearlyResults.push(yearEconomicResults);
            });

            // 7.73: Calculate NPV
            let npvSum = 0;
            economicResults.yearlyResults.forEach((yearResult, index) => {
                const n = index + 1;
                npvSum += yearResult.O29 / Math.pow((1 + appState.inputs.I), n);
            });
            economicResults.O30 = -economicResults.O23 + npvSum;

            appState.dfeResults.economicResults = economicResults;
        }

        // FIXED: Improved function to find emission data in CSV9
        function findEmissionData(emissionType) {
            if (!appState.csvData.CSV9 || appState.csvData.CSV9.length === 0) {
                console.error("CSV9 data not available");
                return null;
            }
            
            // Map internal emission type names to CSV9 row names
            const emissionMapping = {
                'carbonMonoxide': 'Carbon Monoxide',
                'nitrogenOxides': 'Nitrogene Oxydes', 
                'formaldehyde': 'Formldehyd',
                'methaneSlop': 'Methane Slop',
                'particulateMatter': 'Particulate Matter',
                'sulfurDioxide': 'Sulfur Dioxide',
                'ammonia': 'Ammonia'
            };
            
            const emissionName = emissionMapping[emissionType];
            if (!emissionName) {
                console.warn(`No mapping found for emission type: ${emissionType}`);
                return null;
            }
            
            // Find the row in CSV9 where Impact Category contains the emission name
            const emissionData = appState.csvData.CSV9.find(row => {
                const impactCategory = row['Impact Category'];
                return impactCategory && impactCategory.includes(emissionName);
            });
            
            if (!emissionData) {
                console.warn(`No emission data found for: ${emissionName}`);
                console.log("Available CSV9 Impact Categories:", appState.csvData.CSV9.map(row => row['Impact Category']));
            }
            
            return emissionData;
        }

        // Helper function to find closest load row
        function findClosestLoadRow(data, targetLoad, columnName) {
            if (!data || data.length === 0) return {};
            
            let closestRow = data[0];
            let minDifference = Math.abs(parseFloat(data[0][columnName]) - targetLoad);
            
            for (let i = 1; i < data.length; i++) {
                const difference = Math.abs(parseFloat(data[i][columnName]) - targetLoad);
                if (difference < minDifference) {
                    minDifference = difference;
                    closestRow = data[i];
                }
            }
            
            console.log(`Found row for load ${targetLoad}%:`, closestRow);
            return closestRow;
        }

        // Display DFE results
        function displayDFEResults() {
            const container = window.tempDFEResultsContainer || document.getElementById('dfe-results-container');
            const DFE_results = appState.dfeResults.DFE_results;
            const DFE_O1 = appState.dfeResults.DFE_O1;
            const DFE_maxTotalGas = appState.dfeResults.DFE_maxTotalGas;
            
            if (!DFE_results || Object.keys(DFE_results).length === 0) {
                container.innerHTML = '<div class="error">No DFE results available</div>';
                return;
            }
            
            let html = '';
            
            // Display selected engine
            if (DFE_O1) {
                html += `
                    <div class="selected-engine">
                        <div class="engine-summary">Selected engine size (DFE_O1): ${DFE_O1} kWel</div>
                        <div>Total gas processed (DFE_IR8): ${DFE_maxTotalGas.toFixed(2)} m³</div>
                    </div>
                `;
            } else {
                html += `
                    <div class="error">
                        DFE_E1: No suitable engine size available for one or more utilization technologies. 
                        Please adjust input values A and B.
                    </div>
                `;
            }
            
            // Display results for each engine size
            Object.keys(DFE_results).forEach(engineSize => {
                const engineData = DFE_results[engineSize];
                const isSelected = DFE_O1 === parseFloat(engineSize);
                
                html += `
                    <div class="engine-results ${isSelected ? 'selected-engine' : ''}">
                        <div class="engine-title">Engine size: ${engineSize} kWel ${isSelected ? '(SELECTED)' : ''}</div>
                        <div class="engine-summary">Total gas processed (DFE_IR8): ${engineData.DFE_IR8.toFixed(2)} m³</div>
                        
                        <div class="section-subtitle">Annual Results</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                                    <th>DFE_IR4: Energy content [kWh]</th>
                                    <th>DFE_IR5: Energetic utilization [kW el.]</th>
                                    <th>DFE_IR6: Relative utilization [%]</th>
                                    <th>DFE_IR7: Engine usable</th>
                                    <th>DFE_IR9: Gas flared [m³]</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                engineData.yearlyResults.forEach(yearResult => {
                    html += `
                        <tr>
                            <td>${yearResult.year}</td>
                            <td>${yearResult.DFE_IR4.toFixed(2)}</td>
                            <td>${yearResult.DFE_IR5.toFixed(2)}</td>
                            <td>${yearResult.DFE_IR6.toFixed(2)}</td>
                            <td>${yearResult.DFE_IR7 === 1 ? 'Yes' : 'No'}</td>
                            <td>${yearResult.DFE_IR9.toFixed(2)}</td>
                        </tr>
                    `;
                });
                
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // Display detailed DFE results
        function displayDFEDetailedResults() {
            const container = window.tempDFEDetailedResultsContainer || document.getElementById('dfe-detailed-results-container');
            const detailedResults = appState.dfeResults.detailedResults;
            
            if (!detailedResults || detailedResults.length === 0) {
                container.innerHTML = '<div class="error">No detailed DFE results available</div>';
                return;
            }

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed results for engine size: ${appState.dfeResults.DFE_O1} kWel</div>
                </div>
                
                <div class="results-section">
                    <div class="section-subtitle">Table 1: Engine-specific operating parameters (IR10-IR14, IR16-IR17)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IR10: Diesel consumption [L]</th>
                                <th>IR11: Electricity consumption [kWh]</th>
                                <th>IR12: Maintenance frequency</th>
                                <th>IR13: Coolant consumption [L]</th>
                                <th>IR14: Oil consumption [L]</th>
                                <th>IR16: Thermal energy [kWh]</th>
                                <th>IR17: Electrical energy [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IR10.toFixed(2)}</td>
                        <td>${result.IR11.toFixed(2)}</td>
                        <td>${result.IR12.toFixed(4)}</td>
                        <td>${result.IR13.toFixed(2)}</td>
                        <td>${result.IR14.toFixed(2)}</td>
                        <td>${result.IR16.toFixed(2)}</td>
                        <td>${result.IR17.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 2: Flare operation (IR18-IR20)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IR18: Flare operating hours [h]</th>
                                <th>IR19: Flare maintenance frequency</th>
                                <th>IR20: Flare electricity consumption [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IR18.toFixed(0)}</td>
                        <td>${result.IR19.toFixed(4)}</td>
                        <td>${result.IR20.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 3: Engine emissions (IR15) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.emissionsIR15.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.emissionsIR15.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.emissionsIR15.formaldehyde.toFixed(6)}</td>
                        <td>${result.emissionsIR15.methaneSlop.toFixed(6)}</td>
                        <td>${result.emissionsIR15.particulateMatter.toFixed(6)}</td>
                        <td>${result.emissionsIR15.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.emissionsIR15.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 4: Flare emissions (IR21) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            detailedResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.flareEmissionsIR21.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.flareEmissionsIR21.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.flareEmissionsIR21.formaldehyde.toFixed(6)}</td>
                        <td>${result.flareEmissionsIR21.methaneSlop.toFixed(6)}</td>
                        <td>${result.flareEmissionsIR21.particulateMatter.toFixed(6)}</td>
                        <td>${result.flareEmissionsIR21.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.flareEmissionsIR21.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
        }

        // Display DFE ecological results
        function displayDFEEcologicalResults() {
            const container = window.tempDFEEcologicalResultsContainer || document.getElementById('dfe-ecological-results-container');
            const ecologicalResults = appState.dfeResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No ecological DFE results available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            let html = '';

            // O2: Engine Production Impact - Show overall result at the top (only once)
            const firstYearO2 = ecologicalResults.yearlyResults[0].O2;
            
            html += `
                <div class="impact-summary">
                    <div class="engine-summary">O2: Engine Production Impact (one-time in first year)</div>
                    <div class="impact-category-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Impact category</th>
                                    <th>Value</th>
                                    <th>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
            `;

            // Show O2 for each impact category (first year only)
            impactCategories.forEach(category => {
                const value = firstYearO2[category] || 0;
                html += `
                    <tr>
                        <td>${category}</td>
                        <td class="impact-value">${value.toExponential(4)}</td>
                        <td>${getUnitForCategory(category)}</td>
                    </tr>
                `;
            });

            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;

            // Tables for O3 to O13
            const resultTypes = [
                { id: 'O3', title: 'O3: Fuel Production Impact' },
                { id: 'O4', title: 'O4: Maintenance Impact' },
                { id: 'O5', title: 'O5: Oil Impact' },
                { id: 'O6', title: 'O6: Coolant Impact' },
                { id: 'O7', title: 'O7: Emission Impact (Sum)' },
                { id: 'O8', title: 'O8: Engine Energy Impact' },
                { id: 'O9', title: 'O9: Flare Energy Impact' },
                { id: 'O10', title: 'O10: Flare Maintenance Impact' },
                { id: 'O11', title: 'O11: Flare Emission Impact (Sum)' },
                { id: 'O12', title: 'O12: Environmental impacts from operating materials' },
                { id: 'O13', title: 'O13: Environmental impacts from flare' }
            ];

            resultTypes.forEach(resultType => {
                html += `
                    <div class="results-section">
                        <div class="section-subtitle">${resultType.title}</div>
                        <div class="impact-category-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                `;

                // Column headers for impact categories
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                    </tr>
                                </thead>
                                <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        // For O2 only show values in first year
                        if (resultType.id === 'O2' && yearResult.year > 1) {
                            html += `<td>-</td>`;
                        } else {
                            const value = yearResult[resultType.id][category] || 0;
                            html += `<td>${value.toExponential(4)}</td>`;
                        }
                    });
                    
                    html += `</tr>`;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // Display DFE emission impacts (new function for detailed emission calculations)
        function displayDFEEmissionImpacts() {
            const container = window.tempDFEEmissionImpactsContainer || document.getElementById('dfe-emission-impacts-container');
            const ecologicalResults = appState.dfeResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No emission impact data available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
            const emissionLabels = {
                'carbonMonoxide': 'Carbon Monoxide',
                'nitrogenOxides': 'Nitrogen Oxides', 
                'formaldehyde': 'Formaldehyde',
                'methaneSlop': 'Methane Slip',
                'particulateMatter': 'Particulate Matter',
                'sulfurDioxide': 'Sulfur Dioxide',
                'ammonia': 'Ammonia'
            };

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed Emission Impacts for engine size: ${appState.dfeResults.DFE_O1} kWel</div>
                </div>
            `;

            // Table for Engine Emissions (O7_detailed) - One table per emission type with years as rows
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Engine Emissions - Detailed Impacts per Emission Type (O7_detailed)</div>
            `;

            emissionTypes.forEach(emissionType => {
                html += `
                    <div class="impact-category-table">
                        <h4>Emission: ${emissionLabels[emissionType]}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                `;

                // Columns for each impact category
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                </tr>
                            </thead>
                            <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        const value = yearResult.O7_detailed[category][emissionType] || 0;
                        html += `<td>${value.toExponential(4)}</td>`;
                    });
                    
                    html += `</tr>`;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            // Table for Flare Emissions (O11_detailed) - One table per emission type with years as rows
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Flare Emissions - Detailed Impacts per Emission Type (O11_detailed)</div>
            `;

            emissionTypes.forEach(emissionType => {
                html += `
                    <div class="impact-category-table">
                        <h4>Emission: ${emissionLabels[emissionType]}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                `;

                // Columns for each impact category
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                </tr>
                            </thead>
                            <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        const value = yearResult.O11_detailed[category][emissionType] || 0;
                        html += `<td>${value.toExponential(4)}</td>`;
                    });
                    
                    html += `</tr>`;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // Display DFE economic results
        function displayDFEEconomicResults() {
            const container = window.tempDFEEconomicResultsContainer || document.getElementById('dfe-economic-results-container');
            const economicResults = appState.dfeResults.economicResults;
            
            if (!economicResults || !economicResults.yearlyResults || economicResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No economic DFE results available</div>';
                return;
            }

            let html = '';

            // Display NPV at the top
            html += `
                <div class="economic-highlight ${economicResults.O30 >= 0 ? 'highlight-green' : 'highlight-red'} npv-result">
                    <div>O30: Net Present Value (NPV): €${economicResults.O30.toFixed(2)}</div>
                </div>
            `;

            // Display investment costs
            html += `
                <div class="economic-highlight highlight-red">
                    <div>O23: DFE Investment Costs: €${economicResults.O23.toFixed(2)}</div>
                </div>
            `;

            // Table 1: Operating costs and revenues
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual Operating Costs and Revenues</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th class="revenue-cell">O14: Electric Energy Revenue [€]</th>
                                <th class="revenue-cell">O15: Thermal Energy Revenue [€]</th>
                                <th>O16: Flare Maintenance Costs [€]</th>
                                <th>O17: Flare Electricity Costs [€]</th>
                                <th>O18: DFE Electricity Costs [€]</th>
                                <th>O19: DFE Maintenance Costs [€]</th>
                                <th>O20: DFE Oil Costs [€]</th>
                                <th>O21: DFE Coolant Costs [€]</th>
                                <th>O22: DFE Fuel Costs [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td class="revenue-cell">${yearResult.O14.toFixed(2)}</td>
                        <td class="revenue-cell">${yearResult.O15.toFixed(2)}</td>
                        <td>${yearResult.O16.toFixed(2)}</td>
                        <td>${yearResult.O17.toFixed(2)}</td>
                        <td>${yearResult.O18.toFixed(2)}</td>
                        <td>${yearResult.O19.toFixed(2)}</td>
                        <td>${yearResult.O20.toFixed(2)}</td>
                        <td>${yearResult.O21.toFixed(2)}</td>
                        <td>${yearResult.O22.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            // Table 2: Cost summaries and new parameters
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual Cost Summaries and New Economic Parameters</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>O24: Total DFE Energy Revenue [€]</th>
                                <th>O25: Total Flare Costs [€]</th>
                                <th>O26: Total DFE Operating Costs [€]</th>
                                <th>O27: Total DFE Revenue [€]</th>
                                <th>O27.1: Tax Compensation [€]</th>
                                <th>IR22: Depreciation Costs [€]</th>
                                <th>IR23: Profit Before Taxes [€]</th>
                                <th>O28: Taxes [€]</th>
                                <th>O29: Profit After Taxes [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td>${yearResult.O24.toFixed(2)}</td>
                        <td>${yearResult.O25.toFixed(2)}</td>
                        <td>${yearResult.O26.toFixed(2)}</td>
                        <td>${yearResult.O27.toFixed(2)}</td>
                        <td>${yearResult.O27_1.toFixed(2)}</td>
                        <td>${yearResult.IR22.toFixed(2)}</td>
                        <td>${yearResult.IR23.toFixed(2)}</td>
                        <td>${yearResult.O28.toFixed(2)}</td>
                        <td>${yearResult.O29.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            container.innerHTML = html;
        }

        // Helper function to get unit for impact category
        function getUnitForCategory(category) {
            const units = {
                'Fine particulate matter formation': 'kg PM2.5 eq',
                'Fossil resource scarcity': 'kg oil eq',
                'Freshwater ecotoxicity': 'kg 1,4-DCB',
                'Freshwater eutrophication': 'kg P eq',
                'Global warming': 'kg CO2 eq',
                'Human carcinogenic toxicity': 'kg 1,4-DCB',
                'Human non-carcinogenic toxicity': 'kg 1,4-DCB',
                'Ionizing radiation': 'kBq Co-60 eq',
                'Land use': 'm2a crop eq',
                'Marine ecotoxicity': 'kg 1,4-DCB',
                'Marine eutrophication': 'kg N eq',
                'Mineral resource scarcity': 'kg Cu eq',
                'Ozone formation, Human health': 'kg NOx eq',
                'Ozone formation, Terrestrial ecosystems': 'kg NOx eq',
                'Stratospheric ozone depletion': 'kg CFC11 eq',
                'Terrestrial acidification': 'kg SO2 eq',
                'Terrestrial ecotoxicity': 'kg 1,4-DCB',
                'Water consumption': 'm3'
            };
            
            return units[category] || '';
        }
























        // NEW: Calculate Flare results (IRF1-IRF4)
        function calculateFlare() {
            console.log("Starting Flare calculation...");
            
            if (!appState.csvData.CSV6 || !appState.csvData.CSV7) {
                console.error("Flare CSV data not available");
                showError("Flare background data could not be loaded.");
                return;
            }

            const gasDevelopment = appState.calculationResults.gasDevelopment;
            const years = appState.inputs.C;
            const K = appState.inputs.K;

            // Get flare data from CSV6 and CSV7
            const flareData = appState.csvData.CSV6[0]; // Assuming first row contains the data
            const flareEmissionData = appState.csvData.CSV7[0]; // Assuming first row contains the data

            if (!flareData || !flareEmissionData) {
                console.error("Flare data not available");
                return;
            }

            const flareResults = {
                yearlyResults: []
            };

            // Calculate for each year
            for (let i = 0; i < years; i++) {
                const year = i + 1;
                const yearData = gasDevelopment[i];
                
                // IRF1: Operating hours Flare in year n = K
                const IRF1 = K;
                
                // IRF2: Flare maintenance frequency in year n = IRF1 / Maintenance Period(CSV6)
                const maintenancePeriod = flareData['Maintenance Period [opr. h]'] || 15000;
                const IRF2 = IRF1 / maintenancePeriod;
                
                // IRF3: Flare electricity use in year n = IRF1 * Electricity Consumption(CSV6)
                const electricityConsumption = flareData['Electricity Consumption [kW]'] || 20;
                const IRF3 = IRF1 * electricityConsumption;
                
                // IRF4: Flare Emission X in year n = IR2 * K * Flare emission X(CSV7)
                const emissionsIRF4 = {
                    carbonMonoxide: yearData.gasVolume * K * (flareEmissionData['Carbon Monoxide [kg CO/m^3]'] || 0),
                    nitrogenOxides: yearData.gasVolume * K * (flareEmissionData['Nitrogene Oxydes [kg NOx/m^3]'] || 0),
                    formaldehyde: yearData.gasVolume * K * (flareEmissionData['Formldehyd [kg CH2O/m^3]'] || 0),
                    methaneSlop: yearData.gasVolume * K * (flareEmissionData['Methane Slop [kg CH4/m^3]'] || 0),
                    particulateMatter: yearData.gasVolume * K * (flareEmissionData['Particulate Matter [kg/m^3]'] || 0),
                    sulfurDioxide: yearData.gasVolume * K * (flareEmissionData['Sulfur Dioxide [kg SO2/m^3]'] || 0),
                    ammonia: yearData.gasVolume * K * (flareEmissionData['Ammonia [kg NH3/m^3]'] || 0)
                };

                flareResults.yearlyResults.push({
                    year: year,
                    IRF1: IRF1,
                    IRF2: IRF2,
                    IRF3: IRF3,
                    emissionsIRF4: emissionsIRF4,
                    IR2: yearData.gasVolume // Store for reference
                });
            }

            appState.flareResults = flareResults;

            // Calculate ecological and economic results
            calculateFlareEcologicalResults();
            calculateFlareEconomicResults();
        }

        // NEW: Calculate Flare ecological results (OF1-OF3)
        function calculateFlareEcologicalResults() {
            console.log("Starting ecological Flare calculations...");
            
            if (!appState.csvData.CSV10 || !appState.csvData.CSV11 || !appState.csvData.CSV9) {
                console.error("Ecological CSV data not available");
                showError("Ecological background data could not be loaded.");
                return;
            }

            const flareResults = appState.flareResults;
            if (!flareResults || !flareResults.yearlyResults || flareResults.yearlyResults.length === 0) {
                console.error("No flare results available");
                return;
            }

            // Get impact categories from CSV10 (first row)
            const impactCategories = Object.keys(appState.csvData.CSV10[0] || {});
            impactCategories.shift(); // Remove "Impact Category" column
            
            console.log("Flare Impact categories:", impactCategories);

            const ecologicalResults = {
                impactCategories: impactCategories,
                yearlyResults: []
            };

            // Properly select energy source data from CSV10
            let energySourceData;
            if (appState.inputs.J === 'Renewable') {
                // Find the row for Renewable
                energySourceData = appState.csvData.CSV10.find(row => {
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === 'Renewable';
                });
            } else {
                // Find the row for the selected country
                energySourceData = appState.csvData.CSV10.find(row => {
                    const firstColumnKey = Object.keys(row)[0];
                    const firstColumnValue = row[firstColumnKey];
                    return firstColumnValue === appState.inputs.D;
                });
            }

            console.log("Flare Energy source data:", energySourceData);

            // Calculate for each year
            flareResults.yearlyResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEcologicalResults = {
                    year: year,
                    OF1: {}, // Flare Energy Impact
                    OF2: {}, // Flare Maintenance Impact
                    OF3: {}, // Flare Emission Impact (sum of all emissions)
                    OF3_detailed: {} // Detailed flare emissions per emission type
                };

                // Calculate for each impact category
                impactCategories.forEach(category => {
                    // OF1: Flare Energy Impact in Impact Category X in year n = IRF3 * Energy specific Impact in Impact Category X(CSV10)
                    if (energySourceData) {
                        yearEcologicalResults.OF1[category] = yearData.IRF3 * (energySourceData[category] || 0);
                    } else {
                        console.warn("No energy source data found for Flare:", appState.inputs.J, appState.inputs.D);
                        yearEcologicalResults.OF1[category] = 0;
                    }

                    // OF2: Flare Maintenance Impact in Impact Category X in year n = IRF2 * Maintenance in Impact Category X(CSV11)
                    const maintenanceData = appState.csvData.CSV11.find(row => 
                        row['Impact Category'] && row['Impact Category'].includes('Maintenance')
                    );
                    if (maintenanceData) {
                        yearEcologicalResults.OF2[category] = yearData.IRF2 * (maintenanceData[category] || 0);
                    }

                    // OF3: Flare Emission Impact in Impact Category X in year n = sum of IRF4 (for Emission X) * Emission Impact in Impact Category X(CSV9)
                    let emissionImpact = 0;
                    yearEcologicalResults.OF3_detailed[category] = {};
                    
                    Object.keys(yearData.emissionsIRF4).forEach(emissionType => {
                        // Find emission data in CSV9
                        const emissionData = findEmissionData(emissionType);
                        if (emissionData) {
                            const emissionValue = yearData.emissionsIRF4[emissionType] * (emissionData[category] || 0);
                            emissionImpact += emissionValue;
                            yearEcologicalResults.OF3_detailed[category][emissionType] = emissionValue;
                        } else {
                            console.warn(`No emission data found for ${emissionType} in category ${category}`);
                            yearEcologicalResults.OF3_detailed[category][emissionType] = 0;
                        }
                    });
                    yearEcologicalResults.OF3[category] = emissionImpact;
                });

                ecologicalResults.yearlyResults.push(yearEcologicalResults);
            });

            appState.flareResults.ecologicalResults = ecologicalResults;
        }

        // NEW: Calculate Flare economic results (OF4-OF8)
        function calculateFlareEconomicResults() {
            console.log("Starting economic Flare calculations...");
            
            if (!appState.csvData.CSV1) {
                console.error("Economic CSV data not available");
                showError("Economic background data could not be loaded.");
                return;
            }

            const flareResults = appState.flareResults;
            if (!flareResults || !flareResults.yearlyResults || flareResults.yearlyResults.length === 0) {
                console.error("No flare results available");
                return;
            }

            const years = appState.inputs.C;
            const economicResults = {
                yearlyResults: [],
                OF8: 0  // NPV
            };

            // Get country-specific maintenance costs from CSV1
            const countryData = appState.csvData.CSV1.find(row => row.Country === appState.inputs.D);
            const maintenanceFlare = countryData['Maintenance Flare [€/maintenance mix]'] || 250;

            // Calculate for each year
            flareResults.yearlyResults.forEach((yearData, index) => {
                const year = index + 1;
                const yearEconomicResults = {
                    year: year,
                    OF4: 0, // Flare maintenance costs
                    OF5: 0, // Flare electricity costs
                    OF6: 0  // Total flare costs
                };

                // OF4: Flare maintenance costs in year n = IRF2 * Maintenance Flare(CSV1)
                yearEconomicResults.OF4 = yearData.IRF2 * maintenanceFlare;

                // OF5: Flare electricity costs in year n = IRF3 * E
                yearEconomicResults.OF5 = yearData.IRF3 * appState.inputs.E;

                // OF6: Total costs in year n = OF4 + OF5
                yearEconomicResults.OF6 = yearEconomicResults.OF4 + yearEconomicResults.OF5;

                economicResults.yearlyResults.push(yearEconomicResults);
            });

            // OF8: NPV = - 0 + sum (OF6 / ((1+ I)^n))
            let npvSum = 0;
            economicResults.yearlyResults.forEach((yearResult, index) => {
                const n = index + 1;
                npvSum += yearResult.OF6 * -1 / Math.pow((1 + appState.inputs.I), n);
            });
            economicResults.OF8 = npvSum; // No initial investment (0)

            appState.flareResults.economicResults = economicResults;
        }        











        // NEW: Display Flare results in the interim results tab
        function displayInterimFlareResults(resultType) {
            if (!appState.flareResults || Object.keys(appState.flareResults).length === 0) {
                interimFlareResults.innerHTML = '<div class="loading">Flare results not available yet. Please perform calculations first.</div>';
                return;
            }

            // Create temporary containers to generate the HTML
            const tempFlareResultsContainer = document.createElement('div');
            const tempFlareEcologicalResultsContainer = document.createElement('div');
            const tempFlareEmissionResultsContainer = document.createElement('div');
            const tempFlareEconomicResultsContainer = document.createElement('div');
            
            // Temporarily replace containers to generate HTML
            document.body.appendChild(tempFlareResultsContainer);
            document.body.appendChild(tempFlareEcologicalResultsContainer);
            document.body.appendChild(tempFlareEmissionResultsContainer);
            document.body.appendChild(tempFlareEconomicResultsContainer);
            
            // Set temporary containers as targets for display functions
            window.tempFlareResultsContainer = tempFlareResultsContainer;
            window.tempFlareEcologicalResultsContainer = tempFlareEcologicalResultsContainer;
            window.tempFlareEmissionResultsContainer = tempFlareEmissionResultsContainer;
            window.tempFlareEconomicResultsContainer = tempFlareEconomicResultsContainer;
            
            // Generate the HTML content
            switch(resultType) {
                case 'flare-results':
                    displayFlareResults();
                    interimFlareResults.innerHTML = tempFlareResultsContainer.innerHTML;
                    break;
                case 'flare-ecological-results':
                    displayFlareEcologicalResults();
                    interimFlareResults.innerHTML = tempFlareEcologicalResultsContainer.innerHTML;
                    break;
                case 'flare-emission-results':
                    displayFlareEmissionResults();
                    interimFlareResults.innerHTML = tempFlareEmissionResultsContainer.innerHTML;
                    break;
                case 'flare-economic-results':
                    displayFlareEconomicResults();
                    interimFlareResults.innerHTML = tempFlareEconomicResultsContainer.innerHTML;
                    break;
                default:
                    interimFlareResults.innerHTML = '<div class="error">Unknown results type selected</div>';
            }
            
            // Clean up temporary containers
            document.body.removeChild(tempFlareResultsContainer);
            document.body.removeChild(tempFlareEcologicalResultsContainer);
            document.body.removeChild(tempFlareEmissionResultsContainer);
            document.body.removeChild(tempFlareEconomicResultsContainer);
            
            // Restore original containers
            delete window.tempFlareResultsContainer;
            delete window.tempFlareEcologicalResultsContainer;
            delete window.tempFlareEmissionResultsContainer;
            delete window.tempFlareEconomicResultsContainer;
        }

        // NEW: Display Flare Results (IRF1-IRF4)
        function displayFlareResults() {
            const container = window.tempFlareResultsContainer || document.getElementById('flare-results-container');
            const flareResults = appState.flareResults;
            
            if (!flareResults || !flareResults.yearlyResults || flareResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No flare results available</div>';
                return;
            }

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Flare Operation Results</div>
                </div>
                
                <div class="results-section">
                    <div class="section-subtitle">Table 1: Flare Operation Parameters (IRF1-IRF3)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>IRF1: Operating hours [h]</th>
                                <th>IRF2: Maintenance frequency</th>
                                <th>IRF3: Electricity consumption [kWh]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            flareResults.yearlyResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.IRF1.toFixed(0)}</td>
                        <td>${result.IRF2.toFixed(4)}</td>
                        <td>${result.IRF3.toFixed(2)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>

                <div class="results-section">
                    <div class="section-subtitle">Table 2: Flare Emissions (IRF4) [kg]</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Carbon monoxide</th>
                                <th>Nitrogen oxides</th>
                                <th>Formaldehyde</th>
                                <th>Methane slip</th>
                                <th>Particulate matter</th>
                                <th>Sulfur dioxide</th>
                                <th>Ammonia</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            flareResults.yearlyResults.forEach(result => {
                html += `
                    <tr>
                        <td>${result.year}</td>
                        <td>${result.emissionsIRF4.carbonMonoxide.toFixed(6)}</td>
                        <td>${result.emissionsIRF4.nitrogenOxides.toFixed(6)}</td>
                        <td>${result.emissionsIRF4.formaldehyde.toFixed(6)}</td>
                        <td>${result.emissionsIRF4.methaneSlop.toFixed(6)}</td>
                        <td>${result.emissionsIRF4.particulateMatter.toFixed(6)}</td>
                        <td>${result.emissionsIRF4.sulfurDioxide.toFixed(6)}</td>
                        <td>${result.emissionsIRF4.ammonia.toFixed(6)}</td>
                    </tr>
                `;
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
            
            container.innerHTML = html;
        }

        // NEW: Display Flare Ecological Results (OF1-OF3)
        function displayFlareEcologicalResults() {
            const container = window.tempFlareEcologicalResultsContainer || document.getElementById('flare-ecological-results-container');
            const ecologicalResults = appState.flareResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No ecological flare results available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            let html = '';

            // Tables for OF1 to OF3
            const resultTypes = [
                { id: 'OF1', title: 'OF1: Flare Energy Impact' },
                { id: 'OF2', title: 'OF2: Flare Maintenance Impact' },
                { id: 'OF3', title: 'OF3: Flare Emission Impact (Sum)' }
            ];

            resultTypes.forEach(resultType => {
                html += `
                    <div class="results-section">
                        <div class="section-subtitle">${resultType.title}</div>
                        <div class="impact-category-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Year</th>
                `;

                // Column headers for impact categories
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                    </tr>
                                </thead>
                                <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        const value = yearResult[resultType.id][category] || 0;
                        html += `<td>${value.toExponential(4)}</td>`;
                    });
                    
                    html += `</tr>`;
                });

                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // NEW: Display Flare Emission Results
        function displayFlareEmissionResults() {
            const container = window.tempFlareEmissionResultsContainer || document.getElementById('flare-emission-results-container');
            const ecologicalResults = appState.flareResults.ecologicalResults;
            
            if (!ecologicalResults || !ecologicalResults.yearlyResults || ecologicalResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No emission impact data available</div>';
                return;
            }

            const impactCategories = ecologicalResults.impactCategories;
            const emissionTypes = ['carbonMonoxide', 'nitrogenOxides', 'formaldehyde', 'methaneSlop', 'particulateMatter', 'sulfurDioxide', 'ammonia'];
            const emissionLabels = {
                'carbonMonoxide': 'Carbon Monoxide',
                'nitrogenOxides': 'Nitrogen Oxides', 
                'formaldehyde': 'Formaldehyde',
                'methaneSlop': 'Methane Slip',
                'particulateMatter': 'Particulate Matter',
                'sulfurDioxide': 'Sulfur Dioxide',
                'ammonia': 'Ammonia'
            };

            let html = `
                <div class="selected-engine">
                    <div class="engine-summary">Detailed Flare Emission Impacts</div>
                </div>
            `;

            // Table for Flare Emissions - One table per emission type with years as rows
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Flare Emissions - Detailed Impacts per Emission Type</div>
            `;

            emissionTypes.forEach(emissionType => {
                html += `
                    <div class="impact-category-table">
                        <h4>Emission: ${emissionLabels[emissionType]}</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Year</th>
                `;

                // Columns for each impact category
                impactCategories.forEach(category => {
                    html += `<th>${category}<br>${getUnitForCategory(category)}</th>`;
                });

                html += `
                                </tr>
                            </thead>
                            <tbody>
                `;

                // Rows for each year
                ecologicalResults.yearlyResults.forEach(yearResult => {
                    html += `<tr><td>${yearResult.year}</td>`;
                    
                    impactCategories.forEach(category => {
                        const value = yearResult.OF3_detailed[category][emissionType] || 0;
                        html += `<td>${value.toExponential(4)}</td>`;
                    });
                    
                    html += `</tr>`;
                });

                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            container.innerHTML = html;
        }

        // NEW: Display Flare Economic Results (OF4-OF8)
        function displayFlareEconomicResults() {
            const container = window.tempFlareEconomicResultsContainer || document.getElementById('flare-economic-results-container');
            const economicResults = appState.flareResults.economicResults;
            
            if (!economicResults || !economicResults.yearlyResults || economicResults.yearlyResults.length === 0) {
                container.innerHTML = '<div class="error">No economic flare results available</div>';
                return;
            }

            let html = '';

            // Display NPV at the top
            html += `
                <div class="economic-highlight ${economicResults.OF8 >= 0 ? 'highlight-green' : 'highlight-red'} npv-result">
                    <div>OF8: Net Present Value (NPV): €${economicResults.OF8.toFixed(2)}</div>
                </div>
            `;

            // Table: Economic results
            html += `
                <div class="results-section">
                    <div class="section-subtitle">Annual Flare Costs (OF4-OF6)</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>OF4: Flare maintenance costs [€]</th>
                                <th>OF5: Flare electricity costs [€]</th>
                                <th>OF6: Total flare costs [€]</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            economicResults.yearlyResults.forEach(yearResult => {
                html += `
                    <tr>
                        <td>${yearResult.year}</td>
                        <td>${yearResult.OF4.toFixed(2)}</td>
                        <td>${yearResult.OF5.toFixed(2)}</td>
                        <td>${yearResult.OF6.toFixed(2)}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;

            container.innerHTML = html;
        }


// Initialize charts storage if not exists
        if (!appState.charts) {
            appState.charts = {
                methaneChart: null,
                volumeChart: null,
                generalEcoBar: null,
                generalEcoLine: null,
                ecoDetailBar: null,
                ecoDetailLine: null,
                econPie: null
            };
        }


        // Show error message
        function showError(message) {
            alert(`Error: ${message}`);
        }
// Initialize charts storage if not exists
        if (!appState.charts) {
            appState.charts = {
                methaneChart: null,
                volumeChart: null,
                generalEcoBar: null,
                generalEcoLine: null,
                ecoDetailBar: null,
                ecoDetailLine: null,
                econPie: null
            };
        }
        
// Debug helper functions
        window.debugAppState = function() {
            console.log('=== AppState Debug ===');
            console.log('DFE Results:', appState.dfeResults);
            console.log('OEC Results:', appState.oecResults);
            console.log('SFR Results:', appState.sfrResults);
            console.log('Flare Results:', appState.flareResults);
            console.log('Charts:', appState.charts);
        };
        
        window.testGeneralResults = function() {
            console.log('Testing General Results...');
            updateGeneralResults();
        };
        
        window.testEcologicalResults = function() {
            console.log('Testing Ecological Results...');
            updateEcologicalResults();
        };
        
        window.testEconomicResults = function() {
            console.log('Testing Economic Results...');
            updateEconomicResults();
        };
        
        console.log('Landfill Gas Analysis Tool initialized. Debug functions available:');
        console.log('- debugAppState(): Show current application state');
        console.log('- testGeneralResults(): Test general results display');
        console.log('- testEcologicalResults(): Test ecological results display');
        console.log('- testEconomicResults(): Test economic results display');
