// CSV Daten URLs
const csvUrls = {
    csv1: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV1.csv',
    csv2: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV2.csv',
    csv3: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV3%20.csv',
    csv4: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV4.csv',
    csv5: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV5%20.csv',
    csv6: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV6%20.csv',
    csv7: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV7%20.csv',
    csv8: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV8%20.csv',
    csv9: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV9.csv',
    csv10: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV10.csv',
    csv11: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV11.csv',
    csv12: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV12.csv',
    csv13: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV13.csv',
    csv14: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV14.csv',
    csv15: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV15.csv',
    csv16: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV16%20.csv',
    csv17: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV17.csv',
    csv18: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV18%20.csv',
    csv19: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV19.csv',
    csv20: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV20%20.csv',
    csv21: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV21.csv',
    csv22: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV22.csv',
    csv23: 'https://raw.githubusercontent.com/Svenhardy/Low-Calorific-Landfillgas-Tool/refs/heads/main/CSV%20Files/CSV23.csv'
};

// Globale Variablen
let csvData = {};
let calculationResults = {};
let charts = {};
let intermediateResults = {
    general: {},
    dfe: {},
    oec: {},
    sfr: {},
    flare: {}
};

// Hauptinitialisierungsfunktion
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeInputHandlers();
    loadCSVData();
});

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            if (calculationResults.gasDevelopment) {
                if (tabId === 'gas-development') {
                    createGasDevelopmentCharts();
                } else if (tabId === 'general-results') {
                    createGeneralResultsCharts();
                } else if (tabId === 'ecological-results') {
                    updateEcologicalResults();
                } else if (tabId === 'economic-results') {
                    updateEconomicResults();
                } else if (tabId === 'verification') {
                    updateVerificationTables();
                }
            }
        });
    });
}

function initializeInputHandlers() {
    // Handler für manuelle Eingabe-Felder
    document.getElementById('time-horizon').addEventListener('change', updateManualInputFields);
    document.getElementById('manual-gas-volume').addEventListener('change', function() {
        toggleManualInput('gas-volume');
    });
    document.getElementById('manual-methane-content').addEventListener('change', function() {
        toggleManualInput('methane-content');
    });
    
    // Handler für Länder-auswahl
    document.getElementById('country').addEventListener('change', updateCountrySpecificValues);
    
    // Berechnungs-Button
    document.getElementById('calculate-btn').addEventListener('click', performCalculations);
    
    // Filter-Handler
    document.getElementById('technology-select').addEventListener('change', updateGasDevelopmentCharts);
    document.getElementById('impact-category').addEventListener('change', updateGeneralResultsCharts);
    document.getElementById('eco-technology').addEventListener('change', updateEcologicalResults);
    document.getElementById('eco-year').addEventListener('change', updateEcologicalResults);
    document.getElementById('eco-impact').addEventListener('change', updateEcologicalResults);
    document.getElementById('life-stage').addEventListener('change', updateEcologicalResults);
    document.getElementById('econ-technology').addEventListener('change', updateEconomicResults);
    document.getElementById('econ-year').addEventListener('change', updateEconomicResults);
    document.getElementById('verification-category').addEventListener('change', updateVerificationTables);
    
    // Initialisiere manuelle Eingabefelder
    updateManualInputFields();
}

function updateManualInputFields() {
    const years = parseInt(document.getElementById('time-horizon').value) || 10;
    
    // Gasmenge manuelle Felder
    const gasVolumeContainer = document.getElementById('gas-volume-years');
    gasVolumeContainer.innerHTML = '';
    for (let i = 1; i <= years; i++) {
        const defaultValue = (100 * Math.pow(0.95, i-1)).toFixed(2);
        gasVolumeContainer.innerHTML += `
            <div class="year-input-container">
                <label>Year ${i}:</label>
                <input type="number" class="year-input" data-year="${i}" data-type="gas-volume" step="0.1" min="0" value="${defaultValue}">
            </div>
        `;
    }
    
    // Methangehalt manuelle Felder
    const methaneContainer = document.getElementById('methane-content-years');
    methaneContainer.innerHTML = '';
    for (let i = 1; i <= years; i++) {
        const defaultValue = (50 * Math.pow(0.95, i-1)).toFixed(2);
        methaneContainer.innerHTML += `
            <div class="year-input-container">
                <label>Year ${i}:</label>
                <input type="number" class="year-input" data-year="${i}" data-type="methane-content" step="0.1" min="0" max="100" value="${defaultValue}">
            </div>
        `;
    }
}

function toggleManualInput(type) {
    const checkbox = document.getElementById(`manual-${type}`);
    const manualFields = document.getElementById(`manual-${type}-fields`);
    
    if (checkbox.checked) {
        manualFields.style.display = 'block';
    } else {
        manualFields.style.display = 'none';
    }
}

function updateCountrySpecificValues() {
    const country = document.getElementById('country').value;
    
    if (csvData.csv1 && csvData.csv1.length > 0) {
        const countryData = csvData.csv1.find(row => row.Country === country);
        if (countryData) {
            if (!document.getElementById('manual-electricity-price').checked) {
                document.getElementById('electricity-price').value = parseFloat(countryData['Energy Price [€/kWh]']) || 0.2;
            }
            if (!document.getElementById('manual-thermal-price').checked) {
                document.getElementById('thermal-price').value = parseFloat(countryData['Energy Price th. [€/kWh]']) || 0.3;
            }
            if (!document.getElementById('manual-depreciation').checked) {
                document.getElementById('depreciation-period').value = parseInt(countryData['Depreciation [a]']) || 3;
            }
            if (!document.getElementById('manual-tax-rate').checked) {
                document.getElementById('tax-rate').value = parseFloat(countryData['Tax rate [%]']) || 20;
            }
        }
    }
}

async function loadCSVData() {
    try {
        document.getElementById('loading-message').style.display = 'block';
        
        for (const [key, url] of Object.entries(csvUrls)) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
                const csvText = await response.text();
                csvData[key] = parseCSV(csvText);
                console.log(`Loaded ${key} successfully`);
            } catch (error) {
                console.error(`Error loading ${key}:`, error);
                csvData[key] = [];
            }
        }
        
        console.log('All CSV data loaded:', csvData);
        initializeDropdowns();
        updateCountrySpecificValues();
        document.getElementById('loading-message').style.display = 'none';
    } catch (error) {
        console.error('Error loading CSV data:', error);
        document.getElementById('loading-message').style.display = 'none';
        alert('Error loading data. Please check your internet connection and try again.');
    }
}

function parseCSV(csvText) {
    if (csvText.charCodeAt(0) === 0xFEFF) {
        csvText = csvText.substring(1);
    }
    
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(';').map(header => header.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';').map(value => {
            let cleaned = value.replace(/"/g, '').trim();
            cleaned = cleaned.replace(',', '.');
            return cleaned;
        });
        
        const row = {};
        headers.forEach((header, index) => {
            let value = values[index] || '';
            const numValue = parseFloat(value);
            if (!isNaN(numValue) && value !== '') {
                row[header] = numValue;
            } else {
                row[header] = value;
            }
        });
        data.push(row);
    }
    
    return data;
}

