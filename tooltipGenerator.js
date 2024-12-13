/*
This tooltip generator uses termGlossary.json to create tooltips that show definitions of terms.
termGlossary.json is of the style { "term1" : "<h5>Term1<h5><p>Definition.</p>"... }
*/ 



/*
Searches through a string for every term that matches a term in the glossary, and returns a .tooltiptext span with 
each term's definition in it.

params 
  content: the text for which to search for terms and put their definitions in a tooltip
*/
function autoGenerateTooltip(content) {
  var tooltiptext = '';
  
  return `<span class="tooltiptext">${tooltiptext}</span>`;
}

function manualGenerateTooltip(termArray) {

}