// all the make Hist and update hist functions

// Part i

//// egs
function makeHist_egs(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");
    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });    
    old_maxbin = old_maxbin*100;    
    old_minbin = old_minbin*100;

    svg_egs= d3.select(var_svg_id)
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width2]);

    xScale_egs = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width2]);

    yScale_egs = d3.scaleLinear()
    .range([height2, 0]);

    var newNumBuckets1 ;
    if (path == "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/PA_data/plan_metrics_PA_PRES16.csv"){
        newNumBuckets1 = 9;
    } else {
        newNumBuckets1 = numBuckets/2;
    }
    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_egs.domain())
    .thresholds(xScale_egs.ticks(newNumBuckets1));

    bins = histogram(old_csvdata);

    yScale_egs.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_egs.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_egs(d.x0) + "," + yScale_egs(d.length) + ")"; })
      .attr("width", xScale_egs(bins[0].x1) - xScale_egs(bins[0].x0) - 1)
      .attr("height", function(d) { return height2 - yScale_egs(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.4);

    // add the x axis and x-label
    svg_egs.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));

      // add the y axis and y-label
    svg_egs.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_egs).tickSizeOuter(0));

    svg_egs.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height2 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");

    //legend
    svg_egs.append("circle").attr("cx",20).attr("cy",178).attr("r", 4)
    .style("fill", "red")
    .style("opacity", 0.6);
    svg_egs.append("circle").attr("cx",20).attr("cy",188).attr("r", 4)
    .style("fill", "blue")
    .style("opacity", 0.6);
    svg_egs.append("text").attr("x", 35).attr("y", 180).text("Efficiency Gap > 0: Republican advantage")
    .style("font-size", "50%");
    svg_egs.append("text").attr("x", 35).attr("y", 190).text("Efficiency Gap "+ "\u2264" +" 0: Democratic advantage")
    .style("font-size", "50%");
    // svg_egs.append("text").attr("x", 85).attr("y", 200)
    // .text("Note: an efficiency gap < 0 is commonly accepted as indicating Republican advantage")
    // .style("font-size", "50%");



};


function updateHist_egs(csvdata, col, var_svg_id) {
    var newNumBuckets1 ;
    if (path == "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/PA_data/plan_metrics_PA_PRES16.csv"){
        newNumBuckets1 = 9;
    } else {
        newNumBuckets1 = numBuckets/2;
    }
    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_egs.domain())
    .thresholds(xScale_egs.ticks(newNumBuckets1));
    bins = histogram(csvdata);

    // set up the bars
    bar_egs = svg_egs.selectAll(".bin_rect")
    .data(bins)


    bar_egs
    .enter()
    .append("rect")
    .attr("class", "bin_rect")
    .merge(bar_egs)
    .transition()
    .duration(100)
    .attr("x", 1)// move 1px to right
    .attr("transform", function(d) 
        { return "translate(" + xScale_egs(d.x0) + "," + yScale_egs(d.length) + ")"; })
    .attr("width", xScale_egs(bins[0].x1) - xScale_egs(bins[0].x0) - 1)
    .attr("height", function(d) { return height2 - yScale_egs(d.length); })
    .attr("fill", function(d){
        if (d.x0 > 0) { return("red")} else {
            return("blue")
        }
    })
    .style("opacity", 0.4);
    
    bar_egs.exit()
    .remove();

};




///// cuts
function makeHist_cuts(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    
    

    svg_nb_cuts= d3.select(var_svg_id)
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width1]);

    xScale_nb_cuts = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width1]);

    yScale_nb_cuts = d3.scaleLinear()
    .range([height1, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_nb_cuts.domain())
    .thresholds(xScale_nb_cuts.ticks(numBuckets));

    bins = histogram(old_csvdata);

    yScale_nb_cuts.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_nb_cuts.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_old(d.x0) + "," + yScale_nb_cuts(d.length) + ")"; })
      .attr("width", xScale_old(bins[0].x1) - xScale_old(bins[0].x0) - 1)
      .attr("height", function(d) { return height1 - yScale_nb_cuts(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.4);

    // add the x axis and x-label
    svg_nb_cuts.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(xScale_old).ticks(5).tickSizeOuter(0));

    // add the y axis and y-label
    svg_nb_cuts.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_nb_cuts).tickSizeOuter(0));

    svg_nb_cuts.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height1 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};


