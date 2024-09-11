// utils.js


const Matieres = {
    'C': "Tests cognitifs",
    'P': "Tests liés aux problèmes perceptifs et sensoriels"
};

function calculateAvancement(item, resultat) { 
    //console.log("calculateAvancement - Item:", item);  // Log the content of the item object
    //console.log("calculateAvancement - Resultat:", resultat);  // Log the resultat value 

    let avancement = 0;

    if ((item.seuil1 === 0) && (resultat === 0)) {
        avancement = 1;
    } else if ((resultat < item.seuil1)) {
        avancement = resultat / item.seuil1;
    } else if (resultat < item.seuil2) {
        avancement = 1 + (resultat - item.seuil1) / (item.seuil2 - item.seuil1);
    } else if (resultat < item.max_point) {
        avancement = 2 + (resultat - item.seuil2) / (item.max_point - item.seuil2);
    } else {
        avancement = 3;
    }

    //console.log("Calculated Avancement:", avancement);  // Log the calculated avancement value

    return avancement;
}


// Fonction pour accéder à la description en fonction de la lettre
function getMatiereDescription(letter) {
    return Matieres[letter] || "Matiere non reconnue";
}

 		// utils.js
function safeStringify(obj, replacer = null, space = 2) {
    const cache = new Set();
    const result = JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (cache.has(value)) {
                return '[Circular]'; // Handle circular reference
            }
            cache.add(value);
        }
        return value;
    }, space);
    cache.clear(); // Clear cache after use
    return result;
}
			
export { Matieres, calculateAvancement, getMatiereDescription, safeStringify };