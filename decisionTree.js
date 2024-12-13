//

(async () => {
    const queryUser = (question) => {
      const app = document.getElementById("app");
      const options = Object.keys(question).filter(
        (option) =>
          option !== "text" &&
          option !== "buttonText" &&
          option !== "isRoot" &&
          option !== "subtree"
      );
  
      const questionElement = document.createElement("div");

      questionElement.className = "question";
      if (question.text) {
        questionElement.innerHTML = question.text;
      }
  
      for (const option of options) {

        const childOptions = Object.keys(question[option]).filter(
          (childOption) =>
            childOption !== "text" &&
            childOption !== "buttonText" &&
            childOption !== "isRoot" &&
            childOption !== "subtree"
        );

        if (childOptions.length === 0 && !question.isRoot) {
          const connector = document.createElement("div");
          connector.className = "connector";
          app.appendChild(connector);
          const result = document.createElement("div");
          result.className = "result";
          result.innerHTML = `<div style='text-align: center; margin-bottom: 1em;'><strong>Guidance</strong></div>${question[option].buttonText}`;
          app.appendChild(result);
          result.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          return;
        }
        
        const button = document.createElement("button");
        button.innerHTML = question[option].buttonText;
        button.onclick = () => {
          const buttons = document
            .getElementById("app")
            .getElementsByTagName("button");
          button.disabled = true;
          for (const btn of buttons) {
            if (btn.disabled === false) {
              btn.classList.add("remove");
            }
          }

          if (question[option].subtree) {
            queryUser(treeMap[question[option].subtree]);
          } else {
  
          queryUser(question[option]);
          }
        };
        questionElement.appendChild(button);
      }
  
      if (!question.isRoot) {
        const connector = document.createElement("div");
        connector.className = "connector";
        app.appendChild(connector);
      }
  
        app.appendChild(questionElement);
        questionElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    };

    const buildTree = (tree, node) => {

      if (!node){
        return;
      }

      console.info("Node %o", node);

      const children = Object.keys(node).filter(
        (option) =>
          option !== "text" &&
          option !== "buttonText" &&
          option !== "isRoot" &&
          option !== "subtree"
      );

      if (children.length === 0 && !node.isRoot){
        const item = document.createElement('li');
        item.className = "leaf";
        item.innerHTML = node.buttonText || node.text;
        tree.appendChild(item);
        return;
      }

      const list = document.createElement('ul');
      const item = document.createElement('li');

      
      const details = document.createElement('details');
      if (node.isRoot){
        details.open = true;
      }
      const text = document.createElement('summary');
      text.innerHTML = node.buttonText || node.text;
      details.appendChild(text);
      item.appendChild(details).appendChild(list);
      tree.appendChild(item);

      // try to generate a tooltip for the node and apply it if there is one
      var tooltip = autoGenerateTooltip(text.innerHTML);
      if (tooltip != null) {
       details.classList.add("tooltip");
       text.innerHTML += tooltip;
      }

      for (const child of children){

        

        if (node[child].subtree){
          buildTree(list, treeMap[node[child].subtree]);
        }
        else{

          buildTree(list, node[child]);
        }
        
      }

    }

    const makeVisible = (btn) => {
      const elements = document.querySelectorAll('.view');
      
      for (const element of elements) {
        
        if (element.id === btn.name) {
          element.style.display = 'flex';
          btn.disabled = true;
          continue;  
        }
        const matchingButton = document.querySelector(`button.navBtn[name="${element.id}"]`);
        element.style.display = 'none';
        matchingButton.disabled = false;
      }
    };

    const navButtons = document.querySelectorAll(".navBtn");
    for (navBtn of navButtons){
      navBtn.addEventListener('click', (e) => makeVisible(e.target));
    }

    const typeData = await fetch("trees/PD_Type_2024.drawio.json").then((response) => response.json());
    const photoData = await fetch("trees/PD_Photo_2024.drawio.json").then((response) => response.json());
    const broadcastData = await fetch("trees/PD_Broadcast_2024.drawio.json").then((response) => response.json());
    const cinemaData = await fetch("trees/PD_Cinema_ 2024.drawio.json").then((response) => response.json());
    const soundData = await fetch("trees/PD_Sound_2024.drawio.json").then((response) => response.json());
    const literaryData = await fetch("trees/PD_Literary_2024.drawio.json").then((response) => response.json());
    const performanceData = await fetch("trees/PD_Performance_2024.drawio.json").then((response) => response.json());
    const treeMap = {
      "Type": typeData,
      "Photo": photoData,
      "Broadcast": broadcastData,
      "Cinema": cinemaData,
      "Sound": soundData,
      "Literary": literaryData,
      "Performance": performanceData
    }

    // tooltip generator
    // -----------------
    const glossary = await fetch("termGlossary.json").then((response) => response.json());
    function autoGenerateTooltip(content) {
      var tooltiptext = '';
      // go through each term in the glossary and if a term matches any whole words
      // in the content string, add the definition to tooltiptext
      Object.entries(glossary).forEach(pair => {
        let term = pair[0];
        const regexForMatchTerm = new RegExp(`\\b(${term})\\b`, "i") //matches only whole words that match 'term', case insensitively
        if (content.match(regexForMatchTerm) != null) {
          tooltiptext += termAndDefinitionToTooltip(term, pair[1]);
        }
      });
      if (tooltiptext == '') {
        return null;
      }
      return `<span class="tooltiptext">${tooltiptext}</span>`;
    }

    function termAndDefinitionToTooltip(term, definition) {
      return `<h5>${term}</h5><p>${definition}</p>`;
    }

    queryUser(treeMap["Type"]);
    buildTree(document.getElementById('tree'), treeMap["Type"]);
})();




