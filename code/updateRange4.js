
// kernel https://www.d3-graph-gallery.com/graph/density_double.html

var col_to_filter;
var first_load;

var check_selection_nb_sp;
var check_selection_nb_cuts;
var check_selection_egs;
var check_selection_mms;
var check_selection_hmss;
var check_selection_p_votes;



var graph;
// variables for histogram set up
var margin, width, height, formatCount,
 old_maxbin, old_minbin, maxbin, minbin, 
 histogram, bins,
 maxbin_egs, minbin_egs;



var margin = {top: 50, right: 30, bottom: 50, left: 100};
var width = 450 - margin.left - margin.right;
var height = 250 - margin.top - margin.bottom;
// Histogram bucket width
var HISTOGRAM_BUCKET_SIZE = 4;
var numBuckets = 200 / HISTOGRAM_BUCKET_SIZE;
var tx_max = width;
var tx_min = 0;
var topY = height;


Range=function(_parentElement, _data, _filterData){
    this.parentElement  = _parentElement;
    this.data = _data;
    this.filterData = _filterData;

    margin = {top: 50, right: 30, bottom: 50, left: 100};
    width = 450 - margin.left - margin.right;
    height = 250 - margin.top - margin.bottom;
    // Histogram bucket width
    HISTOGRAM_BUCKET_SIZE = 4;
    numBuckets = 200 / HISTOGRAM_BUCKET_SIZE;
    tx_max = width;
    tx_min = 0;
    topY = height;

    check_selection_nb_sp = document.getElementById("check_selection_nb_sp").checked;
    check_selection_nb_cuts = document.getElementById("check_selection_nb_cuts").checked;
    check_selection_egs = document.getElementById("check_selection_egs").checked;
    check_selection_mms = document.getElementById("check_selection_mms").checked;
    check_selection_hmss = document.getElementById("check_selection_hmss").checked;
    check_selection_p_votes = document.getElementById("check_selection_p_votes").checked;
    if (check_selection_nb_sp) {
        col_to_filter = "nb_splits";}
    if (check_selection_nb_cuts) {
        col_to_filter = "nb_cuts";}
    if (check_selection_egs) {
        col_to_filter = "egs";}
    if (check_selection_mms) {
        col_to_filter = "mms";}
    if (check_selection_hmss) {
        col_to_filter = "hmss";}
    if (check_selection_p_votes) {
        col_to_filter = "perc_dem_vote";}

    this.default_var_min = d3.min(this.data, function(d) { return +d[col_to_filter]; } );
    this.default_var_max = d3.max(this.data, function(d) { return +d[col_to_filter]; } );
    this.filter_var_min = d3.min(this.filterData, function(d) { return +d[col_to_filter]; } );
    this.filter_var_max = d3.max(this.filterData, function(d) { return +d[col_to_filter]; } );
    var filterData = this.filterData;
    var data = this.data;
    
    if (graph) {
        // if the histogram exists then update its data
        updateHist_egs(filterData, "egs", "#egs");
        updateHist_sp(filterData, "nb_splits", "#nb_sp");
        updateHist_cuts(filterData, "nb_cuts", "#nb_cuts");
        updateHist_mms(filterData, "mms", "#mms");
        updateHist_hmss(filterData, "hmss", "#hmss");
        updateHist_votes(filterData, "perc_dem_vote", "#p_votes");

        // cutoff_max.call(drag_max);
        // thresholdLabel_max.call(drag_max);

        // cutoff_min.call(drag_min);
        // thresholdLabel_min.call(drag_min);

      } else {

        if (first_load ){
            svg_egs.selectAll("*").remove();
            svg_nb_sp.selectAll("*").remove();
            svg_nb_cuts.selectAll("*").remove();
            svg_mms.selectAll("*").remove();
            svg_hmss.selectAll("*").remove();
            svg_p_votes.selectAll("*").remove();

            cutoff_max.selectAll("*").remove();
            cutoff_min.selectAll("*").remove();
        } else { first_load = true ; }

        // otherwise create the histogram
        makeHist_egs(data, "egs", "#egs", "Efficiency Gap");
        makeHist_sp(data, "nb_splits", "#nb_sp", "Number of Splits");
        makeHist_cuts(data, "nb_cuts", "#nb_cuts" , "Number of Cuts");
        makeHist_mms(data, "mms", "#mms", "Mean - Median");
        makeHist_hmss(data, "hmss", "#hmss", 
                "Number of seats won by democrats");
        makeHist_votes(data, "perc_dem_vote", "#p_votes", "Percentage Democratic Votes");

        if (check_selection_nb_sp) {
            col_to_filter = "nb_splits";
            cutoff_max = svg_nb_sp.append('rect');
            cutoff_min = svg_nb_sp.append('rect');

            var tmax_tmp = xScale_nb_sp.invert(tx_max);
            var tmin_tmp = xScale_nb_sp.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(2);
            tmax_tmp = tmax_tmp.toPrecision(2);
            thresholdLabel_max = svg_nb_sp.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_nb_sp.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_nb_cuts) {
            col_to_filter = "nb_cuts";
            cutoff_max = svg_nb_cuts.append('rect');
            cutoff_min = svg_nb_cuts.append('rect');

            var tmax_tmp = xScale_nb_cuts.invert(tx_max);
            var tmin_tmp = xScale_nb_cuts.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(3);
            tmax_tmp = tmax_tmp.toPrecision(3);
            thresholdLabel_max = svg_nb_cuts.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_nb_cuts.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_egs) {
            col_to_filter = "egs";
            cutoff_max = svg_egs.append('rect');
            cutoff_min = svg_egs.append('rect');

            var tmax_tmp = xScale_egs.invert(tx_max);
            var tmin_tmp = xScale_egs.invert(0);
            // tmin_tmp = (tmin_tmp*100).toPrecision(3);
            // tmax_tmp = (tmax_tmp*100).toPrecision(3);
            tmin_tmp = tmin_tmp.toPrecision(3);
            tmax_tmp = tmax_tmp.toPrecision(3);
            thresholdLabel_max = svg_egs.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_egs.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_mms) {
            col_to_filter = "mms";
            cutoff_max = svg_mms.append('rect');
            cutoff_min = svg_mms.append('rect');

            var tmax_tmp = xScale_mms.invert(tx_max);
            var tmin_tmp = xScale_mms.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(2);
            tmax_tmp = tmax_tmp.toPrecision(2);
            thresholdLabel_max = svg_mms.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_mms.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_hmss) {
            col_to_filter = "hmss";
            cutoff_max = svg_hmss.append('rect');
            cutoff_min = svg_hmss.append('rect');

            var tmax_tmp = xScale_hmss.invert(tx_max);
            var tmin_tmp = xScale_hmss.invert(0);
            tmin_tmp = tmin_tmp.toPrecision(1);
            tmax_tmp = tmax_tmp.toPrecision(1);
            thresholdLabel_max = svg_hmss.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_hmss.append('text')
                .text('Min: ' + tmin_tmp);
        }
        if (check_selection_p_votes) {
            col_to_filter = "perc_dem_vote";
            cutoff_max = svg_p_votes.append('rect');
            cutoff_min = svg_p_votes.append('rect');

            var tmax_tmp = xScale_p_votes.invert(tx_max);
            var tmin_tmp = xScale_p_votes.invert(0);
            // tmin_tmp = (tmin_tmp*100).toPrecision(3);
            // tmax_tmp = (tmax_tmp*100).toPrecision(3);
            tmin_tmp = tmin_tmp.toPrecision(3);
            tmax_tmp = tmax_tmp.toPrecision(3);
            thresholdLabel_max = svg_p_votes.append('text')
                .text('Max: ' + tmax_tmp);
            thresholdLabel_min = svg_p_votes.append('text')
                .text('Min: ' + tmin_tmp);
        }
        
        // threshold bar for MAX
        cutoff_max.attr('x', tx_max)
                            .attr('y', -20)//-height
                            .attr('width', 7)
                            .attr('height', height + 20)
                            .attr("class", "cutoff_max_rect");
        

        thresholdLabel_max.attr('x', tx_max - 10)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'thresholdLabel_max');

        // threshold bar for MIN
        cutoff_min.attr('x', 0)
                            .attr('y', -20)//-height
                            .attr('width', 7)
                            .attr('height', height + 20)
                            .attr("class", "cutoff_min_rect");

        thresholdLabel_min.attr('x', 0)
            .attr('y', -30)
            .attr('text-anchor', 'middle')
            .attr('class', 'thresholdLabel_min');

        graph = true;
      };


    this.update_range();
};



