/**
 * Wheel Application
 * Author: JBi
 * Email: jitendra@jbidigital.co.uk
 */

/** 
 * Declare Stage to play code game
 */
var width = 590
height = 590
margin = 0;
var colwidth = 14;

var radius = Math.min(width, height) / 2 - margin // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.

/**
 * Append the svg object to the div called in id 'my_dataviz'   
 */
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


/**
 * Compute the position of each group on the pie element
 */
var pie = d3.pie()
    .sort(null) // Do not sort group by size
    .padAngle(.04)
    .value(function (d) { return d.value.share; });

/**
 * Populate data
 */
var data_ready = pie(d3.entries(data));


/**  
 * The arc generator
 */
var arc = d3.arc()
    .innerRadius((radius * 0.9) - 60)         // This is the size of the donut hole
    .outerRadius(radius * 0.9);

/**
 * Another arc that won't be drawn. Just for labels positioning
 */
var outerArc = d3.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius * 0.8)

/**
 * inner arc placing text
 */
var circleArc = d3.arc()
    .outerRadius((radius * 0.9) - 60)
    .innerRadius((radius * 0.9) - 60);

/** 
 * Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
 */
svg
    .selectAll('allSlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr("id", function (d, i) { return "monthArc_" + i; }) //Unique id for each slice
    .attr('fill', "#74c4e4")
    .attr("stroke", "white")
    .style("stroke-width", "1px")
    .style("opacity", 1)
    .on("click", showDetail);

/**
 * Create Wrap Element
 */
var elem = svg.selectAll("g")
    .data(data_ready);

/**
 * Create and place the "blocks" containing the circle and the text 
 */
var elemEnter = elem.enter()
    .append("g")
    .attr("transform", function (d) { return "translate(" + circleArc.centroid(d) + ")"; });

/** 
 * Create the circle for each block 
 */
var circle = elemEnter.append("circle")
    .attr("r", function (d) { return 10 })
    .attr("stroke", "black")
    .attr("fill", "red")
    .attr("id", function (d, i) { return "c1_" + i; })

/**
 *Create the text for each block 
 */
elemEnter.append("text")
    .attr("dx", function (d) { return -5 })
    .attr("dy", function (d) { return 5 })
    .attr("class", 'circleText')
    .text("+")
    .attr("fill", "white")
    .attr("id", function (d, i) { return "t1_" + i; })
    .on("click", showDetail);


/**  
 * Add the polylines between pie:
 */
var labelText = svg
    .selectAll('allLabels')
    .data(data_ready)
    .enter();

/**
 * Create another group for text wrap
 */
var grouptxt = labelText.append("g")
// .attr("transform", function (d) { return "translate(" + (circleArc.centroid(d)) + ")"; });

/**
 * Place text
 */
var textpath = grouptxt.append('text')
    .attr("dy", 135)
    .attr("x", ('0'))
    .attr("y", ('100'))
    // .attr("class", "monthText")
    .append("textPath")
    .attr("xlink:href", function (d, i) { return "#monthArc_" + i; });

/**
 * Place inside text
 */
textpath.append("tspan")
    .text(function (d) {
        return d.data.value.name.split(":")[0];
        // return d.data.value.name 
    })
    // .attr("x", ('20%'))
    // .attr("y", ('20'))
    .attr("dy", function (d) {
        if (d.data.value.name.split(":")[1])
            return "1.5em"
        else
            return "2.2em"
    })
    .on("click", showDetail)
    .attr("class", "monthText")
    .attr("transform", "translate(200)");

/**
 * Place inside 2nd text
 */
textpath.append("tspan")
    // .attr("x", ('10%'))
    .attr("dy", "1.2em")
    .text(function (d) { return d.data.value.name.split(":")[1]; })
    .style('text-anchor', function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
        // return (midangle < Math.PI ? 'start' : 'end')
        return ('start')
    })
    .attr("class", "monthText")
    .on("click", showDetail);

/**
* Dynamically make text
*/
svg
    .selectAll('.monthText')
    .attr('x', function (d) {
        var text = d.data.value.name.split(":")[0];
        var width1 = this.getComputedTextLength();
        var calcwidth = 110 - (width1 / 2);
        console.log(calcwidth);
        return (calcwidth);
    });


function showDetail(d, i) {
    var myhtml = '<div style="background: #FFF url(' + d.data.value.img + ')"><div class="dc_innercontent"><p>' + d.data.value.content + '</p><P><a href="' + d.data.value.readmore + '" target="_blank">Read more</a></P></div></div>';
    $('#dc_data').html(myhtml);
    d3.selectAll('path').attr('fill', '#74c4e4')
    d3.selectAll('circle').style('fill', 'red');
    d3.selectAll('text.circleText').text('+');
    d3.select('path#monthArc_' + i).attr('fill', '#e3c251');
    d3.selectAll('#c1_' + i).style('fill', 'blue');
    d3.selectAll('text#t1_' + i).text('-');
}