function initializeDropdowns() {
    // Impact Category Dropdown
    const impactDropdown = document.getElementById('impact-category');
    const ecoImpactDropdown = document.getElementById('eco-impact');
    
    if (csvData.csv10 && csvData.csv10.length > 0) {
        const impactCategories = Object.keys(csvData.csv10[0]).filter(key => 
            key !== 'Impact Category' && key !== 'Unit' && key !== '' && !key.includes('﻿')
        );
        
        impactCategories.forEach(category => {
            if (category && category.trim() !== '') {
                [impactDropdown, ecoImpactDropdown].forEach(dropdown => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    dropdown.appendChild(option);
                });
            }
        });
    }
    
    updateYearDropdowns();
}

function updateYearDropdowns() {
    const years = parseInt(document.getElementById('time-horizon').value) || 10;
    const yearDropdowns = [
        document.getElementById('eco-year'),
        document.getElementById('econ-year')
    ];
    
    yearDropdowns.forEach(dropdown => {
        if (dropdown) {
            const allOption = dropdown.querySelector('option[value="all"]');
            dropdown.innerHTML = '';
            if (allOption) dropdown.appendChild(allOption);
            
            for (let i = 1; i <= years; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `Year ${i}`;
                dropdown.appendChild(option);
            }
        }
    });
}

function getManualInputValues(type) {
    const inputs = document.querySelectorAll(`.year-input[data-type="${type}"]`);
    const values = {};
    inputs.forEach(input => {
        const year = parseInt(input.getAttribute('data-year'));
        values[year] = parseFloat(input.value) || 0;
    });
    return values;
}

function performCalculations() {
    try {
        document.getElementById('loading-message').style.display = 'block';
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('error-message').textContent = '';
        
        calculateGasDevelopment();
        
        // Prüfe Motorkapazitäten
        const hasValidEngine = checkEngineCapacities();
        if (!hasValidEngine) {
            document.getElementById('error-message').textContent = 'Für einen oder mehrere Verwertungstechnologien steht keine passende Motorgröße zur Verfügung. Bitte passen Sie die Input-Werte A und B an.';
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('loading-message').style.display = 'none';
            return;
        }
        
        calculateDFE();
        calculateOEC();
        calculateSFR();
        calculateFlare();
        
        updateYearDropdowns();
        visualizeResults();
        document.getElementById('loading-message').style.display = 'none';
        document.querySelector('.tab[data-tab="general-results"]').click();
        
    } catch (error) {
        console.error('Error during calculations:', error);
        document.getElementById('loading-message').style.display = 'none';
        document.getElementById('error-message').textContent = 'Error during calculations. Please check your input values and try again.';
        document.getElementById('error-message').style.display = 'block';
    }
}

function checkEngineCapacities() {
    const initialEnergy = calculationResults.gasDevelopment.energyContent[0];
    const engineSizes = [250, 500, 750];
    
    for (const size of engineSizes) {
        if (initialEnergy <= size * 1.2) {
            return true;
        }
    }
    return false;
}

function calculateGasDevelopment() {
    const years = parseInt(document.getElementById('time-horizon').value) || 10;
    const manualGasVolume = document.getElementById('manual-gas-volume').checked;
    const manualMethaneContent = document.getElementById('manual-methane-content').checked;
    
    const manualGasValues = manualGasVolume ? getManualInputValues('gas-volume') : null;
    const manualMethaneValues = manualMethaneContent ? getManualInputValues('methane-content') : null;
    
    const initialVolume = parseFloat(document.getElementById('gas-volume').value) || 100;
    const initialMethane = parseFloat(document.getElementById('methane-content').value) || 50;
    
    calculationResults.gasDevelopment = {
        volume: [],
        methaneContent: [],
        energyContent: []
    };
    
    intermediateResults.general = {
        IR1: [], // Methangehalt Entwicklung
        IR2: [], // Gasvolumen Entwicklung
        IR3: []  // Energiegehalt Entwicklung
    };
    
    // Heizwert aus CSV2
    let calorificValueCH4 = 9.97;
    if (csvData.csv2 && csvData.csv2.length > 0) {
        const calorificRow = csvData.csv2.find(row => row['Calorific Value CH4 [kW/m^3]'] !== undefined);
        if (calorificRow) {
            calorificValueCH4 = parseFloat(calorificRow['Calorific Value CH4 [kW/m^3]']) || 9.97;
        }
    }
    
    const operatingHours = parseFloat(document.getElementById('operating-hours').value) || 8000;
    
    for (let year = 1; year <= years; year++) {
        let volume, methane;
        
        if (manualGasVolume && manualGasValues[year]) {
            volume = manualGasValues[year];
        } else {
            volume = initialVolume * Math.pow(0.95, year - 1);
        }
        
        if (manualMethaneContent && manualMethaneValues[year]) {
            methane = manualMethaneValues[year];
        } else {
            methane = initialMethane * Math.pow(0.95, year - 1);
        }
        
        const energyContent = (methane / 100) * volume * calorificValueCH4;
        
        calculationResults.gasDevelopment.volume.push(volume);
        calculationResults.gasDevelopment.methaneContent.push(methane);
        calculationResults.gasDevelopment.energyContent.push(energyContent);
        
        intermediateResults.general.IR1.push(methane);
        intermediateResults.general.IR2.push(volume);
        intermediateResults.general.IR3.push(energyContent);
    }
}