Range.prototype.update_range = function(){
    filterData = this.filterData;


    data = this.data;
    filter_var_min = this.filter_var_min;
    filter_var_max = this.filter_var_max;

    default_var_min = this.default_var_min;
    default_var_max = this.default_var_max;  


    check_selection_nb_sp = document.getElementById("check_selection_nb_sp").checked;
    check_selection_nb_cuts = document.getElementById("check_selection_nb_cuts").checked;
    check_selection_egs = document.getElementById("check_selection_egs").checked;
    check_selection_mms = document.getElementById("check_selection_mms").checked;
    check_selection_hmss = document.getElementById("check_selection_hmss").checked;
    check_selection_p_votes = document.getElementById("check_selection_p_votes").checked;

    if (check_selection_nb_sp) {
        col_to_filter = "nb_splits";
        filter_var_max = xScale_nb_sp.invert(tx_max);
        filter_var_min = xScale_nb_sp.invert(tx_min);
    }
    if (check_selection_nb_cuts) {
        col_to_filter = "nb_cuts";
        filter_var_max = xScale_nb_cuts.invert(tx_max);
        filter_var_min = xScale_nb_cuts.invert(tx_min);
    }
    if (check_selection_egs) {
        col_to_filter = "egs";
        filter_var_max = xScale_egs.invert(tx_max);
        filter_var_min = xScale_egs.invert(tx_min);
    }
    if (check_selection_mms) {
        col_to_filter = "mms";
        filter_var_max = xScale_mms.invert(tx_max);
        filter_var_min = xScale_mms.invert(tx_min);
    }
    if (check_selection_hmss) {
        col_to_filter = "hmss";
        filter_var_max = xScale_hmss.invert(tx_max);
        filter_var_min = xScale_hmss.invert(tx_min);
    }
    if (check_selection_p_votes) {
        col_to_filter = "perc_dem_vote";
        filter_var_max = xScale_p_votes.invert(tx_max);
        filter_var_min = xScale_p_votes.invert(tx_min);
    }



      ///////////////////////////////////////////////
    // Sliding threshold bar.
    

    filterData = filterData.filter(function(d) { 
        return ((+d[col_to_filter] <= filter_var_max) && (+d[col_to_filter] >= filter_var_min) );});
///////////////////////////////////////////////


    
    if (graph) { // if the histogram exists then update its data
        updateHist_egs(filterData, "egs", "#egs");
        updateHist_sp(filterData, "nb_splits", "#nb_sp");
        updateHist_cuts(filterData, "nb_cuts", "#nb_cuts");
        updateHist_mms(filterData, "mms", "#mms");
        updateHist_hmss(filterData, "hmss", "#hmss");
        updateHist_votes(filterData, "perc_dem_vote", "#p_votes");

        cutoff_max.call(drag_max);
        thresholdLabel_max.call(drag_max);

        cutoff_min.call(drag_min);
        thresholdLabel_min.call(drag_min);

      } else {// otherwise create the histogram        
        makeHist_egs(data, "egs", "#egs" , "Efficiency Gap");
        makeHist_sp(data, "nb_splits", "#nb_sp", "Number of Splits");
        makeHist_cuts(data, "nb_cuts", "#nb_cuts" , "Number of Cuts");
        makeHist_mms(data, "mms", "#mms", "Mean - Median");
        makeHist_hmss(data, "hmss", "#hmss", "Number of seats won by democrats");
        makeHist_votes(data, "perc_dem_vote", "#p_votes", "Percentage Democratic Votes");

        graph = true;
      }

};