function updateHist_cuts(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_nb_cuts.domain())
    .thresholds(xScale_nb_cuts.ticks(numBuckets));

    bins = histogram(csvdata);

    // set up the bars
    bar_nb_cuts = svg_nb_cuts.selectAll(".bin_rect")
    .data(bins)

    bar_nb_cuts
    .enter()
    .append("rect")
    .attr("class", "bin_rect")
    .merge(bar_nb_cuts)
    .transition()
    .duration(100)
    .attr("x", 1)// move 1px to right
    .attr("transform", function(d) 
        { return "translate(" + xScale_nb_cuts(d.x0) + "," + yScale_nb_cuts(d.length) + ")"; })
    .attr("width", xScale_nb_cuts(bins[0].x1) - xScale_nb_cuts(bins[0].x0) - 1)
    .attr("height", function(d) { return height1 - yScale_nb_cuts(d.length); })
    .attr("fill", "#721055") 
    .style("opacity", 0.5);
    bar_nb_cuts.exit()
    .remove();
};





///// mms
function makeHist_mms(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");
    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    svg_mms= d3.select(var_svg_id)
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width2]);

    xScale_mms = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width2]);

    yScale_mms = d3.scaleLinear()
    .range([height2, 0]);

    if (path == "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/PA_data/plan_metrics_PA_PRES16.csv"){
        var newBucketSize = 16   ;
        var newNumBuckets = Math.round( 200 / newBucketSize);
        
        histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_mms.domain())
                        .thresholds(xScale_mms.ticks(newNumBuckets));
    } else {
        
        histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_mms.domain())
                        .thresholds(xScale_mms.ticks(numBuckets/2));
    }

    bins = histogram(old_csvdata);

    yScale_mms.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_mms.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_old(d.x0) + "," + yScale_mms(d.length) + ")"; })
      .attr("width", xScale_old(bins[0].x1) - xScale_old(bins[0].x0) - 1)
      .attr("height", function(d) { return height2 - yScale_mms(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.4);

    // add the x axis and x-label
    svg_mms.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale_old).ticks(5).tickSizeOuter(0));


    // add the y axis and y-label
    svg_mms.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_mms).tickSizeOuter(0));

    svg_mms.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height2/ 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");

    //legend
    svg_mms.append("circle").attr("cx",20).attr("cy",178).attr("r", 4)
    .style("fill", "red")
    .style("opacity", 0.6);
    svg_mms.append("circle").attr("cx",20).attr("cy",188).attr("r", 4)
    .style("fill", "blue")
    .style("opacity", 0.6);
    svg_mms.append("text").attr("x", 35).attr("y", 180).text("Mean-Median > 0: Republican advantage")
    .style("font-size", "50%");
    svg_mms.append("text").attr("x", 35).attr("y", 190).text("Mean-Median "+ "\u2264" +" 0: Democratic advantage")
    .style("font-size", "50%");
};

function updateHist_mms(csvdata, col, var_svg_id) {
    if (path == "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/PA_data/plan_metrics_PA_PRES16.csv"){
        var newBucketSize = 16  ;
        var newNumBuckets = Math.round( 200 / newBucketSize);
        
        var histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_mms.domain())
                        .thresholds(xScale_mms.ticks(newNumBuckets));
        console.log("newBucketSize makeHist_mms: ", newBucketSize);
        console.log("newNumBuckets makeHist_mms: ", newNumBuckets);
    } else {
        
        var histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_mms.domain())
                        .thresholds(xScale_mms.ticks(numBuckets/2));
    }

    bins = histogram(csvdata);

    // set up the bars
    bar_mms = svg_mms.selectAll(".bin_rect")
    .data(bins)

    bar_mms
    .enter()
    .append("rect")
    .attr("class", "bin_rect")
    .merge(bar_mms)
    .transition()
    .duration(1000)
    .attr("x", 1)// move 1px to right
    .attr("transform", function(d) 
        { return "translate(" + xScale_mms(d.x0) + "," + yScale_mms(d.length) + ")"; })
    .attr("width", xScale_mms(bins[0].x1) - xScale_mms(bins[0].x0) - 1)
    .attr("height", function(d) { return height2 - yScale_mms(d.length); })
    .attr("fill", function(d){
        if (d.x0 > 0) { return "red"} else {
            return "blue"
        }
    })
    .style("opacity",0.5);
    
    bar_mms.exit()
    .remove();


    
};