function calculateDFE() {
    const years = calculationResults.gasDevelopment.volume.length;
    const discountRate = (parseFloat(document.getElementById('discount-rate').value) || 4) / 100;
    const taxRate = (parseFloat(document.getElementById('tax-rate').value) || 20) / 100;
    const depreciationPeriod = parseInt(document.getElementById('depreciation-period').value) || 3;
    const electricityPrice = parseFloat(document.getElementById('electricity-price').value) || 0.2;
    const thermalPrice = parseFloat(document.getElementById('thermal-price').value) || 0.3;
    const operatingHours = parseFloat(document.getElementById('operating-hours').value) || 8000;
    const fuelType = document.getElementById('fuel-type').value;
    
    // Motordaten aus CSV3
    const engineData = csvData.csv3 || [];
    let selectedEngine = null;
    
    for (const engine of engineData) {
        const engineSize = parseFloat(engine['Engine Size [kWel]']);
        if (engineSize && calculationResults.gasDevelopment.energyContent[0] <= engineSize * 1.2) {
            selectedEngine = engine;
            break;
        }
    }
    
    if (!selectedEngine) {
        selectedEngine = engineData[engineData.length - 1] || {
            'Engine Size [kWel]': 750,
            'Fuel Consumption [L/h]': 4,
            'Engine efficency el. [%]': 60,
            'Engine efficency th. [%]': 60,
            'Production Factor': 1.2,
            'Price Factor': 1.2
        };
    }
    
    // Preisdaten aus CSV12
    const priceData = csvData.csv12 && csvData.csv12.length > 0 ? csvData.csv12[0] : {};
    const basePrice = parseFloat(priceData['Dual Fuel Engine [€/Unit]']) || 50000;
    const investmentCost = basePrice * (parseFloat(selectedEngine['Price Factor']) || 1);
    
    // Initialisiere Zwischenergebnisse
    intermediateResults.dfe = {
        IR4: [], IR5: [], IR6: [], IR7: [], IR8: 0, IR9: [],
        IR10: [], IR11: [], IR12: [], IR13: [], IR14: [],
        IR15: {}, IR16: [], IR17: []
    };
    
    let totalProcessedGas = 0;
    let npv = -investmentCost;
    
    for (let year = 0; year < years; year++) {
        const energyContent = calculationResults.gasDevelopment.energyContent[year];
        const engineSize = parseFloat(selectedEngine['Engine Size [kWel]']) || 750;
        const engineEfficiency = parseFloat(selectedEngine['Engine efficency el. [%]']) || 50;
        
        const energeticLoad = energyContent * (engineEfficiency / 100);
        const relativeLoad = (energeticLoad / engineSize) * 100;
        const minLoad = 20;
        const canUseEngine = relativeLoad >= minLoad && relativeLoad <= 100;
        
        // Zwischenergebnisse speichern
        intermediateResults.dfe.IR4.push(energyContent);
        intermediateResults.dfe.IR5.push(energeticLoad);
        intermediateResults.dfe.IR6.push(relativeLoad);
        intermediateResults.dfe.IR7.push(canUseEngine ? 1 : 0);
        
        if (canUseEngine) {
            totalProcessedGas += calculationResults.gasDevelopment.volume[year] * operatingHours;
            
            const thermalEfficiency = parseFloat(selectedEngine['Engine efficency th. [%]']) || 50;
            const thermalEnergy = energyContent * (thermalEfficiency / 100) * operatingHours;
            const electricalEnergy = energeticLoad * operatingHours;
            
            intermediateResults.dfe.IR16.push(thermalEnergy);
            intermediateResults.dfe.IR17.push(electricalEnergy);
            
            const thermalRevenue = thermalEnergy * thermalPrice;
            const electricalRevenue = electricalEnergy * electricityPrice;
            const totalRevenue = thermalRevenue + electricalRevenue;
            
            // Betriebskosten
            const fuelConsumption = parseFloat(selectedEngine['Fuel Consumption [L/h]']) || 4;
            const fuelCostPerLiter = fuelType === 'Diesel' ? 
                (parseFloat(priceData['Diesel']) || 2) : 
                (parseFloat(priceData['Pilot Fuel [€/L]']) || 4);
            const fuelCost = fuelConsumption * operatingHours * fuelCostPerLiter;
            
            const operatingCosts = fuelCost + (totalRevenue * 0.3);
            
            // Cashflow Berechnung
            const depreciation = year < depreciationPeriod ? investmentCost / depreciationPeriod : 0;
            const profitBeforeTax = totalRevenue - operatingCosts - depreciation;
            const tax = Math.max(0, profitBeforeTax) * taxRate;
            const netProfit = profitBeforeTax - tax;
            const cashFlow = netProfit + depreciation;
            
            npv += cashFlow / Math.pow(1 + discountRate, year);
        } else {
            intermediateResults.dfe.IR16.push(0);
            intermediateResults.dfe.IR17.push(0);
            intermediateResults.dfe.IR9.push(calculationResults.gasDevelopment.volume[year] * operatingHours);
        }
    }
    
    intermediateResults.dfe.IR8 = totalProcessedGas;
    
    calculationResults.dfe = {
        npv: npv,
        investment: investmentCost,
        selectedEngine: selectedEngine,
        processedGas: totalProcessedGas
    };
}

function calculateOEC() {
    const years = calculationResults.gasDevelopment.volume.length;
    const discountRate = (parseFloat(document.getElementById('discount-rate').value) || 4) / 100;
    const taxRate = (parseFloat(document.getElementById('tax-rate').value) || 20) / 100;
    const depreciationPeriod = parseInt(document.getElementById('depreciation-period').value) || 3;
    const electricityPrice = parseFloat(document.getElementById('electricity-price').value) || 0.2;
    const thermalPrice = parseFloat(document.getElementById('thermal-price').value) || 0.3;
    const operatingHours = parseFloat(document.getElementById('operating-hours').value) || 8000;
    
    // Motordaten aus CSV13
    const engineData = csvData.csv13 || [];
    let selectedEngine = null;
    
    for (const engine of engineData) {
        const engineSize = parseFloat(engine['Engine Size [kWel]']);
        if (engineSize && calculationResults.gasDevelopment.energyContent[0] <= engineSize * 1.2) {
            selectedEngine = engine;
            break;
        }
    }
    
    if (!selectedEngine) {
        selectedEngine = engineData[engineData.length - 1] || {
            'Engine Size [kWel]': 750,
            'Oxygen consumption factor': 1.2,
            'Engine efficency el. [%]': 60,
            'Engine efficency th. [%]': 60,
            'Production Factor': 1.2,
            'Price Factor': 1.2
        };
    }
    
    // Preisdaten aus CSV12
    const priceData = csvData.csv12 && csvData.csv12.length > 0 ? csvData.csv12[0] : {};
    const basePrice = parseFloat(priceData['Oxygen Enrichment Engine [€/Unit]']) || 50000;
    const investmentCost = basePrice * (parseFloat(selectedEngine['Price Factor']) || 1);
    
    // Initialisiere Zwischenergebnisse
    intermediateResults.oec = {
        IRO4: [], IRO5: [], IRO6: [], IRO7: 0, IRO8: [],
        IRO9: [], IRO10: [], IRO11: [], IRO12: [], IRO13: [],
        IRO14: {}, IRO15: [], IRO16: []
    };
    
    let totalProcessedGas = 0;
    let npv = -investmentCost;
    
    for (let year = 0; year < years; year++) {
        const energyContent = calculationResults.gasDevelopment.energyContent[year];
        const engineSize = parseFloat(selectedEngine['Engine Size [kWel]']) || 750;
        const engineEfficiency = parseFloat(selectedEngine['Engine efficency el. [%]']) || 50;
        
        const energeticLoad = energyContent * (engineEfficiency / 100);
        const relativeLoad = (energeticLoad / engineSize) * 100;
        const minLoad = 20;
        const canUseEngine = relativeLoad >= minLoad && relativeLoad <= 100;
        
        // Zwischenergebnisse speichern
        intermediateResults.oec.IRO4.push(energyContent);
        intermediateResults.oec.IRO5.push(energeticLoad);
        intermediateResults.oec.IRO6.push(canUseEngine ? 1 : 0);
        
        if (canUseEngine) {
            totalProcessedGas += calculationResults.gasDevelopment.volume[year] * operatingHours;
            
            const thermalEfficiency = parseFloat(selectedEngine['Engine efficency th. [%]']) || 50;
            const thermalEnergy = energyContent * (thermalEfficiency / 100) * operatingHours;
            const electricalEnergy = energeticLoad * operatingHours;
            
            intermediateResults.oec.IRO15.push(thermalEnergy);
            intermediateResults.oec.IRO16.push(electricalEnergy);
            
            const thermalRevenue = thermalEnergy * thermalPrice;
            const electricalRevenue = electricalEnergy * electricityPrice;
            const totalRevenue = thermalRevenue + electricalRevenue;
            
            // Sauerstoffkosten
            const oxygenConsumption = parseFloat(selectedEngine['Oxygen consumption factor']) || 1;
            const oxygenPrice = parseFloat(priceData['Oxygen [€/m^3]']) || 3;
            const oxygenCost = oxygenConsumption * operatingHours * oxygenPrice;
            
            const operatingCosts = oxygenCost + (totalRevenue * 0.3);
            
            // Cashflow Berechnung
            const depreciation = year < depreciationPeriod ? investmentCost / depreciationPeriod : 0;
            const profitBeforeTax = totalRevenue - operatingCosts - depreciation;
            const tax = Math.max(0, profitBeforeTax) * taxRate;
            const netProfit = profitBeforeTax - tax;
            const cashFlow = netProfit + depreciation;
            
            npv += cashFlow / Math.pow(1 + discountRate, year);
        } else {
            intermediateResults.oec.IRO15.push(0);
            intermediateResults.oec.IRO16.push(0);
            intermediateResults.oec.IRO8.push(calculationResults.gasDevelopment.volume[year] * operatingHours);
        }
    }
    
    intermediateResults.oec.IRO7 = totalProcessedGas;
    
    calculationResults.oec = {
        npv: npv,
        investment: investmentCost,
        selectedEngine: selectedEngine,
        processedGas: totalProcessedGas
    };
}

