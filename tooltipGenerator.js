/*
This tooltip generator uses termGlossary.json to create tooltips that show definitions of terms.
termGlossary.json is of the style { "Term1" : "Definition.", ... }
*/ 
const glossary = await fetch("termGlossary.json").then((response) => response.json());


/*
Searches through a string for every term that matches a term in the glossary, and returns a .tooltiptext span with 
each term's definition in it.

params 
  content: the text for which to search for terms and put their definitions in a tooltip
*/
function autoGenerateTooltip(content) {
  var tooltiptext = '';
  // go through each term in the glossary and if a term matches anything
  // in the content string, add the definition to tooltiptext
  Object.entries(glossary).forEach(pair => {
    let term = pair[0];
    if (content.toLowerCase().includes(term.toLowerCase())) {
      tooltiptext += termAndDefinitionToTooltip(term, pair[1]);
    }
  });;
  
  return `<span class="tooltiptext">${tooltiptext}</span>`;
}

function manualGenerateTooltip(termArray) {

}


function termAndDefinitionToTooltip(term, definition) {
  return `<h5>${term}</h5><p>${definition}</p>`;
}