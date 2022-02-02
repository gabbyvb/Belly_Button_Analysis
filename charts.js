function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select('#selDataset')

  // Use the list of sample names to populate the select options
  d3.json('samples.json').then(data => {
    var sampleNames = data.names

    sampleNames.forEach(sample => {
      selector.append('option').text(sample).property('value', sample)
    })

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0]
    buildCharts(firstSample)
    buildMetadata(firstSample)
  })
}

// Initialize the dashboard
init()

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log(newSample)
  buildMetadata(newSample)
  buildCharts(newSample)
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json('samples.json').then(data => {
    var metadata = data.metadata
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample)
    var result = resultArray[0]
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select('#sample-metadata')

    // Use `.html("") to clear any existing metadata
    PANEL.html('')

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append('h6').text(`${key.toUpperCase()}: ${value}`)
    })
  })
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json('samples.json').then(data => {
    console.log(data)
    // 3. Create a variable that holds the samples array.
    var sample_values = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterSample = data.samples.filter(
      sampleObj => sampleObj.id === sample
    )[0]
    console.log(filterSample)

    // 1. (Gauge Steps) Create a variable that filters the metadata array for the object with the desired sample number.
    var filterMeta = data.metadata.filter(
      sampleObj => sampleObj.id === parseInt(sample)
    )[0]
    console.log(filterMeta)

    // sampleObj.id == data.samples.id
    // var result = filterSample[0];
    //  5. Create a variable that holds the first sample in the array.
    // var firstSample = filterSample[0];
    // buildCharts(firstSample);
    // buildMetadata(firstSample);

    // 2. (Gauge Steps) Create a variable that holds the first sample in the metadata array.

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ID = data.samples.otu_ids
    var Labels = data.samples.otu_labels
    var Sampled = filterSample.sample_values.map(outID => `${outID}`)

    // 3. (Gauge Steps) Create a variable that holds the washing frequency.
    var wash_frequency = filterMeta["wfreq"]
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    console.log(data.samples)
    var yticks = filterSample.otu_ids
      .slice(0, 10)
      .sort((anElement, anotherElement) => anElement - anotherElement)
      .reverse()

    // 8. Create the trace for the bar chart.
    var barData = {
      x: filterSample.otu_ids
        .map(otu => `ID - ${otu}`)
        .slice(0, 10)
        .reverse(),
      y: yticks,
      type: 'bar'
    }
    // 9. Create the layout for the bar chart.
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'ID' },
      yaxis: { title: '# of Bacteria' }
    }
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bar', [barData], barLayout)

    // 1. (Bubble Chart) Create the trace for the bubble chart.
    var bubbleData = {
      x: filterSample.otu_ids
        .map(otu => `ID - ${otu}`)
        .slice(0, 10)
        .reverse(),
      y: yticks,
      text: Labels,
      mode: 'markers',
      marker: {
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
        size: [40, 60, 80, 100]
      }
    };

    // 2. (Bubble Chart) Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: '# of Bacteria' }
    };

    // 3. (Bubble Chart) Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);

    // 4. (Gauge Steps) Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_frequency,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "darkgreen" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
    ];

    // 5. (Gauge Steps) Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, height: 450, margin: { t: 0, b: 0 }
    };

    // 6. (Gauge Steps) Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  })
}