function calculateSFR() {
    const years = calculationResults.gasDevelopment.volume.length;
    const discountRate = (parseFloat(document.getElementById('discount-rate').value) || 4) / 100;
    const taxRate = (parseFloat(document.getElementById('tax-rate').value) || 20) / 100;
    const depreciationPeriod = parseInt(document.getElementById('depreciation-period').value) || 3;
    const electricityPrice = parseFloat(document.getElementById('electricity-price').value) || 0.2;
    const operatingHours = parseFloat(document.getElementById('operating-hours').value) || 8000;
    const chpAvailable = document.getElementById('chp-available').value === 'yes';
    
    // SFR Daten aus CSV17
    const sfrData = csvData.csv17 || [];
    let selectedSFR = null;
    
    for (const unit of sfrData) {
        const maxInput = parseFloat(unit['max. energetic input value [kW]']);
        if (maxInput && calculationResults.gasDevelopment.energyContent[0] <= maxInput) {
            selectedSFR = unit;
            break;
        }
    }
    
    if (!selectedSFR) {
        selectedSFR = sfrData[sfrData.length - 1] || {
            'Output Gas quality [% CH4]': 50,
            'max. energetic input value [kW]': 1500,
            'Production Factor': 1.2,
            'Price Factor': 1.2
        };
    }
    
    // CHP Daten aus CSV18
    const chpData = csvData.csv18 || [];
    let selectedCHP = null;
    
    for (const engine of chpData) {
        const engineSize = parseFloat(engine['Engine Size [kWel]']);
        if (engineSize && calculationResults.gasDevelopment.energyContent[0] <= engineSize * 1.2) {
            selectedCHP = engine;
            break;
        }
    }
    
    // Preisdaten aus CSV12
    const priceData = csvData.csv12 && csvData.csv12.length > 0 ? csvData.csv12[0] : {};
    const sfrBasePrice = parseFloat(priceData['SFR [€/Unit]']) || 50000;
    const chpBasePrice = parseFloat(priceData['CHP Unit'] || priceData['Dual Fuel Engine [€/Unit]']) || 50000;
    
    const sfrInvestment = sfrBasePrice * (parseFloat(selectedSFR['Price Factor']) || 1);
    const chpInvestment = chpAvailable ? chpBasePrice * (parseFloat(selectedCHP?.['CHP Production Factor'] || 1)) : 0;
    const totalInvestment = sfrInvestment + chpInvestment;
    
    // Initialisiere Zwischenergebnisse
    intermediateResults.sfr = {
        IRS4: [], IRS5: [], IRS6: 0, IRS7: [], IRS8: [],
        IRS9: [], IRS10: [], IRS11: [], IRS12: 0,
        IRS13: [], IRS14: [], IRS15: [], IRS16: [],
        IRS17: [], IRS18: [], IRS19: [], IRS20: [],
        IRS21: {}, IRS22: [], IRS23: []
    };
    
    let totalProcessedGas = 0;
    let npv = -totalInvestment;
    
    for (let year = 0; year < years; year++) {
        const energyContent = calculationResults.gasDevelopment.energyContent[year];
        const maxInput = parseFloat(selectedSFR['max. energetic input value [kW]']) || 1500;
        
        const sfrLoad = (energyContent / maxInput) * 100;
        const canUseSFR = sfrLoad >= 10 && sfrLoad <= 100;
        
        // Zwischenergebnisse speichern
        intermediateResults.sfr.IRS4.push(sfrLoad);
        intermediateResults.sfr.IRS5.push(canUseSFR ? 1 : 0);
        
        if (canUseSFR && selectedCHP) {
            totalProcessedGas += calculationResults.gasDevelopment.volume[year] * operatingHours;
            
            const outputGasQuality = parseFloat(selectedSFR['Output Gas quality [% CH4]']) || 50;
            const methaneContent = calculationResults.gasDevelopment.methaneContent[year];
            const processedGas = ((methaneContent / outputGasQuality) * calculationResults.gasDevelopment.volume[year]);
            
            intermediateResults.sfr.IRS7.push(processedGas);
            intermediateResults.sfr.IRS8.push(processedGas * outputGasQuality / 100 * 9.97); // Energiegehalt
            
            // CHP Berechnungen
            const chpEngineSize = parseFloat(selectedCHP['Engine Size [kWel]']) || 750;
            const chpEfficiency = parseFloat(selectedCHP['Engine efficency el. [%]']) || 50;
            const chpEnergeticLoad = intermediateResults.sfr.IRS8[year] * (chpEfficiency / 100);
            const chpRelativeLoad = (chpEnergeticLoad / chpEngineSize) * 100;
            const canUseCHP = chpRelativeLoad >= 20 && chpRelativeLoad <= 100;
            
            intermediateResults.sfr.IRS9.push(chpEnergeticLoad);
            intermediateResults.sfr.IRS10.push(chpRelativeLoad);
            intermediateResults.sfr.IRS11.push(canUseCHP ? 1 : 0);
            
            if (canUseCHP) {
                const thermalEfficiency = parseFloat(selectedCHP['Engine efficency th. [%]']) || 50;
                const thermalEnergy = intermediateResults.sfr.IRS8[year] * (thermalEfficiency / 100) * operatingHours;
                const electricalEnergy = chpEnergeticLoad * operatingHours;
                
                intermediateResults.sfr.IRS22.push(thermalEnergy);
                intermediateResults.sfr.IRS23.push(electricalEnergy);
                
                const thermalRevenue = thermalEnergy * (parseFloat(document.getElementById('thermal-price').value) || 0.3);
                const electricalRevenue = electricalEnergy * electricityPrice;
                const totalRevenue = thermalRevenue + electricalRevenue;
                
                // Betriebskosten
                const chemicalConsumption = 10; // Beispielwert
                const chemicalPrice = parseFloat(priceData['Chemical SFR [€/L]']) || 5;
                const chemicalCost = chemicalConsumption * operatingHours * chemicalPrice;
                
                const operatingCosts = chemicalCost + (totalRevenue * 0.4);
                
                // Cashflow Berechnung
                const depreciation = year < depreciationPeriod ? totalInvestment / depreciationPeriod : 0;
                const profitBeforeTax = totalRevenue - operatingCosts - depreciation;
                const tax = Math.max(0, profitBeforeTax) * taxRate;
                const netProfit = profitBeforeTax - tax;
                const cashFlow = netProfit + depreciation;
                
                npv += cashFlow / Math.pow(1 + discountRate, year);
            }
        }
    }
    
    intermediateResults.sfr.IRS6 = totalProcessedGas;
    
    calculationResults.sfr = {
        npv: npv,
        investment: totalInvestment,
        selectedSFR: selectedSFR,
        selectedCHP: selectedCHP,
        processedGas: totalProcessedGas,
        chpAvailable: chpAvailable
    };
}