//// egs
function makeHist_egs(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");
    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin_egs = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin_egs = d3.min(old_csvdata, function(d) { return +d[col]; });
    
    

    svg_egs= d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale_egs = d3.scaleLinear()
    .domain([minbin_egs, maxbin_egs])
    .rangeRound([0, width]);

    yScale_egs = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_egs.domain())
    .thresholds(xScale_egs.ticks(numBuckets)); // split into 20 bins

    bins = histogram(old_csvdata);

    yScale_egs.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // add the x axis and x-label
    svg_egs.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg_egs.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(xlabel)
    .style("font-size","70%")
    .style("padding-bottom", "3em");


      // add the y axis and y-label
    svg_egs.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_egs));

    svg_egs.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};


function updateHist_egs(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_egs.domain())
    .thresholds(xScale_egs.ticks(numBuckets)); // split into 20 bins

    // var blue_dem = d3.scaleLinear()
    // .domain([Math.min(0,minbin_egs), 0])
    // .range(["lightblue", "steelblue"]);

    // var red_rep = d3.scaleLinear()
    // .domain([0, Math.max(0, maxbin_egs)])
    // .range(["lightred", "steelred"]);

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
    .attr("height", function(d) { return height - yScale_egs(d.length); })
    .attr("fill", function(d){
        if (d.x0 > 0) { return("red")} else {
            return("blue")
        }
    }); 
    // .attr("fill", function(d){
    //     if (d.x0 > 0) { return(red_rep(d))} else {
    //         return(blue_dem(d))
    //     }
    // }); 
    
    bar_egs.exit()
    .remove();


};