//// hmss
function makeHist_hmss(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    
    

    svg_hmss= d3.select(var_svg_id)
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width2]);

    xScale_hmss = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width2]);

    yScale_hmss = d3.scaleLinear()
    .range([height2, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_hmss.domain())
    .thresholds(xScale_hmss.ticks(numBuckets/2));

    bins = histogram(old_csvdata);
    yScale_hmss.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_hmss.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_old(d.x0) + "," + yScale_hmss(d.length) + ")"; })
      .attr("width", xScale_old(bins[0].x1) - xScale_old(bins[0].x0) - 1)
      .attr("height", function(d) { return height2 - yScale_hmss(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.4);

    // add the x axis and x-label
    svg_hmss.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));

    // add the y axis and y-label
    svg_hmss.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_hmss).tickSizeOuter(0));

    svg_hmss.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height2 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");

    //legend
    svg_hmss.append("circle").attr("cx",20).attr("cy",178).attr("r", 4)
    .style("fill", "red")
    .style("opacity", 0.6);
    svg_hmss.append("circle").attr("cx",20).attr("cy",188).attr("r", 4)
    .style("fill", "blue")
    .style("opacity", 0.6);
    svg_hmss.append("text").attr("x", 35).attr("y", 180).text("Republican won more than half the seats")
    .style("font-size", "50%");
    svg_hmss.append("text").attr("x", 35).attr("y", 190).text("Democratic won more than half the seats")
    .style("font-size", "50%");
};


function updateHist_hmss(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_hmss.domain())
    .thresholds(xScale_hmss.ticks(numBuckets/2));

    bins = histogram(csvdata);

    // set up the bars
    bar_hmss = svg_hmss.selectAll(".bin_rect")
    .data(bins)

    bar_hmss
    .enter()
    .append("rect")
    .attr("class", "bin_rect")
    .merge(bar_hmss)
    .transition()
    .duration(1000)
    .attr("x", 1)// move 1px to right
    .attr("transform", function(d) 
        { return "translate(" + xScale_hmss(d.x0) + "," + yScale_hmss(d.length) + ")"; })
    .attr("width", xScale_hmss(bins[0].x1) - xScale_hmss(bins[0].x0) - 1)
    .attr("height", function(d) { return height2 - yScale_hmss(d.length); })
    .attr("fill", function(d){
        if (d.x0 <= n_median_seats) { return "red"} else {
            return "blue"
        }
    })
    .style("opacity",0.5);
    
    bar_hmss.exit()
    .remove();
};

///// votes
function makeHist_votes(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    old_maxbin = old_maxbin*100;    
    old_minbin = old_minbin*100;
    maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    svg_p_votes= d3.select(var_svg_id)
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width1]);

    xScale_p_votes = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width1]);

    yScale_p_votes = d3.scaleLinear()
    .range([height1, 0]);

    if (path == "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/PA_data/plan_metrics_PA_PRES16.csv"){
        var newBucketSize = 8;
        var newNumBuckets = Math.round( 200 / newBucketSize);
        
        histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_p_votes.domain())
                        .thresholds(xScale_p_votes.ticks(newNumBuckets));
        console.log("newBucketSize: ", newBucketSize);
        console.log("newNumBuckets: ", newNumBuckets);
    } else{
        
        histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_p_votes.domain())
                        .thresholds(xScale_p_votes.ticks(numBuckets));
    }
    

    bins = histogram(old_csvdata);

    

    yScale_p_votes.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_p_votes.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_p_votes(d.x0) + "," + yScale_p_votes(d.length) + ")"; })
      .attr("width", xScale_p_votes(bins[0].x1) - xScale_p_votes(bins[0].x0) - 1)
      .attr("height", function(d) { return height1 - yScale_p_votes(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.4);

    // add the x axis and x-label
    svg_p_votes.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));

    // add the y axis and y-label
    svg_p_votes.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_p_votes));

    svg_p_votes.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height1 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans") 
    .style("font-size","70%");

    //legend
    svg_p_votes.append("circle").attr("cx",60).attr("cy",188).attr("r", 4)
    .style("fill", "red")
    .style("opacity", 0.6);
    svg_p_votes.append("circle").attr("cx",60).attr("cy",198).attr("r", 4)
    .style("fill", "blue")
    .style("opacity", 0.6);
    svg_p_votes.append("text").attr("x", 75).attr("y", 190).text("Republican won more than half the votes")
    .style("font-size", "50%");
    svg_p_votes.append("text").attr("x", 75).attr("y", 200).text("Democratic won more than half the votes")
    .style("font-size", "50%");
};