function calculateFlare() {
    const years = calculationResults.gasDevelopment.volume.length;
    const discountRate = (parseFloat(document.getElementById('discount-rate').value) || 4) / 100;
    const taxRate = (parseFloat(document.getElementById('tax-rate').value) || 20) / 100;
    const electricityPrice = parseFloat(document.getElementById('electricity-price').value) || 0.2;
    const operatingHours = parseFloat(document.getElementById('operating-hours').value) || 8000;
    
    // Preisdaten aus CSV12
    const priceData = csvData.csv12 && csvData.csv12.length > 0 ? csvData.csv12[0] : {};
    const investmentCost = parseFloat(priceData['Maintenance Flare [€/maintenance mix]']) || 10000;
    
    let npv = -investmentCost;
    
    for (let year = 0; year < years; year++) {
        // Nur Kosten für Fackelbetrieb
        const maintenanceCost = 5000 * Math.pow(0.95, year);
        const electricityCost = 1000 * Math.pow(0.95, year);
        const totalCost = maintenanceCost + electricityCost;
        
        // Cashflow Berechnung (nur negative Cashflows)
        const depreciation = year < 5 ? investmentCost / 5 : 0;
        const profitBeforeTax = -totalCost - depreciation;
        const tax = profitBeforeTax > 0 ? profitBeforeTax * taxRate : 0;
        const netProfit = profitBeforeTax - tax;
        const cashFlow = netProfit + depreciation;
        
        npv += cashFlow / Math.pow(1 + discountRate, year);
    }
    
    calculationResults.flare = {
        npv: npv,
        investment: investmentCost
    };
}

function visualizeResults() {
    createGasDevelopmentCharts();
    createGeneralResultsCharts();
    updateEcologicalResults();
    updateEconomicResults();
    updateVerificationTables();
}

function createGasDevelopmentCharts() {
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    const selectedTechnology = document.getElementById('technology-select').value;
    
    if (charts.gasVolume) charts.gasVolume.destroy();
    if (charts.methaneContent) charts.methaneContent.destroy();
    
    // Bestimme Betriebszeiträume
    let operationPeriods = [];
    if (selectedTechnology !== 'general') {
        const techData = intermediateResults[selectedTechnology];
        if (techData) {
            const operationArray = selectedTechnology === 'dfe' ? techData.IR7 : 
                                 selectedTechnology === 'oec' ? techData.IRO6 : 
                                 selectedTechnology === 'sfr' ? techData.IRS5 : [];
            
            operationArray.forEach((canOperate, index) => {
                if (canOperate === 1) {
                    operationPeriods.push(index + 1);
                }
            });
        }
    }
    
    // Chart für Gasvolumen mit Hervorhebungen
    const volumeCtx = document.getElementById('gas-volume-chart').getContext('2d');
    charts.gasVolume = new Chart(volumeCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Gas Volume [m³/h]',
                    data: calculationResults.gasDevelopment.volume,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Operation Period',
                    data: years.map(year => operationPeriods.includes(year) ? calculationResults.gasDevelopment.volume[year-1] : null),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    pointRadius: 6,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Gas Volume Development - ${selectedTechnology.toUpperCase()} Operation Highlighted`
                }
            },
            scales: {
                x: { title: { display: true, text: 'Year' } },
                y: { title: { display: true, text: 'Gas Volume [m³/h]' } }
            }
        }
    });
    
    // Chart für Methangehalt mit Hervorhebungen
    const methaneCtx = document.getElementById('methane-content-chart').getContext('2d');
    charts.methaneContent = new Chart(methaneCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Methane Content [%]',
                    data: calculationResults.gasDevelopment.methaneContent,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.1,
                    fill: true
                },
                {
                    label: 'Operation Period',
                    data: years.map(year => operationPeriods.includes(year) ? calculationResults.gasDevelopment.methaneContent[year-1] : null),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    pointRadius: 6,
                    showLine: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Methane Content Development - ${selectedTechnology.toUpperCase()} Operation Highlighted`
                }
            },
            scales: {
                x: { title: { display: true, text: 'Year' } },
                y: { title: { display: true, text: 'Methane Content [%]' } }
            }
        }
    });
}

function createGeneralResultsCharts() {
    const selectedImpactCategory = document.getElementById('impact-category').value;
    
    if (!selectedImpactCategory) return;
    
    // Lade Einheit für die Wirkungskategorie
    let unit = '';
    if (csvData.csv10 && csvData.csv10.length > 0) {
        const unitRow = csvData.csv10.find(row => row['Impact Category'] === 'Unit');
        if (unitRow) {
            unit = unitRow[selectedImpactCategory] || '';
        }
    }
    
    // Berechne ökologische Auswirkungen für jede Technologie
    const impactValues = calculateEnvironmentalImpacts(selectedImpactCategory);
    
    if (charts.ecologicalBar) charts.ecologicalBar.destroy();
    if (charts.ecologicalLine) charts.ecologicalLine.destroy();
    
    // Balkendiagramm
    const barCtx = document.getElementById('ecological-bar-chart').getContext('2d');
    charts.ecologicalBar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['DFE', 'OEC', 'SFR', 'Flare'],
            datasets: [{
                label: `${selectedImpactCategory} [${unit}]`,
                data: [
                    impactValues.dfe || 0,
                    impactValues.oec || 0,
                    impactValues.sfr || 0,
                    impactValues.flare || 0
                ],
                backgroundColor: [
                    'rgba(255, 107, 107, 0.7)',
                    'rgba(78, 205, 196, 0.7)',
                    'rgba(69, 183, 209, 0.7)',
                    'rgba(150, 206, 180, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Environmental Impact - ${selectedImpactCategory}`
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: unit
                    }
                }
            }
        }
    });
    
    // Liniendiagramm über Zeit
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    const lineCtx = document.getElementById('ecological-line-chart').getContext('2d');
    
    // Berechne jahresspezifische Werte
    const yearlyImpacts = calculateYearlyEnvironmentalImpacts(selectedImpactCategory);
    
    charts.ecologicalLine = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: `DFE [${unit}]`,
                    data: yearlyImpacts.dfe,
                    borderColor: 'rgb(255, 107, 107)',
                    tension: 0.1
                },
                {
                    label: `OEC [${unit}]`,
                    data: yearlyImpacts.oec,
                    borderColor: 'rgb(78, 205, 196)',
                    tension: 0.1
                },
                {
                    label: `SFR [${unit}]`,
                    data: yearlyImpacts.sfr,
                    borderColor: 'rgb(69, 183, 209)',
                    tension: 0.1
                },
                {
                    label: `Flare [${unit}]`,
                    data: yearlyImpacts.flare,
                    borderColor: 'rgb(150, 206, 180)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Environmental Impact Development - ${selectedImpactCategory}`
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: unit
                    }
                }
            }
        }
    });
    
    updateNPVDisplay();
}

