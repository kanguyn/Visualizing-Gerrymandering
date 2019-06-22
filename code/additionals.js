var update = function(){
    fv.update_range();
};

var dataLoaded = function(error,_mapData,_filterData){
    graph = false;
    var xScale_egs, yScale_egs,  svg_egs, bar_egs;
    // var xScale_nb_sp, yScale_nb_sp, svg_nb_sp, bar_nb_sp;
    var xScale_nb_cuts, yScale_nb_cuts, svg_nb_cuts, bar_nb_cuts;
    var xScale_mms, yScale_mms, svg_mms, bar_mms;
    var xScp_votes, yScale_hmss,svg_hmss, bar_hmss;
    var xScale_p_votes, yScale_p_votes,svg_p_votes, bar_p_votes;
    var xScale, yScale, xAxis, yAxis;
    var cutoff_max ;
    var thresholdLabel_max;
    var cutoff_min ;
    var thresholdLabel_min;
    

    var mapData = _mapData;
    var filterData = _filterData;
    fv = new Range('#Range',mapData, filterData);
};
var path = path = "https://github.mit.edu/pages/6894-sp19/Visualizing_Gerrymandering/data/VA_data/plan_metrics_ATG17.csv";
var startHere = function(path){
    var q = d3.queue();
    q.defer(d3.csv, path)
    .defer(d3.csv, path)
    .await(dataLoaded); // Call dataLoaded function
};

startHere(path); 
               