function updateHist_votes(csvdata, col, var_svg_id) {
    if (path == "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/PA_data/plan_metrics_PA_PRES16.csv"){
        var newBucketSize = 8;
        var newNumBuckets = Math.round( 200 / newBucketSize);
        
        var histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_p_votes.domain())
                        .thresholds(xScale_p_votes.ticks(newNumBuckets));
        console.log("newBucketSize updateHist_votes: ", newBucketSize);
        console.log("newNumBuckets updateHist_votes: ", newNumBuckets);
    } else{
        
        var histogram = d3.histogram()
                        .value(function(d) { return +d[col]; })
                        .domain(xScale_p_votes.domain())
                        .thresholds(xScale_p_votes.ticks(numBuckets));
    }

    bins = histogram(csvdata);

    // set up the bars
    bar_p_votes = svg_p_votes.selectAll(".bin_rect")
    .data(bins)

    bar_p_votes
    .enter()
    .append("rect")
    .attr("class", "bin_rect")
    .merge(bar_p_votes)
    .transition()
    .duration(1000)
    .attr("x", 1)// move 1px to right
    .attr("transform", function(d) 
        { return "translate(" + xScale_p_votes(d.x0) + "," + yScale_p_votes(d.length) + ")"; })
    .attr("width", xScale_p_votes(bins[0].x1) - xScale_p_votes(bins[0].x0) - 1)
    .attr("height", function(d) { return height1 - yScale_p_votes(d.length); })
    .attr("fill", function(d){
        if (d.x0 > 50) { return "red"} else {
            return "blue"
        }
    })
    .style("opacity",0.5);
    
    bar_p_votes.exit()
    .remove();
};



// Part ii
var xScale_egs2, yScale_egs2, svg_egs2, bar_egs2;
var xScale_nb_cuts2, yScale_nb_cuts2, svg_nb_cuts2, bar_nb_cuts2;
var xScale_mms2, yScale_mms2, svg_mms2, bar_mms2;
var xScale_hmss2, yScale_hmss2, svg_hmss2, bar_hmss2;
var xScale_p_votes2, yScale_p_votes2, svg_p_votes2, bar_p_votes2;
var barCut;

//// create MakeHist functions for 6 metrics for Part II

// cuts2
function makeHist_cuts2(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });
    
    svg_nb_cuts2 = d3.select(var_svg_id)
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width1]);

    xScale_nb_cuts2 = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width1]);

    yScale_nb_cuts2 = d3.scaleLinear()
    .range([height1, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_nb_cuts2.domain())
    .thresholds(xScale_nb_cuts2.ticks(numBuckets)); 

    bins = histogram(old_csvdata);

    yScale_nb_cuts2.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_nb_cuts2.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_old(d.x0) + "," + yScale_nb_cuts2(d.length) + ")"; })
      .attr("width", xScale_old(bins[0].x1) - xScale_old(bins[0].x0) - 1)
      .attr("height", function(d) { return height1 - yScale_nb_cuts2(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.5);

    // add the x axis and x-label
    svg_nb_cuts2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));


      // add the y axis and y-label
    svg_nb_cuts2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_nb_cuts2).tickSizeOuter(0));

    svg_nb_cuts2.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height1 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};