function calculateEnvironmentalImpacts(impactCategory) {
    const country = document.getElementById('country').value;
    const energySource = document.getElementById('energy-source').value;
    
    let baseImpact = 1;
    
    if (csvData.csv10 && csvData.csv10.length > 0) {
        let impactData;
        if (energySource === 'Renewable') {
            impactData = csvData.csv10.find(row => row['Impact Category'] === 'Renewable');
        } else {
            impactData = csvData.csv10.find(row => row['Impact Category'] === country);
        }
        
        if (impactData && impactData[impactCategory]) {
            baseImpact = parseFloat(impactData[impactCategory]);
        }
    }
    
    // Technologie-spezifische Faktoren
    return {
        dfe: baseImpact * 0.8,
        oec: baseImpact * 0.9,
        sfr: baseImpact * 0.7,
        flare: baseImpact * 1.2
    };
}

function calculateYearlyEnvironmentalImpacts(impactCategory) {
    const years = calculationResults.gasDevelopment.volume.length;
    const baseImpacts = calculateEnvironmentalImpacts(impactCategory);
    
    const yearly = { dfe: [], oec: [], sfr: [], flare: [] };
    
    for (let year = 0; year < years; year++) {
        const degradation = Math.pow(0.95, year);
        yearly.dfe.push(baseImpacts.dfe * degradation);
        yearly.oec.push(baseImpacts.oec * degradation);
        yearly.sfr.push(baseImpacts.sfr * degradation);
        yearly.flare.push(baseImpacts.flare * degradation);
    }
    
    return yearly;
}

function updateNPVDisplay() {
    const formatCurrency = (value) => {
        if (value === undefined || value === null || isNaN(value)) return '-';
        return `€${value.toLocaleString('de-DE', {maximumFractionDigits: 0})}`;
    };
    
    document.getElementById('npv-dfe').textContent = formatCurrency(calculationResults.dfe?.npv);
    document.getElementById('npv-oec').textContent = formatCurrency(calculationResults.oec?.npv);
    document.getElementById('npv-sfr').textContent = formatCurrency(calculationResults.sfr?.npv);
    document.getElementById('npv-flare').textContent = formatCurrency(calculationResults.flare?.npv);
    
    // Setze Farben basierend auf NPV-Wert
    const npvElements = {
        'npv-dfe': calculationResults.dfe?.npv,
        'npv-oec': calculationResults.oec?.npv,
        'npv-sfr': calculationResults.sfr?.npv,
        'npv-flare': calculationResults.flare?.npv
    };
    
    Object.entries(npvElements).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('positive', 'negative');
            if (value !== undefined && value !== null && !isNaN(value)) {
                element.classList.add(value >= 0 ? 'positive' : 'negative');
            }
        }
    });
}

function updateGasDevelopmentCharts() {
    createGasDevelopmentCharts();
}

function updateGeneralResultsCharts() {
    createGeneralResultsCharts();
}

function updateEcologicalResults() {
    const technology = document.getElementById('eco-technology').value;
    const selectedYear = document.getElementById('eco-year').value;
    const impactCategory = document.getElementById('eco-impact').value;
    const lifeStage = document.getElementById('life-stage').value;
    
    if (!impactCategory) return;
    
    // Lade Einheit
    let unit = '';
    if (csvData.csv10 && csvData.csv10.length > 0) {
        const unitRow = csvData.csv10.find(row => row['Impact Category'] === 'Unit');
        if (unitRow) {
            unit = unitRow[impactCategory] || '';
        }
    }
    
    // Aktualisiere Life-Stage Dropdown basierend auf Technologie
    updateLifeStageDropdown(technology);
    
    // Berechne detaillierte ökologische Auswirkungen
    const detailedImpacts = calculateDetailedEnvironmentalImpacts(technology, impactCategory, lifeStage, selectedYear);
    
    if (charts.ecologicalDetailBar) charts.ecologicalDetailBar.destroy();
    if (charts.ecologicalDetailLine) charts.ecologicalDetailLine.destroy();
    
    // Balkendiagramm für detaillierte Aufschlüsselung
    const barCtx = document.getElementById('ecological-detail-bar-chart').getContext('2d');
    charts.ecologicalDetailBar = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(detailedImpacts),
            datasets: [{
                label: `${technology.toUpperCase()} - ${impactCategory} [${unit}]`,
                data: Object.values(detailedImpacts),
                backgroundColor: 'rgba(54, 162, 235, 0.7)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Ecological Impact Breakdown - ${technology.toUpperCase()}`
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: unit
                    }
                }
            }
        }
    });
    
    // Liniendiagramm für zeitliche Entwicklung
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    const lineCtx = document.getElementById('ecological-detail-line-chart').getContext('2d');
    
    const yearlyDetailed = calculateYearlyDetailedImpacts(technology, impactCategory, lifeStage);
    
    charts.ecologicalDetailLine = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: `${technology.toUpperCase()} - ${impactCategory} [${unit}]`,
                data: yearlyDetailed,
                borderColor: 'rgb(54, 162, 235)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Ecological Impact Over Time - ${technology.toUpperCase()}`
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: unit
                    }
                }
            }
        }
    });
}

function updateLifeStageDropdown(technology) {
    const lifeStageDropdown = document.getElementById('life-stage');
    lifeStageDropdown.innerHTML = '';
    
    const generalOption = document.createElement('option');
    generalOption.value = 'general';
    generalOption.textContent = 'General';
    lifeStageDropdown.appendChild(generalOption);
    
    const lifeStages = getLifeStagesForTechnology(technology);
    lifeStages.forEach(stage => {
        const option = document.createElement('option');
        option.value = stage.value;
        option.textContent = stage.label;
        lifeStageDropdown.appendChild(option);
    });
}

