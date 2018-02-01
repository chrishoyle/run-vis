'use strict';

let selectedId = 0;

let feats = {};
var mainDiv = document.getElementById('display');

var w = 300,
    h = 300;

var path_str = d3.geo.path();

var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

var path = d3.geo.path()
        .projection(projection);


function render(id) {

    projection.scale(1)
              .translate([0, 0]);

    path.projection(projection);

    var b = path.bounds(feats[id]);
    var s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
    var t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

    let selection = d3.select("svg path")
        .datum(feats[id]);

   
    if (!d3.select("svg path").attr("d")) {
      selection.attr("d", path);
      return;
    }

    selection.transition().attrTween('d', function(data) {
      var previous = d3.select(this).attr('d');
      var current = path(data);

      return interpolatePath(previous, current);
    });
}


function selectActivity(index) {
  selectedId = index;
  console.log("feats.length",feats);
  if (selectedId < 0) {
    selectedId = Object.keys(feats).length - 1;
    console.log("feats.length");
  } else if (selectedId >= Object.keys(feats).length){
    selectedId = 0;
  }
  
  render(selectedId);
}

d3.json('./my_runs.geojson',(error, data)  => {
    if (error) throw error;

    var i = 0;

    for (const id in data.features){
      feats[id] = data.features[id];
      //activityIds.push(i);
      i++;
    };

    selectedId = 0;

    d3.select("#display")
      .append("svg")
      .attr("width", "55%")
      .attr("height", "55%")
      .attr("viewBox", "0 0 " + w + " " + h)
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#e0e4cc");


    let svg = d3.select("#display").append('svg')
        .attr('class', 'map')
        .attr('width', w)
        .attr('height', h);


    render(0);
});


function setPrettyColor() {
  var pretty_colors =  [['#FE4365','#fc9d9a'],['#ecd078','#d95b43'],['#556270','#4ECDC4'],['#e08e79','#f1d4af'],['#E8DDCB','#036564'],['#490A3D','#E97F02'],['#594f4f','#547980'],['#00a0b0','#6A4A3C'],['#E94E77','#C6A49A'],['#D9CEB2','#d5ded9'],['#CBE86B','#F2E9E1'],['#efffcd','#2E2633']];
  var color = pretty_colors[Math.floor(Math.random() * pretty_colors.length)];
  $("#display").css("background-color", color[0]);
  $("path").css("stroke", color[1]);
}

d3.select("body").on("keydown", () => {
  const key = d3.event.which;
  const index = selectedId;
  if (key == 39 || key == 40) {
    selectActivity(index + 1);
    setPrettyColor();
  } else if (key == 37 || key == 38) {
    selectActivity(index - 1);
    setPrettyColor();
  }
});


d3.select("#previous").on("click", () => {
  selectActivity(selectedId - 1);
  setPrettyColor();
  console.log(selectedId)
});

d3.select("#next").on("click", () => {
  selectActivity(selectedId + 1);
  setPrettyColor();
  console.log(selectedId)
});