//// splits
function makeHist_sp(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");
    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    
    
    svg_nb_sp= d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale_nb_sp = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    yScale_nb_sp = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_nb_sp.domain())
    .thresholds(xScale_nb_sp.ticks(numBuckets)); // split into 20 bins

    bins = histogram(old_csvdata);

    yScale_nb_sp.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // add the x axis and x-label
    svg_nb_sp.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg_nb_sp.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(xlabel)
    .style("font-size","70%")
    .style("padding-bottom", "1em");

    // add the y axis and y-label
    svg_nb_sp.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_nb_sp));

    svg_nb_sp.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");


    
};


function updateHist_sp(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_nb_sp.domain())
    .thresholds(xScale_nb_sp.ticks(numBuckets)); // split into 20 bins

    bins = histogram(csvdata);

    // set up the bars
    bar_nb_sp = svg_nb_sp.selectAll(".bin_rect")
    .data(bins)

    bar_nb_sp
    .enter()
    .append("rect")
    .attr("class", "bin_rect")
    .merge(bar_nb_sp)
    .transition()
    .duration(100)
    .attr("x", 1)// move 1px to right
    .attr("transform", function(d) 
        { return "translate(" + xScale_nb_sp(d.x0) + "," + yScale_nb_sp(d.length) + ")"; })
    .attr("width", xScale_nb_sp(bins[0].x1) - xScale_nb_sp(bins[0].x0) - 1)
    .attr("height", function(d) { return height - yScale_nb_sp(d.length); })
    .attr("fill", "#2f165b"); 
    
    bar_nb_sp.exit()
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
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale_nb_cuts = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    yScale_nb_cuts = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_nb_cuts.domain())
    .thresholds(xScale_nb_cuts.ticks(numBuckets)); // split into 20 bins

    bins = histogram(old_csvdata);

    yScale_nb_cuts.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // add the x axis and x-label
    svg_nb_cuts.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg_nb_cuts.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(xlabel)
    .style("font-size","70%")
    .style("padding-bottom", "3em");

      // add the y axis and y-label
    svg_nb_cuts.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_nb_cuts));

    svg_nb_cuts.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
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
    .thresholds(xScale_nb_cuts.ticks(numBuckets)); // split into 20 bins

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
    .attr("height", function(d) { return height - yScale_nb_cuts(d.length); })
    .attr("fill", "#721055"); 
    
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
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale_mms = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    yScale_mms = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_mms.domain())
    .thresholds(xScale_mms.ticks(numBuckets / 2)); // split into 20 bins

    bins = histogram(old_csvdata);

    yScale_mms.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // add the x axis and x-label
    svg_mms.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg_mms.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(xlabel)
    .style("font-size","70%")
    .style("padding-bottom", "3em");

      // add the y axis and y-label
    svg_mms.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_mms));

    svg_mms.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};