function getLifeStagesForTechnology(technology) {
    const lifeStages = {
        dfe: [
            { value: 'engine-production', label: 'Engine Production' },
            { value: 'fuel-production', label: 'Fuel Production' },
            { value: 'operating-resources', label: 'Operating Resources' },
            { value: 'emissions', label: 'Emissions' },
            { value: 'flare-impact', label: 'Flare Impact' }
        ],
        oec: [
            { value: 'engine-production', label: 'Engine Production' },
            { value: 'oxygen-production', label: 'Oxygen Production' },
            { value: 'operating-resources', label: 'Operating Resources' },
            { value: 'emissions', label: 'Emissions' },
            { value: 'flare-impact', label: 'Flare Impact' }
        ],
        sfr: [
            { value: 'unit-production', label: 'Unit Production' },
            { value: 'chemical-production', label: 'Chemical Production' },
            { value: 'operating-resources', label: 'Operating Resources' },
            { value: 'chp-production', label: 'CHP Production' },
            { value: 'chp-operating-resources', label: 'CHP Operating Resources' },
            { value: 'emissions', label: 'Emissions' },
            { value: 'flare-impact', label: 'Flare Impact' }
        ],
        flare: [
            { value: 'energy-consumption', label: 'Energy Consumption' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'emissions', label: 'Emissions' }
        ]
    };
    
    return lifeStages[technology] || [];
}

function calculateDetailedEnvironmentalImpacts(technology, impactCategory, lifeStage, selectedYear) {
    // Vereinfachte Berechnung - in der Realität würden hier die tatsächlichen LCIA-Daten verwendet
    const baseValue = calculateEnvironmentalImpacts(impactCategory)[technology] || 1;
    
    const breakdowns = {
        'engine-production': 0.2,
        'fuel-production': 0.25,
        'oxygen-production': 0.3,
        'chemical-production': 0.15,
        'operating-resources': 0.35,
        'chp-production': 0.1,
        'chp-operating-resources': 0.25,
        'emissions': 0.4,
        'flare-impact': 0.15,
        'energy-consumption': 0.5,
        'maintenance': 0.3
    };
    
    if (lifeStage === 'general') {
        return {
            'Production': baseValue * 0.3,
            'Operation': baseValue * 0.4,
            'Maintenance': baseValue * 0.2,
            'Emissions': baseValue * 0.5
        };
    } else {
        return {
            [lifeStage]: baseValue * (breakdowns[lifeStage] || 0.3)
        };
    }
}

function calculateYearlyDetailedImpacts(technology, impactCategory, lifeStage) {
    const years = calculationResults.gasDevelopment.volume.length;
    const baseValue = calculateEnvironmentalImpacts(impactCategory)[technology] || 1;
    
    return Array.from({length: years}, (_, i) => baseValue * Math.pow(0.95, i));
}

function updateEconomicResults() {
    const technology = document.getElementById('econ-technology').value;
    const selectedYear = document.getElementById('econ-year').value;
    const selectedTech = calculationResults[technology];
    
    if (!selectedTech) return;
    
    // Berechne jahresspezifische oder kumulierte Werte
    let costData, energyRevenue;
    
    if (selectedYear === 'all') {
        costData = {
            labels: ['Investment', 'Fuel/Oxygen', 'Maintenance', 'Electricity', 'Other Costs', 'Taxes'],
            datasets: [{
                data: [30, 25, 15, 10, 15, 5],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ]
            }]
        };
        energyRevenue = Math.abs(selectedTech.npv) * 2;
    } else {
        const year = parseInt(selectedYear) - 1;
        const degradation = Math.pow(0.95, year);
        costData = {
            labels: ['Investment', 'Fuel/Oxygen', 'Maintenance', 'Electricity', 'Other Costs', 'Taxes'],
            datasets: [{
                data: [
                    30 * degradation,
                    25 * degradation,
                    15 * degradation,
                    10 * degradation,
                    15 * degradation,
                    5 * degradation
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ]
            }]
        };
        energyRevenue = (Math.abs(selectedTech.npv) * 2 * degradation) / calculationResults.gasDevelopment.volume.length;
    }
    
    if (charts.economicPie) charts.economicPie.destroy();
    
    const pieCtx = document.getElementById('economic-pie-chart').getContext('2d');
    charts.economicPie = new Chart(pieCtx, {
        type: 'pie',
        data: costData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `Cost Distribution - ${technology.toUpperCase()}${selectedYear !== 'all' ? ` - Year ${selectedYear}` : ''}`
                }
            }
        }
    });
    
    // Aktualisiere finanzielle Zusammenfassung mit korrekten CSV-Daten
    const priceData = csvData.csv12 && csvData.csv12.length > 0 ? csvData.csv12[0] : {};
    let investmentCost = selectedTech.investment;
    
    // Verwende tatsächliche Preise aus CSV12
    if (technology === 'dfe') {
        investmentCost = (parseFloat(priceData['Dual Fuel Engine [€/Unit]']) || 50000) * 
                        (parseFloat(selectedTech.selectedEngine?.['Price Factor']) || 1);
    } else if (technology === 'oec') {
        investmentCost = (parseFloat(priceData['Oxygen Enrichment Engine [€/Unit]']) || 50000) * 
                        (parseFloat(selectedTech.selectedEngine?.['Price Factor']) || 1);
    } else if (technology === 'sfr') {
        const sfrPrice = (parseFloat(priceData['SFR [€/Unit]']) || 50000) * 
                        (parseFloat(selectedTech.selectedSFR?.['Price Factor']) || 1);
        const chpPrice = selectedTech.chpAvailable ? 
            (parseFloat(priceData['CHP Unit'] || priceData['Dual Fuel Engine [€/Unit]']) || 50000) * 
            (parseFloat(selectedTech.selectedCHP?.['CHP Production Factor']) || 1) : 0;
        investmentCost = sfrPrice + chpPrice;
    }
    
    document.getElementById('total-energy-revenue').textContent = formatCurrency(energyRevenue);
    document.getElementById('investment-cost').textContent = formatCurrency(investmentCost);
    document.getElementById('total-taxes').textContent = formatCurrency(selectedTech.npv ? Math.abs(selectedTech.npv) * 0.2 : 0);
    document.getElementById('detailed-npv').textContent = formatCurrency(selectedTech.npv);
    
    document.getElementById('electrical-revenue').textContent = formatCurrency(energyRevenue * 0.6);
    document.getElementById('thermal-revenue').textContent = formatCurrency(energyRevenue * 0.4);
}

function updateVerificationTables() {
    const category = document.getElementById('verification-category').value;
    const tablesContainer = document.getElementById('verification-tables');
    
    let tableHTML = '';
    
    switch(category) {
        case 'general':
            tableHTML = createGeneralVerificationTable();
            break;
        case 'dfe':
            tableHTML = createDFEVerificationTables();
            break;
        case 'oec':
            tableHTML = createOECVerificationTables();
            break;
        case 'sfr':
            tableHTML = createSFRVerificationTables();
            break;
        case 'flare':
            tableHTML = createFlareVerificationTable();
            break;
    }
    
    tablesContainer.innerHTML = tableHTML;
}