// p_votes
function makeHist_votes2(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    old_maxbin = old_maxbin*100;    
    old_minbin = old_minbin*100;

    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });

    svg_p_votes2 = d3.select(var_svg_id)
    .attr("width", width1 + margin.left + margin.right)
    .attr("height", height1 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width1]);

    xScale_p_votes2 = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width1]);

    yScale_p_votes2 = d3.scaleLinear()
    .range([height1, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_p_votes2.domain())
    .thresholds(xScale_p_votes2.ticks(numBuckets));

    bins = histogram(old_csvdata);

    yScale_p_votes2.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_p_votes2.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_p_votes2(d.x0) + "," + yScale_p_votes2(d.length) + ")"; })
      .attr("width", xScale_p_votes2(bins[0].x1) - xScale_p_votes2(bins[0].x0) - 1)
      .attr("height", function(d) { return height1 - yScale_p_votes2(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.5);

    // add the x axis and x-label
    svg_p_votes2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height1 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));


      // add the y axis and y-label
    svg_p_votes2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_p_votes2).tickSizeOuter(0));

    svg_p_votes2.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height1 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};

// egs
function makeHist_egs2(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });
    old_maxbin = old_maxbin*100;    
    old_minbin = old_minbin*100;

    svg_egs2 = d3.select(var_svg_id)
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width2]);

    xScale_egs2 = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width2]);

    yScale_egs2 = d3.scaleLinear()
    .range([height2, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_egs2.domain())
    .thresholds(xScale_egs2.ticks(numBuckets/2));

    bins = histogram(old_csvdata);

    yScale_egs2.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_egs2.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_egs2(d.x0) + "," + yScale_egs2(d.length) + ")"; })
      .attr("width", xScale_egs2(bins[0].x1) - xScale_egs2(bins[0].x0) - 1)
      .attr("height", function(d) { return height2 - yScale_egs2(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.5);

    // add the x axis and x-label
    svg_egs2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));

 
    // add the y axis and y-label
    svg_egs2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_egs2).tickSizeOuter(0));

    svg_egs2.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height2 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};

// mms
function makeHist_mms2(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });

    svg_mms2 = d3.select(var_svg_id)
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width2]);

    xScale_mms2 = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width2]);

    yScale_mms2 = d3.scaleLinear()
    .range([height2, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_mms2.domain())
    .thresholds(xScale_mms2.ticks(numBuckets/2)); // split into 20 bins

    bins = histogram(old_csvdata);

    yScale_mms2.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_mms2.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_old(d.x0) + "," + yScale_mms2(d.length) + ")"; })
      .attr("width", xScale_old(bins[0].x1) - xScale_old(bins[0].x0) - 1)
      .attr("height", function(d) { return height2 - yScale_mms2(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.5);

    // add the x axis and x-label
    svg_mms2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale_old).ticks(5).tickSizeOuter(0));

    // svg_mms2.append("text")
    // .attr("class", "xlabel")
    // .attr("text-anchor", "middle")
    // .attr("x", width / 2)
    // .attr("y", height + margin.bottom - 5)
    // .text(xlabel)
    // .style("font-size","70%")
    // .style("padding-bottom", "3em");

      // add the y axis and y-label
    svg_mms2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_mms2).tickSizeOuter(0));

    svg_mms2.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height2 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};

// hmss
function makeHist_hmss2(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });

    svg_hmss2 = d3.select(var_svg_id)
    .attr("width", width2 + margin.left + margin.right)
    .attr("height", height2 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width2]);

    xScale_hmss2 = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width2]);

    yScale_hmss2 = d3.scaleLinear()
    .range([height2, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_hmss2.domain())
    .thresholds(xScale_hmss2.ticks(numBuckets/2));

    bins = histogram(old_csvdata);

    yScale_hmss2.domain([0, d3.max(bins, function(d) { return d.length; })]);

    svg_hmss2.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function(d) { return "translate(" + xScale_old(d.x0) + "," + yScale_hmss2(d.length) + ")"; })
      .attr("width", xScale_old(bins[0].x1) - xScale_old(bins[0].x0) - 1)
      .attr("height", function(d) { return height2 - yScale_hmss2(d.length); })
      .style("fill", "#69b3a2")
      .style("opacity", 0.4);

    // add the x axis and x-label
    svg_hmss2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(d3.axisBottom(xScale_old).tickSizeOuter(0));

    // svg_hmss2.append("text")
    // .attr("class", "xlabel")
    // .attr("text-anchor", "middle")
    // .attr("x", width / 2)
    // .attr("y", height + margin.bottom - 5)
    // .text(xlabel)
    // .style("font-size","70%")
    // .style("padding-bottom", "3em");

      // add the y axis and y-label
    svg_hmss2.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_hmss2).tickSizeOuter(0));

    svg_hmss2.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height2 / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};