function updateHist_mms(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_mms.domain())
    .thresholds(xScale_mms.ticks(numBuckets / 2)); // split into 20 bins
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
    .attr("height", function(d) { return height - yScale_mms(d.length); })
    .attr("fill", function(d){
        if (d.x0 > 0) { return "red"} else {
            return "blue"
        }
    }); 
    
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
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale_hmss = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    yScale_hmss = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_hmss.domain())
    .thresholds(xScale_hmss.ticks(numBuckets)); // split into 20 bins

    bins = histogram(old_csvdata);
    yScale_hmss.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // add the x axis and x-label
    svg_hmss.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg_hmss.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(xlabel)
    .style("font-size","70%")
    .style("padding-bottom", "3em");

      // add the y axis and y-label
    svg_hmss.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_hmss));

    svg_hmss.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};


function updateHist_hmss(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_hmss.domain())
    .thresholds(xScale_hmss.ticks(numBuckets)); // split into 20 bins

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
    .attr("height", function(d) { return height - yScale_hmss(d.length); })
    .attr("fill", function(d){
        if (d.x0 <= 5) { return "red"} else {
            return "blue"
        }
    }); 
    
    bar_hmss.exit()
    .remove();
};








///// votes
function makeHist_votes(old_csvdata, col, var_svg_id, xlabel) {
    formatCount = d3.format(",.0f");

    old_maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    old_minbin = d3.min(old_csvdata, function(d) { return +d[col]; });

    maxbin = d3.max(old_csvdata, function(d) { return +d[col]; });
    minbin = d3.min(old_csvdata, function(d) { return +d[col]; });
    
    

    svg_p_votes= d3.select(var_svg_id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale_old = d3.scaleLinear()
    .domain([old_minbin, old_maxbin])
    .rangeRound([0, width]);

    xScale_p_votes = d3.scaleLinear()
    .domain([minbin, maxbin])
    .rangeRound([0, width]);

    yScale_p_votes = d3.scaleLinear()
    .range([height, 0]);

    histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_p_votes.domain())
    .thresholds(xScale_p_votes.ticks(numBuckets)); // split into 20 bins

    bins = histogram(old_csvdata);

    yScale_p_votes.domain([0, d3.max(bins, function(d) { return d.length; })]);

    // add the x axis and x-label
    svg_p_votes.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale_old));

    svg_p_votes.append("text")
    .attr("class", "xlabel")
    .attr("text-anchor", "middle")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 5)
    .text(xlabel)
    .style("font-size","70%")
    .style("padding-bottom", "3em");

      // add the y axis and y-label
    svg_p_votes.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(yScale_p_votes));

    svg_p_votes.append("text")
    .attr("class", "ylabel")
    .attr("y", 0 - margin.left) // x and y switched due to rotation!!
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Count: number of plans")
    .style("font-size","70%");
};