function createGeneralVerificationTable() {
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    
    let tableHTML = `
        <h3>Table 1: Gas Development Over Time</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IR1: Methane Content [%]</th>
                    <th>IR2: Gas Volume [m³/h]</th>
                    <th>IR3: Energy Content [kW]</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tableHTML += `
            <tr>
                <td>${year}</td>
                <td>${intermediateResults.general.IR1[index]?.toFixed(2) || 'N/A'}</td>
                <td>${intermediateResults.general.IR2[index]?.toFixed(2) || 'N/A'}</td>
                <td>${intermediateResults.general.IR3[index]?.toFixed(2) || 'N/A'}</td>
            </tr>
        `;
    });
    
    tableHTML += `</tbody></table>`;
    return tableHTML;
}

function createDFEVerificationTables() {
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    const dfe = intermediateResults.dfe;
    
    let tablesHTML = `
        <h3>Table 2: DFE General Calculations (All Engine Sizes)</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IR4: Energy Content [kW]</th>
                    <th>IR5: Energetic Load [kW]</th>
                    <th>IR6: Relative Load [%]</th>
                    <th>IR7: Engine Usable</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${dfe.IR4[index]?.toFixed(2) || 'N/A'}</td>
                <td>${dfe.IR5[index]?.toFixed(2) || 'N/A'}</td>
                <td>${dfe.IR6[index]?.toFixed(2) || 'N/A'}</td>
                <td>${dfe.IR7[index] === 1 ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    // Tabelle 6: DFE Specific Results for Selected Engine
    tablesHTML += `
        <h3>Table 6: DFE Specific Results for Selected Engine</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IR10: Diesel Consumption [L]</th>
                    <th>IR11: Electricity Consumption [kWh]</th>
                    <th>IR16: Thermal Energy [kWh]</th>
                    <th>IR17: Electrical Energy [kWh]</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${(dfe.IR10[index] || 0).toFixed(2)}</td>
                <td>${(dfe.IR11[index] || 0).toFixed(2)}</td>
                <td>${(dfe.IR16[index] || 0).toFixed(2)}</td>
                <td>${(dfe.IR17[index] || 0).toFixed(2)}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    // Tabelle 10: DFE Emissions
    tablesHTML += `
        <h3>Table 10: DFE Emissions</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Carbon Monoxide [kg]</th>
                    <th>Nitrogen Oxides [kg]</th>
                    <th>Formaldehyde [kg]</th>
                    <th>Methane Slip [kg]</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        // Beispiel-Emissionswerte
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${(calculationResults.gasDevelopment.volume[index] * 0.003).toFixed(4)}</td>
                <td>${(calculationResults.gasDevelopment.volume[index] * 0.01).toFixed(4)}</td>
                <td>${(calculationResults.gasDevelopment.volume[index] * 0.002).toFixed(4)}</td>
                <td>${(calculationResults.gasDevelopment.volume[index] * 0.001).toFixed(4)}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    return tablesHTML;
}

function createOECVerificationTables() {
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    const oec = intermediateResults.oec;
    
    let tablesHTML = `
        <h3>Table 3: OEC General Calculations</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IRO4: Energy Content [kW]</th>
                    <th>IRO5: Energetic Load [kW]</th>
                    <th>IRO6: Engine Usable</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${oec.IRO4[index]?.toFixed(2) || 'N/A'}</td>
                <td>${oec.IRO5[index]?.toFixed(2) || 'N/A'}</td>
                <td>${oec.IRO6[index] === 1 ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    // Tabelle 7: OEC Specific Results
    tablesHTML += `
        <h3>Table 7: OEC Specific Results for Selected Engine</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IRO9: Oxygen Consumption [m³]</th>
                    <th>IRO10: Electricity Consumption [kWh]</th>
                    <th>IRO15: Thermal Energy [kWh]</th>
                    <th>IRO16: Electrical Energy [kWh]</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${(oec.IRO9[index] || 0).toFixed(2)}</td>
                <td>${(oec.IRO10[index] || 0).toFixed(2)}</td>
                <td>${(oec.IRO15[index] || 0).toFixed(2)}</td>
                <td>${(oec.IRO16[index] || 0).toFixed(2)}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    return tablesHTML;
}

function createSFRVerificationTables() {
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    const sfr = intermediateResults.sfr;
    
    let tablesHTML = `
        <h3>Table 4: SFR General Calculations</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IRS4: SFR Load [%]</th>
                    <th>IRS5: SFR Usable</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${sfr.IRS4[index]?.toFixed(2) || 'N/A'}</td>
                <td>${sfr.IRS5[index] === 1 ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    // Tabelle 5: CHP General Calculations
    tablesHTML += `
        <h3>Table 5: CHP General Calculations</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IRS7: Processed Gas [m³/h]</th>
                    <th>IRS8: Energy Content [kW]</th>
                    <th>IRS9: CHP Energetic Load [kW]</th>
                    <th>IRS10: CHP Relative Load [%]</th>
                    <th>IRS11: CHP Usable</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${(sfr.IRS7[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS8[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS9[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS10[index] || 0).toFixed(2)}</td>
                <td>${sfr.IRS11[index] === 1 ? 'Yes' : 'No'}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    // Tabelle 8: SFR Specific Results
    tablesHTML += `
        <h3>Table 8: SFR Specific Results</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IRS14: Chemical Consumption [L]</th>
                    <th>IRS15: Electricity Consumption [kWh]</th>
                    <th>IRS16: Maintenance Frequency</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${(sfr.IRS14[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS15[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS16[index] || 0).toFixed(2)}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    // Tabelle 9: CHP Specific Results
    tablesHTML += `
        <h3>Table 9: CHP Specific Results</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>IRS17: Electricity Consumption [kWh]</th>
                    <th>IRS18: Maintenance Frequency</th>
                    <th>IRS22: Thermal Energy [kWh]</th>
                    <th>IRS23: Electrical Energy [kWh]</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        tablesHTML += `
            <tr>
                <td>${year}</td>
                <td>${(sfr.IRS17[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS18[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS22[index] || 0).toFixed(2)}</td>
                <td>${(sfr.IRS23[index] || 0).toFixed(2)}</td>
            </tr>
        `;
    });
    
    tablesHTML += `</tbody></table>`;
    
    return tablesHTML;
}

function createFlareVerificationTable() {
    const years = Array.from({length: calculationResults.gasDevelopment.volume.length}, (_, i) => i + 1);
    
    let tableHTML = `
        <h3>Flare Operation Results</h3>
        <table class="results-table">
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Gas Volume Flared [m³]</th>
                    <th>Maintenance Cost [€]</th>
                    <th>Electricity Cost [€]</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    years.forEach((year, index) => {
        const gasVolume = calculationResults.gasDevelopment.volume[index];
        const operatingHours = parseFloat(document.getElementById('operating-hours').value) || 8000;
        
        tableHTML += `
            <tr>
                <td>${year}</td>
                <td>${(gasVolume * operatingHours).toFixed(2)}</td>
                <td>${(5000 * Math.pow(0.95, index)).toFixed(2)}</td>
                <td>${(1000 * Math.pow(0.95, index)).toFixed(2)}</td>
            </tr>
        `;
    });
    
    tableHTML += `</tbody></table>`;
    return tableHTML;
}

function formatCurrency(value) {
    if (value === undefined || value === null || isNaN(value)) return '-';
    return `€${value.toLocaleString('de-DE', {maximumFractionDigits: 0})}`;
}