function updateHist_votes(csvdata, col, var_svg_id) {
    var histogram = d3.histogram()
    .value(function(d) { return +d[col]; })
    .domain(xScale_p_votes.domain())
    .thresholds(xScale_p_votes.ticks(numBuckets)); // split into 20 bins

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
    .attr("height", function(d) { return height - yScale_p_votes(d.length); })
    .attr("fill", function(d){
        if (d.x0 > 50) { return "red"} else {
            return "blue"
        }
    }); 
    
    bar_p_votes.exit()
    .remove();
};

// for threshold bars
function setThreshold(t, eventFromUser, max_true) {
    t = Math.min(t, default_var_max);
    t = Math.max(t, default_var_min);
    if (eventFromUser) {
        if (check_selection_nb_sp){
            t = t.toPrecision(2);
        } 
        if (check_selection_hmss){
            t = t.toPrecision(1);
        }
        if (check_selection_nb_cuts){
            t = t.toPrecision(3);
        }
        if (check_selection_egs || check_selection_p_votes){
            // t = t*100;
            t = t.toPrecision(3);

        }
        if (check_selection_mms){
            t = t.toPrecision(2);
        }  
    } 

    if (max_true){
        filter_var_max = t;
        tx_max = Math.max(0, Math.min(width - 4, tx_max));
        if (tx_max < tx_min){
            tx_max = tx_min;
        }
        cutoff_max.enter()
                    .merge(cutoff_max)
                    .transition()
                    .duration(1)
                    .attr('x', tx_max);
        cutoff_max.exit()
                .remove();
        
        thresholdLabel_max.enter()
                    .merge(thresholdLabel_max)
                    .transition()
                    .duration(1)
                    .attr('x', tx_max)
                    .text('Max: ' + filter_var_max)
        thresholdLabel_max.exit()
                .remove();
    }
    else {
        filter_var_min = t;
        tx_min = Math.max(0, Math.min(width - 4, tx_min));
        if (tx_min > tx_max){ tx_min = tx_max; }
        cutoff_min.enter()
                    .merge(cutoff_min)
                    .transition()
                    .duration(1)
                    .attr('x', tx_min);
        cutoff_min.exit()
                .remove();
        
        thresholdLabel_min.enter()
                    .merge(thresholdLabel_min)
                    .transition()
                    .duration(1)
                    .attr('x', tx_min)
                    .text('Min: ' + filter_var_min)
        thresholdLabel_min.exit()
                .remove();
    }
};

// listening to drag events
var drag_max = d3.drag()
.on('drag', function() {
    tx_max += d3.event.dx;  
    if (check_selection_nb_sp) { var t_max = xScale_nb_sp.invert(tx_max)}
    if (check_selection_nb_cuts) { var t_max = xScale_nb_cuts.invert(tx_max)}
    if (check_selection_egs) { var t_max = xScale_egs.invert(tx_max)}
    if (check_selection_mms) { var t_max = xScale_mms.invert(tx_max)}
    if (check_selection_hmss) { var t_max = xScale_hmss.invert(tx_max)}
    if (check_selection_p_votes) { var t_max = xScale_p_votes.invert(tx_max)}
    setThreshold(t_max, true, true);
    update();
});

// listening to drag events
var drag_min = d3.drag()
.on('drag', function() {
    tx_min += d3.event.dx;
    if (check_selection_nb_sp) { 
        var t_min = xScale_nb_sp.invert(tx_min);
    }
    if (check_selection_nb_cuts) { var t_min = xScale_nb_cuts.invert(tx_min);}
    if (check_selection_egs) { var t_min = xScale_egs.invert(tx_min);}
    if (check_selection_mms) { var t_min = xScale_mms.invert(tx_min);}
    if (check_selection_hmss) { var t_min = xScale_hmss.invert(tx_min);}
    if (check_selection_p_votes) { var t_min = xScale_p_votes.invert(tx_min);}
    setThreshold(t_min, true, false);
    update();
});

